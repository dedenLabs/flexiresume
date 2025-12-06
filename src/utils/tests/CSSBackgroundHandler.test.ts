/**
 * CSS背景图片处理器测试
 */
import { cssBackgroundHandler } from '../CSSBackgroundHandler';

describe('CSSBackgroundHandler', () => {
  beforeEach(() => {
    // 重置处理器状态
    (cssBackgroundHandler as any).processedStyles.clear();
  });

  afterEach(() => {
    // 清理资源
    cssBackgroundHandler.destroy();
  });

  describe('generateOptimizedBackgroundURL', () => {
    test('应该返回原始URL如果无法获取CDN', () => {
      const originalUrl = 'images/test.jpg';
      const result = cssBackgroundHandler.generateOptimizedBackgroundURL(originalUrl);
      expect(result).toBe(originalUrl);
    });

    test('应该处理相对路径', () => {
      const relativeUrl = './images/test.jpg';
      const result = cssBackgroundHandler.generateOptimizedBackgroundURL(relativeUrl);
      expect(result).toBe(relativeUrl);
    });

    test('应该处理数据URL', () => {
      const dataUrl = 'data:image/png;base64,test';
      const result = cssBackgroundHandler.generateOptimizedBackgroundURL(dataUrl);
      expect(result).toBe(dataUrl);
    });
  });

  describe('processBackgroundImageURLs', () => {
    test('应该处理包含background-image的样式', () => {
      const handler = (cssBackgroundHandler as any);
      const styleText = 'background-image: url("images/test.jpg"); color: red;';
      const result = handler.processBackgroundImageURLs(styleText);
      
      expect(result).toContain('background-image: url(');
      expect(result).toContain('color: red;');
    });

    test('应该处理多个背景图片', () => {
      const handler = (cssBackgroundHandler as any);
      const styleText = `
        background-image: url("images/test1.jpg");
        background-image: url("images/test2.jpg");
      `;
      const result = handler.processBackgroundImageURLs(styleText);
      
      const matches = result.match(/background-image: url\(/g);
      expect(matches).toHaveLength(2);
    });
  });

  describe('processSingleURL', () => {
    test('应该缓存已处理的URL', () => {
      const handler = (cssBackgroundHandler as any);
      const originalUrl = 'images/test.jpg';
      
      // 第一次处理
      const result1 = handler.processSingleURL(originalUrl);
      
      // 第二次处理（应该从缓存返回）
      const result2 = handler.processSingleURL(originalUrl);
      
      expect(result1).toBe(result2);
      expect(handler.processedStyles.has(originalUrl)).toBe(true);
    });
  });

  describe('样式处理集成测试', () => {
    test('应该正确处理完整的CSS样式', () => {
      const handler = (cssBackgroundHandler as any);
      const complexStyle = `
        background-image: url("images/bg.jpg");
        background-size: cover;
        background-position: center;
        color: var(--color-primary);
        padding: 20px;
        background-image: url("images/overlay.png");
      `;
      
      const result = handler.processBackgroundImageURLs(complexStyle);
      
      // 验证结构完整性
      expect(result).toContain('background-size: cover');
      expect(result).toContain('background-position: center');
      expect(result).toContain('color: var(--color-primary)');
      expect(result).toContain('padding: 20px');
      
      // 验证URL处理
      const urlMatches = result.match(/background-image: url\([^)]+\)/g);
      expect(urlMatches).toHaveLength(2);
    });
  });
});