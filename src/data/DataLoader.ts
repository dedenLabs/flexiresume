/**
 * 多语言数据加载器
 * 
 * 根据当前语言动态加载对应的数据文件
 * 支持运行时语言切换和数据热更新
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import { IFlexiResume } from "../types/IFlexiResume";

/**
 * 支持的语言列表
 */
export type SupportedLanguage = 'zh' | 'en';

/**
 * 默认语言
 */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'zh';

/**
 * 语言显示名称映射
 */
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  zh: '中文',
  en: 'English'
};

/**
 * 当前语言状态
 */
let currentLanguage: SupportedLanguage = DEFAULT_LANGUAGE;

/**
 * 数据缓存
 */
const dataCache = new Map<SupportedLanguage, IFlexiResume>();

/**
 * 语言变更监听器
 */
const languageChangeListeners: Array<(language: SupportedLanguage) => void> = [];

/**
 * 获取当前语言
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return currentLanguage;
};

/**
 * 设置当前语言
 * @param language 目标语言
 */
export const setCurrentLanguage = (language: SupportedLanguage): void => {
  if (currentLanguage !== language) {
    currentLanguage = language;
    // 通知所有监听器
    languageChangeListeners.forEach(listener => listener(language));
  }
};

/**
 * 添加语言变更监听器
 * @param listener 监听器函数
 * @returns 取消监听的函数
 */
export const addLanguageChangeListener = (
  listener: (language: SupportedLanguage) => void
): (() => void) => {
  languageChangeListeners.push(listener);
  return () => {
    const index = languageChangeListeners.indexOf(listener);
    if (index > -1) {
      languageChangeListeners.splice(index, 1);
    }
  };
};

/**
 * 动态加载指定语言的数据
 * @param language 目标语言
 * @returns Promise<数据对象>
 */
export const loadLanguageData = async (language: SupportedLanguage): Promise<IFlexiResume> => {
  // 检查缓存
  if (dataCache.has(language)) {
    return dataCache.get(language)!;
  }

  try {
    // 动态导入对应语言的数据文件
    let dataModule;
    if (language === 'zh') {
      dataModule = await import('./zh/Data');
    } else if (language === 'en') {
      dataModule = await import('./en/Data');
    } else {
      throw new Error(`Unsupported language: ${language}`);
    }
    const data = dataModule.default;
    
    // 缓存数据
    dataCache.set(language, data);
    
    return data;
  } catch (error) {
    console.error(`Failed to load data for language: ${language}`, error);
    
    // 如果加载失败且不是默认语言，尝试加载默认语言
    if (language !== DEFAULT_LANGUAGE) {
      console.warn(`Falling back to default language: ${DEFAULT_LANGUAGE}`);
      return loadLanguageData(DEFAULT_LANGUAGE);
    }
    
    throw error;
  }
};

/**
 * 获取当前语言的数据
 * @returns Promise<数据对象>
 */
export const getCurrentLanguageData = async (): Promise<IFlexiResume> => {
  return loadLanguageData(currentLanguage);
};

/**
 * 预加载所有语言的数据
 * @returns Promise<void>
 */
export const preloadAllLanguages = async (): Promise<void> => {
  const languages: SupportedLanguage[] = ['zh', 'en'];
  
  await Promise.all(
    languages.map(async (language) => {
      try {
        await loadLanguageData(language);
        console.log(`Preloaded data for language: ${language}`);
      } catch (error) {
        console.warn(`Failed to preload data for language: ${language}`, error);
      }
    })
  );
};

/**
 * 清除数据缓存
 * @param language 可选，指定清除某个语言的缓存，不指定则清除所有
 */
export const clearDataCache = (language?: SupportedLanguage): void => {
  if (language) {
    dataCache.delete(language);
  } else {
    dataCache.clear();
  }
};

/**
 * 检测浏览器语言偏好
 * @returns 推荐的语言
 */
export const detectBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('zh')) {
    return 'zh';
  } else if (browserLang.startsWith('en')) {
    return 'en';
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * 初始化语言设置
 * 从localStorage读取用户偏好，如果没有则使用浏览器语言
 */
export const initializeLanguage = (): void => {
  try {
    const savedLanguage = localStorage.getItem('flexiresume-language') as SupportedLanguage;
    if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
      currentLanguage = savedLanguage;
    } else {
      currentLanguage = detectBrowserLanguage();
    }
  } catch (error) {
    console.warn('Failed to read language preference from localStorage', error);
    currentLanguage = detectBrowserLanguage();
  }
};

/**
 * 保存语言偏好到localStorage
 * @param language 要保存的语言
 */
export const saveLanguagePreference = (language: SupportedLanguage): void => {
  try {
    localStorage.setItem('flexiresume-language', language);
  } catch (error) {
    console.warn('Failed to save language preference to localStorage', error);
  }
};

// 自动初始化语言设置
initializeLanguage();
