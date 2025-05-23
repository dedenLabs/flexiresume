import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Tabs from './components/Tabs';
import originData from './data/Data';
import flexiResumeStore from './store/Store';
import { ImageViewerProvider } from './components/image_viewer/ImageViewerContext';
// import useCDNInterceptor from './hooks/useCDNInterceptor';
import { useLazyVideo } from './utils/Tools';

// import FlexiResume from './pages/FlexiResume';
const FlexiResume = lazy(() => import('./pages/FlexiResume'));


// 初始化页签
flexiResumeStore.tabs = Object.keys(originData.expected_positions).map((key) =>
  [originData.expected_positions[key].header_info?.position, "/" + key, !!originData.expected_positions[key].is_home_page]
);
const tabs = flexiResumeStore.tabs;

// 默认页签
const defaultPath = tabs.find(([, , isHomePage]) => isHomePage)?.[1] || "/";

// 路由
const App: React.FC = () => {
  // 初始化 CDN静态资源拦截器, 用来替换CDN资源地址
  // if (originData.header_info.use_static_assets_from_cdn) useCDNInterceptor(); // 使用 serviceWorker 方案替换资源如果是视频的情况下,无法实现流式加载,所以取消了改方案,改为业务层替换

  // 激活视频懒加载
  useLazyVideo();

  return (
    <>
      <ImageViewerProvider >
        <GlobalStyle />
        <Router basename={originData.header_info.route_base_name}>
          <Tabs /> {/* 页签导航栏 */}
          <Routes>
            {
              tabs.map(([title, path], i) => (
                // <Route key={i} path={path} element={<FlexiResume path={path} />} />
                <Route key={i} path={path} element={
                  <Suspense fallback={
                    <div className="splash-loader">
                      <div className="spinner"></div>
                      <p>资源加载中...</p>
                    </div>
                  }>
                    <FlexiResume path={path} />
                  </Suspense>
                } />
              ))
            }
            <Route path="/" element={<Navigate to={defaultPath} />} />
          </Routes>
        </Router>
      </ImageViewerProvider >
    </>
  );
}

export default App;
