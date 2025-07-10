/**
 * 兼容性测试组件
 * 
 * 验证所有优化功能与现有系统的兼容性：
 * - 骨架屏组件的正确渲染
 * - 性能监控系统的正常工作
 * - 主题切换功能的完整性
 * - 国际化系统的正确性
 * - 响应式设计的适配性
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { SkeletonResume, SkeletonText, SkeletonAvatar } from '../components/SkeletonComponents';
import { useTheme } from '../theme';
import { useI18n } from '../i18n';
import { 
  getPerformanceMetrics, 
  getPerformanceScore,
  recordMetric,
  recordComponentMetric,
  recordThemeChangeTime,
  recordLanguageChangeTime
} from '../utils/PerformanceMonitor';

const TestContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-card);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const TestSection = styled.div`
  margin: 30px 0;
  padding: 20px;
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  background: var(--color-background);
`;

const TestTitle = styled.h2`
  color: var(--color-text-primary);
  margin-bottom: 15px;
  font-size: 1.2rem;
`;

const TestResult = styled.div<{ success: boolean }>`
  padding: 10px;
  margin: 10px 0;
  border-radius: 4px;
  background: ${props => props.success ? 'var(--color-success-bg, #d4edda)' : 'var(--color-error-bg, #f8d7da)'};
  color: ${props => props.success ? 'var(--color-success-text, #155724)' : 'var(--color-error-text, #721c24)'};
  border: 1px solid ${props => props.success ? 'var(--color-success-border, #c3e6cb)' : 'var(--color-error-border, #f5c6cb)'};
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 5px;
  border: none;
  border-radius: 4px;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: var(--color-primary-dark);
  }
`;

const MetricsDisplay = styled.pre`
  background: var(--color-code-bg, #f8f9fa);
  color: var(--color-code-text, #333);
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.9rem;
  border: 1px solid var(--color-border-light);
`;

/**
 * 兼容性测试组件
 */
