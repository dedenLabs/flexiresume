/**
 * 滤镜工具函数
 * 
 * 提供统一的滤镜样式管理功能
 * 
 * @author FlexiResume Team
 * @date 2025-07-30
 */

// 滤镜类型枚举
export enum FilterType {
  BACKGROUND_LIGHT = 'background-light',
  BACKGROUND_DARK = 'background-dark',
  LINK_ICON_LIGHT = 'link-icon-light',
  LINK_ICON_DARK = 'link-icon-dark'
}

// 滤镜配置接口
export interface FilterConfig {
  sepia?: number;
  hueRotate?: number;
  saturate?: number;
  brightness?: number;
  contrast?: number;
  invert?: number;
}

/**
 * 获取当前主题的滤镜值
 * @param filterType 滤镜类型
 * @returns 滤镜CSS值
 */
export const getFilterValue = (filterType: FilterType): string => {
  const cssVarMap = {
    [FilterType.BACKGROUND_LIGHT]: '--filter-background-light',
    [FilterType.BACKGROUND_DARK]: '--filter-background-dark',
    [FilterType.LINK_ICON_LIGHT]: '--filter-link-icon-light',
    [FilterType.LINK_ICON_DARK]: '--filter-link-icon-dark'
  };

  const cssVar = cssVarMap[filterType];
  if (!cssVar) return '';

  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement)
      .getPropertyValue(cssVar)
      .trim();
  }

  return '';
};

/**
 * 设置滤镜值到CSS变量
 * @param filterType 滤镜类型
 * @param filterValue 滤镜CSS值
 */
export const setFilterValue = (filterType: FilterType, filterValue: string): void => {
  const cssVarMap = {
    [FilterType.BACKGROUND_LIGHT]: '--filter-background-light',
    [FilterType.BACKGROUND_DARK]: '--filter-background-dark',
    [FilterType.LINK_ICON_LIGHT]: '--filter-link-icon-light',
    [FilterType.LINK_ICON_DARK]: '--filter-link-icon-dark'
  };

  const cssVar = cssVarMap[filterType];
  if (!cssVar) return;

  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty(cssVar, filterValue);
  }
};

/**
 * 根据配置生成滤镜CSS值
 * @param config 滤镜配置
 * @returns 滤镜CSS值
 */
export const generateFilterValue = (config: FilterConfig): string => {
  const filters: string[] = [];

  if (config.brightness !== undefined) {
    filters.push(`brightness(${config.brightness})`);
  }

  if (config.saturate !== undefined) {
    filters.push(`saturate(${config.saturate}%)`);
  }

  if (config.invert !== undefined) {
    filters.push(`invert(${config.invert}%)`);
  }

  if (config.sepia !== undefined) {
    filters.push(`sepia(${config.sepia})`);
  }

  if (config.hueRotate !== undefined) {
    filters.push(`hue-rotate(${config.hueRotate}deg)`);
  }

  if (config.contrast !== undefined) {
    filters.push(`contrast(${config.contrast})`);
  }

  return filters.join(' ');
};

/**
 * 解析滤镜CSS值为配置对象
 * @param filterValue 滤镜CSS值
 * @returns 滤镜配置对象
 */
export const parseFilterValue = (filterValue: string): FilterConfig => {
  const config: FilterConfig = {};

  // 匹配各种滤镜函数
  const patterns = {
    brightness: /brightness\(([^)]+)\)/,
    saturate: /saturate\(([^)]+)\)/,
    invert: /invert\(([^)]+)\)/,
    sepia: /sepia\(([^)]+)\)/,
    hueRotate: /hue-rotate\(([^)]+)\)/,
    contrast: /contrast\(([^)]+)\)/
  };

  Object.entries(patterns).forEach(([key, pattern]) => {
    const match = filterValue.match(pattern);
    if (match) {
      const value = match[1];
      switch (key) {
        case 'brightness':
        case 'saturate':
        case 'contrast':
        case 'sepia':
          config[key as keyof FilterConfig] = parseFloat(value);
          break;
        case 'invert':
          config.invert = parseFloat(value.replace('%', ''));
          break;
        case 'hueRotate':
          config.hueRotate = parseFloat(value.replace('deg', ''));
          break;
      }
    }
  });

  return config;
};

