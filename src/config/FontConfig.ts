import { getLogger } from "../utils/Logger";
import { SmartCache } from "../utils/MemoryManager";
import { removeBaseURL } from "../utils/URLPathJoiner";
import { cdnManager } from "../utils/CDNManager";


const logFontConfig = getLogger('FontConfig');

// 字体缓存实例
const fontCache = new SmartCache<FontFace>({
  maxSize: 20,                    // 最多缓存20个字体
  maxAge: 60 * 60 * 1000,        // 1小时过期
  maxMemory: 10 * 1024 * 1024,   // 10MB内存限制
  cleanupInterval: 10 * 60 * 1000 // 10分钟清理一次
});
/**
 * 字体配置
 * 
 * 支持中文古代字体和现代字体的配置和切换
 * 
 * @author dedenlabs
 * @date 2025-07-25
 */

// 字体类型枚举
export enum FontType {
  ANCIENT_CHINESE = 'ancient_chinese',
  MODERN_CHINESE = 'modern_chinese',
  ENGLISH = 'english',
  MIXED = 'mixed'
}

// 字体配置接口 - 优化版
export interface FontConfig {
  name: string;
  displayName: string;
  fontFamily: string;
  fallbacks: string[];
  description: string;
  webFontUrl?: string;
  localFontFiles?: string[];

  // 在线字体配置
  cdnConfig?: {
    googleFonts?: string;     // Google Fonts URL
    loli?: string;           // fonts.loli.net URL
    jsdelivr?: string;        // jsDelivr URL
    unpkg?: string;          // unpkg URL
    custom?: string[];       // 自定义CDN URLs
  };

  // 加载配置
  loadConfig?: {
    priority: 'high' | 'medium' | 'low';
    preload: boolean;
    display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  };
}

// 中文古代字体配置 - 每种字体都有独立的CSS文件
export const ancientChineseFonts: FontConfig[] = [
  {
    name: 'kangxi',
    displayName: '康熙字典体',
    fontFamily: 'Noto Serif SC',
    fallbacks: ['STKaiti', 'KaiTi', 'SimKai', 'FangSong', 'serif'],
    description: '康熙字典风格的古典字体，适合正式文档',
    webFontUrl: './fonts/kangxi.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap',
      googleFonts: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap'
    },

    loadConfig: {
      priority: 'medium',
      preload: false,
      display: 'swap'
    }
  },
  {
    name: 'songti',
    displayName: '宋体古风',
    fontFamily: 'Noto Serif SC',
    fallbacks: ['STSong', 'SimSun', 'Song', 'serif'],
    description: '宋体风格，具有古典韵味',
    webFontUrl: './fonts/songti.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap',
      googleFonts: 'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap'
    },

    loadConfig: {
      priority: 'medium',
      preload: false,
      display: 'swap'
    }
  },
  {
    name: 'kaiti',
    displayName: '楷体',
    fontFamily: 'Ma Shan Zheng',
    fallbacks: ['STKaiti', 'KaiTi', 'SimKai', 'FangSong', 'serif'],
    description: '楷体，端正秀丽，适合正式场合',
    webFontUrl: './fonts/kaiti.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap',
      googleFonts: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap'
    },

    loadConfig: {
      priority: 'medium',
      preload: false,
      display: 'swap'
    }
  },
  {
    name: 'fangsong',
    displayName: '仿宋',
    fontFamily: 'ZCOOL XiaoWei',
    fallbacks: ['STFangsong', 'FangSong', 'SimSun', 'serif'],
    description: '仿宋体，古朴典雅',
    webFontUrl: './fonts/fangsong.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=ZCOOL+XiaoWei&display=swap',
      googleFonts: 'https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap'
    },

    loadConfig: {
      priority: 'medium',
      preload: false,
      display: 'swap'
    }
  },
  {
    name: 'lishu',
    displayName: '隶书',
    fontFamily: 'Liu Jian Mao Cao',
    fallbacks: ['STLiti', 'LiSu', 'SimLi', 'serif'],
    description: '隶书风格，古朴大气',
    webFontUrl: './fonts/lishu.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=Liu+Jian+Mao+Cao&display=swap',
      googleFonts: 'https://fonts.googleapis.com/css2?family=Liu+Jian+Mao+Cao&display=swap'
    },

    loadConfig: {
      priority: 'medium',
      preload: false,
      display: 'swap'
    }
  },
  {
    name: 'hanyi_shangwei',
    displayName: '汉仪尚巍手书W',
    fontFamily: 'HYShangWeiShouShuW',
    fallbacks: ['Ma Shan Zheng', 'STKaiti', 'KaiTi', 'SimKai', 'FangSong', 'serif'],
    description: '汉仪尚巍手书体，现代手写风格，具有个性化特色',
    webFontUrl: './fonts/hanyi-shangwei.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=Ma+Shan+Zheng:wght@400&display=swap',
      jsdelivr: 'https://cdn.jsdelivr.net/npm/@fontsource/ma-shan-zheng@4.5.0/index.css',
      unpkg: 'https://unpkg.com/@fontsource/ma-shan-zheng@4.5.0/index.css',
      googleFonts: 'https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng:wght@400&display=swap'
    },

    // 加载配置
    loadConfig: {
      priority: 'high',
      preload: true,
      display: 'swap'
    }
  }
];