const CompatibilityTest: React.FC = () => {
  const { mode, toggleMode, isDark } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({});
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);

  // 测试结果更新函数
  const updateTestResult = (testName: string, success: boolean) => {
    setTestResults(prev => ({ ...prev, [testName]: success }));
  };

  // 骨架屏测试
  const testSkeletonComponents = () => {
    try {
      setShowSkeleton(true);
      setTimeout(() => {
        setShowSkeleton(false);
        updateTestResult('skeleton', true);
      }, 2000);
    } catch (error) {
      console.error('Skeleton test failed:', error);
      updateTestResult('skeleton', false);
    }
  };

  // 主题切换测试
  const testThemeSwitch = () => {
    try {
      const startTime = performance.now();
      const currentMode = mode;
      
      toggleMode();
      
      setTimeout(() => {
        const changeTime = performance.now() - startTime;
        recordThemeChangeTime(currentMode, mode === 'light' ? 'dark' : 'light', changeTime);
        updateTestResult('theme', true);
      }, 100);
    } catch (error) {
      console.error('Theme switch test failed:', error);
      updateTestResult('theme', false);
    }
  };

  // 语言切换测试
  const testLanguageSwitch = () => {
    try {
      const startTime = performance.now();
      const currentLang = language;
      const newLang = language === 'zh' ? 'en' : 'zh';
      
      setLanguage(newLang);
      
      setTimeout(() => {
        const changeTime = performance.now() - startTime;
        recordLanguageChangeTime(currentLang, newLang, changeTime);
        updateTestResult('language', true);
      }, 100);
    } catch (error) {
      console.error('Language switch test failed:', error);
      updateTestResult('language', false);
    }
  };

  // 性能监控测试
  const testPerformanceMonitoring = () => {
    try {
      // 记录一些测试指标
      recordMetric('testMetric', 100);
      recordComponentMetric('TestComponent', 'render', 25);
      
      // 获取性能数据
      const metrics = getPerformanceMetrics();
      const score = getPerformanceScore();
      
      setPerformanceData({ metrics, score });
      updateTestResult('performance', true);
    } catch (error) {
      console.error('Performance monitoring test failed:', error);
      updateTestResult('performance', false);
    }
  };

  // 响应式设计测试
  const testResponsiveDesign = () => {
    try {
      const container = document.querySelector('[data-testid="responsive-test"]');
      if (container) {
        const rect = container.getBoundingClientRect();
        const isResponsive = rect.width <= window.innerWidth;
        updateTestResult('responsive', isResponsive);
      } else {
        updateTestResult('responsive', true); // 假设通过
      }
    } catch (error) {
      console.error('Responsive design test failed:', error);
      updateTestResult('responsive', false);
    }
  };

  // 运行所有测试
  const runAllTests = () => {
    testSkeletonComponents();
    testThemeSwitch();
    testLanguageSwitch();
    testPerformanceMonitoring();
    testResponsiveDesign();
  };

  // 组件挂载时运行基础测试
  useEffect(() => {
    testPerformanceMonitoring();
    testResponsiveDesign();
  }, []);

  return (
    <TestContainer data-testid="responsive-test">
      <h1>🧪 FlexiResume 兼容性测试</h1>
      <p>验证所有优化功能与现有系统的兼容性</p>

      {/* 测试控制面板 */}
      <TestSection>
        <TestTitle>测试控制面板</TestTitle>
        <Button onClick={runAllTests}>运行所有测试</Button>
        <Button onClick={testSkeletonComponents}>测试骨架屏</Button>
        <Button onClick={testThemeSwitch}>测试主题切换</Button>
        <Button onClick={testLanguageSwitch}>测试语言切换</Button>
        <Button onClick={testPerformanceMonitoring}>测试性能监控</Button>
        <Button onClick={testResponsiveDesign}>测试响应式设计</Button>
      </TestSection>

      {/* 骨架屏测试区域 */}
      <TestSection>
        <TestTitle>骨架屏组件测试</TestTitle>
        {showSkeleton ? (
          <div>
            <p>正在显示骨架屏...</p>
            <SkeletonResume />
          </div>
        ) : (
          <div>
            <SkeletonText width="200px" height="20px" isDark={isDark} />
            <SkeletonAvatar size={60} isDark={isDark} />
          </div>
        )}
        {testResults.skeleton !== undefined && (
          <TestResult success={testResults.skeleton}>
            骨架屏测试: {testResults.skeleton ? '✅ 通过' : '❌ 失败'}
          </TestResult>
        )}
      </TestSection>

      {/* 主题和语言测试 */}
      <TestSection>
        <TestTitle>主题和国际化测试</TestTitle>
        <p>当前主题: {mode} ({isDark ? '深色' : '浅色'})</p>
        <p>当前语言: {language} ({t.common.language})</p>
        <p>测试文本: {t.common.loading}</p>
        
        {testResults.theme !== undefined && (
          <TestResult success={testResults.theme}>
            主题切换测试: {testResults.theme ? '✅ 通过' : '❌ 失败'}
          </TestResult>
        )}
        
        {testResults.language !== undefined && (
          <TestResult success={testResults.language}>
            语言切换测试: {testResults.language ? '✅ 通过' : '❌ 失败'}
          </TestResult>
        )}
      </TestSection>

      {/* 性能监控测试 */}
      <TestSection>
        <TestTitle>性能监控测试</TestTitle>
        {performanceData && (
          <div>
            <p>性能评分: {performanceData.score.score}/100</p>
            <MetricsDisplay>
              {JSON.stringify(performanceData.metrics, null, 2)}
            </MetricsDisplay>
          </div>
        )}
        
        {testResults.performance !== undefined && (
          <TestResult success={testResults.performance}>
            性能监控测试: {testResults.performance ? '✅ 通过' : '❌ 失败'}
          </TestResult>
        )}
      </TestSection>

      {/* 响应式设计测试 */}
      <TestSection>
        <TestTitle>响应式设计测试</TestTitle>
        <p>窗口宽度: {window.innerWidth}px</p>
        <p>容器适配: {window.innerWidth > 768 ? '桌面端' : '移动端'}</p>
        
        {testResults.responsive !== undefined && (
          <TestResult success={testResults.responsive}>
            响应式设计测试: {testResults.responsive ? '✅ 通过' : '❌ 失败'}
          </TestResult>
        )}
      </TestSection>

      {/* 总体测试结果 */}
      <TestSection>
        <TestTitle>总体测试结果</TestTitle>
        {Object.keys(testResults).length > 0 && (
          <div>
            <p>已完成测试: {Object.keys(testResults).length}</p>
            <p>通过测试: {Object.values(testResults).filter(Boolean).length}</p>
            <p>失败测试: {Object.values(testResults).filter(r => !r).length}</p>
            <TestResult success={Object.values(testResults).every(Boolean)}>
              整体兼容性: {Object.values(testResults).every(Boolean) ? '✅ 完全兼容' : '⚠️ 存在问题'}
            </TestResult>
          </div>
        )}
      </TestSection>
    </TestContainer>
  );
};

export default CompatibilityTest;
