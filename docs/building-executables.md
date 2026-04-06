# 构建可执行文件指南

本文档介绍如何将 Claude Code CLI 项目打包为独立的可执行文件。

## 前提条件

### 方法1：使用 Bun 编译（推荐）
- Bun 1.2+ 版本
- 已安装 Bun：https://bun.sh

### 方法2：使用 pkg 打包
- Node.js 18+
- 安装 pkg：`npm install -g pkg`

### 方法3：使用 nexe 打包
- Node.js 18+
- 安装 nexe：`npm install -g nexe`

## 构建步骤

### 1. 安装依赖
```bash
bun install
```

### 2. 构建项目
```bash
bun run build
```

这会生成 `dist/` 目录，包含所有打包好的 JavaScript 文件。

### 3. 构建可执行文件

#### 方法A：使用 Bun 编译（推荐，性能最好）
```bash
# 使用 Bun 编译（默认）
bun run build:executable:bun

# 或简写
bun run build:executable
```

这会为**当前平台**生成可执行文件：
- Linux: `build-executables/claude-code`
- macOS: `build-executables/claude-code`
- Windows: `build-executables/claude-code.exe`

**注意**：Bun 的 `--compile` 只能编译当前平台的可执行文件。如需跨平台编译，请使用 pkg。

#### 方法B：使用 pkg 打包
```bash
bun run build:executable:pkg
```

#### 方法C：使用 nexe 打包
```bash
bun run build:executable:nexe
```

## 测试可执行文件

```bash
# Linux/macOS
chmod +x build-executables/claude-code-linux
./build-executables/claude-code-linux --version

# Windows
build-executables\claude-code-win.exe --version
```

## 文件大小说明

- **Bun 编译**：文件较小（~30-50MB），启动速度快
- **pkg 打包**：文件较大（~80-100MB），包含完整的 Node.js 运行时
- **nexe 打包**：文件中等（~50-70MB）

## 分发注意事项

1. **依赖项**：可执行文件是独立的，不需要安装 Bun 或 Node.js
2. **权限**：确保可执行文件有执行权限
3. **配置文件**：首次运行时会在用户目录创建配置文件
4. **ripgrep**：首次运行会自动下载 ripgrep（如果未安装）

## 故障排除

### 问题：构建失败
- 确保已运行 `bun run build`
- 检查 Bun/Node.js 版本
- 检查网络连接（下载依赖需要）

### 问题：可执行文件无法运行
- 检查文件权限：`chmod +x <filename>`
- 检查操作系统架构是否匹配
- 尝试在终端直接运行查看错误信息

### 问题：缺少依赖
- Bun 编译版本需要 glibc 2.28+（较新的 Linux 发行版）
- pkg/nexe 版本兼容性更好，但文件更大

## 高级选项

### 自定义构建
编辑 `scripts/build-executable.ts` 文件：
- 修改目标平台
- 调整输出文件名
- 添加额外的构建参数

### 仅构建特定平台
```bash
# 使用 Bun 仅构建 Linux 版本
bun build --compile dist/cli.js --target linux-x64 --outfile claude-code-linux

# 使用 pkg 仅构建 macOS 版本
pkg dist/cli.js --targets node18-macos-x64 --output claude-code-macos
```

## 版本信息

构建的可执行文件会包含版本信息：
```bash
./claude-code --version
# 输出: 2.1.888 (Claude Code)
```