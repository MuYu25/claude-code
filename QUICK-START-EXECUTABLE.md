# 快速开始：构建可执行文件

## 最简单的方法（推荐）

1. **安装依赖**：
   ```bash
   bun install
   ```

2. **构建项目**：
   ```bash
   bun run build
   ```

3. **编译为可执行文件**：
   ```bash
   bun run build:executable
   ```

4. **使用可执行文件**：
   ```bash
   # 给执行权限（Linux/macOS）
   chmod +x build-executables/claude-code
   
   # 测试
   ./build-executables/claude-code --version
   # 输出: 2.1.888 (Claude Code)
   
   # 运行
   ./build-executables/claude-code
   ```

## 文件位置

- 可执行文件：`build-executables/claude-code`（或 `claude-code.exe` on Windows）
- 大小：约 120MB（包含所有依赖）

## 跨平台构建

如果需要为其他平台构建：

### 使用 pkg（需要 Node.js）
```bash
# 安装 pkg
npm install -g pkg

# 构建
bun run build:executable:pkg
```

### 在不同平台上分别构建
1. 在 Linux 上：`bun run build:executable` → `claude-code-linux`
2. 在 macOS 上：`bun run build:executable` → `claude-code-macos`
3. 在 Windows 上：`bun run build:executable` → `claude-code-win.exe`

## 注意事项

1. **首次运行**会自动下载 ripgrep（如果未安装）
2. **配置文件**保存在用户目录：`~/.config/claude-code-best/`
3. **不需要 Bun 或 Node.js**：可执行文件是独立的

## 故障排除

### 构建失败
- 确保已运行 `bun run build`
- 检查 Bun 版本：`bun --version`（需要 1.2+）

### 无法运行
```bash
# 检查权限
chmod +x build-executables/claude-code

# 检查依赖
ldd build-executables/claude-code  # Linux
otool -L build-executables/claude-code  # macOS
```

### 文件太大
- 这是正常的，包含了 Bun 运行时和所有依赖
- 使用 `strip` 可以减少大小（Linux/macOS）：
  ```bash
  strip build-executables/claude-code
  ```