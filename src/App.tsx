import React, { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Tabs from './components/Tabs';
import flexiResumeStore from './store/Store';
import { ImageViewerProvider } from './components/image_viewer/ImageViewerContext';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonResume } from './components/SkeletonComponents';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';
import ControlPanel from './components/ControlPanel';
import {
  getCurrentLanguageData,
  addLanguageChangeListener,
  getCurrentLanguage, 
  // preloadAllLanguages
} from './data/DataLoader';
import { IFlexiResume } from './data/types/IFlexiResume';
// import useCDNInterceptor from './hooks/useCDNInterceptor';
import { useLazyVideo, updateDataCache } from './utils/Tools';
import './utils/PerformanceMonitor'; // 初始化性能监控

/**
 * 懒加载FlexiResume组件
 * 使用React.lazy实现代码分割，减少初始包大小
 */
const FlexiResume = lazy(() => import('./pages/FlexiResume'));

/**
 * 初始化导航页签
 * @param data 简历数据
 * @returns 页签数组
 */
const initializeTabs = (data: IFlexiResume) => {
  return Object.keys(data.expected_positions)
    .filter((key) => !data.expected_positions[key].hidden) // 过滤掉hidden为true的标签
    .map((key) =>
      [data.expected_positions[key].header_info?.position, "/" + key, !!data.expected_positions[key].is_home_page, !!data.expected_positions[key].is_home_page]
    );
};

/**
 * 获取默认路径
 * @param tabs 页签数组
 * @returns 默认路径
 */
const getDefaultPath = (tabs: any[]) => {
  return tabs.find(([, , isHomePage]) => isHomePage)?.[1] || "/";
};

/**
 * 主应用组件
 *
 * 负责：
 * - 路由配置和导航
 * - 全局状态管理
 * - 错误边界处理
 * - 性能监控初始化
 * - 懒加载和代码分割
 * - 多语言数据动态加载
 */
const App: React.FC = () => {
  const [originData, setOriginData] = useState<IFlexiResume | null>(null);
  const [tabs, setTabs] = useState<any[]>([]);
  const [defaultPath, setDefaultPath] = useState<string>("/");
  const [isLoading, setIsLoading] = useState(true);

  /**
   * 加载当前语言数据
   */
  const loadCurrentData = async () => {
    try {
      setIsLoading(true);
      const data = await getCurrentLanguageData();
      setOriginData(data);

      // 更新Tools.ts中的数据缓存
      await updateDataCache();

      // 更新页签和默认路径
      const newTabs = initializeTabs(data);
      setTabs(newTabs);
      setDefaultPath(getDefaultPath(newTabs));

      // 更新store中的数据
      flexiResumeStore.tabs = newTabs;
    } catch (error) {
      console.error('Failed to load language data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 初始化和语言变更处理
   */
  useEffect(() => {
    // 初始加载
    loadCurrentData();

    // 预加载所有语言数据（后台进行）
    // preloadAllLanguages().catch(console.warn);

    // 监听语言变更
    const unsubscribe = addLanguageChangeListener(() => {
      loadCurrentData();
    });

    return unsubscribe;
  }, []);

  /**
   * CDN静态资源拦截器（已禁用）
   * 原本使用ServiceWorker方案替换CDN资源，但对视频流式加载支持不佳
   * 现改为业务层直接替换URL的方案
   */
  // if (originData?.header_info.use_static_assets_from_cdn) useCDNInterceptor();

  /**
   * 激活视频懒加载
   * 监听滚动事件，当视频进入可视区域时才开始加载
   * 提升页面初始加载性能
   */
  useLazyVideo();

  // 数据加载中显示骨架屏
  if (isLoading || !originData) {
    return (
      <ThemeProvider>
        <I18nProvider>
          <ErrorBoundary>
            <GlobalStyle />
            <ControlPanel collapsible={true} />
            <SkeletonResume />
          </ErrorBoundary>
        </I18nProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <I18nProvider>
        <ErrorBoundary>
          <ImageViewerProvider >
            <GlobalStyle />
            <ControlPanel collapsible={true} />
            <Router basename={originData.header_info.route_base_name}>
              <Tabs /> {/* 页签导航栏 */}
            <Routes>
              {
                tabs.map(([title, path], i) => (
                  // <Route key={i} path={path} element={<FlexiResume path={path} />} />
                  <Route key={i} path={path} element={
                    <ErrorBoundary>
                      <Suspense fallback={<SkeletonResume />}>
                        <FlexiResume path={path} />
                      </Suspense>
                    </ErrorBoundary>
                  } />
                ))
              }
              {/* 添加对 .html 后缀路由的支持 - 重定向到无后缀版本 */}
              {
                tabs.map(([title, path], i) => {
                  const htmlPath = path + '.html';
                  return (
                    <Route
                      key={`html-${i}`}
                      path={htmlPath}
                      element={<Navigate to={path} replace />}
                    />
                  );
                })
              }
              <Route path="/" element={<Navigate to={defaultPath} />} />
            </Routes>
            </Router>
          </ImageViewerProvider >
        </ErrorBoundary>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
