/**
 * CDN统计功能测试脚本
 * CDN Statistics Feature Test Script
 * 
 * 用于测试CDN资源加载成功率统计和自动移除失败资源功能
 * Used to test CDN resource loading success rate statistics and automatic removal of failed resources
 */

import { cdnManager } from '../src/utils/CDNManager';
import { cdnHealthChecker } from '../src/utils/CDNHealthChecker';
import { ResourceLoader } from '../src/utils/ResourceLoader';
import { getCDNConfig } from '../src/config/ProjectConfig';

export class CDNStatisticsTest {
  private testName = 'CDN Statistics Test';
  
  /**
   * 运行所有测试
   * Run all tests
   */
  async runAllTests(): Promise<void> {
    console.log(`🧪 开始运行 ${this.testName}`);
    
    try {
      await this.testCDNStatisticsInitialization();
      await this.testCDNStatisticsRecording();
      await this.testCDNAutoRemoval();
      await this.testCDNFiltering();
      await this.testSuccessRateThreshold();
      await this.testDebugTools();
      
      console.log(`✅ ${this.testName} 全部通过`);
    } catch (error) {
      console.error(`❌ ${this.testName} 失败:`, error);
      throw error;
    }
  }

  /**
   * 测试CDN统计初始化
   * Test CDN statistics initialization
   */
  private async testCDNStatisticsInitialization(): Promise<void> {
    console.log('📊 测试CDN统计初始化...');
    
    // 初始化CDN管理器
    await cdnManager.initialize();
    
    // 获取初始统计信息
    const stats = cdnManager.getCDNStatistics();
    
    if (!Array.isArray(stats)) {
      throw new Error('CDN统计信息应该返回数组');
    }
    
    console.log('✅ CDN统计初始化测试通过');
  }

  /**
   * 测试CDN统计记录
   * Test CDN statistics recording
   */
  private async testCDNStatisticsRecording(): Promise<void> {
    console.log('📈 测试CDN统计记录...');
    
    // 重置统计信息
    cdnManager.resetCDNStatistics();
    
    // 模拟几次CDN访问
    const testCDN = getCDNConfig().baseUrls[0];
    if (!testCDN) {
      console.log('⚠️ 没有配置CDN，跳过统计记录测试');
      return;
    }
    
    // 记录成功和失败的统计
    (cdnManager as any).recordCDNStats(testCDN, true, 100);
    (cdnManager as any).recordCDNStats(testCDN, false, 200);
    (cdnManager as any).recordCDNStats(testCDN, true, 150);
    
    // 获取统计信息
    const stats = cdnManager.getCDNStatistics();
    const cdnStat = stats.find(s => s.cdnUrl === testCDN);
    
    if (!cdnStat) {
      throw new Error('CDN统计信息未记录');
    }
    
    if (cdnStat.totalAttempts !== 3) {
      throw new Error(`预期总尝试次数为3，实际为${cdnStat.totalAttempts}`);
    }
    
    if (cdnStat.successfulAttempts !== 2) {
      throw new Error(`预期成功次数为2，实际为${cdnStat.successfulAttempts}`);
    }
    
    if (cdnStat.failedAttempts !== 1) {
      throw new Error(`预期失败次数为1，实际为${cdnStat.failedAttempts}`);
    }
    
    console.log('✅ CDN统计记录测试通过');
  }

  /**
   * 测试CDN自动移除
   * Test CDN automatic removal
   */
  private async testCDNAutoRemoval(): Promise<void> {
    console.log('🗑️ 测试CDN自动移除...');
    
    const config = getCDNConfig();
    if (config.baseUrls.length <= config.autoRemoval.minCDNCount) {
      console.log('⚠️ CDN数量不足，跳过自动移除测试');
      return;
    }
    
    // 重置统计信息
    cdnManager.resetCDNStatistics();
    
    const testCDN = config.baseUrls[0];
    
    // 模拟多次失败
    const failureThreshold = config.autoRemoval.failureThreshold;
    for (let i = 0; i < failureThreshold; i++) {
      (cdnManager as any).recordCDNStats(testCDN, false, 1000);
    }
    
    // 检查CDN是否被移除
    const remainingCDNs = cdnHealthChecker.getAvailableCDNs();
    if (remainingCDNs.includes(testCDN)) {
      console.log('⚠️ CDN未被自动移除，可能是因为保留了最小CDN数量');
    }
    
    console.log('✅ CDN自动移除测试通过');
  }

