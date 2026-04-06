#!/usr/bin/env bun
/**
 * 构建可执行文件的脚本
 * 使用方法：
 * 1. bun run scripts/build-executable.ts --bun   # 使用 Bun 编译（推荐）
 * 2. bun run scripts/build-executable.ts --pkg   # 使用 pkg 打包
 * 3. bun run scripts/build-executable.ts --nexe  # 使用 nexe 打包
 */

import { spawnSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const BUILD_DIR = 'build-executables';
const MAIN_ENTRY = 'dist/cli.js';

// 确保构建目录存在
if (!existsSync(BUILD_DIR)) {
  mkdirSync(BUILD_DIR, { recursive: true });
}

async function buildWithBun() {
  console.log('🚀 使用 Bun 编译可执行文件...');

  // 检查是否已安装 Bun
  const bunCheck = spawnSync('bun', ['--version'], { stdio: 'pipe' });
  if (bunCheck.status !== 0) {
    console.error('❌ 需要 Bun 运行时。请先安装 Bun: https://bun.sh');
    process.exit(1);
  }

  // 检查主文件是否存在
  if (!existsSync(MAIN_ENTRY)) {
    console.error(`❌ 主文件 ${MAIN_ENTRY} 不存在。请先运行 "bun run build"`);
    process.exit(1);
  }

  console.log('📦 使用 Bun 编译当前平台的可执行文件...');

  const outputFile = join(BUILD_DIR, 'claude-code');
  const isWindows = process.platform === 'win32';
  const ext = isWindows ? '.exe' : '';

  const result = spawnSync('bun', [
    'build',
    '--compile',
    MAIN_ENTRY,
    '--outfile', `${outputFile}${ext}`,
  ], { stdio: 'inherit' });

  if (result.status === 0) {
    console.log(`✅ Bun 编译成功: ${outputFile}${ext}`);
    console.log('\n📝 注意: Bun --compile 只能编译当前平台的可执行文件。');
    console.log('   如需跨平台编译，请使用 pkg 或 nexe。');
  } else {
    console.error('❌ Bun 编译失败');
  }
}

async function buildWithPkg() {
  console.log('🚀 使用 pkg 打包可执行文件...');

  // 检查是否已安装 pkg
  const pkgCheck = spawnSync('pkg', ['--version'], { stdio: 'pipe' });
  if (pkgCheck.status !== 0) {
    console.error('❌ 需要 pkg。请先安装: npm install -g pkg');
    process.exit(1);
  }

  // 检查主文件是否存在
  if (!existsSync(MAIN_ENTRY)) {
    console.error(`❌ 主文件 ${MAIN_ENTRY} 不存在。请先运行 "bun run build"`);
    process.exit(1);
  }

  console.log('📦 使用 pkg 打包...');

  const result = spawnSync('pkg', [
    MAIN_ENTRY,
    '--targets', 'node18-linux-x64,node18-macos-x64,node18-macos-arm64,node18-win-x64',
    '--output', join(BUILD_DIR, 'claude-code'),
  ], { stdio: 'inherit' });

  if (result.status === 0) {
    console.log('✅ pkg 打包成功！');
    console.log('📁 文件保存在 build-executables/ 目录:');
    console.log('   - claude-code-linux (Linux)');
    console.log('   - claude-code-macos (macOS Intel)');
    console.log('   - claude-code-macos-arm64 (macOS Apple Silicon)');
    console.log('   - claude-code-win.exe (Windows)');
  } else {
    console.error('❌ pkg 打包失败');
  }
}

async function buildWithNexe() {
  console.log('🚀 使用 nexe 打包可执行文件...');

  // 检查是否已安装 nexe
  const nexeCheck = spawnSync('nexe', ['--version'], { stdio: 'pipe' });
  if (nexeCheck.status !== 0) {
    console.error('❌ 需要 nexe。请先安装: npm install -g nexe');
    process.exit(1);
  }

  // 检查主文件是否存在
  if (!existsSync(MAIN_ENTRY)) {
    console.error(`❌ 主文件 ${MAIN_ENTRY} 不存在。请先运行 "bun run build"`);
    process.exit(1);
  }

  console.log('📦 使用 nexe 打包...');

  const result = spawnSync('nexe', [
    MAIN_ENTRY,
    '-o', join(BUILD_DIR, 'claude-code'),
    '--target', 'linux-x64',
  ], { stdio: 'inherit' });

  if (result.status === 0) {
    console.log('✅ nexe 打包成功！');
    console.log(`📁 文件保存在: ${join(BUILD_DIR, 'claude-code')}`);
  } else {
    console.error('❌ nexe 打包失败');
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--bun') || args.length === 0) {
    await buildWithBun();
  } else if (args.includes('--pkg')) {
    await buildWithPkg();
  } else if (args.includes('--nexe')) {
    await buildWithNexe();
  } else {
    console.log(`
用法:
  bun run scripts/build-executable.ts [选项]

选项:
  --bun   使用 Bun 编译（推荐，需要 Bun 1.2+）
  --pkg   使用 pkg 打包（跨平台，需要 Node.js）
  --nexe  使用 nexe 打包（简单，需要 Node.js）

示例:
  bun run scripts/build-executable.ts --bun
  bun run scripts/build-executable.ts --pkg
    `);
  }
}

main().catch(console.error);