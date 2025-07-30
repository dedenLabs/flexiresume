/**
 * React Icons 优化工具
 *
 * 提供按需导入和缓存优化的图标管理
 *
 * @author 陈剑
 * @date 2024-12-27
 */

import React from 'react'; 
import { getLogger } from './Logger';

const logIconOptimizer = getLogger('IconOptimizer');

// 预定义常用图标，避免动态导入
export const COMMON_ICONS = {
  // IO5 图标
  home: () => import('react-icons/io5').then(mod => mod.IoHome),
  
  // FI 图标
  chevronRight: () => import('react-icons/fi').then(mod => mod.FiChevronRight),
  chevronDown: () => import('react-icons/fi').then(mod => mod.FiChevronDown),
  
  // MD 图标
  close: () => import('react-icons/md').then(mod => mod.MdClose),
} as const;

// 图标缓存
const iconCache = new Map<string, React.ComponentType>();

/**
 * 异步加载图标组件
 * @param iconName 图标名称
 * @returns Promise<React.ComponentType>
 */
export const loadIcon = async (iconName: keyof typeof COMMON_ICONS): Promise<React.ComponentType> => {
  // 检查缓存
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }
  
  try {
    const iconLoader = COMMON_ICONS[iconName];
    const IconComponent = await iconLoader();
    
    // 缓存图标
    iconCache.set(iconName, IconComponent);
    
    return IconComponent;
  } catch (error) {
    logIconOptimizer.extend('error')(`Failed to load icon: ${iconName}`, error);
    // 返回一个空的占位符组件
    return () => null;
  }
};

/**
 * React Hook for lazy loading icons
 * @param iconName 图标名称
 * @returns [IconComponent, isLoading, error]
 */
export const useIcon = (iconName: keyof typeof COMMON_ICONS) => {
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  
  React.useEffect(() => {
    let isMounted = true;
    
    const loadIconAsync = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const component = await loadIcon(iconName);
        
        if (isMounted) {
          setIconComponent(() => component);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };
    
    loadIconAsync();
    
    return () => {
      isMounted = false;
    };
  }, [iconName]);
  
  return [IconComponent, isLoading, error] as const;
};

/**
 * 预加载常用图标
 */
export const preloadCommonIcons = async () => {
  const iconNames = Object.keys(COMMON_ICONS) as Array<keyof typeof COMMON_ICONS>;
  
  try {
    await Promise.all(
      iconNames.map(iconName => loadIcon(iconName))
    );
    logIconOptimizer('Common icons preloaded successfully');
  } catch (error) {
    logIconOptimizer.extend('error')('Failed to preload icons:', error);
  }
};

/**
 * 清理图标缓存
 */
export const clearIconCache = () => {
  iconCache.clear();
};

/**
 * 获取缓存统计信息
 */
export const getCacheStats = () => {
  return {
    size: iconCache.size,
    keys: Array.from(iconCache.keys())
  };
};

// 在模块加载时预加载常用图标
if (typeof window !== 'undefined') {
  // 延迟预加载，避免阻塞初始渲染
  setTimeout(() => {
    preloadCommonIcons();
  }, 1000);
}
