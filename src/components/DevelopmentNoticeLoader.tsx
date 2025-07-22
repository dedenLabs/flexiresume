import React, { Suspense, lazy } from 'react';
import { isDevelopment } from '../config/ProjectConfig';

/**
 * 开发环境提示组件动态加载器
 * 
 * 功能：
 * - 只在开发环境动态加载DevelopmentNotice组件
 * - 生产环境返回null，不加载任何代码
 * - 使用React.lazy实现代码分割
 * - 提供加载状态处理
 * 
 * 优势：
 * - 减少生产环境包体积
 * - 提升生产环境性能
 * - 开发环境保持完整功能
 */

// 只在开发环境动态导入组件
const DevelopmentNotice = isDevelopment() 
  ? lazy(() => import('./DevelopmentNotice'))
  : null;

/**
 * 开发环境提示加载器组件
 */
const DevelopmentNoticeLoader: React.FC = () => {
  // 生产环境直接返回null
  if (!isDevelopment() || !DevelopmentNotice) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <DevelopmentNotice />
    </Suspense>
  );
};

export default DevelopmentNoticeLoader;
