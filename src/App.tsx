import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyle';
import Tabs from './components/Tabs';
import originData from './data/Data';
import flexiResumeStore from './store/Store';
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
const App: React.FC = () => (
  <>
    <GlobalStyle />
    <Router>
      <Tabs /> {/* 页签导航栏 */}
      <Routes>
        {
          tabs.map(([title, path], i) => (
            // <Route key={i} path={path} element={<FlexiResume path={path} />} />
            <Route key={i} path={path} element={
              <Suspense fallback={<div>请稍后...</div>}>
                <FlexiResume path={path} />
              </Suspense>
            } />
          ))
        }
        <Route path="/" element={<Navigate to={defaultPath} />} />
      </Routes>
    </Router>
  </>
);

export default App;
