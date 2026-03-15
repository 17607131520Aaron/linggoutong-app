#!/usr/bin/env python3
"""
从 metro.config.js 读取端口配置，启动 Metro bundler 或 Android 应用。

用法:
    python scripts/start_with_port.py start      # 启动 Metro bundler
    python scripts/start_with_port.py android    # 运行 Android 应用
    python scripts/start_with_port.py ios        # 运行 iOS 应用

配置:
    在脚本顶部的 CONFIG 中设置 JAVA_HOME 路径，留空则使用系统默认 Java
"""

import os
import re
import subprocess
import sys
from pathlib import Path

# ============ 配置区域 ============
CONFIG = {
    # 指定 Java 路径，留空则使用系统默认
    # 例如: "JAVA_HOME": "/opt/homebrew/Cellar/openjdk@17/17.0.15/libexec/openjdk.jdk/Contents/Home",
    # "JAVA_HOME": "",
     "JAVA_HOME": "/opt/homebrew/Cellar/openjdk@17/17.0.15/libexec/openjdk.jdk/Contents/Home",
}
# =================================


def get_project_root() -> Path:
    """获取项目根目录"""
    return Path(__file__).parent.parent


def read_metro_port() -> int:
    """从 metro.config.js 读取端口配置"""
    metro_config_path = get_project_root() / "metro.config.js"

    if not metro_config_path.exists():
        print("警告: metro.config.js 不存在，使用默认端口 8081")
        return 8081

    content = metro_config_path.read_text(encoding="utf-8")

    # 匹配 server: { port: 8081 } 或 server: { port: 8081, ... }
    pattern = r"server\s*:\s*\{[^}]*port\s*:\s*(\d+)"
    match = re.search(pattern, content, re.DOTALL)

    if match:
        port = int(match.group(1))
        print(f"从 metro.config.js 读取到端口: {port}")
        return port

    print("警告: 未在 metro.config.js 中找到端口配置，使用默认端口 8081")
    return 8081


def get_env_with_java() -> dict:
    """获取包含 Java 配置的环境变量"""
    env = os.environ.copy()

    java_home = CONFIG.get("JAVA_HOME", "").strip()
    if java_home:
        if not Path(java_home).exists():
            print(f"警告: 指定的 JAVA_HOME 路径不存在: {java_home}")
            print("将使用系统默认 Java")
        else:
            env["JAVA_HOME"] = java_home
            # 将 Java bin 目录添加到 PATH 最前面
            java_bin = str(Path(java_home) / "bin")
            env["PATH"] = f"{java_bin}:{env.get('PATH', '')}"
            print(f"使用指定 Java: {java_home}")

    return env


def run_command(command: list[str], use_java_env: bool = False) -> int:
    """运行命令并返回退出码"""
    print(f"执行命令: {' '.join(command)}")

    env = get_env_with_java() if use_java_env else None

    try:
        result = subprocess.run(command, cwd=get_project_root(), env=env)
        return result.returncode
    except KeyboardInterrupt:
        print("\n已取消")
        return 130


def start_metro(port: int) -> int:
    """启动 Metro bundler"""
    return run_command(["npx", "react-native", "start", "--port", str(port)])


def run_android(port: int) -> int:
    """运行 Android 应用"""
    return run_command(
        ["npx", "react-native", "run-android", "--port", str(port)],
        use_java_env=True
    )


def run_ios(port: int) -> int:
    """运行 iOS 应用"""
    return run_command(["npx", "react-native", "run-ios", "--port", str(port)])


def print_usage():
    """打印使用说明"""
    print(__doc__)
    print("可用命令:")
    print("  start   - 启动 Metro bundler")
    print("  android - 构建并运行 Android 应用")
    print("  ios     - 构建并运行 iOS 应用")


def main():
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(1)

    command = sys.argv[1].lower()
    port = read_metro_port()

    commands = {
        "start": lambda: start_metro(port),
        "android": lambda: run_android(port),
        "ios": lambda: run_ios(port),
    }

    if command in commands:
        sys.exit(commands[command]())
    else:
        print(f"未知命令: {command}")
        print_usage()
        sys.exit(1)


if __name__ == "__main__":
    main()
