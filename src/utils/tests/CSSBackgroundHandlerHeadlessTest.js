/**
 * CSSBackgroundHandler 无头浏览器测试脚本
 * 测试CSS背景图片CDN处理器的功能
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class CSSBackgroundHandlerTest {
  constructor() {
    this.browser = null;
    this.page = null;
    this.testResults = [];
    this.testUrl = 'http://localhost:5179/';
    this.targetImage = 'images/flexi-resume1.jpg';
  }

  async init() {
    console.log('🚀 启动无头浏览器...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // 监听网络请求
    await this.setupNetworkMonitoring();
    
    console.log('✅ 无头浏览器启动完成');
  }

  async setupNetworkMonitoring() {
    // 监听所有网络请求
    await this.page.setRequestInterception(true);
    
    this.page.on('request', (request) => {
      const url = request.url();
      
      // 记录图片请求
      if (url.includes(this.targetImage) || url.includes('flexi-resume1.jpg')) {
        console.log(`🖼️ 检测到图片请求: ${url}`);
        this.testResults.push({
          type: 'image_request',
          url: url,
          timestamp: new Date().toISOString(),
          method: request.method(),
          headers: request.headers()
        });
      }
      
      request.continue();
    });

    // 监听响应
    this.page.on('response', (response) => {
      const url = response.url();
      
      if (url.includes(this.targetImage) || url.includes('flexi-resume1.jpg')) {
        response.text().then(text => {
          console.log(`📄 图片响应: ${url} - 状态: ${response.status()}`);
          this.testResults.push({
            type: 'image_response',
            url: url,
            status: response.status(),
            headers: response.headers(),
            timestamp: new Date().toISOString()
          });
        }).catch(err => {
          console.log(`📄 图片响应: ${url} - 状态: ${response.status()} - 无法读取响应内容`);
          this.testResults.push({
            type: 'image_response',
            url: url,
            status: response.status(),
            headers: response.headers(),
            timestamp: new Date().toISOString(),
            error: err.message
          });
        });
      }
    });

    // 监听控制台消息
    this.page.on('console', (msg) => {
      const text = msg.text();
      
      // 监听CSSBackgroundHandler相关的日志
      if (text.includes('CSSBackgroundHandler') || 
          text.includes('cdnManager') || 
          text.includes('flexi-resume1.jpg')) {
        console.log(`🔧 浏览器日志: ${text}`);
        this.testResults.push({
          type: 'console_log',
          message: text,
          timestamp: new Date().toISOString()
        });
      }
    });
  }

  async testCSSBackgroundHandler() {
    console.log('🧪 开始测试CSSBackgroundHandler功能...');
    
    try {
      // 访问测试页面
      console.log(`🌐 访问测试页面: ${this.testUrl}`);
      await this.page.goto(this.testUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      });
      
      // 等待页面完全加载
      await this.page.waitForTimeout(3000);
      
      // 测试1: 检查CSSBackgroundHandler是否已初始化
      console.log('📋 测试1: 检查CSSBackgroundHandler初始化状态');
      const isInitialized = await this.page.evaluate(() => {
        return typeof window.cssBackgroundHandler !== 'undefined';
      });
      
      this.testResults.push({
        type: 'initialization_test',
        passed: isInitialized,
        message: isInitialized ? 'CSSBackgroundHandler已正确初始化' : 'CSSBackgroundHandler未初始化'
      });
      
      if (!isInitialized) {
        console.log('❌ CSSBackgroundHandler未初始化，测试无法继续');
        return;
      }
      
      console.log('✅ CSSBackgroundHandler已正确初始化');
      
      // 测试2: 检查generateOptimizedBackgroundURL方法
      console.log('📋 测试2: 测试generateOptimizedBackgroundURL方法');
      const urlGenerationResult = await this.page.evaluate((targetImage) => {
        try {
          const result = window.cssBackgroundHandler.generateOptimizedBackgroundURL(targetImage);
          return {
            success: true,
            originalUrl: targetImage,
            generatedUrl: result,
            isCDNUrl: result.includes('http') && !result.includes('localhost')
          };
        } catch (error) {
          return {
            success: false,
            error: error.message
          };
        }
      }, this.targetImage);
      
      this.testResults.push({
        type: 'url_generation_test',
        ...urlGenerationResult
      });
      
      console.log(`🔗 URL生成测试: ${urlGenerationResult.success ? '成功' : '失败'}`);
      if (urlGenerationResult.success) {
        console.log(`   原始URL: ${urlGenerationResult.originalUrl}`);
        console.log(`   生成URL: ${urlGenerationResult.generatedUrl}`);
        console.log(`   是否CDN: ${urlGenerationResult.isCDNUrl ? '是' : '否'}`);
      }
      
      // 测试3: 检查页面中的背景图片样式
      console.log('📋 测试3: 检查页面背景图片样式');
      const backgroundStyles = await this.page.evaluate(() => {
        const styles = [];
        
        // 检查body元素的背景图片
        const bodyStyle = window.getComputedStyle(document.body);
        if (bodyStyle.backgroundImage && bodyStyle.backgroundImage !== 'none') {
          styles.push({
            element: 'body',
            backgroundImage: bodyStyle.backgroundImage
          });
        }
        
        // 检查所有元素的背景图片
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
          const style = window.getComputedStyle(element);
          if (style.backgroundImage && style.backgroundImage !== 'none') {
            styles.push({
              element: element.tagName + (element.className ? '.' + element.className : ''),
              backgroundImage: style.backgroundImage
            });
          }
        });
        
        return styles;
      });
      
      this.testResults.push({
        type: 'background_style_test',
        styles: backgroundStyles
      });
      
      console.log(`🎨 发现 ${backgroundStyles.length} 个背景图片样式`);
      backgroundStyles.forEach(style => {
        console.log(`   ${style.element}: ${style.backgroundImage}`);
      });
      
      // 测试4: 直接访问不存在的图片文件，观察重定向行为
      console.log('📋 测试4: 测试不存在的图片文件重定向行为');
      const nonExistentUrl = `${this.testUrl}${this.targetImage}`;
      
      try {
        const response = await this.page.goto(nonExistentUrl, {
          waitUntil: 'networkidle2',
          timeout: 10000
        });
        
        this.testResults.push({
          type: 'nonexistent_image_test',
          url: nonExistentUrl,
          finalUrl: this.page.url(),
          status: response ? response.status() : 'No response'
        });
        
        console.log(`📸 不存在图片测试: ${nonExistentUrl}`);
        console.log(`   最终URL: ${this.page.url()}`);
        console.log(`   状态码: ${response ? response.status() : 'No response'}`);
        
      } catch (error) {
        this.testResults.push({
          type: 'nonexistent_image_test',
          url: nonExistentUrl,
          error: error.message
        });
        console.log(`📸 不存在图片测试失败: ${error.message}`);
      }
      
      // 测试5: 等待并观察网络请求模式
      console.log('📋 测试5: 观察网络请求模式');
      await this.page.waitForTimeout(5000);
      
      // 分析网络请求模式
      const imageRequests = this.testResults.filter(r => r.type === 'image_request');
      const imageResponses = this.testResults.filter(r => r.type === 'image_response');
      
      this.testResults.push({
        type: 'network_pattern_analysis',
        requestCount: imageRequests.length,
        responseCount: imageResponses.length,
        requests: imageRequests,
        responses: imageResponses
      });
      
      console.log(`🌐 网络请求分析:`);
      console.log(`   请求数量: ${imageRequests.length}`);
      console.log(`   响应数量: ${imageResponses.length}`);
      
      imageRequests.forEach((request, index) => {
        console.log(`   请求${index + 1}: ${request.url}`);
      });
      
      // 测试6: 验证CDN切换逻辑
      console.log('📋 测试6: 验证CDN切换逻辑');
      const cdnUrls = imageRequests.map(r => r.url).filter(url => 
        url.includes('cdn') || 
        url.includes('githubusercontent.com') || 
        url.includes('jsdelivr.net') ||
        url.includes('unpkg.com')
      );
      
      const localUrls = imageRequests.map(r => r.url).filter(url => 
        url.includes('localhost') || url.startsWith('/')
      );
      
      this.testResults.push({
        type: 'cdn_switch_test',
        cdnUrls: cdnUrls,
        localUrls: localUrls,
        hasCDNRequests: cdnUrls.length > 0,
        hasLocalRequests: localUrls.length > 0
      });
      
      console.log(`🔄 CDN切换测试:`);
      console.log(`   CDN请求: ${cdnUrls.length} 个`);
      console.log(`   本地请求: ${localUrls.length} 个`);
      console.log(`   是否使用CDN: ${cdnUrls.length > 0 ? '是' : '否'}`);
      
      console.log('✅ CSSBackgroundHandler功能测试完成');
      
    } catch (error) {
      console.error('❌ 测试过程中发生错误:', error);
      this.testResults.push({
        type: 'test_error',
        error: error.message,
        stack: error.stack
      });
    }
  }

  async generateTestReport() {
    console.log('📊 生成测试报告...');
    
    const report = {
      testInfo: {
        testName: 'CSSBackgroundHandler无头浏览器测试',
        testTime: new Date().toISOString(),
        testUrl: this.testUrl,
        targetImage: this.targetImage
      },
      summary: {
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter(r => 
          r.type === 'initialization_test' && r.passed ||
          r.type === 'url_generation_test' && r.success ||
          r.type === 'background_style_test' ||
          r.type === 'network_pattern_analysis' ||
          r.type === 'cdn_switch_test'
        ).length,
        failedTests: this.testResults.filter(r => 
          (r.type === 'initialization_test' && !r.passed) ||
          (r.type === 'url_generation_test' && !r.success) ||
          r.type === 'test_error'
        ).length
      },
      detailedResults: this.testResults,
      conclusions: this.generateConclusions()
    };
    
    // 保存测试报告
    const reportPath = path.join(__dirname, 'css-background-handler-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`📄 测试报告已保存到: ${reportPath}`);
    return report;
  }

  generateConclusions() {
    const conclusions = [];
    
    // 检查初始化
    const initTest = this.testResults.find(r => r.type === 'initialization_test');
    if (initTest) {
      if (initTest.passed) {
        conclusions.push('✅ CSSBackgroundHandler已正确初始化');
      } else {
        conclusions.push('❌ CSSBackgroundHandler未正确初始化');
      }
    }
    
    // 检查URL生成
    const urlTest = this.testResults.find(r => r.type === 'url_generation_test');
    if (urlTest && urlTest.success) {
      if (urlTest.isCDNUrl) {
        conclusions.push('✅ URL生成功能正常，能够生成CDN地址');
      } else {
        conclusions.push('⚠️ URL生成功能正常，但未生成CDN地址');
      }
    } else if (urlTest) {
      conclusions.push('❌ URL生成功能异常');
    }
    
    // 检查CDN切换
    const cdnTest = this.testResults.find(r => r.type === 'cdn_switch_test');
    if (cdnTest) {
      if (cdnTest.hasCDNRequests) {
        conclusions.push('✅ CDN切换功能正常，检测到CDN请求');
      } else {
        conclusions.push('❌ CDN切换功能异常，未检测到CDN请求');
      }
    }
    
    // 检查背景图片样式
    const bgTest = this.testResults.find(r => r.type === 'background_style_test');
    if (bgTest && bgTest.styles.length > 0) {
      conclusions.push(`✅ 检测到${bgTest.styles.length}个背景图片样式`);
    } else {
      conclusions.push('⚠️ 未检测到背景图片样式');
    }
    
    // 检查网络请求模式
    const networkTest = this.testResults.find(r => r.type === 'network_pattern_analysis');
    if (networkTest) {
      if (networkTest.requestCount > 0) {
        conclusions.push(`✅ 检测到${networkTest.requestCount}个网络请求`);
      } else {
        conclusions.push('⚠️ 未检测到网络请求');
      }
    }
    
    return conclusions;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      console.log('🧹 无头浏览器已关闭');
    }
  }

  async runFullTest() {
    try {
      await this.init();
      await this.testCSSBackgroundHandler();
      const report = await this.generateTestReport();
      
      // 显示测试结论
      console.log('\n🎯 测试结论:');
      report.conclusions.forEach(conclusion => {
        console.log(`   ${conclusion}`);
      });
      
      return report;
    } catch (error) {
      console.error('❌ 测试执行失败:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// 运行测试
if (require.main === module) {
  const test = new CSSBackgroundHandlerTest();
  test.runFullTest()
    .then(() => {
      console.log('🎉 测试完成');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 测试失败:', error);
      process.exit(1);
    });
}

module.exports = CSSBackgroundHandlerTest;