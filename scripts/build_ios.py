#!/usr/bin/env python3
"""
iOS IPA 打包脚本
将 React Native 项目打包成可安装的 iOS IPA

使用方法:
    python scripts/build_ios.py [--clean] [--install]

参数:
    --clean         构建前清理缓存
    --install       构建完成后自动安装到连接的设备（需要 ios-deploy）

注意:
    - 需要在 macOS 上运行
    - 需要安装 Xcode 和 Command Line Tools
    - 构建 Ad-Hoc/Development IPA 需要有效的开发者证书和 Provisioning Profile
"""

import os
import sys
import subprocess
import shutil
import argparse
from pathlib import Path
from datetime import datetime

# ============================================================
# 配置区域 - 可根据需要修改
# ============================================================

# Xcode 项目配置
WORKSPACE_NAME = 'storeverserepoApp.xcworkspace'
SCHEME_NAME = 'storeverserepoApp'
CONFIGURATION = 'Release'

# ============================================================


def get_project_root() -> Path:
    """获取项目根目录"""
    return Path(__file__).parent.parent


def check_platform():
    """检查是否在 macOS 上运行"""
    if sys.platform != 'darwin':
        print('❌ 此脚本只能在 macOS 上运行')
        sys.exit(1)


def check_environment():
    """检查构建环境"""
    print('🔍 检查构建环境...')

    errors = []

    # 检查 Xcode
    try:
        result = subprocess.run(['xcodebuild', '-version'], capture_output=True, text=True)
        if result.returncode == 0:
            version_line = result.stdout.split('\n')[0]
            print(f'  ✅ {version_line}')
        else:
            errors.append('Xcode 未正确安装')
    except FileNotFoundError:
        errors.append('xcodebuild 未找到，请安装 Xcode Command Line Tools')

    # 检查 Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        print(f'  ✅ Node.js: {result.stdout.strip()}')
    except FileNotFoundError:
        errors.append('Node.js 未安装')

    # 检查 CocoaPods
    try:
        result = subprocess.run(['pod', '--version'], capture_output=True, text=True)
        print(f'  ✅ CocoaPods: {result.stdout.strip()}')
    except FileNotFoundError:
        errors.append('CocoaPods 未安装 (brew install cocoapods)')

    # 检查 yarn/npm
    try:
        result = subprocess.run(['yarn', '--version'], capture_output=True, text=True)
        print(f'  ✅ Yarn: {result.stdout.strip()}')
    except FileNotFoundError:
        try:
            result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
            print(f'  ✅ npm: {result.stdout.strip()}')
        except FileNotFoundError:
            errors.append('npm 或 yarn 未安装')

    if errors:
        print('\n❌ 环境检查失败:')
        for error in errors:
            print(f'  - {error}')
        sys.exit(1)

    print('  ✅ 环境检查通过\n')


def install_dependencies():
    """安装项目依赖"""
    print('📦 安装项目依赖...')
    project_root = get_project_root()

    # 安装 JS 依赖
    if shutil.which('yarn'):
        cmd = ['yarn', 'install']
    else:
        cmd = ['npm', 'install']

    result = subprocess.run(cmd, cwd=project_root)
    if result.returncode != 0:
        print('❌ JS 依赖安装失败')
        sys.exit(1)

    print('  ✅ JS 依赖安装完成\n')


def install_pods():
    """安装 CocoaPods 依赖"""
    print('📦 安装 CocoaPods 依赖...')
    project_root = get_project_root()
    ios_dir = project_root / 'ios'

    result = subprocess.run(['pod', 'install'], cwd=ios_dir)
    if result.returncode != 0:
        print('❌ CocoaPods 依赖安装失败')
        sys.exit(1)

    print('  ✅ CocoaPods 依赖安装完成\n')


def clean_build():
    """清理构建缓存"""
    print('🧹 清理构建缓存...')
    project_root = get_project_root()
    ios_dir = project_root / 'ios'

    # 清理 Xcode 构建目录
    build_dir = ios_dir / 'build'
    if build_dir.exists():
        shutil.rmtree(build_dir)
        print('  🗑️ 已删除: ios/build')

    # 清理 DerivedData (可选，比较耗时)
    derived_data = Path.home() / 'Library/Developer/Xcode/DerivedData'
    if derived_data.exists():
        for item in derived_data.iterdir():
            if item.name.startswith('storeverserepoApp'):
                shutil.rmtree(item)
                print(f'  🗑️ 已删除 DerivedData: {item.name}')

    print('  ✅ 清理完成\n')


