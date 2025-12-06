/**
 * CSS背景图片处理器启动验证脚本
 */

console.log('🧪 开始CSS背景图片处理器启动验证...');

// 模拟浏览器环境
if (typeof window === 'undefined') {
  console.log('🌐 设置模拟浏览器环境...');
  (global as any).window = {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    Image: class {
      constructor() {
        this.onload = () => {};
        this.onerror = () => {};
        this.src = '';
      }
    },
    document: {
      documentElement: {
        getElementsByTagName: () => [],
        querySelectorAll: () => [],
        getAttribute: () => null,
        setAttribute: () => {}
      },
      getElementsByTagName: () => [],
      querySelectorAll: () => [],
      getAttribute: () => null,
      setAttribute: () => {},
      styleSheets: []
    },
    MutationObserver: class {
      constructor(callback) {
        this.callback = callback;
        console.log('👀 模拟MutationObserver已创建');
      }
      observe() {
        console.log('🔍 模拟DOM观察已启动');
      }
      disconnect() {
        console.log('🛑 模拟DOM观察已停止');
      }
    }
  };
}

try {
  console.log('📦 导入CSSBackgroundHandler...');
  
  // 动态导入CSSBackgroundHandler
  const CSSBackgroundHandlerModule = require('./CSSBackgroundHandler.ts');
  
  console.log('✅ CSSBackgroundHandler模块导入成功');
  console.log('📋 模块内容:', Object.keys(CSSBackgroundHandlerModule));
  
  // 检查是否有导出的实例
  if (CSSBackgroundHandlerModule.cssBackgroundHandler) {
    console.log('✅ cssBackgroundHandler实例已导出');
    console.log('🔧 实例类型:', typeof CSSBackgroundHandlerModule.cssBackgroundHandler);
    console.log('🛠️  实例方法:', Object.getOwnPropertyNames(Object.getPrototypeOf(CSSBackgroundHandlerModule.cssBackgroundHandler)));
  } else {
    console.log('❌ cssBackgroundHandler实例未找到');
  }
  
  // 检查是否有便捷函数
  if (CSSBackgroundHandlerModule.generateOptimizedBackgroundURL) {
    console.log('✅ generateOptimizedBackgroundURL函数已导出');
    
    // 测试便捷函数
    const testUrl = 'images/test.jpg';
    const result = CSSBackgroundHandlerModule.generateOptimizedBackgroundURL(testUrl);
    console.log('🧪 测试generateOptimizedBackgroundURL:', testUrl, '->', result);
  } else {
    console.log('❌ generateOptimizedBackgroundURL函数未找到');
  }
  
  console.log('🎉 CSS背景图片处理器验证完成！');
  
} catch (error) {
  console.error('❌ CSS背景图片处理器验证失败:', error);
  console.error('📋 错误详情:', error.stack);
}

console.log('🚀 验证脚本执行完成');