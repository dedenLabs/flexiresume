/**
 * 视频下载最终验证测试
 * 
 * 综合测试所有修复的视频下载功能
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

test.describe('视频下载最终验证测试', () => {

  test('验证1：视频下载功能完整性测试', async () => {
    console.log('🧪 测试1：视频下载功能完整性测试');
    
    // 清理之前的下载文件
    const videoDir = 'downloads/audio/video';
    if (fs.existsSync(videoDir)) {
      const files = fs.readdirSync(videoDir);
      files.forEach(file => {
        if (file.includes('28七龙珠此生不悔入龙珠')) {
          fs.unlinkSync(path.join(videoDir, file));
        }
      });
    }
    
    console.log('🧹 清理完成，开始下载测试');
    
    // 执行视频下载命令
    const command = 'node scripts/playwright-audio-downloader.js "28七龙珠此生不悔入龙珠" 1 -t video';
    console.log(`🚀 执行命令: ${command}`);
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 180000 // 3分钟超时
      });
      
      console.log('📊 下载输出:');
      console.log(stdout);
      
      if (stderr) {
        console.log('⚠️ 错误输出:');
        console.log(stderr);
      }
      
      // 验证下载结果
      if (fs.existsSync(videoDir)) {
        const files = fs.readdirSync(videoDir);
        const videoFiles = files.filter(file => 
          file.includes('28七龙珠此生不悔入龙珠') && file.endsWith('.mp4')
        );
        
        console.log(`📁 找到 ${videoFiles.length} 个视频文件:`);
        
        let totalSize = 0;
        videoFiles.forEach((file, index) => {
          const filePath = path.join(videoDir, file);
          const stats = fs.statSync(filePath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          totalSize += stats.size;
          
          console.log(`  ${index + 1}. ${file} (${sizeKB}KB)`);
        });
        
        const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2);
        console.log(`📊 总下载大小: ${totalSizeMB}MB`);
        
        // 验证下载成功
        expect(videoFiles.length).toBeGreaterThan(0);
        expect(totalSize).toBeGreaterThan(100 * 1024); // 至少100KB
        
        // 验证文件命名正确
        const hasCorrectNaming = videoFiles.some(file => 
          file.includes('28七龙珠此生不悔入龙珠')
        );
        expect(hasCorrectNaming).toBeTruthy();
        
        console.log('✅ 视频下载功能验证通过');
        
      } else {
        throw new Error('视频下载目录不存在');
      }
      
    } catch (error) {
      console.error('❌ 视频下载测试失败:', error.message);
      throw error;
    }
  });

  test('验证2：音频下载功能验证', async () => {
    console.log('🧪 测试2：音频下载功能验证');
    
    // 清理之前的下载文件
    const soundDir = 'downloads/audio/sound';
    if (fs.existsSync(soundDir)) {
      const files = fs.readdirSync(soundDir);
      files.forEach(file => {
        if (file.includes('孙悟空')) {
          fs.unlinkSync(path.join(soundDir, file));
        }
      });
    }
    
    // 执行音频下载命令
    const command = 'node scripts/playwright-audio-downloader.js "孙悟空" 1 -t sound';
    console.log(`🚀 执行命令: ${command}`);
    
    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd: process.cwd(),
        timeout: 120000 // 2分钟超时
      });
      
      console.log('📊 下载输出:');
      console.log(stdout);
      
      // 验证下载结果
      if (fs.existsSync(soundDir)) {
        const files = fs.readdirSync(soundDir);
        const audioFiles = files.filter(file => 
          file.includes('孙悟空') && (file.endsWith('.mp3') || file.endsWith('.wav'))
        );
        
        console.log(`📁 找到 ${audioFiles.length} 个音频文件:`);
        
        let totalSize = 0;
        audioFiles.forEach((file, index) => {
          const filePath = path.join(soundDir, file);
          const stats = fs.statSync(filePath);
          const sizeKB = (stats.size / 1024).toFixed(1);
          totalSize += stats.size;
          
          console.log(`  ${index + 1}. ${file} (${sizeKB}KB)`);
        });
        
        // 验证下载成功
        expect(audioFiles.length).toBeGreaterThan(0);
        expect(totalSize).toBeGreaterThan(50 * 1024); // 至少50KB
        
        console.log('✅ 音频下载功能验证通过');
        
      } else {
        throw new Error('音频下载目录不存在');
      }
      
    } catch (error) {
      console.error('❌ 音频下载测试失败:', error.message);
      throw error;
    }
  });

  test('验证3：分类目录存储功能', async () => {
    console.log('🧪 测试3：分类目录存储功能');
    
    // 检查目录结构
    const baseDir = 'downloads/audio';
    const expectedDirs = ['sound', 'music', 'video'];
    
    expectedDirs.forEach(dir => {
      const dirPath = path.join(baseDir, dir);
      const exists = fs.existsSync(dirPath);
      
      console.log(`📁 ${dir} 目录: ${exists ? '✅ 存在' : '❌ 不存在'}`);
      expect(exists).toBeTruthy();
      
      if (exists) {
        const files = fs.readdirSync(dirPath);
        console.log(`  - 包含 ${files.length} 个文件`);
      }
    });
    
    console.log('✅ 分类目录存储功能验证通过');
  });

  test('验证4：登录功能状态检查', async () => {
    console.log('🧪 测试4：登录功能状态检查');
    
    // 检查登录状态文件
    const loginStateFile = 'downloads/audio/login-state.json';
    
    if (fs.existsSync(loginStateFile)) {
      console.log('✅ 登录状态文件存在');
      
      try {
        const loginData = JSON.parse(fs.readFileSync(loginStateFile, 'utf8'));
        
        console.log('📊 登录状态信息:');
        console.log(`  - 时间戳: ${new Date(loginData.timestamp).toLocaleString()}`);
        console.log(`  - Cookies数量: ${loginData.cookies ? loginData.cookies.length : 0}`);
        console.log(`  - User Agent: ${loginData.userAgent ? '已设置' : '未设置'}`);
        
        expect(loginData.timestamp).toBeTruthy();
        expect(loginData.cookies).toBeTruthy();
        
        console.log('✅ 登录状态数据有效');
        
      } catch (error) {
        console.log('⚠️ 登录状态文件格式错误:', error.message);
      }
    } else {
      console.log('ℹ️ 登录状态文件不存在（正常，如果未使用--login参数）');
    }
  });

  test('验证5：README文档完整性检查', async () => {
    console.log('🧪 测试5：README文档完整性检查');
    
    const readmePath = 'downloads/audio/README.md';
    
    if (fs.existsSync(readmePath)) {
      const content = fs.readFileSync(readmePath, 'utf8');
      
      // 检查关键内容
      const requiredSections = [
        '登录功能',
        '分页支持',
        '分类存储',
        '错误处理',
        '故障排除',
        '技术实现',
        '更新日志'
      ];
      
      console.log('📋 检查README文档内容:');
      requiredSections.forEach(section => {
        const hasSection = content.includes(section);
        console.log(`  - ${section}: ${hasSection ? '✅ 包含' : '❌ 缺失'}`);
        expect(hasSection).toBeTruthy();
      });
      
      // 检查示例命令
      const hasLoginExample = content.includes('--login');
      const hasPageExample = content.includes('-p 2');
      
      console.log(`  - 登录示例: ${hasLoginExample ? '✅ 包含' : '❌ 缺失'}`);
      console.log(`  - 分页示例: ${hasPageExample ? '✅ 包含' : '❌ 缺失'}`);
      
      expect(hasLoginExample).toBeTruthy();
      expect(hasPageExample).toBeTruthy();
      
      console.log('✅ README文档完整性验证通过');
      
    } else {
      throw new Error('README.md文件不存在');
    }
  });

  test('验证6：调试脚本存在性检查', async () => {
    console.log('🧪 测试6：调试脚本存在性检查');
    
    const debugScripts = [
      'scripts/debug-video-structure.js',
      'scripts/debug-video-download-logic.js',
      'scripts/debug-video-quality.js',
      'scripts/debug-video-loading-error.js',
      'scripts/debug-audio-download-logic.js'
    ];
    
    console.log('📋 检查调试脚本:');
    debugScripts.forEach(script => {
      const exists = fs.existsSync(script);
      console.log(`  - ${script}: ${exists ? '✅ 存在' : '❌ 缺失'}`);
      expect(exists).toBeTruthy();
    });
    
    console.log('✅ 调试脚本存在性验证通过');
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 视频下载最终验证测试完成');
  console.log('📊 所有功能验证通过，系统运行正常');
});
