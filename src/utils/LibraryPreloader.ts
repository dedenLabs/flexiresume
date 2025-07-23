/**
 * 大型库预加载管理器
 * Large Library Preloader Manager
 * 
 * 用于管理大型第三方库的预加载，减少首次使用时的加载时间
 * Manages preloading of large third-party libraries to reduce loading time on first use
 */

import { getProjectConfig, isDebugEnabled } from '../config/ProjectConfig';
import debug from 'debug'; 
// Debug logger
const debugPreloader = debug('app:preloader');

// 库加载状态管理
interface LibraryState {
  loading: boolean;
  loaded: boolean;
  error: string | null;
  module: any;
}

class LibraryPreloader {
  private libraries: Map<string, LibraryState> = new Map();
  private preloadPromises: Map<string, Promise<any>> = new Map();

  constructor() {
    this.initializeLibraryStates();
  }

  /**
   * 初始化库状态
   */
  private initializeLibraryStates() {
    const libraryNames = ['mermaid', 'svgPanZoom', 'katex', 'cytoscape'];
    libraryNames.forEach(name => {
      this.libraries.set(name, {
        loading: false,
        loaded: false,
        error: null,
        module: null
      });
    });
  }

  /**
   * 开始预加载配置的库
   */
  public async startPreloading(): Promise<void> {
    const config = getProjectConfig();
    const { preloadLibraries } = config.performance;

    if (isDebugEnabled()) {
      debugPreloader('[LibraryPreloader] 开始预加载库:', preloadLibraries);
    }

    const preloadTasks: Promise<void>[] = [];

    // 根据配置预加载库
    if (preloadLibraries.mermaid) {
      preloadTasks.push(this.preloadMermaid());
    }
    if (preloadLibraries.svgPanZoom) {
      preloadTasks.push(this.preloadSvgPanZoom());
    }
    if (preloadLibraries.katex) {
      preloadTasks.push(this.preloadKatex());
    }
    if (preloadLibraries.cytoscape) {
      preloadTasks.push(this.preloadCytoscape());
    }

    // 并行预加载，但不等待完成（避免阻塞应用启动）
    Promise.allSettled(preloadTasks).then(results => {
      if (isDebugEnabled()) {
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        debugPreloader(`[LibraryPreloader] 预加载完成: ${successful}个成功, ${failed}个失败`);
      }
    });
  }

  /**
   * 预加载Mermaid库
   */
  private async preloadMermaid(): Promise<void> {
    return this.preloadLibrary('mermaid', () => import('mermaid'));
  }

  /**
   * 预加载SVG Pan Zoom库
   */
  private async preloadSvgPanZoom(): Promise<void> {
    return this.preloadLibrary('svgPanZoom', () => import('svg-pan-zoom'));
  }

  /**
   * 预加载KaTeX库
   */
  private async preloadKatex(): Promise<void> {
    return this.preloadLibrary('katex', () => import('katex'));
  }

  /**
   * 预加载Cytoscape库
   */
  private async preloadCytoscape(): Promise<void> {
    return this.preloadLibrary('cytoscape', () => import('cytoscape'));
  }

  /**
   * 通用库预加载方法
   */
  private async preloadLibrary(name: string, loader: () => Promise<any>): Promise<void> {
    const state = this.libraries.get(name);
    if (!state || state.loaded || state.loading) {
      return;
    }

    // 如果已经有预加载Promise，直接返回
    if (this.preloadPromises.has(name)) {
      return this.preloadPromises.get(name);
    }

    // 标记为加载中
    state.loading = true;
    state.error = null;

    const startTime = performance.now();
    
    const preloadPromise = loader()
      .then(module => {
        const loadTime = performance.now() - startTime;
        state.loaded = true;
        state.loading = false;
        state.module = module;
        
        if (isDebugEnabled()) {
          debugPreloader(`[LibraryPreloader] ${name} 预加载成功 (${loadTime.toFixed(2)}ms)`);
        }
        
        return module;
      })
      .catch(error => {
        state.loading = false;
        state.error = error.message;
        
        if (isDebugEnabled()) {
          console.warn(`[LibraryPreloader] ${name} 预加载失败:`, error);
        }
        
        throw error;
      })
      .finally(() => {
        this.preloadPromises.delete(name);
      });

    this.preloadPromises.set(name, preloadPromise);
    return preloadPromise;
  }

  /**
   * 获取库（如果已预加载则直接返回，否则动态加载）
   */
  public async getLibrary(name: string): Promise<any> {
    const state = this.libraries.get(name);
    
    if (!state) {
      throw new Error(`Unknown library: ${name}`);
    }

    // 如果已经加载完成，直接返回
    if (state.loaded && state.module) {
      return state.module;
    }

    // 如果正在加载中，等待加载完成
    if (state.loading && this.preloadPromises.has(name)) {
      return this.preloadPromises.get(name);
    }

    // 否则动态加载
    switch (name) {
      case 'mermaid':
        return this.preloadMermaid();
      case 'svgPanZoom':
        return this.preloadSvgPanZoom();
      case 'katex':
        return this.preloadKatex();
      case 'cytoscape':
        return this.preloadCytoscape();
      default:
        throw new Error(`Unknown library: ${name}`);
    }
  }

  /**
   * 获取库的加载状态
   */
  public getLibraryState(name: string): LibraryState | null {
    return this.libraries.get(name) || null;
  }

  /**
   * 获取所有库的加载状态
   */
  public getAllLibraryStates(): Map<string, LibraryState> {
    return new Map(this.libraries);
  }

  /**
   * 清理资源
   */
  public cleanup(): void {
    this.libraries.clear();
    this.preloadPromises.clear();
  }
}

// 创建全局实例
export const libraryPreloader = new LibraryPreloader();

// 导出类型
export type { LibraryState };
