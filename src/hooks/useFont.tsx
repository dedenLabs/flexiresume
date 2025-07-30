/**
 * 字体管理Hook
 * 
 * 提供字体配置、切换和管理功能
 * 
 * @author FlexiResume Team
 * @date 2025-07-25
 */

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

import {
  FontConfig,
  FontPriorityConfig,
  FontType,
  defaultFontPriority,
  allFonts,
  generateFontCSS,
  checkFontAvailability,
  preloadFonts
} from '../config/FontConfig';
import { getLogger } from '../utils/Logger';

const logUseFont = getLogger('UseFont');
// 字体上下文接口
export interface FontContextType {
  currentFont: FontPriorityConfig;
  setFont: (config: FontPriorityConfig) => void;
  setFontByName: (fontName: string) => void;
  setFontByType: (fontType: FontType, fontName: string) => void;
  availableFonts: Record<FontType, FontConfig[]>;
  fontCSS: string;
  isLoading: boolean;
  loadedFonts: Set<string>;
}

// 本地存储键
const FONT_STORAGE_KEY = 'flexiresume_font_config';

// 字体管理Hook
export const useFont = (): FontContextType => {
  const [currentFont, setCurrentFont] = useState<FontPriorityConfig>(() => {
    // 从localStorage读取保存的字体设置
    try {
      const saved = localStorage.getItem(FONT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (error) {
      logUseFont.extend('warn')('Failed to load font config from localStorage:', error);
    }
    
    return defaultFontPriority;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // 生成当前字体CSS
  const fontCSS = generateFontCSS(currentFont);

  // 设置字体配置
  const setFont = useCallback(async (config: FontPriorityConfig) => {
    setIsLoading(true);
    
    try {
      // 预加载字体
      const allConfigs = [config.primary, ...config.secondary];
      await preloadFonts(allConfigs);
      
      // 检查字体可用性
      const availabilityChecks = await Promise.all(
        allConfigs.map(async (fontConfig) => {
          const isAvailable = await checkFontAvailability(fontConfig.fontFamily);
          return { fontFamily: fontConfig.fontFamily, isAvailable };
        })
      );
      
      // 更新已加载字体列表
      const newLoadedFonts = new Set(loadedFonts);
      availabilityChecks.forEach(({ fontFamily, isAvailable }) => {
        if (isAvailable) {
          newLoadedFonts.add(fontFamily);
        }
      });
      setLoadedFonts(newLoadedFonts);
      
      // 更新当前字体配置
      setCurrentFont(config);
      
      // 保存到localStorage
      localStorage.setItem(FONT_STORAGE_KEY, JSON.stringify(config));
      
      // 更新CSS变量
      updateCSSVariables(generateFontCSS(config));
      
    } catch (error) {
      logUseFont.extend('error')('Failed to set font:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loadedFonts]);

  // 根据字体名称设置字体
  const setFontByName = useCallback((fontName: string) => {
    // 在所有字体中查找
    for (const fontType of Object.values(FontType)) {
      const fonts = allFonts[fontType];
      const font = fonts.find(f => f.name === fontName);
      if (font) {
        const newConfig: FontPriorityConfig = {
          primary: font,
          secondary: fonts.filter(f => f.name !== fontName).slice(0, 2),
          fallback: currentFont.fallback
        };
        setFont(newConfig);
        return;
      }
    }
    
    logUseFont.extend('warn')(`Font ${fontName} not found`);
  }, [currentFont.fallback, setFont]);

  // 根据字体类型和名称设置字体
  const setFontByType = useCallback((fontType: FontType, fontName: string) => {
    const fonts = allFonts[fontType];
    const font = fonts.find(f => f.name === fontName);
    
    if (font) {
      const newConfig: FontPriorityConfig = {
        primary: font,
        secondary: fonts.filter(f => f.name !== fontName).slice(0, 2),
        fallback: currentFont.fallback
      };
      setFont(newConfig);
    } else {
      logUseFont.extend('warn')(`Font ${fontName} not found in type ${fontType}`);
    }
  }, [currentFont.fallback, setFont]);

  // 更新CSS变量
  const updateCSSVariables = useCallback((fontFamily: string) => {
    document.documentElement.style.setProperty('--font-family-primary', fontFamily);
    
    // 更新body的字体
    document.body.style.fontFamily = fontFamily;
  }, []);

  // 初始化字体
  useEffect(() => {
    const initializeFont = async () => {
      setIsLoading(true);
      
      try {
        // 预加载默认字体
        const allConfigs = [currentFont.primary, ...currentFont.secondary];
        await preloadFonts(allConfigs);
        
        // 更新CSS变量
        updateCSSVariables(fontCSS);
        
        // 检查字体可用性
        const availabilityChecks = await Promise.all(
          allConfigs.map(async (fontConfig) => {
            const isAvailable = await checkFontAvailability(fontConfig.fontFamily);
            return { fontFamily: fontConfig.fontFamily, isAvailable };
          })
        );
        
        // 更新已加载字体列表
        const newLoadedFonts = new Set<string>();
        availabilityChecks.forEach(({ fontFamily, isAvailable }) => {
          if (isAvailable) {
            newLoadedFonts.add(fontFamily);
          }
        });
        setLoadedFonts(newLoadedFonts);
        
      } catch (error) {
        logUseFont.extend('error')('Failed to initialize font:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFont();
  }, []); // 只在组件挂载时执行一次

  // 监听字体配置变化
  useEffect(() => {
    updateCSSVariables(fontCSS);
  }, [fontCSS, updateCSSVariables]);

  return {
    currentFont,
    setFont,
    setFontByName,
    setFontByType,
    availableFonts: allFonts,
    fontCSS,
    isLoading,
    loadedFonts
  };
};

// 字体上下文

const FontContext = createContext<FontContextType | undefined>(undefined);

// 字体Provider
export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const fontContext = useFont();

  return (
    <FontContext.Provider value={fontContext}>
      {children}
    </FontContext.Provider>
  );
};

// 使用字体的Hook
export const useFontContext = (): FontContextType => {
  const context = useContext(FontContext);
  if (!context) {
    logUseFont.extend('warn')('useFontContext must be used within a FontProvider, using default font context');
    // 返回默认的字体上下文，避免应用崩溃
    return {
      currentFont: defaultFontPriority,
      setFont: () => {},
      setFontByName: () => {},
      setFontByType: () => {},
      availableFonts: allFonts,
      fontCSS: generateFontCSS(defaultFontPriority),
      isLoading: false,
      loadedFonts: new Set()
    };
  }
  return context;
};
