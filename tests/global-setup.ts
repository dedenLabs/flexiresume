import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Playwright 全局设置
 * 在所有测试开始前执行的初始化操作
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 开始 Playwright 全局设置...');
  
  // 确保测试目录存在
  const testDirs = [
    'tests/screenshots',
    'tests/screenshots/zh',
    'tests/screenshots/en',
    'tests/reports',
    'tests/reports/html',
    'tests/reports/json',
    'tests/test-results'
  ];
  
  testDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 创建目录: ${dir}`);
    }
  });
  
  // 清理旧的测试结果
  const cleanupDirs = [
    'tests/screenshots/zh',
    'tests/screenshots/en',
    'tests/test-results'
  ];
  
  cleanupDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      console.log(`🧹 清理目录: ${dir}`);
    }
  });
  
  // 等待开发服务器启动
  console.log('⏳ 等待开发服务器启动...');
  
  // 创建测试开始时间戳
  const timestamp = new Date().toISOString();
  fs.writeFileSync('tests/test-start-time.txt', timestamp);
  
  console.log('✅ 全局设置完成');
}

export default globalSetup;