def build_archive() -> Path:
    """构建 Xcode Archive"""
    print('🔨 构建 Archive...')
    project_root = get_project_root()
    ios_dir = project_root / 'ios'

    # Archive 输出路径
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    archive_path = ios_dir / 'build' / f'{SCHEME_NAME}-{timestamp}.xcarchive'
    archive_path.parent.mkdir(parents=True, exist_ok=True)

    cmd = [
        'xcodebuild',
        '-workspace', str(ios_dir / WORKSPACE_NAME),
        '-scheme', SCHEME_NAME,
        '-configuration', CONFIGURATION,
        '-archivePath', str(archive_path),
        '-destination', 'generic/platform=iOS',
        'archive',
        'CODE_SIGN_IDENTITY=-',  # Ad-hoc 签名
        'CODE_SIGNING_REQUIRED=NO',
        'CODE_SIGNING_ALLOWED=NO',
    ]

    result = subprocess.run(cmd, cwd=ios_dir)
    if result.returncode != 0:
        print('❌ Archive 构建失败')
        print('\n💡 提示: 如果遇到签名问题，请确保:')
        print('   1. 在 Xcode 中打开项目并配置签名')
        print('   2. 或者使用 --no-sign 参数跳过签名')
        sys.exit(1)

    print(f'  ✅ Archive 构建完成: {archive_path}\n')
    return archive_path


def export_ipa(archive_path: Path) -> Path:
    """从 Archive 导出 IPA"""
    print('📦 导出 IPA...')
    project_root = get_project_root()
    ios_dir = project_root / 'ios'

    # 创建导出选项 plist
    export_options_path = ios_dir / 'build' / 'ExportOptions.plist'
    export_options_content = '''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>compileBitcode</key>
    <false/>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
'''
    export_options_path.write_text(export_options_content)

    # 导出路径
    export_path = ios_dir / 'build' / 'export'
    export_path.mkdir(parents=True, exist_ok=True)

    cmd = [
        'xcodebuild',
        '-exportArchive',
        '-archivePath', str(archive_path),
        '-exportPath', str(export_path),
        '-exportOptionsPlist', str(export_options_path),
    ]

    result = subprocess.run(cmd, cwd=ios_dir)
    if result.returncode != 0:
        print('⚠️ IPA 导出失败（可能是签名问题）')
        print('  将尝试创建未签名的 .app 包...\n')
        return create_unsigned_app(archive_path)

    # 查找生成的 IPA
    for ipa_file in export_path.glob('*.ipa'):
        print(f'  ✅ IPA 导出完成: {ipa_file}\n')
        return ipa_file

    return None


def create_unsigned_app(archive_path: Path) -> Path:
    """从 Archive 创建未签名的 .app（用于模拟器或重签名）"""
    print('📦 创建未签名 App 包...')
    project_root = get_project_root()

    # 从 archive 中提取 .app
    app_path = archive_path / 'Products' / 'Applications' / f'{SCHEME_NAME}.app'

    if not app_path.exists():
        print(f'❌ 未找到 .app: {app_path}')
        return None

    # 复制到输出目录
    output_dir = project_root / 'output'
    output_dir.mkdir(exist_ok=True)

    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    output_app = output_dir / f'{SCHEME_NAME}-{timestamp}.app'

    shutil.copytree(app_path, output_app)
    print(f'  ✅ App 包已创建: {output_app}\n')

    # 创建 IPA（将 .app 打包成 .ipa）
    ipa_path = create_ipa_from_app(output_app)

    return ipa_path


