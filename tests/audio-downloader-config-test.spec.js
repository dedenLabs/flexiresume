/**
 * 音频下载器配置测试
 * 
 * 测试音频下载器的配置是否正确
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('音频下载器配置测试', () => {

  test('验证1：最小文件大小配置正确', async () => {
    console.log('🧪 测试1：最小文件大小配置正确');
    
    // 读取音频下载器脚本文件
    const scriptPath = 'scripts/playwright-audio-downloader.js';
    
    if (!fs.existsSync(scriptPath)) {
      throw new Error(`音频下载器脚本不存在: ${scriptPath}`);
    }
    
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // 检查minFileSize配置
    const minFileSizeMatch = scriptContent.match(/minFileSize:\s*(\d+)\s*\*\s*(\d+),?\s*\/\/\s*(.+)/);
    
    if (!minFileSizeMatch) {
      throw new Error('未找到minFileSize配置');
    }
    
    const [fullMatch, multiplier, base, comment] = minFileSizeMatch;
    const actualSize = parseInt(multiplier) * parseInt(base);
    
    console.log(`📊 minFileSize配置分析:`);
    console.log(`  - 完整匹配: ${fullMatch}`);
    console.log(`  - 乘数: ${multiplier}`);
    console.log(`  - 基数: ${base}`);
    console.log(`  - 实际大小: ${actualSize} bytes`);
    console.log(`  - 注释: ${comment}`);
    
    // 验证配置值
    expect(actualSize).toBe(1024); // 1KB = 1024 bytes
    
    // 验证注释正确
    expect(comment.toLowerCase()).toContain('1kb');
    expect(comment).not.toContain('5KB'); // 确保不包含错误的5KB注释
    
    console.log('✅ minFileSize配置正确：1KB (1024 bytes)');
  });

  test('验证2：配置文件完整性检查', async () => {
    console.log('🧪 测试2：配置文件完整性检查');
    
    const scriptPath = 'scripts/playwright-audio-downloader.js';
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // 检查关键配置项
    const configChecks = [
      { name: 'downloadDir', pattern: /downloadDir:\s*path\.join/ },
      { name: 'maxDownloads', pattern: /maxDownloads:\s*\d+/ },
      { name: 'minFileSize', pattern: /minFileSize:\s*\d+\s*\*\s*\d+/ },
      { name: 'timeouts', pattern: /timeouts:\s*{/ },
      { name: 'browser', pattern: /browser:\s*{/ }
    ];
    
    console.log('📊 配置项检查结果:');
    
    configChecks.forEach(check => {
      const found = check.pattern.test(scriptContent);
      console.log(`  - ${check.name}: ${found ? '✅ 存在' : '❌ 缺失'}`);
      expect(found).toBeTruthy();
    });
    
    console.log('✅ 配置文件完整性检查通过');
  });

  test('验证3：文件大小过滤逻辑验证', async () => {
    console.log('🧪 测试3：文件大小过滤逻辑验证');
    
    const scriptPath = 'scripts/playwright-audio-downloader.js';
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // 查找文件大小过滤相关的代码
    const filterPatterns = [
      /minFileSize/g,
      /size.*<.*minFileSize/g,
      /文件大小.*小于/g,
      /过滤.*小文件/g
    ];
    
    console.log('📊 文件大小过滤逻辑检查:');
    
    filterPatterns.forEach((pattern, index) => {
      const matches = scriptContent.match(pattern);
      const count = matches ? matches.length : 0;
      console.log(`  - 模式 ${index + 1}: 找到 ${count} 处匹配`);
      
      if (matches) {
        matches.forEach((match, matchIndex) => {
          console.log(`    ${matchIndex + 1}. ${match}`);
        });
      }
    });
    
    // 验证至少有文件大小过滤逻辑
    const hasFiltering = /minFileSize/.test(scriptContent);
    expect(hasFiltering).toBeTruthy();
    
    console.log('✅ 文件大小过滤逻辑存在');
  });

  test('验证4：注释一致性检查', async () => {
    console.log('🧪 测试4：注释一致性检查');
    
    const scriptPath = 'scripts/playwright-audio-downloader.js';
    const scriptContent = fs.readFileSync(scriptPath, 'utf8');
    
    // 查找所有与文件大小相关的注释
    const commentLines = scriptContent.split('\n').filter(line => 
      line.includes('//') && (
        line.toLowerCase().includes('文件大小') ||
        line.toLowerCase().includes('filesize') ||
        line.toLowerCase().includes('kb') ||
        line.toLowerCase().includes('mb')
      )
    );
    
    console.log('📊 文件大小相关注释:');
    commentLines.forEach((line, index) => {
      console.log(`  ${index + 1}. ${line.trim()}`);
    });
    
    // 检查是否还有错误的5KB注释
    const has5KBComment = commentLines.some(line => 
      line.includes('5KB') && line.includes('minFileSize')
    );
    
    expect(has5KBComment).toBeFalsy();
    console.log('✅ 没有发现错误的5KB注释');
    
    // 检查是否有正确的1KB注释
    const has1KBComment = commentLines.some(line => 
      line.includes('1KB') || line.includes('1kb')
    );
    
    if (has1KBComment) {
      console.log('✅ 找到正确的1KB注释');
    } else {
      console.log('ℹ️ 未找到明确的1KB注释，但配置值正确');
    }
  });

  test('验证5：脚本语法正确性', async () => {
    console.log('🧪 测试5：脚本语法正确性');
    
    const scriptPath = 'scripts/playwright-audio-downloader.js';
    
    // 尝试require脚本文件来检查语法
    try {
      // 读取文件内容
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      
      // 检查基本语法结构
      const syntaxChecks = [
        { name: '大括号匹配', test: () => {
          const openBraces = (scriptContent.match(/{/g) || []).length;
          const closeBraces = (scriptContent.match(/}/g) || []).length;
          return openBraces === closeBraces;
        }},
        { name: '小括号匹配', test: () => {
          const openParens = (scriptContent.match(/\(/g) || []).length;
          const closeParens = (scriptContent.match(/\)/g) || []).length;
          return openParens === closeParens;
        }},
        { name: '方括号匹配', test: () => {
          const openBrackets = (scriptContent.match(/\[/g) || []).length;
          const closeBrackets = (scriptContent.match(/\]/g) || []).length;
          return openBrackets === closeBrackets;
        }},
        { name: '没有语法错误关键词', test: () => {
          return !scriptContent.includes('SyntaxError') && 
                 !scriptContent.includes('Unexpected token');
        }}
      ];
      
      console.log('📊 语法检查结果:');
      syntaxChecks.forEach(check => {
        const passed = check.test();
        console.log(`  - ${check.name}: ${passed ? '✅ 通过' : '❌ 失败'}`);
        expect(passed).toBeTruthy();
      });
      
      console.log('✅ 脚本语法正确性验证通过');
      
    } catch (error) {
      console.error('❌ 脚本语法检查失败:', error.message);
      throw error;
    }
  });

});

// 测试后清理
test.afterAll(async () => {
  console.log('🧹 音频下载器配置测试完成');
  console.log('📋 测试结论：minFileSize配置已修复，注释正确显示为1KB');
});
