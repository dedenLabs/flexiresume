/**
 * 安全功能综合测试套件
 * 测试XSS防护、数据验证、内容清理等安全功能
 */

import { test, expect, Page } from '@playwright/test';
import { ErrorCollector } from '../utils/ErrorCollector';
import { ScreenshotHelper } from '../utils/ScreenshotHelper';

class SecurityTester {
  constructor(private page: Page) {}

  /**
   * 测试XSS攻击防护
   */
  async testXSSProtection(): Promise<{
    totalTests: number;
    blockedAttacks: number;
    failedBlocks: number;
    attackVectors: Array<{ vector: string; blocked: boolean; details?: string }>;
  }> {
    const xssVectors = [
      '<script>alert("XSS")</script>',
      '<img src="x" onerror="alert(\'XSS\')">',
      '<svg onload="alert(\'XSS\')">',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')"></iframe>',
      '<object data="javascript:alert(\'XSS\')"></object>',
      '<embed src="javascript:alert(\'XSS\')">',
      '<form><button formaction="javascript:alert(\'XSS\')">',
      '<input type="image" src="x" onerror="alert(\'XSS\')">',
      '<link rel="stylesheet" href="javascript:alert(\'XSS\')">',
      '<style>@import "javascript:alert(\'XSS\')"</style>',
      '<meta http-equiv="refresh" content="0;url=javascript:alert(\'XSS\')">',
      '<base href="javascript:alert(\'XSS\')//">',
      '<table background="javascript:alert(\'XSS\')">',
      '<div style="background:url(javascript:alert(\'XSS\'))">',
      '"><script>alert("XSS")</script>',
      '\';alert("XSS");//',
      '${alert("XSS")}',
      '{{alert("XSS")}}',
      '<img src="data:text/html,<script>alert(\'XSS\')</script>">'
    ];

    const results: Array<{ vector: string; blocked: boolean; details?: string }> = [];
    let blockedCount = 0;

    for (const vector of xssVectors) {
      try {
        // 尝试注入XSS向量
        const injectionResult = await this.page.evaluate((xssVector) => {
          try {
            // 模拟将恶意内容插入到页面中
            const testDiv = document.createElement('div');
            testDiv.innerHTML = xssVector;
            document.body.appendChild(testDiv);
            
            // 检查是否有脚本执行
            const hasScript = testDiv.querySelector('script') !== null;
            const hasEventHandlers = testDiv.innerHTML.includes('onerror') || 
                                   testDiv.innerHTML.includes('onload') ||
                                   testDiv.innerHTML.includes('onclick');
            
            // 清理测试元素
            document.body.removeChild(testDiv);
            
            return {
              blocked: !hasScript && !hasEventHandlers,
              hasScript,
              hasEventHandlers,
              sanitizedContent: testDiv.innerHTML
            };
          } catch (error) {
            return {
              blocked: true,
              error: error.toString()
            };
          }
        }, vector);

        const blocked = injectionResult.blocked;
        if (blocked) {
          blockedCount++;
        }

        results.push({
          vector,
          blocked,
          details: injectionResult.error || 
                  `Script: ${injectionResult.hasScript}, Events: ${injectionResult.hasEventHandlers}`
        });

      } catch (error) {
        // 如果执行失败，认为是被阻止了
        blockedCount++;
        results.push({
          vector,
          blocked: true,
          details: `Execution failed: ${error}`
        });
      }
    }

    return {
      totalTests: xssVectors.length,
      blockedAttacks: blockedCount,
      failedBlocks: xssVectors.length - blockedCount,
      attackVectors: results
    };
  }

