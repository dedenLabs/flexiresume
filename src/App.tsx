import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Tabs from './components/Tabs';
import originData from './data/Data';
import flexiResumeStore from './store/Store';
import { ImageViewerProvider } from './components/image_viewer/ImageViewerContext';
import ErrorBoundary from './components/ErrorBoundary';
import { SkeletonResume } from './components/SkeletonComponents';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';
import ControlPanel from './components/ControlPanel';
// import useCDNInterceptor from './hooks/useCDNInterceptor';
import { useLazyVideo } from './utils/Tools';
import './utils/PerformanceMonitor'; // 初始化性能监控

/**
 * 懒加载FlexiResume组件
 * 使用React.lazy实现代码分割，减少初始包大小
 */
const FlexiResume = lazy(() => import('./pages/FlexiResume'));

/**
 * 初始化导航页签
 * 根据配置的职位信息动态生成导航标签
 * 格式：[显示名称, 路径, 是否为首页]
 */
flexiResumeStore.tabs = Object.keys(originData.expected_positions).map((key) =>
  [originData.expected_positions[key].header_info?.position, "/" + key, !!originData.expected_positions[key].is_home_page]
);
const tabs = flexiResumeStore.tabs;

/**
 * 确定默认路径
 * 查找标记为首页的页签，如果没有则使用根路径
 */
const defaultPath = tabs.find(([, , isHomePage]) => isHomePage)?.[1] || "/";

/**
 * 主应用组件
 *
 * 负责：
 * - 路由配置和导航
 * - 全局状态管理
 * - 错误边界处理
 * - 性能监控初始化
 * - 懒加载和代码分割
 */
const App: React.FC = () => {
  /**
   * CDN静态资源拦截器（已禁用）
   * 原本使用ServiceWorker方案替换CDN资源，但对视频流式加载支持不佳
   * 现改为业务层直接替换URL的方案
   */
  // if (originData.header_info.use_static_assets_from_cdn) useCDNInterceptor();

  /**
   * 激活视频懒加载
   * 监听滚动事件，当视频进入可视区域时才开始加载
   * 提升页面初始加载性能
   */
  useLazyVideo();

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