/**
 * 获取所有滤镜配置
 * @returns 所有滤镜类型的配置
 */
export const getAllFilterValues = (): Record<FilterType, string> => {
  return {
    [FilterType.BACKGROUND_LIGHT]: getFilterValue(FilterType.BACKGROUND_LIGHT),
    [FilterType.BACKGROUND_DARK]: getFilterValue(FilterType.BACKGROUND_DARK),
    [FilterType.LINK_ICON_LIGHT]: getFilterValue(FilterType.LINK_ICON_LIGHT),
    [FilterType.LINK_ICON_DARK]: getFilterValue(FilterType.LINK_ICON_DARK)
  };
};

/**
 * 批量设置滤镜值
 * @param filters 滤镜配置映射
 */
export const setAllFilterValues = (filters: Partial<Record<FilterType, string>>): void => {
  Object.entries(filters).forEach(([type, value]) => {
    if (value) {
      setFilterValue(type as FilterType, value);
    }
  });
};

/**
 * 重置滤镜为默认值
 * @param filterType 滤镜类型，如果不提供则重置所有
 */
export const resetFilterValues = (filterType?: FilterType): void => {
  const defaultFilters = {
    [FilterType.BACKGROUND_LIGHT]: 'sepia(0.2) hue-rotate(200deg) saturate(1.2) brightness(1.1)',
    [FilterType.BACKGROUND_DARK]: 'invert(1) hue-rotate(220deg) saturate(0.8) brightness(0.7) contrast(1.1)',
    [FilterType.LINK_ICON_LIGHT]: 'brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(200deg) brightness(103%) contrast(101%)',
    [FilterType.LINK_ICON_DARK]: 'brightness(0) saturate(100%) invert(65%) sepia(11%) saturate(297%) hue-rotate(181deg) brightness(93%) contrast(87%)'
  };

  if (filterType) {
    setFilterValue(filterType, defaultFilters[filterType]);
  } else {
    setAllFilterValues(defaultFilters);
  }
};

/**
 * 创建主题色调整的滤镜
 * @param hue 色调偏移（度）
 * @param saturation 饱和度倍数
 * @param brightness 亮度倍数
 * @returns 滤镜CSS值
 */
export const createThemeFilter = (
  hue: number = 0,
  saturation: number = 1,
  brightness: number = 1
): string => {
  return generateFilterValue({
    hueRotate: hue,
    saturate: saturation * 100,
    brightness
  });
};

/**
 * 应用主题色调整到所有滤镜
 * @param hueShift 色调偏移
 * @param saturationMultiplier 饱和度倍数
 * @param brightnessMultiplier 亮度倍数
 */
export const applyThemeAdjustment = (
  hueShift: number,
  saturationMultiplier: number = 1,
  brightnessMultiplier: number = 1
): void => {
  const currentFilters = getAllFilterValues();
  
  Object.entries(currentFilters).forEach(([type, value]) => {
    if (value) {
      const config = parseFilterValue(value);
      
      // 调整色调
      if (config.hueRotate !== undefined) {
        config.hueRotate += hueShift;
      }
      
      // 调整饱和度
      if (config.saturate !== undefined) {
        config.saturate *= saturationMultiplier;
      }
      
      // 调整亮度
      if (config.brightness !== undefined) {
        config.brightness *= brightnessMultiplier;
      }
      
      const newValue = generateFilterValue(config);
      setFilterValue(type as FilterType, newValue);
    }
  });
};

export default {
  FilterType,
  getFilterValue,
  setFilterValue,
  generateFilterValue,
  parseFilterValue,
  getAllFilterValues,
  setAllFilterValues,
  resetFilterValues,
  createThemeFilter,
  applyThemeAdjustment
};