def create_ipa_from_app(app_path: Path) -> Path:
    """将 .app 打包成 .ipa"""
    print('📦 打包 IPA...')

    output_dir = app_path.parent
    ipa_name = app_path.stem + '.ipa'
    ipa_path = output_dir / ipa_name

    # 创建 Payload 目录结构
    payload_dir = output_dir / 'Payload'
    if payload_dir.exists():
        shutil.rmtree(payload_dir)
    payload_dir.mkdir()

    # 复制 .app 到 Payload
    shutil.copytree(app_path, payload_dir / app_path.name)

    # 压缩成 .ipa
    import zipfile
    with zipfile.ZipFile(ipa_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(payload_dir):
            for file in files:
                file_path = Path(root) / file
                arcname = file_path.relative_to(output_dir)
                zipf.write(file_path, arcname)

    # 清理 Payload 目录
    shutil.rmtree(payload_dir)

    # 删除 .app 目录（只保留 .ipa）
    shutil.rmtree(app_path)

    print(f'  ✅ IPA 打包完成: {ipa_path}\n')
    return ipa_path


def clean_output_dir():
    """清空输出目录"""
    print('🗑️ 清空输出目录...')
    project_root = get_project_root()
    output_dir = project_root / 'output'

    if output_dir.exists():
        for file in output_dir.iterdir():
            if file.suffix in ['.ipa', '.app'] or file.is_dir():
                if file.is_dir():
                    shutil.rmtree(file)
                else:
                    file.unlink()
                print(f'  已删除: {file.name}')
        print('  ✅ 输出目录已清空\n')
    else:
        output_dir.mkdir()
        print('  输出目录已创建\n')


def copy_to_output(source_path: Path) -> Path:
    """复制构建产物到输出目录"""
    if not source_path or not source_path.exists():
        return None

    project_root = get_project_root()
    output_dir = project_root / 'output'
    output_dir.mkdir(exist_ok=True)

    # 如果已经在 output 目录，直接返回
    if source_path.parent == output_dir:
        return source_path

    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')
    output_path = output_dir / f'{source_path.stem}-{timestamp}{source_path.suffix}'

    shutil.copy2(source_path, output_path)
    return output_path


def install_to_device(ipa_path: Path):
    """安装 IPA 到连接的设备"""
    print('📱 安装到设备...')

    # 检查 ios-deploy
    if not shutil.which('ios-deploy'):
        print('⚠️ ios-deploy 未安装')
        print('  安装方法: brew install ios-deploy')
        print('  或者使用 Apple Configurator 2 / Xcode 安装\n')
        return False

    # 检查连接的设备
    result = subprocess.run(['ios-deploy', '-c'], capture_output=True, text=True)
    if 'Found' not in result.stdout:
        print('❌ 未检测到连接的 iOS 设备')
        print('  请确保:')
        print('  1. 设备已通过 USB 连接')
        print('  2. 设备已解锁并信任此电脑')
        return False

    # 安装
    cmd = ['ios-deploy', '--bundle', str(ipa_path)]
    result = subprocess.run(cmd)

    if result.returncode == 0:
        print('  ✅ 安装成功\n')
        return True
    else:
        print('  ❌ 安装失败\n')
        return False


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='iOS IPA 打包脚本')
    parser.add_argument('--clean', action='store_true', help='构建前清理缓存')
    parser.add_argument('--install', action='store_true', help='构建后自动安装到设备')
    parser.add_argument('--skip-deps', action='store_true', help='跳过依赖安装')
    parser.add_argument('--skip-pods', action='store_true', help='跳过 Pod 安装')
    args = parser.parse_args()

    print('=' * 50)
    print('🚀 开始构建 iOS Release IPA')
    print('=' * 50 + '\n')

    # 0. 检查平台
    check_platform()

    # 1. 检查环境
    check_environment()

    # 2. 安装 JS 依赖
    if not args.skip_deps:
        install_dependencies()

    # 3. 安装 CocoaPods 依赖
    if not args.skip_pods:
        install_pods()

    # 4. 清空输出目录
    clean_output_dir()

    # 5. 清理缓存（可选）
    if args.clean:
        clean_build()

    # 6. 构建 Archive
    archive_path = build_archive()

    # 7. 导出 IPA
    ipa_path = export_ipa(archive_path)

    # 8. 复制到输出目录
    if ipa_path:
        output_path = copy_to_output(ipa_path)
    else:
        output_path = None

    # 9. 安装到设备（可选）
    if args.install and output_path:
        install_to_device(output_path)

    # 完成
    print('=' * 50)
    print('✅ 构建完成!')
    print('=' * 50)

    if output_path and output_path.exists():
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f'\n📦 IPA 文件: {output_path.name} ({size_mb:.2f} MB)')
        print(f'📁 输出目录: {get_project_root() / "output"}')
        print('\n💡 安装方式:')
        print('   1. 使用 Apple Configurator 2')
        print('   2. 使用 Xcode > Devices and Simulators')
        print('   3. 使用 ios-deploy: ios-deploy --bundle <ipa_path>')
        print('   4. 使用 AltStore / Sideloadly 等工具')
    else:
        print('\n⚠️ 未生成 IPA 文件')
        print('   可能原因:')
        print('   1. 没有有效的开发者证书')
        print('   2. 没有配置 Provisioning Profile')
        print('\n💡 解决方案:')
        print('   1. 在 Xcode 中打开项目，配置 Signing & Capabilities')
        print('   2. 使用免费 Apple ID 也可以进行开发签名')

    if not args.install:
        print('\n💡 提示: 使用 --install 参数可自动安装到连接的设备')


if __name__ == '__main__':
    main()