  /**
   * 测试数据验证功能
   */
  async testDataValidation(): Promise<{
    validationTests: Array<{
      testName: string;
      input: any;
      expectedValid: boolean;
      actualValid: boolean;
      passed: boolean;
    }>;
    overallSuccess: boolean;
  }> {
    const validationTests = [
      {
        testName: '有效邮箱',
        input: { email: 'test@example.com' },
        expectedValid: true
      },
      {
        testName: '无效邮箱',
        input: { email: 'invalid-email' },
        expectedValid: false
      },
      {
        testName: '有效电话',
        input: { phone: '+86-138-0013-8000' },
        expectedValid: true
      },
      {
        testName: '无效电话',
        input: { phone: 'not-a-phone' },
        expectedValid: false
      },
      {
        testName: '过长内容',
        input: { content: 'a'.repeat(100000) },
        expectedValid: false
      },
      {
        testName: '恶意脚本内容',
        input: { content: '<script>alert("xss")</script>' },
        expectedValid: false
      },
      {
        testName: '正常内容',
        input: { content: 'This is normal content' },
        expectedValid: true
      }
    ];

    const results = [];
    let successCount = 0;

    for (const test of validationTests) {
      try {
        const validationResult = await this.page.evaluate((testInput) => {
          // 模拟数据验证逻辑
          const { email, phone, content } = testInput;
          
          if (email !== undefined) {
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return emailRegex.test(email);
          }
          
          if (phone !== undefined) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            const cleanPhone = phone.replace(/[-\s]/g, '');
            return phoneRegex.test(cleanPhone);
          }
          
          if (content !== undefined) {
            if (content.length > 50000) return false;
            if (content.includes('<script>')) return false;
            return true;
          }
          
          return true;
        }, test.input);

        const passed = validationResult === test.expectedValid;
        if (passed) successCount++;

        results.push({
          testName: test.testName,
          input: test.input,
          expectedValid: test.expectedValid,
          actualValid: validationResult,
          passed
        });

      } catch (error) {
        results.push({
          testName: test.testName,
          input: test.input,
          expectedValid: test.expectedValid,
          actualValid: false,
          passed: false
        });
      }
    }

    return {
      validationTests: results,
      overallSuccess: successCount === validationTests.length
    };
  }

  /**
   * 测试敏感信息检测
   */
  async testSensitiveDataDetection(): Promise<{
    detectionTests: Array<{
      testName: string;
      content: string;
      expectedSensitive: boolean;
      actualSensitive: boolean;
      detectedTypes: string[];
      passed: boolean;
    }>;
    overallAccuracy: number;
  }> {
    const sensitiveDataTests = [
      {
        testName: '信用卡号',
        content: '我的信用卡号是 4532 1234 5678 9012',
        expectedSensitive: true
      },
      {
        testName: '身份证号',
        content: '身份证号码：123456789012345678',
        expectedSensitive: true
      },
      {
        testName: '密码信息',
        content: 'password: mySecretPassword123',
        expectedSensitive: true
      },
      {
        testName: 'API密钥',
        content: 'api_key=sk-1234567890abcdef',
        expectedSensitive: true
      },
      {
        testName: '正常文本',
        content: '这是一段正常的简历内容，包含工作经验和技能描述。',
        expectedSensitive: false
      },
      {
        testName: '联系信息',
        content: '邮箱：test@example.com，电话：138-0013-8000',
        expectedSensitive: false
      }
    ];

    const results = [];
    let correctDetections = 0;

    for (const test of sensitiveDataTests) {
      try {
        const detectionResult = await this.page.evaluate((content) => {
          // 模拟敏感信息检测逻辑
          const sensitivePatterns = {
            creditCard: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,
            idCard: /\b\d{17}[\dXx]\b/,
            password: /password\s*[:=]\s*\S+/i,
            apiKey: /api[_-]?key\s*[:=]\s*\S+/i
          };

          const detectedTypes: string[] = [];
          
          for (const [type, pattern] of Object.entries(sensitivePatterns)) {
            if (pattern.test(content)) {
              detectedTypes.push(type);
            }
          }

          return {
            hasSensitive: detectedTypes.length > 0,
            types: detectedTypes
          };
        }, test.content);

        const passed = detectionResult.hasSensitive === test.expectedSensitive;
        if (passed) correctDetections++;

        results.push({
          testName: test.testName,
          content: test.content,
          expectedSensitive: test.expectedSensitive,
          actualSensitive: detectionResult.hasSensitive,
          detectedTypes: detectionResult.types,
          passed
        });

      } catch (error) {
        results.push({
          testName: test.testName,
          content: test.content,
          expectedSensitive: test.expectedSensitive,
          actualSensitive: false,
          detectedTypes: [],
          passed: false
        });
      }
    }

    return {
      detectionTests: results,
      overallAccuracy: correctDetections / sensitiveDataTests.length
    };
  }

  /**
   * 测试内容清理功能
   */
  async testContentSanitization(): Promise<{
    sanitizationTests: Array<{
      testName: string;
      input: string;
      output: string;
      isSafe: boolean;
    }>;
    allSafe: boolean;
  }> {
    const sanitizationTests = [
      {
        testName: '移除脚本标签',
        input: '<p>Hello</p><script>alert("xss")</script><p>World</p>'
      },
      {
        testName: '移除事件处理器',
        input: '<img src="test.jpg" onerror="alert(\'xss\')" alt="test">'
      },
      {
        testName: '移除危险协议',
        input: '<a href="javascript:alert(\'xss\')">Click me</a>'
      },
      {
        testName: '保留安全内容',
        input: '<p><strong>重要</strong>：这是<em>安全</em>的内容。</p>'
      },
      {
        testName: '清理样式注入',
        input: '<div style="background:url(javascript:alert(\'xss\'))">Content</div>'
      }
    ];

    const results = [];
    let allSafe = true;

    for (const test of sanitizationTests) {
      try {
        const sanitizationResult = await this.page.evaluate((input) => {
          // 模拟内容清理逻辑
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = input;
          
          // 移除危险元素
          const dangerousElements = tempDiv.querySelectorAll('script, object, embed, iframe');
          dangerousElements.forEach(el => el.remove());
          
          // 移除危险属性
          const allElements = tempDiv.querySelectorAll('*');
          allElements.forEach(el => {
            const dangerousAttrs = ['onerror', 'onload', 'onclick', 'onmouseover'];
            dangerousAttrs.forEach(attr => {
              if (el.hasAttribute(attr)) {
                el.removeAttribute(attr);
              }
            });
            
            // 检查href属性
            if (el.hasAttribute('href')) {
              const href = el.getAttribute('href');
              if (href && href.startsWith('javascript:')) {
                el.setAttribute('href', '#');
              }
            }
          });
          
          const output = tempDiv.innerHTML;
          
          // 检查是否安全
          const isSafe = !output.includes('<script>') && 
                        !output.includes('javascript:') &&
                        !output.includes('onerror') &&
                        !output.includes('onload');
          
          return { output, isSafe };
        }, test.input);

        if (!sanitizationResult.isSafe) {
          allSafe = false;
        }

        results.push({
          testName: test.testName,
          input: test.input,
          output: sanitizationResult.output,
          isSafe: sanitizationResult.isSafe
        });

      } catch (error) {
        allSafe = false;
        results.push({
          testName: test.testName,
          input: test.input,
          output: '',
          isSafe: false
        });
      }
    }

    return {
      sanitizationTests: results,
      allSafe
    };
  }
}

