#!/usr/bin/env python3
"""
Android APK 打包脚本
将 React Native 项目打包成可安装的 Android APK

使用方法:
    python scripts/build_android.py [--release] [--clean] [--install] [--java-home PATH]

参数:
    --release       构建 Release 版本（默认 Debug）
    --clean         构建前清理缓存
    --install       构建完成后自动安装到连接的设备
    --java-home     指定 Java 路径 (例如: /Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home)
"""

import os
import sys
import subprocess
import shutil
import argparse
import secrets
import string
from pathlib import Path
from datetime import datetime

# ============================================================
# 配置区域 - 可根据需要修改
# ============================================================

# 默认 Java 路径，设置为 None 则使用系统默认 Java
# 示例:
#   macOS (Homebrew): '/opt/homebrew/opt/openjdk@17'
#   macOS (Oracle):   '/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home'
#   Linux:            '/usr/lib/jvm/java-17-openjdk'
#   Windows:          'C:\\Program Files\\Java\\jdk-17'
DEFAULT_JAVA_HOME: str | None = '/opt/homebrew/Cellar/openjdk@17/17.0.15/libexec/openjdk.jdk/Contents/Home'

# ============================================================


def get_project_root() -> Path:
    """获取项目根目录"""
    return Path(__file__).parent.parent


def generate_password(length: int = 16) -> str:
    """生成随机密码"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def generate_keystore():
    """生成新的签名密钥（每次构建都生成新的）"""
    print('🔐 生成签名密钥...')
    project_root = get_project_root()
    android_dir = project_root / 'android'
    app_dir = android_dir / 'app'

    keystore_path = app_dir / 'release.keystore'
    config_path = android_dir / 'keystore.properties'

    # 删除旧的 keystore（如果存在）
    if keystore_path.exists():
        keystore_path.unlink()
        print('  🗑️ 已删除旧的签名文件')

    # 清理 Gradle 签名相关缓存，避免使用旧密码
    app_build_dir = app_dir / 'build'
    if app_build_dir.exists():
        shutil.rmtree(app_build_dir)
        print('  🗑️ 已清理 app/build 缓存')

    # 检查 keytool
    try:
        subprocess.run(['keytool', '-help'], capture_output=True)
    except FileNotFoundError:
        print('❌ keytool 未找到，请确保已安装 JDK')
        print('   macOS: brew install openjdk')
        sys.exit(1)

    # 生成密码 (PKCS12 要求 store 和 key 密码相同)
    store_password = generate_password()
    key_password = store_password  # PKCS12 格式必须使用相同密码
    key_alias = 'release-key'

    # 默认证书信息
    dname = 'CN=Developer, OU=Development, O=MyCompany, L=Beijing, ST=Beijing, C=CN'

    # 生成 keystore
    cmd = [
        'keytool', '-genkeypair',
        '-v',
        '-storetype', 'PKCS12',
        '-keystore', str(keystore_path),
        '-alias', key_alias,
        '-keyalg', 'RSA',
        '-keysize', '2048',
        '-validity', '10000',
        '-storepass', store_password,
        '-keypass', key_password,
        '-dname', dname,
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode != 0:
        print(f'❌ 签名生成失败: {result.stderr}')
        sys.exit(1)

    print(f'  ✅ 签名文件已生成: {keystore_path}')

    # 生成配置文件
    config_content = f"""# Android Release 签名配置
# ⚠️ 此文件包含敏感信息，请勿提交到 Git