// 现代中文字体配置
export const modernChineseFonts: FontConfig[] = [
  {
    name: 'noto_sans_sc',
    displayName: 'Noto Sans SC',
    fontFamily: 'Noto Sans SC',
    fallbacks: ['PingFang SC', 'Microsoft YaHei', 'SimHei', 'sans-serif'],
    description: '现代简洁的中文字体',
    webFontUrl: './fonts/modern-sans.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap',
      googleFonts: 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap'
    },

    loadConfig: {
      priority: 'medium',
      preload: false,
      display: 'swap'
    }
  },
  {
    name: 'decorative',
    displayName: '装饰字体',
    fontFamily: 'ZCOOL KuaiLe',
    fallbacks: ['ZCOOL XiaoWei', 'Noto Sans SC', 'PingFang SC', 'sans-serif'],
    description: '活泼的装饰性字体，适合标题',
    webFontUrl: './fonts/decorative.css',

    // 在线字体配置
    cdnConfig: {
      loli: 'https://fonts.loli.net/css2?family=ZCOOL+KuaiLe&display=swap',
      googleFonts: 'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&display=swap'
    },

    loadConfig: {
      priority: 'medium',
      preload: false,
      display: 'swap'
    }
  },
  {
    name: 'pingfang',
    displayName: '苹方',
    fontFamily: 'PingFang SC',
    fallbacks: ['Microsoft YaHei', 'SimHei', 'sans-serif'],
    description: '苹果设计的现代中文字体',
    localFontFiles: ['PingFang SC']
  },
  {
    name: 'microsoft_yahei',
    displayName: '微软雅黑',
    fontFamily: 'Microsoft YaHei',
    fallbacks: ['SimHei', 'sans-serif'],
    description: '微软设计的现代中文字体',
    localFontFiles: ['Microsoft YaHei']
  }
];

// 英文字体配置
export const englishFonts: FontConfig[] = [
  {
    name: 'times_new_roman',
    displayName: 'Times New Roman',
    fontFamily: 'Times New Roman',
    fallbacks: ['Times', 'serif'],
    description: '经典的英文衬线字体',
    localFontFiles: ['Times New Roman', 'Times']
  },
  {
    name: 'georgia',
    displayName: 'Georgia',
    fontFamily: 'Georgia',
    fallbacks: ['Times New Roman', 'serif'],
    description: '优雅的英文衬线字体',
    localFontFiles: ['Georgia']
  },
  {
    name: 'arial',
    displayName: 'Arial',
    fontFamily: 'Arial',
    fallbacks: ['Helvetica', 'sans-serif'],
    description: '经典的英文无衬线字体',
    localFontFiles: ['Arial', 'Helvetica']
  }
];

