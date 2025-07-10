# 性能监控系统文档

## 📊 概述

FlexiResume 的性能监控系统提供了全面的 Web 性能指标监控，帮助开发者了解应用的性能表现并进行优化。

## 🎯 监控指标

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: 最大内容绘制时间
- **FID (First Input Delay)**: 首次输入延迟
- **CLS (Cumulative Layout Shift)**: 累积布局偏移

### 自定义指标
- **数据加载时间**: 监控不同数据源的加载性能
- **骨架屏显示时间**: 跟踪加载状态的用户体验
- **路由切换时间**: 监控页面间导航性能
- **主题切换时间**: 监控主题切换的响应速度
- **语言切换时间**: 监控国际化切换性能
- **组件渲染时间**: 跟踪组件级别的性能

## 🔧 使用方法

### 基础用法

```typescript
import { 
  recordMetric, 
  recordDataLoadTime, 
  getPerformanceMetrics,
  getPerformanceScore 
} from '../utils/PerformanceMonitor';

// 记录自定义指标
recordMetric('customOperation', 150);

// 记录数据加载时间
recordDataLoadTime('userProfile', 800);

// 获取所有性能指标
const metrics = getPerformanceMetrics();

// 获取性能评分
const { score, details } = getPerformanceScore();
```

### React Hook 用法

```typescript
import { usePerformanceMonitor } from '../utils/PerformanceMonitor';

const MyComponent = () => {
  const { recordRender, recordMount, recordUpdate } = usePerformanceMonitor('MyComponent');
  
  useEffect(() => {
    recordMount();
  }, []);
  
  // 在渲染时记录性能
  recordRender();
  
  return <div>My Component</div>;
};
```

### 高阶组件用法

```typescript
import { withPerformanceMonitor } from '../utils/PerformanceMonitor';

const MyComponent = () => <div>My Component</div>;

// 自动添加性能监控
export default withPerformanceMonitor(MyComponent, 'MyComponent');
```

## 📈 性能评分

系统会根据 Core Web Vitals 和自定义指标计算性能评分：

- **LCP**: 理想 < 2.5s, 需要改进 < 4s
- **FID**: 理想 < 100ms, 需要改进 < 300ms  
- **CLS**: 理想 < 0.1, 需要改进 < 0.25
- **数据加载**: 快速 < 1s, 中等 < 2s, 慢速 > 2s

## 🎨 最佳实践

1. **组件级监控**: 为关键组件添加性能监控
2. **数据加载监控**: 监控所有异步数据加载操作
3. **用户交互监控**: 跟踪主题切换、语言切换等用户操作
4. **定期检查**: 使用 `getPerformanceScore()` 定期检查性能状况

## 🔍 调试技巧

- 打开浏览器控制台查看性能日志
- 使用 `getPerformanceMetrics()` 获取详细指标
- 关注性能评分中的 "Poor" 和 "Needs Improvement" 项目
- 使用浏览器的 Performance 面板进行深入分析

## 📊 监控数据示例

```json
{
  "LCP": 1200,
  "FID": 50,
  "CLS": 0.05,
  "dataLoadTime": 800,
  "skeletonDisplayTime": 300,
  "routeChangeTime": 150,
  "componentMetrics": {
    "FlexiResume": {
      "renderTime": 25,
      "mountTime": 100,
      "updateTime": 15
    }
  }
}
```