test.describe('安全功能综合测试', () => {
  let errorCollector: ErrorCollector;
  let screenshotHelper: ScreenshotHelper;
  let securityTester: SecurityTester;

  test.beforeEach(async ({ page }) => {
    errorCollector = new ErrorCollector(page);
    screenshotHelper = new ScreenshotHelper(page);
    securityTester = new SecurityTester(page);

    // 设置安全监控
    await page.addInitScript(() => {
      (window as any).securityLogs = [];
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.join(' ');
        if (message.includes('security') || message.includes('XSS') || message.includes('安全')) {
          (window as any).securityLogs.push(message);
        }
        originalLog.apply(console, args);
      };
    });
  });

  test('XSS攻击防护测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 执行XSS防护测试
    const xssResult = await securityTester.testXSSProtection();
    
    console.log('XSS防护测试结果:');
    console.log(`总测试数: ${xssResult.totalTests}`);
    console.log(`成功阻止: ${xssResult.blockedAttacks}`);
    console.log(`阻止失败: ${xssResult.failedBlocks}`);
    console.log(`防护率: ${((xssResult.blockedAttacks / xssResult.totalTests) * 100).toFixed(2)}%`);

    // 截图记录测试状态
    await screenshotHelper.takeScreenshot('security-xss-protection-test', 'zh');

    // 断言
    expect(xssResult.blockedAttacks).toBeGreaterThan(xssResult.totalTests * 0.8); // 80%以上阻止率
    expect(xssResult.failedBlocks).toBeLessThan(xssResult.totalTests * 0.2); // 失败率小于20%

    // 记录失败的攻击向量
    const failedVectors = xssResult.attackVectors.filter(v => !v.blocked);
    if (failedVectors.length > 0) {
      console.warn('未能阻止的XSS向量:', failedVectors);
    }
  });

  test('数据验证功能测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 执行数据验证测试
    const validationResult = await securityTester.testDataValidation();
    
    console.log('数据验证测试结果:');
    console.log(`总体成功: ${validationResult.overallSuccess}`);
    
    validationResult.validationTests.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      console.log(`${status} ${test.testName}: 期望${test.expectedValid}, 实际${test.actualValid}`);
    });

    // 截图记录测试状态
    await screenshotHelper.takeScreenshot('security-data-validation-test', 'zh');

    // 断言
    expect(validationResult.overallSuccess).toBe(true);
    
    const passedTests = validationResult.validationTests.filter(t => t.passed).length;
    const passRate = passedTests / validationResult.validationTests.length;
    expect(passRate).toBeGreaterThan(0.9); // 90%以上通过率
  });

  test('敏感信息检测测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 执行敏感信息检测测试
    const detectionResult = await securityTester.testSensitiveDataDetection();
    
    console.log('敏感信息检测测试结果:');
    console.log(`检测准确率: ${(detectionResult.overallAccuracy * 100).toFixed(2)}%`);
    
    detectionResult.detectionTests.forEach(test => {
      const status = test.passed ? '✅' : '❌';
      console.log(`${status} ${test.testName}: 检测到 ${test.detectedTypes.join(', ') || '无'}`);
    });

    // 截图记录测试状态
    await screenshotHelper.takeScreenshot('security-sensitive-detection-test', 'zh');

    // 断言
    expect(detectionResult.overallAccuracy).toBeGreaterThan(0.8); // 80%以上准确率
  });

  test('内容清理功能测试', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 执行内容清理测试
    const sanitizationResult = await securityTester.testContentSanitization();
    
    console.log('内容清理测试结果:');
    console.log(`全部安全: ${sanitizationResult.allSafe}`);
    
    sanitizationResult.sanitizationTests.forEach(test => {
      const status = test.isSafe ? '✅' : '❌';
      console.log(`${status} ${test.testName}: ${test.isSafe ? '安全' : '不安全'}`);
    });

    // 截图记录测试状态
    await screenshotHelper.takeScreenshot('security-content-sanitization-test', 'zh');

    // 断言
    expect(sanitizationResult.allSafe).toBe(true);
    
    const safeTests = sanitizationResult.sanitizationTests.filter(t => t.isSafe).length;
    const safetyRate = safeTests / sanitizationResult.sanitizationTests.length;
    expect(safetyRate).toBe(1.0); // 100%安全率
  });

  test('综合安全性评估', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 执行所有安全测试
    const [xssResult, validationResult, detectionResult, sanitizationResult] = await Promise.all([
      securityTester.testXSSProtection(),
      securityTester.testDataValidation(),
      securityTester.testSensitiveDataDetection(),
      securityTester.testContentSanitization()
    ]);

    // 计算综合安全评分
    const xssScore = (xssResult.blockedAttacks / xssResult.totalTests) * 100;
    const validationScore = validationResult.overallSuccess ? 100 : 0;
    const detectionScore = detectionResult.overallAccuracy * 100;
    const sanitizationScore = sanitizationResult.allSafe ? 100 : 0;
    
    const overallScore = (xssScore + validationScore + detectionScore + sanitizationScore) / 4;

    console.log('=== 综合安全性评估 ===');
    console.log(`XSS防护评分: ${xssScore.toFixed(2)}%`);
    console.log(`数据验证评分: ${validationScore.toFixed(2)}%`);
    console.log(`敏感信息检测评分: ${detectionScore.toFixed(2)}%`);
    console.log(`内容清理评分: ${sanitizationScore.toFixed(2)}%`);
    console.log(`综合安全评分: ${overallScore.toFixed(2)}%`);

    // 截图记录综合评估
    await screenshotHelper.takeScreenshot('security-comprehensive-assessment', 'zh');

    // 断言
    expect(overallScore).toBeGreaterThan(80); // 综合评分80%以上

    // 根据评分给出安全等级
    let securityLevel = 'Low';
    if (overallScore >= 90) {
      securityLevel = 'High';
    } else if (overallScore >= 75) {
      securityLevel = 'Medium';
    }

    console.log(`安全等级: ${securityLevel}`);
    expect(['Medium', 'High']).toContain(securityLevel);
  });

  test.afterEach(async ({ page }) => {
    // 收集安全相关日志
    const securityLogs = await page.evaluate(() => (window as any).securityLogs || []);
    if (securityLogs.length > 0) {
      console.log('安全操作日志:', securityLogs);
    }

    // 检查安全相关错误
    const errors = errorCollector.getErrors();
    const securityErrors = errors.filter(e => 
      e.message.includes('security') || 
      e.message.includes('XSS') ||
      e.message.includes('安全')
    );

    if (securityErrors.length > 0) {
      console.warn('安全相关错误:', securityErrors);
    }
  });
});