// 混合字体配置（中英文搭配）
export const mixedFonts: FontConfig[] = [
  {
    name: 'ancient_mixed',
    displayName: '古典混合',
    fontFamily: 'Noto Serif SC',
    fallbacks: ['Ma Shan Zheng', 'STKaiti', 'KaiTi', 'Times New Roman', 'serif'],
    description: '中文古典字体配英文衬线字体',
    webFontUrl: './fonts/kangxi.css'
  },
  {
    name: 'modern_mixed',
    displayName: '现代混合',
    fontFamily: 'Noto Sans SC',
    fallbacks: ['PingFang SC', 'Microsoft YaHei', 'Arial', 'sans-serif'],
    description: '中文现代字体配英文无衬线字体',
    webFontUrl: './fonts/modern-sans.css'
  }
];

// 所有字体配置
export const allFonts = {
  [FontType.ANCIENT_CHINESE]: ancientChineseFonts,
  [FontType.MODERN_CHINESE]: modernChineseFonts,
  [FontType.ENGLISH]: englishFonts,
  [FontType.MIXED]: mixedFonts
};

// 默认字体配置 - 使用仿市宋体作为默认字体
export const defaultFontConfig: FontConfig =
{
  ...getFontConfigByName('fangsong'), // 使用仿市宋体作为默认字体
  // 加载配置
  loadConfig: {
    priority: 'high',
    preload: true, // 预加载
    display: 'swap'
  }
};

// 字体优先级配置
export interface FontPriorityConfig {
  primary: FontConfig;
  secondary: FontConfig[];
  fallback: string[];
}

// 默认字体优先级配置
export const defaultFontPriority: FontPriorityConfig = {
  primary: defaultFontConfig,
  secondary: [
    ancientChineseFonts[1], // 宋体古风
    ancientChineseFonts[2], // 楷体
    modernChineseFonts[0]   // Noto Sans SC
  ],
  fallback: [
    'STFangsong', 'FangSong', 'STKaiti', 'KaiTi', 'SimKai',
    'STSong', 'SimSun', 'Song',
    'PingFang SC', 'Microsoft YaHei', 'SimHei',
    'Times New Roman', 'Georgia', 'Arial',
    'serif', 'sans-serif'
  ]
};

// 生成字体CSS
export const generateFontCSS = (config: FontPriorityConfig): string => {
  const fontFamilies = [
    `"${config.primary.fontFamily}"`,
    ...config.secondary.map(font => `"${font.fontFamily}"`),
    ...config.fallback.map(font => font.includes(' ') ? `"${font}"` : font)
  ];

  return fontFamilies.join(', ');
};

// 生成Web字体链接
export const generateWebFontLinks = (configs: FontConfig[]): string[] => {
  return configs
    .filter(config => config.webFontUrl)
    .map(config => {
      // 移除基础路径，只保留相对路径
      return removeBaseURL(config.webFontUrl!, cdnManager.getProjectBasePath());
    })
    .filter((url, index, array) => array.indexOf(url) === index); // 去重
};

// 字体加载状态检查
export const checkFontAvailability = async (fontFamily: string): Promise<boolean> => {
  if (!document.fonts) {
    return false;
  }

  try {
    await document.fonts.load(`16px "${fontFamily}"`);
    return document.fonts.check(`16px "${fontFamily}"`);
  } catch (error) {
    logFontConfig.extend('warn')(`Font ${fontFamily} check failed:`, error);
    return false;
  }
};

// 字体加载器类 - 支持按需加载、多CDN源和智能缓存
export class FontLoader {
  private loadedFonts = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();
  private failedCDNs = new Set<string>();

  // 按需加载字体
  async loadFont(fontConfig: FontConfig): Promise<void> {
    // 检查缓存
    const cacheKey = this.generateCacheKey(fontConfig);
    const cachedFont = fontCache.get(cacheKey);

    if (cachedFont) {
      logFontConfig.extend('info')(`Font loaded from cache: ${fontConfig.name}`);
      this.loadedFonts.add(fontConfig.name);
      return;
    }

    if (this.loadedFonts.has(fontConfig.name)) {
      return; // 已加载，直接返回
    }

    if (this.loadingPromises.has(fontConfig.name)) {
      return this.loadingPromises.get(fontConfig.name); // 正在加载，返回Promise
    }

    const loadPromise = this.loadFontFromCDN(fontConfig);
    this.loadingPromises.set(fontConfig.name, loadPromise);

    try {
      await loadPromise;
      this.loadedFonts.add(fontConfig.name);
      logFontConfig.extend('info')(`Font loaded successfully: ${fontConfig.name}`);
    } catch (error) {
      logFontConfig.extend('error')(`Failed to load font: ${fontConfig.name}`, error);
      throw error;
    } finally {
      this.loadingPromises.delete(fontConfig.name);
    }
  }

