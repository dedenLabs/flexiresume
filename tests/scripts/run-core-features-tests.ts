#!/usr/bin/env ts-node

/**
 * 核心功能测试运行脚本
 * 执行Mermaid、CDN、主题切换等核心功能的完整测试套件
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TestResult {
  testFile: string;
  testName: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number;
  error?: string;
}

interface TestSummary {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  totalDuration: number;
  successRate: number;
  results: TestResult[];
}

class CoreFeaturesTestRunner {
  private testFiles = [
    'tests/core-features/mermaid-comprehensive.spec.ts',
    'tests/core-features/cdn-switching.spec.ts',
    'tests/core-features/theme-switching.spec.ts',
    'tests/core-features/integration-comprehensive.spec.ts'
  ];

  private outputDir = 'tests/reports/core-features';

  constructor() {
    this.ensureOutputDirectory();
  }

  /**
   * 确保输出目录存在
   */
  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * 运行单个测试文件
   */
  private async runTestFile(testFile: string): Promise<TestResult[]> {
    console.log(`\n🧪 运行测试文件: ${testFile}`);
    
    const startTime = Date.now();
    const results: TestResult[] = [];

    try {
      // 运行Playwright测试
      const command = `npx playwright test ${testFile} --reporter=json`;
      const output = execSync(command, { 
        encoding: 'utf8',
        timeout: 300000 // 5分钟超时
      });

      // 解析JSON输出
      const jsonOutput = JSON.parse(output);
      
      if (jsonOutput.suites) {
        jsonOutput.suites.forEach((suite: any) => {
          suite.specs.forEach((spec: any) => {
            spec.tests.forEach((test: any) => {
              const result: TestResult = {
                testFile,
                testName: test.title,
                status: test.outcome === 'expected' ? 'passed' : 'failed',
                duration: test.results[0]?.duration || 0,
                error: test.results[0]?.error?.message
              };
              results.push(result);
            });
          });
        });
      }

    } catch (error) {
      console.error(`❌ 测试文件 ${testFile} 执行失败:`, error);
      
      results.push({
        testFile,
        testName: 'Test Execution',
        status: 'failed',
        duration: Date.now() - startTime,
        error: error.toString()
      });
    }

    return results;
  }

  /**
   * 运行所有核心功能测试
   */
  async runAllTests(): Promise<TestSummary> {
    console.log('🚀 开始运行核心功能测试套件');
    console.log('=' .repeat(60));

    const startTime = Date.now();
    const allResults: TestResult[] = [];

    // 依次运行每个测试文件
    for (const testFile of this.testFiles) {
      const results = await this.runTestFile(testFile);
      allResults.push(...results);
    }

    const totalDuration = Date.now() - startTime;

    // 统计结果
    const summary: TestSummary = {
      totalTests: allResults.length,
      passedTests: allResults.filter(r => r.status === 'passed').length,
      failedTests: allResults.filter(r => r.status === 'failed').length,
      skippedTests: allResults.filter(r => r.status === 'skipped').length,
      totalDuration,
      successRate: 0,
      results: allResults
    };

    summary.successRate = summary.totalTests > 0 
      ? (summary.passedTests / summary.totalTests) * 100 
      : 0;

    return summary;
  }

  /**
   * 生成测试报告
   */
  generateReport(summary: TestSummary): void {
    console.log('\n📊 生成测试报告...');

    // 生成HTML报告
    const htmlReport = this.generateHTMLReport(summary);
    const htmlPath = path.join(this.outputDir, 'core-features-report.html');
    fs.writeFileSync(htmlPath, htmlReport);

    // 生成JSON报告
    const jsonPath = path.join(this.outputDir, 'core-features-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2));

    // 生成Markdown报告
    const markdownReport = this.generateMarkdownReport(summary);
    const markdownPath = path.join(this.outputDir, 'core-features-report.md');
    fs.writeFileSync(markdownPath, markdownReport);

    console.log(`📄 报告已生成:`);
    console.log(`   HTML: ${htmlPath}`);
    console.log(`   JSON: ${jsonPath}`);
    console.log(`   Markdown: ${markdownPath}`);
  }

  /**
   * 生成HTML报告
   */
  private generateHTMLReport(summary: TestSummary): string {
    const statusColor = (status: string) => {
      switch (status) {
        case 'passed': return '#4caf50';
        case 'failed': return '#f44336';
        case 'skipped': return '#ff9800';
        default: return '#9e9e9e';
      }
    };

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>核心功能测试报告</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px; }
        .metric { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
        .metric-value { font-size: 2em; font-weight: bold; margin-bottom: 5px; }
        .metric-label { color: #666; font-size: 0.9em; }
        .test-results { background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .test-item { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
        .test-item:last-child { border-bottom: none; }
        .test-name { font-weight: 500; }
        .test-file { color: #666; font-size: 0.9em; margin-top: 5px; }
        .test-status { padding: 4px 8px; border-radius: 4px; color: white; font-size: 0.8em; font-weight: bold; }
        .test-duration { color: #666; font-size: 0.9em; }
        .error-message { color: #f44336; font-size: 0.8em; margin-top: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 核心功能测试报告</h1>
        <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
        <p>总耗时: ${(summary.totalDuration / 1000).toFixed(2)} 秒</p>
    </div>

    <div class="summary">
        <div class="metric">
            <div class="metric-value">${summary.totalTests}</div>
            <div class="metric-label">总测试数</div>
        </div>
        <div class="metric">
            <div class="metric-value" style="color: #4caf50">${summary.passedTests}</div>
            <div class="metric-label">通过</div>
        </div>
        <div class="metric">
            <div class="metric-value" style="color: #f44336">${summary.failedTests}</div>
            <div class="metric-label">失败</div>
        </div>
        <div class="metric">
            <div class="metric-value" style="color: #ff9800">${summary.skippedTests}</div>
            <div class="metric-label">跳过</div>
        </div>
        <div class="metric">
            <div class="metric-value" style="color: ${summary.successRate >= 80 ? '#4caf50' : '#f44336'}">${summary.successRate.toFixed(1)}%</div>
            <div class="metric-label">成功率</div>
        </div>
    </div>

    <div class="test-results">
        <h2 style="margin: 0; padding: 20px; background: #f5f5f5; border-bottom: 1px solid #eee;">测试详情</h2>
        ${summary.results.map(result => `
            <div class="test-item">
                <div>
                    <div class="test-name">${result.testName}</div>
                    <div class="test-file">${result.testFile}</div>
                    ${result.error ? `<div class="error-message">${result.error}</div>` : ''}
                </div>
                <div style="text-align: right;">
                    <div class="test-status" style="background-color: ${statusColor(result.status)}">${result.status.toUpperCase()}</div>
                    <div class="test-duration">${result.duration}ms</div>
                </div>
            </div>
        `).join('')}
    </div>
</body>
</html>`;
  }

  /**
   * 生成Markdown报告
   */
  private generateMarkdownReport(summary: TestSummary): string {
    return `# 核心功能测试报告

## 📊 测试概览

- **生成时间**: ${new Date().toLocaleString('zh-CN')}
- **总耗时**: ${(summary.totalDuration / 1000).toFixed(2)} 秒
- **总测试数**: ${summary.totalTests}
- **通过**: ${summary.passedTests} ✅
- **失败**: ${summary.failedTests} ❌
- **跳过**: ${summary.skippedTests} ⏭️
- **成功率**: ${summary.successRate.toFixed(1)}%

## 📋 测试详情

| 测试名称 | 文件 | 状态 | 耗时 |
|---------|------|------|------|
${summary.results.map(result => 
  `| ${result.testName} | ${result.testFile} | ${result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️'} | ${result.duration}ms |`
).join('\n')}

## 🔍 失败测试详情

${summary.results.filter(r => r.status === 'failed').map(result => `
### ${result.testName}

- **文件**: ${result.testFile}
- **错误**: ${result.error || '未知错误'}
`).join('\n')}

## 📈 测试建议

${summary.successRate >= 90 ? '🎉 测试通过率优秀！所有核心功能运行正常。' : 
  summary.successRate >= 80 ? '⚠️ 测试通过率良好，但仍有改进空间。' : 
  '🚨 测试通过率较低，需要重点关注失败的测试用例。'}

---
*报告由核心功能测试运行器自动生成*`;
  }

  /**
   * 打印控制台摘要
   */
  printSummary(summary: TestSummary): void {
    console.log('\n' + '='.repeat(60));
    console.log('📊 核心功能测试摘要');
    console.log('='.repeat(60));
    console.log(`总测试数: ${summary.totalTests}`);
    console.log(`通过: ${summary.passedTests} ✅`);
    console.log(`失败: ${summary.failedTests} ❌`);
    console.log(`跳过: ${summary.skippedTests} ⏭️`);
    console.log(`成功率: ${summary.successRate.toFixed(1)}%`);
    console.log(`总耗时: ${(summary.totalDuration / 1000).toFixed(2)} 秒`);

    if (summary.failedTests > 0) {
      console.log('\n❌ 失败的测试:');
      summary.results
        .filter(r => r.status === 'failed')
        .forEach(result => {
          console.log(`   - ${result.testName} (${result.testFile})`);
          if (result.error) {
            console.log(`     错误: ${result.error}`);
          }
        });
    }

    console.log('\n' + '='.repeat(60));
    
    if (summary.successRate >= 90) {
      console.log('🎉 测试结果优秀！所有核心功能运行正常。');
    } else if (summary.successRate >= 80) {
      console.log('⚠️ 测试结果良好，但仍有改进空间。');
    } else {
      console.log('🚨 测试结果需要关注，请检查失败的测试用例。');
    }
  }
}

/**
 * 主函数
 */
async function main() {
  const runner = new CoreFeaturesTestRunner();
  
  try {
    // 运行所有测试
    const summary = await runner.runAllTests();
    
    // 生成报告
    runner.generateReport(summary);
    
    // 打印摘要
    runner.printSummary(summary);
    
    // 根据测试结果设置退出码
    process.exit(summary.failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ 测试运行器执行失败:', error);
    process.exit(1);
  }
}

// 运行主函数
if (require.main === module) {
  main().catch(console.error);
}

export { CoreFeaturesTestRunner };
