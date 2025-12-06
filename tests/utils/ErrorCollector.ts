/**
 * 错误收集器工具类
 * 用于收集和分析页面中的JavaScript错误、控制台警告等
 */

import { Page } from '@playwright/test';

export interface ErrorInfo {
  type: 'error' | 'warning' | 'log';
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: number;
  stack?: string;
}

export class ErrorCollector {
  private errors: ErrorInfo[] = [];
  private warnings: ErrorInfo[] = [];
  private logs: ErrorInfo[] = [];

  constructor(private page: Page) {
    this.setupErrorListeners();
  }

  /**
   * 设置错误监听器
   */
  private setupErrorListeners(): void {
    // 监听页面错误
    this.page.on('pageerror', (error) => {
      this.errors.push({
        type: 'error',
        message: error.message,
        stack: error.stack,
        timestamp: Date.now()
      });
    });

    // 监听控制台消息
    this.page.on('console', (msg) => {
      const type = msg.type();
      const message = msg.text();
      const timestamp = Date.now();

      if (type === 'error') {
        this.errors.push({
          type: 'error',
          message,
          timestamp
        });
      } else if (type === 'warning') {
        this.warnings.push({
          type: 'warning',
          message,
          timestamp
        });
      } else if (type === 'log' || type === 'info') {
        this.logs.push({
          type: 'log',
          message,
          timestamp
        });
      }
    });

    // 监听未处理的Promise拒绝
    this.page.on('requestfailed', (request) => {
      this.errors.push({
        type: 'error',
        message: `Request failed: ${request.url()} - ${request.failure()?.errorText}`,
        timestamp: Date.now()
      });
    });
  }

  /**
   * 获取所有错误
   */
  getErrors(): ErrorInfo[] {
    return [...this.errors];
  }

  /**
   * 获取所有警告
   */
  getWarnings(): ErrorInfo[] {
    return [...this.warnings];
  }

  /**
   * 获取所有日志
   */
  getLogs(): ErrorInfo[] {
    return [...this.logs];
  }

  /**
   * 获取所有消息
   */
  getAllMessages(): ErrorInfo[] {
    return [...this.errors, ...this.warnings, ...this.logs]
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * 清除所有收集的消息
   */
  clear(): void {
    this.errors = [];
    this.warnings = [];
    this.logs = [];
  }

  /**
   * 检查是否有错误
   */
  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  /**
   * 检查是否有警告
   */
  hasWarnings(): boolean {
    return this.warnings.length > 0;
  }

  /**
   * 获取错误统计
   */
  getStats(): {
    errorCount: number;
    warningCount: number;
    logCount: number;
    totalCount: number;
  } {
    return {
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      logCount: this.logs.length,
      totalCount: this.errors.length + this.warnings.length + this.logs.length
    };
  }

  /**
   * 过滤特定类型的消息
   */
  filterMessages(filter: {
    type?: 'error' | 'warning' | 'log';
    contains?: string;
    since?: number;
  }): ErrorInfo[] {
    let messages = this.getAllMessages();

    if (filter.type) {
      messages = messages.filter(msg => msg.type === filter.type);
    }

    if (filter.contains) {
      messages = messages.filter(msg => 
        msg.message.toLowerCase().includes(filter.contains!.toLowerCase())
      );
    }

    if (filter.since) {
      messages = messages.filter(msg => msg.timestamp >= filter.since!);
    }

    return messages;
  }

  /**
   * 生成错误报告
   */
  generateReport(): string {
    const stats = this.getStats();
    const report = [];

    report.push('=== 错误收集报告 ===');
    report.push(`错误数量: ${stats.errorCount}`);
    report.push(`警告数量: ${stats.warningCount}`);
    report.push(`日志数量: ${stats.logCount}`);
    report.push(`总计: ${stats.totalCount}`);
    report.push('');

    if (this.errors.length > 0) {
      report.push('错误详情:');
      this.errors.forEach((error, index) => {
        report.push(`${index + 1}. ${error.message}`);
        if (error.stack) {
          report.push(`   堆栈: ${error.stack.split('\n')[0]}`);
        }
        report.push(`   时间: ${new Date(error.timestamp).toLocaleString()}`);
        report.push('');
      });
    }

    if (this.warnings.length > 0) {
      report.push('警告详情:');
      this.warnings.forEach((warning, index) => {
        report.push(`${index + 1}. ${warning.message}`);
        report.push(`   时间: ${new Date(warning.timestamp).toLocaleString()}`);
        report.push('');
      });
    }

    return report.join('\n');
  }

  /**
   * 检查是否有关键错误
   */
  hasCriticalErrors(): boolean {
    const criticalKeywords = [
      'uncaught',
      'unhandled',
      'syntax error',
      'reference error',
      'type error',
      'network error',
      'failed to fetch'
    ];

    return this.errors.some(error => 
      criticalKeywords.some(keyword => 
        error.message.toLowerCase().includes(keyword)
      )
    );
  }

  /**
   * 获取性能相关的警告
   */
  getPerformanceWarnings(): ErrorInfo[] {
    const performanceKeywords = [
      'performance',
      'slow',
      'timeout',
      'memory',
      'leak',
      'blocking'
    ];

    return this.filterMessages({
      contains: performanceKeywords.join('|')
    });
  }

  /**
   * 获取网络相关的错误
   */
  getNetworkErrors(): ErrorInfo[] {
    const networkKeywords = [
      'network',
      'fetch',
      'xhr',
      'request',
      'connection',
      'timeout'
    ];

    return this.errors.filter(error =>
      networkKeywords.some(keyword =>
        error.message.toLowerCase().includes(keyword)
      )
    );
  }
}