  // 从CDN加载字体
  private async loadFontFromCDN(fontConfig: FontConfig): Promise<void> {
    const cdnUrls = this.getCDNUrls(fontConfig);

    logFontConfig.extend('info')(`🚀 Loading font "${fontConfig.name}" from ${cdnUrls.length} sources`);

    for (let i = 0; i < cdnUrls.length; i++) {
      const url = cdnUrls[i];

      if (this.failedCDNs.has(url)) {
        logFontConfig.extend('debug')(`⏭️ Skipping known failed CDN: ${url}`);
        continue; // 跳过已知失败的CDN
      }

      try {
        logFontConfig.extend('info')(`🔄 Trying source ${i + 1}/${cdnUrls.length}: ${url}`);
        await this.loadFromURL(url);
        logFontConfig.extend('info')(`✅ Font "${fontConfig.name}" loaded successfully from: ${url}`);
        return; // 成功加载，退出
      } catch (error) {
        logFontConfig.extend('warn')(`❌ Failed to load from ${url}:`, error);
        this.failedCDNs.add(url);

        // 如果不是最后一个URL，继续尝试下一个
        if (i < cdnUrls.length - 1) {
          logFontConfig.extend('info')(`🔄 Trying next CDN source...`);
        }
      }
    }

    const errorMsg = `Failed to load font "${fontConfig.name}" from all ${cdnUrls.length} CDN sources`;
    logFontConfig.extend('error')(errorMsg);
    throw new Error(errorMsg);
  }

  // 获取CDN URLs列表
  private getCDNUrls(fontConfig: FontConfig): string[] {
    const urls: string[] = [];

    // 检查是否强制使用在线字体（开发环境也优先使用在线字体）
    const forceOnlineFonts = true; // 强制优先使用在线字体

    if (fontConfig.cdnConfig && forceOnlineFonts) {
      // 优先使用国内CDN
      if (fontConfig.cdnConfig.loli) {
        urls.push(fontConfig.cdnConfig.loli);
        logFontConfig.extend('debug')(`Added loli CDN: ${fontConfig.cdnConfig.loli}`);
      }
      if (fontConfig.cdnConfig.jsdelivr) {
        urls.push(fontConfig.cdnConfig.jsdelivr);
        logFontConfig.extend('debug')(`Added jsdelivr CDN: ${fontConfig.cdnConfig.jsdelivr}`);
      }
      if (fontConfig.cdnConfig.unpkg) {
        urls.push(fontConfig.cdnConfig.unpkg);
        logFontConfig.extend('debug')(`Added unpkg CDN: ${fontConfig.cdnConfig.unpkg}`);
      }
      if (fontConfig.cdnConfig.googleFonts) {
        urls.push(fontConfig.cdnConfig.googleFonts);
        logFontConfig.extend('debug')(`Added Google Fonts CDN: ${fontConfig.cdnConfig.googleFonts}`);
      }
      if (fontConfig.cdnConfig.custom) {
        urls.push(...fontConfig.cdnConfig.custom);
        logFontConfig.extend('debug')(`Added custom CDNs: ${fontConfig.cdnConfig.custom.join(', ')}`);
      }
    }

    // 回退到本地字体URL（只有在没有在线CDN或所有CDN都失败时才使用）
    if (fontConfig.webFontUrl) {
      // 移除基础路径，只保留相对路径
      const relativePath = removeBaseURL(fontConfig.webFontUrl, cdnManager.getProjectBasePath());
      urls.push(relativePath);
      logFontConfig.extend('debug')(`Added local fallback: ${relativePath}`);
    }

    logFontConfig.extend('info')(`Font ${fontConfig.name} CDN URLs order: ${urls.join(' -> ')}`);
    return urls;
  }

