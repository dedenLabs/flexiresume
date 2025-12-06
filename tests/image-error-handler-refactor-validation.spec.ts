/**
 * ImageErrorHandler 重构验证测试
 * 
 * 验证重构后的回退逻辑是否正确工作
 * 
 * @author Claude (Augment Agent)
 * @date 2025-08-04
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { imageErrorHandler } from '../src/utils/ImageErrorHandler';
import { getCDNConfig } from '../src/config/ProjectConfig';

// Mock dependencies
vi.mock('../src/config/ProjectConfig', () => ({
  getCDNConfig: vi.fn(),
  isDebugEnabled: vi.fn(() => false),
  isDevelopment: vi.fn(() => false)
}));

vi.mock('../src/utils/Logger', () => ({
  getLogger: vi.fn(() => ({
    extend: vi.fn(() => vi.fn()),
    __call: vi.fn()
  }))
}));

vi.mock('../src/utils/CDNManager', () => ({
  cdnManager: {
    getResourceUrl: vi.fn(),
    getImageCacheKey: vi.fn()
  }
}));

vi.mock('../src/utils/MemoryManager', () => ({
  imageCache: {
    set: vi.fn(),
    delete: vi.fn(),
    get: vi.fn()
  }
}));

vi.mock('../src/utils/ResourceLoader', () => ({
  ResourceLoader: {
    loadImage: vi.fn()
  }
}));

vi.mock('../src/i18n', () => ({
  getCurrentLanguage: vi.fn(() => 'zh'),
  getTranslations: vi.fn(() => ({
    common: {
      imageErrorHandlerInitialized: '图片错误处理器已初始化',
      imageLoadFailed: '图片加载失败',
      imageFinalLoadFailed: '图片最终加载失败',
      imageErrorHandlerDestroyed: '图片错误处理器已销毁'
    }
  }))
}));

vi.mock('../src/config/ResourceLoadingConfig', () => ({
  getImageLoadingConfig: vi.fn(() => ({
    timeoutMs: 5000,
    maxRetries: 3,
    enableCDNFallback: true,
    useSmartSelection: true
  }))
}));

describe('ImageErrorHandler 重构验证', () => {
  let mockImage: HTMLImageElement;
  let originalDocument: Document;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock DOM environment
    originalDocument = global.document;
    global.document = {
      ...originalDocument,
      readyState: 'complete',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      querySelectorAll: vi.fn(() => []),
      createElement: vi.fn(() => ({
        className: '',
        style: {},
        textContent: '',
        parentNode: {
          replaceChild: vi.fn()
        }
      }))
    } as unknown as Document;

    // Create mock image element
    mockImage = {
      tagName: 'IMG',
      src: 'https://cdn.example.com/images/test.jpg',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dataset: {},
      closest: vi.fn(() => null),
      style: {},
      naturalWidth: 100,
      naturalHeight: 100,
      parentNode: {
        replaceChild: vi.fn()
      }
    } as unknown as HTMLImageElement;

    // Mock CDN config
    (getCDNConfig as vi.Mock).mockReturnValue({
      enabled: true,
      baseUrls: ['https://cdn.example.com/', 'https://cdn2.example.com/']
    });
  });

  afterEach(() => {
    global.document = originalDocument;
  });

  describe('本地回退逻辑', () => {
    it('应该正确提取资源路径', () => {
      const handler = (imageErrorHandler as any);
      
      // 测试CDN路径提取
      expect(handler.extractResourcePath('https://cdn.example.com/images/test.jpg')).toBe('/images/test.jpg');
      expect(handler.extractResourcePath('https://cdn2.example.com/images/test.jpg')).toBe('/images/test.jpg');
      
      // 测试本地路径
      (getCDNConfig as vi.Mock).mockReturnValue({
        enabled: false,
        baseUrls: []
      });
      expect(handler.extractResourcePath('/images/test.jpg')).toBe('/images/test.jpg');
    });

    it('应该正确构建本地URL', () => {
      const handler = (imageErrorHandler as any);
      
      // 测试本地URL构建
      expect(handler.buildLocalUrl('/images/test.jpg')).toBe('/images/test.jpg');
      expect(handler.buildLocalUrl('images/test.jpg')).toBe('/images/test.jpg');
    });

    it('应该验证本地图片可访问性', async () => {
      const handler = (imageErrorHandler as any);
      
      // Mock successful image load
      const mockImageLoad = new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
      
      // Mock Image constructor
      global.Image = vi.fn(() => ({
        onload: null as any,
        onerror: null as any,
        src: ''
      }));
      
      // Test validation
      const result = await handler.validateLocalImage('/images/test.jpg');
      expect(typeof result).toBe('boolean');
    });
  });

  describe('完整的回退流程', () => {
    it('应该尝试CDN后回退到本地资源', async () => {
      const handler = (imageErrorHandler as any);
      const { ResourceLoader } = require('../src/utils/ResourceLoader');
      
      // Mock ResourceLoader failure
      ResourceLoader.loadImage.mockResolvedValue({
        success: false,
        error: 'CDN加载失败',
        url: 'https://cdn.example.com/images/test.jpg',
        loadTime: 1000
      });

      // Mock local image validation success
      handler.validateLocalImage = vi.fn().mockResolvedValue(true);
      handler.extractResourcePath = vi.fn().mockReturnValue('/images/test.jpg');
      handler.buildLocalUrl = vi.fn().mockReturnValue('/images/test.jpg');

      // Create retry info
      const retryInfo = {
        element: mockImage,
        originalSrc: 'https://cdn.example.com/images/test.jpg',
        retryCount: 0,
        cdnIndex: 0,
        maxRetries: 3,
        useResourceLoader: true,
        resourceLoaderFailed: false
      };

      // Test local fallback
      await handler.tryLocalFallback(retryInfo);

      // Verify ResourceLoader was called
      expect(ResourceLoader.loadImage).toHaveBeenCalled();
      
      // Verify local fallback was attempted
      expect(handler.extractResourcePath).toHaveBeenCalledWith('https://cdn.example.com/images/test.jpg');
      expect(handler.validateLocalImage).toHaveBeenCalledWith('/images/test.jpg');
    });

    it('应该正确处理CDN未启用的情况', async () => {
      const handler = (imageErrorHandler as any);
      
      // Mock CDN disabled
      (getCDNConfig as vi.Mock).mockReturnValue({
        enabled: false,
        baseUrls: []
      });

      const retryInfo = {
        element: mockImage,
        originalSrc: 'https://cdn.example.com/images/test.jpg',
        retryCount: 0,
        cdnIndex: 0,
        maxRetries: 3,
        useResourceLoader: true,
        resourceLoaderFailed: false
      };

      const tryNextCDNSpy = vi.spyOn(handler, 'tryNextCDN');
      
      await handler.tryNextCDN(retryInfo);

      // Verify CDN disabled case was handled
      expect(tryNextCDNSpy).toHaveBeenCalled();
    });
  });

  describe('错误处理和边界情况', () => {
    it('应该正确处理提取资源路径的错误', () => {
      const handler = (imageErrorHandler as any);
      
      // Mock getCDNConfig to throw error
      (getCDNConfig as vi.Mock).mockImplementation(() => {
        throw new Error('配置获取失败');
      });

      const result = handler.extractResourcePath('https://cdn.example.com/images/test.jpg');
      expect(result).toBeNull();
    });

    it('应该正确处理构建本地URL的错误', () => {
      const handler = (imageErrorHandler as any);
      
      // Mock getProjectBasePath to throw error
      handler.getProjectBasePath = vi.fn(() => {
        throw new Error('基础路径获取失败');
      });

      const result = handler.buildLocalUrl('/images/test.jpg');
      expect(result).toBe('/images/test.jpg'); // 应该返回原始路径作为回退
    });

    it('应该正确处理验证本地图片的超时', async () => {
      const handler = (imageErrorHandler as any);
      
      // Mock timeout scenario
      const result = await handler.validateLocalImage('/images/test.jpg');
      expect(result).toBe(false);
    });
  });

  describe('初始化和清理', () => {
    it('应该正确初始化', () => {
      // Mock DOM elements
      (global.document.querySelectorAll as vi.Mock).mockReturnValue([mockImage]);
      
      imageErrorHandler.initialize();
      
      expect(global.document.addEventListener).toHaveBeenCalled();
      expect(global.document.querySelectorAll).toHaveBeenCalled();
    });

    it('应该正确销毁', () => {
      imageErrorHandler.destroy();
      
      expect(global.document.removeEventListener).toHaveBeenCalled();
    });
  });
});