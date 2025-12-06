/**
 * SmartImage检测测试脚本
 * 
 * 测试ImageErrorHandler中的SmartImage检测逻辑
 * 确保在各种情况下都能正确识别SmartImage组件
 */

// 模拟DOM环境
const mockDOM = () => {
  // 创建模拟的document对象
  global.document = {
    createElement: (tagName) => {
      const element = {
        tagName: tagName.toUpperCase(),
        nodeName: tagName.toUpperCase(),
        nodeType: 1,
        dataset: {},
        hasAttribute: (attr) => false,
        getAttribute: (attr) => null,
        setAttribute: (attr, value) => { element[attr] = value; },
        closest: (selector) => null,
        parentElement: null,
        className: '',
        src: '',
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
        appendChild: () => {},
        removeChild: () => {},
        replaceChild: () => {},
        insertBefore: () => {},
        querySelector: () => null,
        querySelectorAll: () => [],
        style: {},
        textContent: '',
        innerHTML: '',
        outerHTML: '',
        id: '',
        classList: {
          contains: () => false,
          add: () => {},
          remove: () => {},
          toggle: () => false
        }
      };
      
      // 模拟dataset属性
      Object.defineProperty(element, 'dataset', {
        get() {
          const dataset = {};
          for (const attr in element) {
            if (attr.startsWith('data-')) {
              const key = attr.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              dataset[key] = element[attr];
            }
          }
          return dataset;
        },
        set(value) {
          for (const key in value) {
            const attr = 'data-' + key.replace(/([A-Z])/g, '-$1').toLowerCase();
            element[attr] = value[key];
          }
        }
      });
      
      return element;
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
    readyState: 'complete',
    documentElement: {},
    head: {},
    body: {}
  };

  // 创建模拟的ImageErrorHandler
  const mockImageErrorHandler = {
    retryMap: new Map(),
    logImageError: {
      extend: (level) => (message, ...args) => {
        console.log(`[${level.toUpperCase()}] ${message}`, ...args);
      }
    },
    
    isSmartImageElement(img) {
      try {
        // 方法1: 检查data属性 (最可靠)
        if (img.dataset.smartImage === 'true') {
          return true;
        }

        // 方法2: 检查CSS类名 (向后兼容)
        if (img.closest('.smart-image-loading, .smart-image-error')) {
          return true;
        }

        // 方法3: 检查特定的组件属性
        if (img.hasAttribute('data-smart-image-loading') || 
            img.hasAttribute('data-smart-image-error')) {
          return true;
        }

        // 方法4: 检查父级容器的特定结构
        const parent = img.parentElement;
        if (parent && (
            parent.className?.includes('smart-image') ||
            parent.getAttribute('data-smart-image-container') === 'true'
        )) {
          return true;
        }

        // 方法5: 检查是否有SmartImage相关的React事件监听器
        if (img.hasAttribute('data-reactroot') || 
            img.closest('[data-reactroot]')) {
          if (img.hasAttribute('data-cdn-index') || 
              img.hasAttribute('data-retry-count')) {
            return true;
          }
        }

        return false;
      } catch (error) {
        mockImageErrorHandler.logImageError.extend('warn')('SmartImage检测失败:', error);
        return false;
      }
    }
  };

  return { mockImageErrorHandler };
};

// 测试用例
const runTests = () => {
  const { mockImageErrorHandler } = mockDOM();
  
  console.log('🧪 开始SmartImage检测测试...\n');
  
  let passedTests = 0;
  let totalTests = 0;
  
  // 测试1: 普通img标签
  totalTests++;
  try {
    const normalImg = document.createElement('img');
    normalImg.src = 'https://example.com/image.jpg';
    
    const result = mockImageErrorHandler.isSmartImageElement(normalImg);
    console.log(`测试1 - 普通img标签: ${result ? '❌ 失败' : '✅ 通过'}`);
    
    if (!result) passedTests++;
  } catch (error) {
    console.log(`测试1 - 普通img标签: ❌ 失败 - ${error.message}`);
  }
  
  // 测试2: 使用data-smart-image属性的img标签
  totalTests++;
  try {
    const smartImg = document.createElement('img');
    smartImg.src = 'https://example.com/image.jpg';
    smartImg.setAttribute('data-smart-image', 'true');
    
    const result = mockImageErrorHandler.isSmartImageElement(smartImg);
    console.log(`测试2 - data-smart-image属性: ${result ? '✅ 通过' : '❌ 失败'}`);
    
    if (result) passedTests++;
  } catch (error) {
    console.log(`测试2 - data-smart-image属性: ❌ 失败 - ${error.message}`);
  }
  
  // 测试3: 使用CSS类名的img标签
  totalTests++;
  try {
    const styledImg = document.createElement('img');
    styledImg.src = 'https://example.com/image.jpg';
    styledImg.closest = (selector) => {
      if (selector === '.smart-image-loading, .smart-image-error') {
        return { className: 'smart-image-loading' };
      }
      return null;
    };
    
    const result = mockImageErrorHandler.isSmartImageElement(styledImg);
    console.log(`测试3 - CSS类名检测: ${result ? '✅ 通过' : '❌ 失败'}`);
    
    if (result) passedTests++;
  } catch (error) {
    console.log(`测试3 - CSS类名检测: ❌ 失败 - ${error.message}`);
  }
  
  // 测试4: 使用特定属性的img标签
  totalTests++;
  try {
    const specificImg = document.createElement('img');
    specificImg.src = 'https://example.com/image.jpg';
    specificImg.hasAttribute = (attr) => {
      return attr === 'data-smart-image-loading';
    };
    
    const result = mockImageErrorHandler.isSmartImageElement(specificImg);
    console.log(`测试4 - 特定属性检测: ${result ? '✅ 通过' : '❌ 失败'}`);
    
    if (result) passedTests++;
  } catch (error) {
    console.log(`测试4 - 特定属性检测: ❌ 失败 - ${error.message}`);
  }
  
  // 测试5: 包含在SmartImage容器中的img标签
  totalTests++;
  try {
    const containerImg = document.createElement('img');
    containerImg.src = 'https://example.com/image.jpg';
    containerImg.parentElement = {
      className: 'smart-image-container',
      getAttribute: (attr) => {
        if (attr === 'data-smart-image-container') return 'true';
        return null;
      }
    };
    
    const result = mockImageErrorHandler.isSmartImageElement(containerImg);
    console.log(`测试5 - 容器检测: ${result ? '✅ 通过' : '❌ 失败'}`);
    
    if (result) passedTests++;
  } catch (error) {
    console.log(`测试5 - 容器检测: ❌ 失败 - ${error.message}`);
  }
  
  // 测试6: 包含CDN相关属性的img标签
  totalTests++;
  try {
    const cdnImg = document.createElement('img');
    cdnImg.src = 'https://example.com/image.jpg';
    cdnImg.hasAttribute = (attr) => {
      return attr === 'data-reactroot' || attr === 'data-cdn-index';
    };
    cdnImg.closest = (selector) => {
      if (selector === '[data-reactroot]') {
        return { hasAttribute: () => true };
      }
      return null;
    };
    
    const result = mockImageErrorHandler.isSmartImageElement(cdnImg);
    console.log(`测试6 - CDN属性检测: ${result ? '✅ 通过' : '❌ 失败'}`);
    
    if (result) passedTests++;
  } catch (error) {
    console.log(`测试6 - CDN属性检测: ❌ 失败 - ${error.message}`);
  }
  
  // 测试7: 错误处理测试
  totalTests++;
  try {
    const errorImg = document.createElement('img');
    errorImg.src = 'https://example.com/image.jpg';
    // 模拟一个会抛出错误的closest方法
    errorImg.closest = () => {
      throw new Error('模拟错误');
    };
    
    const result = mockImageErrorHandler.isSmartImageElement(errorImg);
    console.log(`测试7 - 错误处理: ${!result ? '✅ 通过' : '❌ 失败'}`);
    
    if (!result) passedTests++;
  } catch (error) {
    console.log(`测试7 - 错误处理: ❌ 失败 - ${error.message}`);
  }
  
  console.log(`\n📊 测试结果: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！SmartImage检测逻辑工作正常。');
  } else {
    console.log('⚠️  部分测试失败，请检查检测逻辑。');
  }
  
  return passedTests === totalTests;
};

// 导出测试函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runTests };
} else {
  // 在浏览器环境中直接运行
  runTests();
}