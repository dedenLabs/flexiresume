import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = __dirname; // 脚本在项目根目录
const publicDir = path.join(projectRoot, 'public');
const docsDir = path.join(projectRoot, 'docs');

/**
 * 递归复制目录，如果目标文件已存在则跳过
 * @param {string} src 源目录
 * @param {string} dest 目标目录
 */
function copyDirectoryIfNotExists(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`源目录不存在: ${src}`);
    return { copied: 0, skipped: 0 };
  }

  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);
  let copiedCount = 0;
  let skippedCount = 0;

  // 定义要排除的目录列表
  const excludeDirs = ['.git', 'node_modules', '.vscode', '.idea'];


  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      const dirName = path.basename(srcPath);

      // 检查当前目录是否在排除列表中
      if (excludeDirs.includes(dirName)) {
        console.log(`跳过目录: ${srcPath}`); 
        continue;
      }
      // 递归处理子目录
      const result = copyDirectoryIfNotExists(srcPath, destPath);
      if (result) {
        copiedCount += result.copied;
        skippedCount += result.skipped;
      }
    } else {
      // 处理文件
      if (fs.existsSync(destPath)) {
        console.log(`跳过已存在的文件: ${path.relative(projectRoot, destPath)}`);
        skippedCount++;
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`复制文件: ${path.relative(projectRoot, srcPath)} -> ${path.relative(projectRoot, destPath)}`);
        copiedCount++;
      }
    }
  }

  return { copied: copiedCount, skipped: skippedCount };
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始将 public 目录映射到 docs 目录...');
  console.log(`源目录: ${publicDir}`);
  console.log(`目标目录: ${docsDir}`);
  console.log('');

  try {
    const result = copyDirectoryIfNotExists(publicDir, docsDir);

    console.log('');
    console.log('✅ 映射完成！');
    console.log(`📁 复制文件数: ${result.copied}`);
    console.log(`⏭️ 跳过文件数: ${result.skipped}`);

    if (result.copied === 0 && result.skipped === 0) {
      console.log('ℹ️ 没有需要复制的文件');
    }
  } catch (error) {
    console.error('❌ 复制过程中出现错误:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();