import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const docsDir = path.join(projectRoot, 'docs');

// 检测操作系统
const isWindows = os.platform() === 'win32';

/**
 * 创建硬链接或符号链接
 * @param {string} src 源路径
 * @param {string} dest 目标路径
 * @param {boolean} isDirectory 是否为目录
 */
function createLink(src, dest, isDirectory = false) {
  try {
    if (isWindows) {
      // Windows 使用 mklink
      if (isDirectory) {
        // 目录硬链接 (Junction)
        execSync(`mklink /J "${dest}" "${src}"`, { stdio: 'pipe' });
        console.log(`🔗 创建目录硬链接: ${path.relative(projectRoot, src)} -> ${path.relative(projectRoot, dest)}`);
      } else {
        // 文件硬链接
        execSync(`mklink /H "${dest}" "${src}"`, { stdio: 'pipe' });
        console.log(`🔗 创建文件硬链接: ${path.relative(projectRoot, src)} -> ${path.relative(projectRoot, dest)}`);
      }
    } else {
      // Linux/macOS 使用 ln -s
      execSync(`ln -sf "${src}" "${dest}"`, { stdio: 'pipe' });
      console.log(`🔗 创建符号链接: ${path.relative(projectRoot, src)} -> ${path.relative(projectRoot, dest)}`);
    }
    return true;
  } catch (error) {
    console.error(`❌ 创建链接失败: ${src} -> ${dest}`, error.message);
    return false;
  }
}

/**
 * 递归创建硬链接映射，跳过.git目录
 * @param {string} src 源目录
 * @param {string} dest 目标目录
 */
function linkDirectoryRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠️ 源目录不存在: ${src}`);
    return { linked: 0, skipped: 0 };
  }

  // 跳过 .git 目录
  if (path.basename(src) === '.git') {
    console.log(`⏭️ 跳过 .git 目录: ${path.relative(projectRoot, src)}`);
    return { linked: 0, skipped: 1 };
  }

  // 确保目标目录的父目录存在
  const destParent = path.dirname(dest);
  if (!fs.existsSync(destParent)) {
    fs.mkdirSync(destParent, { recursive: true });
  }

  const items = fs.readdirSync(src);
  let linkedCount = 0;
  let skippedCount = 0;

  for (const item of items) {
    // 跳过 .git 目录
    if (item === '.git') {
      console.log(`⏭️ 跳过 .git 目录`);
      skippedCount++;
      continue;
    }

    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    // 如果目标已存在，先删除
    if (fs.existsSync(destPath)) {
      try {
        const destStat = fs.lstatSync(destPath);
        if (destStat.isDirectory()) {
          if (isWindows) {
            execSync(`rmdir /S /Q "${destPath}"`, { stdio: 'pipe' });
          } else {
            execSync(`rm -rf "${destPath}"`, { stdio: 'pipe' });
          }
        } else {
          fs.unlinkSync(destPath);
        }
        console.log(`🗑️ 删除现有目标: ${path.relative(projectRoot, destPath)}`);
      } catch (error) {
        console.warn(`⚠️ 删除现有目标失败: ${destPath}`, error.message);
      }
    }

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // 创建目录链接
      if (createLink(srcPath, destPath, true)) {
        linkedCount++;
      } else {
        skippedCount++;
      }
    } else {
      // 创建文件链接
      if (createLink(srcPath, destPath, false)) {
        linkedCount++;
      } else {
        skippedCount++;
      }
    }
  }

  return { linked: linkedCount, skipped: skippedCount };
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始将 public 目录硬链接映射到 docs 目录...');
  console.log(`源目录: ${publicDir}`);
  console.log(`目标目录: ${docsDir}`);
  console.log(`操作系统: ${isWindows ? 'Windows' : 'Unix-like'}`);
  console.log('');

  try {
    // 确保目标目录存在
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
      console.log(`📁 创建目标目录: ${docsDir}`);
    }

    const result = linkDirectoryRecursive(publicDir, docsDir);

    console.log('');
    console.log('✅ 硬链接映射完成！');
    console.log(`🔗 创建链接数: ${result.linked}`);
    console.log(`⏭️ 跳过项目数: ${result.skipped}`);

    if (result.linked === 0 && result.skipped === 0) {
      console.log('ℹ️ 没有需要映射的文件');
    }

    console.log('');
    console.log('💡 提示: 硬链接映射后，public 和 docs 目录将同步更新');
    console.log('💡 提示: 修改任一目录的文件都会影响另一个目录');
  } catch (error) {
    console.error('❌ 映射过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();
