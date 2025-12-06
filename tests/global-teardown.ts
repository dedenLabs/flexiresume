import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Playwright 全局清理
 * 在所有测试结束后执行的清理操作
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 开始 Playwright 全局清理...');
  
  // 读取测试开始时间
  let startTime = '';
  if (fs.existsSync('tests/test-start-time.txt')) {
    startTime = fs.readFileSync('tests/test-start-time.txt', 'utf-8');
  }
  
  // 计算测试总耗时
  const endTime = new Date().toISOString();
  const duration = startTime ? 
    new Date(endTime).getTime() - new Date(startTime).getTime() : 0;
  
  // 生成测试摘要
  const summary = {
    startTime,
    endTime,
    duration: `${Math.round(duration / 1000)}秒`,
    screenshotsCount: countFiles('tests/screenshots'),
    reportsGenerated: fs.existsSync('tests/reports/test-results.json')
  };
  
  // 保存测试摘要
  fs.writeFileSync(
    'tests/test-summary.json', 
    JSON.stringify(summary, null, 2)
  );
  
  console.log('📊 测试摘要:');
  console.log(`   开始时间: ${startTime}`);
  console.log(`   结束时间: ${endTime}`);
  console.log(`   总耗时: ${summary.duration}`);
  console.log(`   截图数量: ${summary.screenshotsCount}`);
  
  // 清理临时文件
  if (fs.existsSync('tests/test-start-time.txt')) {
    fs.unlinkSync('tests/test-start-time.txt');
  }
  
  console.log('✅ 全局清理完成');
}

/**
 * 递归计算目录中的文件数量
 */
function countFiles(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  
  let count = 0;
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isFile()) {
      count++;
    } else if (stat.isDirectory()) {
      count += countFiles(itemPath);
    }
  }
  
  return count;
}

export default globalTeardown;