  // 从URL加载字体
  private async loadFromURL(url: string): Promise<void> {
    logFontConfig.extend('info')(`🔄 Attempting to load font from: ${url}`);

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      link.crossOrigin = 'anonymous';

      link.onload = () => {
        logFontConfig.extend('info')(`✅ Font successfully loaded from: ${url}`);

        // 尝试创建FontFace对象并缓存
        this.cacheFontFromURL(url);

        resolve();
      };

      link.onerror = (error) => {
        logFontConfig.extend('warn')(`❌ Failed to load font from: ${url}`, error);
        reject(new Error(`Failed to load font from: ${url}`));
      };

      // 设置超时
      setTimeout(() => {
        logFontConfig.extend('warn')(`⏰ Font load timeout (10s): ${url}`);
        reject(new Error(`Font load timeout: ${url}`));
      }, 10000);

      logFontConfig.extend('debug')(`📎 Adding font link to document head: ${url}`);
      document.head.appendChild(link);
    });
  }

  // 生成缓存键
  private generateCacheKey(fontConfig: FontConfig): string {
    return `font_${fontConfig.name}_${fontConfig.fontFamily}`;
  }

  // 从URL缓存字体
  private async cacheFontFromURL(url: string): Promise<void> {
    try {
      if (document.fonts && document.fonts.values) {
        // 等待字体加载完成
        await document.fonts.ready;

        // 查找对应的FontFace对象
        const fontFaces = Array.from(document.fonts.values());
        const matchingFont = fontFaces.find(font =>
          font.status === 'loaded' &&
          (font as any).src &&
          (font as any).src.includes(url.split('/').pop()?.split('?')[0] || '')
        );

        if (matchingFont) {
          const cacheKey = `url_${url}`;
          fontCache.set(cacheKey, matchingFont);
          logFontConfig.extend('debug')(`Font cached: ${cacheKey}`);
        }
      }
    } catch (error) {
      logFontConfig.extend('warn')(`Failed to cache font from URL: ${url}`, error);
    }
  }

  // 预加载关键字体
  async preloadCriticalFonts(): Promise<void> {
    const criticalFonts = [
      defaultFontConfig,
      // 可以添加其他高优先级字体
    ];

    const preloadPromises = criticalFonts
      .filter(font => font.loadConfig?.preload)
      .map(font => this.loadFont(font));

    await Promise.allSettled(preloadPromises);
  }

  // 检查字体是否已加载
  isLoaded(fontName: string): boolean {
    return this.loadedFonts.has(fontName);
  }

  // 获取已加载的字体列表
  getLoadedFonts(): string[] {
    return Array.from(this.loadedFonts);
  }

  // 获取缓存统计信息
  getCacheStats() {
    return fontCache.getStats();
  }

  // 清理字体缓存
  clearCache(): void {
    fontCache.clear();
    logFontConfig.extend('info')('Font cache cleared');
  }

  // 预热缓存 - 预加载关键字体
  async warmupCache(fontConfigs: FontConfig[]): Promise<void> {
    const warmupPromises = fontConfigs
      .filter(config => config.loadConfig?.preload)
      .map(config => this.loadFont(config));

    await Promise.allSettled(warmupPromises);
    logFontConfig.extend('info')(`Font cache warmed up with ${warmupPromises.length} fonts`);
  }
}

// 全局字体加载器实例
export const fontLoader = new FontLoader();

// 字体预加载 - 兼容旧API
export const preloadFonts = async (configs: FontConfig[]): Promise<void> => {
  const loadPromises = configs.map(config => fontLoader.loadFont(config));
  await Promise.allSettled(loadPromises);
};

// 获取字体配置
function getFontConfigByName(name: string): FontConfig | undefined {
  let defaultFontConfig: FontConfig = {};
  for (const key in allFonts) {
    for (const fontConfig of allFonts[key]) {
      if (fontConfig.name === name) {
        return fontConfig;
      }
      defaultFontConfig = fontConfig;
    }
  }
  return defaultFontConfig;
}