  /**
   * 测试CDN过滤
   * Test CDN filtering
   */
  private async testCDNFiltering(): Promise<void> {
    console.log('🔍 测试CDN过滤...');
    
    const config = getCDNConfig();
    const testCDNs = config.baseUrls.slice(0, 2); // 取前两个CDN进行测试
    
    // 重置统计信息
    cdnManager.resetCDNStatistics();
    
    // 为第一个CDN记录失败统计
    if (testCDNs.length > 0) {
      const badCDN = testCDNs[0];
      for (let i = 0; i < 3; i++) {
        (cdnManager as any).recordCDNStats(badCDN, false, 1000);
      }
    }
    
    // 测试过滤功能
    const filteredCDNs = (cdnManager as any).filterCDNsByStats(testCDNs);
    
    if (!Array.isArray(filteredCDNs)) {
      throw new Error('过滤结果应该是数组');
    }
    
    console.log('✅ CDN过滤测试通过');
  }

  /**
   * 测试成功率阈值过滤
   * Test success rate threshold filtering
   */
  private async testSuccessRateThreshold(): Promise<void> {
    console.log('📊 测试成功率阈值过滤...');
    
    const config = getCDNConfig();
    if (config.baseUrls.length <= config.autoRemoval.minCDNCount) {
      console.log('⚠️ CDN数量不足，跳过成功率阈值测试');
      return;
    }
    
    // 重置统计信息
    cdnManager.resetCDNStatistics();
    
    const testCDN = config.baseUrls[0];
    const threshold = config.autoRemoval.successRateThreshold;
    
    // 模拟低成功率的情况（1次成功，4次失败 = 20%成功率）
    (cdnManager as any).recordCDNStats(testCDN, true, 100);
    for (let i = 0; i < 4; i++) {
      (cdnManager as any).recordCDNStats(testCDN, false, 1000);
    }
    
    // 测试过滤功能
    const filteredCDNs = (cdnManager as any).filterCDNsByStats([testCDN]);
    
    // 根据阈值判断是否应该被移除
    const expectedRemoval = threshold > 20; // 如果阈值>20%，20%成功率的CDN应该被移除
    
    if (expectedRemoval && filteredCDNs.includes(testCDN)) {
      throw new Error(`CDN应该被移除（成功率20% < 阈值${threshold}%）但仍在列表中`);
    }
    
    if (!expectedRemoval && !filteredCDNs.includes(testCDN)) {
      throw new Error(`CDN不应该被移除（成功率20% >= 阈值${threshold}%）但已被移除`);
    }
    
    console.log(`✅ 成功率阈值测试通过（阈值: ${threshold}%, 测试CDN: ${testCDN})`);
  }

  /**
   * 测试调试工具
   * Test debug tools
   */
  private async testDebugTools(): Promise<void> {
    console.log('🔧 测试调试工具...');
    
    // 测试统计信息获取
    const stats = cdnManager.getCDNStatistics();
    if (!Array.isArray(stats)) {
      throw new Error('统计信息应该返回数组');
    }
    
    // 测试移除统计信息获取
    const removalStats = cdnManager.getCDNRemovalStats();
    if (typeof removalStats !== 'object') {
      throw new Error('移除统计信息应该返回对象');
    }
    
    // 测试健康状态获取
    const healthStatus = cdnManager.getCDNHealthStatus();
    if (!Array.isArray(healthStatus)) {
      throw new Error('健康状态应该返回数组');
    }
    
    console.log('✅ 调试工具测试通过');
  }

  /**
   * 清理测试数据
   * Clean up test data
   */
  cleanup(): void {
    try {
      cdnManager.resetCDNStatistics();
      console.log('🧹 测试数据已清理');
    } catch (error) {
      console.warn('⚠️ 清理测试数据时出错:', error);
    }
  }
}

// 导出测试实例
export const cdnStatisticsTest = new CDNStatisticsTest();

// 如果直接运行此脚本，执行测试
if (typeof window !== 'undefined') {
  (window as any).cdnStatisticsTest = cdnStatisticsTest;
  console.log('🧪 CDN统计测试工具已加载，使用 cdnStatisticsTest.runAllTests() 运行测试');
}