storeFile=release.keystore
storePassword={store_password}
keyAlias={key_alias}
keyPassword={key_password}
"""

    config_path.write_text(config_content)
    print(f'  ✅ 配置文件已生成: {config_path}\n')


def check_environment():
    """检查构建环境"""
    print('🔍 检查构建环境...')

    errors = []

    # 检查 Node.js
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        print(f'  ✅ Node.js: {result.stdout.strip()}')
    except FileNotFoundError:
        errors.append('Node.js 未安装')

    # 检查 npm/yarn
    try:
        result = subprocess.run(['yarn', '--version'], capture_output=True, text=True)
        print(f'  ✅ Yarn: {result.stdout.strip()}')
    except FileNotFoundError:
        try:
            result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
            print(f'  ✅ npm: {result.stdout.strip()}')
        except FileNotFoundError:
            errors.append('npm 或 yarn 未安装')

    # 检查 ANDROID_HOME
    android_home = os.environ.get('ANDROID_HOME') or os.environ.get('ANDROID_SDK_ROOT')
    if android_home and os.path.exists(android_home):
        print(f'  ✅ Android SDK: {android_home}')
    else:
        errors.append('ANDROID_HOME 环境变量未设置或路径不存在')

    # 检查 Java
    try:
        result = subprocess.run(['java', '-version'], capture_output=True, text=True)
        # Java 版本信息输出到 stderr
        java_version = result.stderr.split('\n')[0] if result.stderr else result.stdout.split('\n')[0]
        print(f'  ✅ Java: {java_version}')
    except FileNotFoundError:
        errors.append('Java 未安装')

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

    # 优先使用 yarn
    if shutil.which('yarn'):
        cmd = ['yarn', 'install']
    else:
        cmd = ['npm', 'install']

    result = subprocess.run(cmd, cwd=project_root)
    if result.returncode != 0:
        print('❌ 依赖安装失败')
        sys.exit(1)

    print('  ✅ 依赖安装完成\n')


def clean_build():
    """清理构建缓存"""
    print('🧹 清理构建缓存...')
    project_root = get_project_root()
    android_dir = project_root / 'android'

    # 清理 Android 构建目录
    build_dirs = [
        android_dir / 'app' / 'build',
        android_dir / 'build',
        android_dir / '.gradle',
    ]

    for build_dir in build_dirs:
        if build_dir.exists():
            shutil.rmtree(build_dir)
            print(f'  🗑️ 已删除: {build_dir.name}')

    # 执行 gradlew clean
    gradlew = android_dir / 'gradlew'
    if gradlew.exists():
        subprocess.run(['./gradlew', 'clean'], cwd=android_dir, shell=False)

    print('  ✅ 清理完成\n')


def build_bundle():
    """构建 JavaScript Bundle"""
    print('📜 构建 JavaScript Bundle...')
    project_root = get_project_root()
    android_dir = project_root / 'android'

    # 确保 assets 目录存在
    assets_dir = android_dir / 'app' / 'src' / 'main' / 'assets'
    assets_dir.mkdir(parents=True, exist_ok=True)

    # 构建 bundle
    cmd = [
        'npx', 'react-native', 'bundle',
        '--platform', 'android',
        '--dev', 'false',
        '--entry-file', 'index.js',
        '--bundle-output', str(assets_dir / 'index.android.bundle'),
        '--assets-dest', str(android_dir / 'app' / 'src' / 'main' / 'res'),
    ]

    result = subprocess.run(cmd, cwd=project_root)
    if result.returncode != 0:
        print('❌ Bundle 构建失败')
        sys.exit(1)

    print('  ✅ Bundle 构建完成\n')


def build_apk(release: bool = False):
    """构建 APK"""
    build_type = 'Release' if release else 'Debug'
    print(f'🔨 构建 {build_type} APK...')

    project_root = get_project_root()
    android_dir = project_root / 'android'

    # 设置 gradlew 可执行权限
    gradlew = android_dir / 'gradlew'
    if gradlew.exists():
        os.chmod(gradlew, 0o755)

    # 构建命令
    task = f'assemble{build_type}'
    cmd = ['./gradlew', task, '--no-daemon']

    result = subprocess.run(cmd, cwd=android_dir)
    if result.returncode != 0:
        print(f'❌ {build_type} APK 构建失败')
        sys.exit(1)

    print(f'  ✅ {build_type} APK 构建完成\n')


def get_apk_path(release: bool = False) -> Path:
    """获取生成的 APK 路径"""
    project_root = get_project_root()
    build_type = 'release' if release else 'debug'

    apk_dir = project_root / 'android' / 'app' / 'build' / 'outputs' / 'apk' / build_type

    # 查找 APK 文件
    if apk_dir.exists():
        for apk_file in apk_dir.glob('*.apk'):
            return apk_file

    return None


def clean_output_dir():
    """清空输出目录"""
    print('🗑️ 清空输出目录...')
    project_root = get_project_root()
    output_dir = project_root / 'output'

    if output_dir.exists():
        # 删除目录中的所有文件
        for file in output_dir.iterdir():
            if file.is_file():
                file.unlink()
                print(f'  已删除: {file.name}')
        print('  ✅ 输出目录已清空\n')
    else:
        print('  输出目录不存在，跳过清理\n')


def copy_apk_to_output(release: bool = False) -> list:
    """复制所有 APK 到输出目录"""
    project_root = get_project_root()
    output_dir = project_root / 'output'
    output_dir.mkdir(exist_ok=True)

    build_type = 'release' if release else 'debug'
    apk_dir = project_root / 'android' / 'app' / 'build' / 'outputs' / 'apk' / build_type

    if not apk_dir.exists():
        print('❌ 未找到 APK 输出目录')
        return []

    # 复制所有 APK 文件
    copied_files = []
    timestamp = datetime.now().strftime('%Y-%m-%d_%H-%M-%S')

    for apk_file in apk_dir.glob('*.apk'):
        # 保留原文件名，添加时间戳
        base_name = apk_file.stem  # 如 app-arm64-v8a-release
        new_name = f'{base_name}-{timestamp}.apk'
        output_path = output_dir / new_name
        shutil.copy2(apk_file, output_path)
        copied_files.append(output_path)

    return copied_files


def install_apk(release: bool = False):
    """安装 APK 到连接的设备"""
    print('📱 安装 APK 到设备...')

    apk_path = get_apk_path(release)
    if not apk_path:
        print('❌ 未找到 APK 文件')
        return False

    # 检查 adb 设备
    result = subprocess.run(['adb', 'devices'], capture_output=True, text=True)
    devices = [line for line in result.stdout.split('\n') if '\tdevice' in line]

    if not devices:
        print('❌ 未检测到连接的 Android 设备')
        print('  请确保:')
        print('  1. 设备已通过 USB 连接')
        print('  2. 已开启 USB 调试模式')
        print('  3. 已授权此电脑调试')
        return False

    print(f'  📱 检测到 {len(devices)} 个设备')

    # 安装 APK
    cmd = ['adb', 'install', '-r', str(apk_path)]
    result = subprocess.run(cmd)

    if result.returncode == 0:
        print('  ✅ APK 安装成功')
        return True
    else:
        print('  ❌ APK 安装失败')
        return False


def setup_java_home(java_home: str):
    """设置 JAVA_HOME 环境变量"""
    if not java_home:
        return

    java_path = Path(java_home)
    if not java_path.exists():
        print(f'❌ 指定的 Java 路径不存在: {java_home}')
        sys.exit(1)

    # 验证是否是有效的 Java 目录
    java_bin = java_path / 'bin' / 'java'
    if not java_bin.exists() and not (java_path / 'bin' / 'java.exe').exists():
        print(f'❌ 指定的路径不是有效的 Java 目录: {java_home}')
        print('   请确保路径指向 JAVA_HOME (包含 bin/java)')
        sys.exit(1)

    os.environ['JAVA_HOME'] = str(java_path)
    # 将 Java bin 目录添加到 PATH 前面
    os.environ['PATH'] = str(java_path / 'bin') + os.pathsep + os.environ.get('PATH', '')
    print(f'☕ 使用指定的 Java: {java_home}\n')


def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='Android APK 打包脚本')
    parser.add_argument('--release', action='store_true', help='构建 Release 版本')
    parser.add_argument('--clean', action='store_true', help='构建前清理缓存')
    parser.add_argument('--install', action='store_true', help='构建后自动安装到设备')
    parser.add_argument('--skip-deps', action='store_true', help='跳过依赖安装')
    parser.add_argument('--java-home', type=str, help='指定 Java 路径')
    args = parser.parse_args()

    build_type = 'Release' if args.release else 'Debug'

    print('=' * 50)
    print(f'🚀 开始构建 Android {build_type} APK')
    print('=' * 50 + '\n')

    # 0. 设置 Java 路径（命令行参数优先，否则使用默认配置）
    java_home = args.java_home or DEFAULT_JAVA_HOME
    if java_home:
        setup_java_home(java_home)

    # 1. 检查环境
    check_environment()

    # 2. 安装依赖
    if not args.skip_deps:
        install_dependencies()

    # 3. 清空输出目录
    clean_output_dir()

    # 4. 清理缓存（可选）
    if args.clean:
        clean_build()

    # 5. 生成签名密钥（Release 模式需要，每次都生成新的）
    if args.release:
        generate_keystore()

    # 6. 构建 JS Bundle（Release 模式需要）
    if args.release:
        build_bundle()

    # 7. 构建 APK
    build_apk(args.release)

    # 8. 复制到输出目录
    output_files = copy_apk_to_output(args.release)

    # 9. 安装到设备（可选）
    if args.install:
        install_apk(args.release)

    # 完成
    print('=' * 50)
    print('✅ 构建完成!')
    print('=' * 50)

    if output_files:
        print(f'\n📦 APK 文件位置 ({len(output_files)} 个):')
        for apk_path in output_files:
            size_mb = apk_path.stat().st_size / (1024 * 1024)
            print(f'   {apk_path.name} ({size_mb:.2f} MB)')
        print(f'\n📁 输出目录: {get_project_root() / "output"}')

    if not args.install:
        print('\n💡 提示: 使用 --install 参数可自动安装到连接的设备')
        print('   python scripts/build_android.py --install')


if __name__ == '__main__':
    main()
