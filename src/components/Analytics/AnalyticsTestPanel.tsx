/**
 * 分析统计测试面板
 * Analytics Test Panel
 * 
 * 用于测试和验证三种统计方案的集成效果
 */

import React, { useState, useEffect } from 'react';
import { baiduAnalytics } from '../../utils/BaiduAnalytics';
import { googleAnalytics } from '../../utils/GoogleAnalytics';
import { elkAnalytics } from '../../utils/ELKAnalytics';
import { analyticsConfig } from '../../config/AnalyticsConfig';
import { getLogger } from '../../utils/Logger';

const logAnalyticsTest = getLogger('AnalyticsTest');

interface AnalyticsStatus {
  baidu: any;
  google: any;
  elk: any;
  config: any;
}

const AnalyticsTestPanel: React.FC = () => {
  const [status, setStatus] = useState<AnalyticsStatus | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    updateStatus();
  }, []);

  const updateStatus = () => {
    const currentStatus = {
      baidu: baiduAnalytics.getStatus(),
      google: googleAnalytics.getStatus(),
      elk: elkAnalytics.getStatus(),
      config: analyticsConfig.getConfigSummary()
    };
    setStatus(currentStatus);
  };

  const addTestResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const testPageView = () => {
    try {
      baiduAnalytics.trackPageView('/test-page', 'Test Page');
      googleAnalytics.trackPageView({
        page_title: 'Test Page',
        page_path: '/test-page'
      });
      elkAnalytics.trackPageView('Test Page', '/test-page');
      logAnalyticsTest('✅ Page view test completed');
      addTestResult('✅ Page view test completed');
    } catch (error) {
      logAnalyticsTest.extend('error')('❌ Page view test failed:', error);
      addTestResult(`❌ Page view test failed: ${error}`);
    }
  };

  const testSkillClick = () => {
    try {
      baiduAnalytics.trackSkillClick('React', 'Frontend');
      googleAnalytics.trackSkillClick('React', 'Frontend');
      elkAnalytics.trackSkillClick('React', 'Frontend');
      logAnalyticsTest('✅ Skill click test completed');
      addTestResult('✅ Skill click test completed');
    } catch (error) {
      logAnalyticsTest.extend('error')('❌ Skill click test failed:', error);
      addTestResult(`❌ Skill click test failed: ${error}`);
    }
  };

  const testProjectView = () => {
    try {
      baiduAnalytics.trackProjectView('FlexiResume', 'Web Application');
      googleAnalytics.trackProjectView('FlexiResume', 'Web Application');
      elkAnalytics.trackProjectView('FlexiResume', 'Web Application');
      logAnalyticsTest('✅ Project view test completed');
      addTestResult('✅ Project view test completed');
    } catch (error) {
      logAnalyticsTest.extend('error')('❌ Project view test failed:', error);
      addTestResult(`❌ Project view test failed: ${error}`);
    }
  };

  const testContactClick = () => {
    try {
      baiduAnalytics.trackContactClick('email');
      googleAnalytics.trackContactClick('email', 'test@example.com');
      elkAnalytics.trackContactClick('email', 'test@example.com');
      logAnalyticsTest('✅ Contact click test completed');
      addTestResult('✅ Contact click test completed');
    } catch (error) {
      logAnalyticsTest.extend('error')('❌ Contact click test failed:', error);
      addTestResult(`❌ Contact click test failed: ${error}`);
    }
  };

  const testLanguageSwitch = () => {
    try {
      baiduAnalytics.trackLanguageSwitch('zh', 'en');
      googleAnalytics.trackLanguageSwitch('zh', 'en');
      elkAnalytics.trackLanguageSwitch('zh', 'en');
      logAnalyticsTest('✅ Language switch test completed');
      addTestResult('✅ Language switch test completed');
    } catch (error) {
      logAnalyticsTest.extend('error')('❌ Language switch test failed:', error);
      addTestResult(`❌ Language switch test failed: ${error}`);
    }
  };

  const testThemeSwitch = () => {
    try {
      baiduAnalytics.trackThemeSwitch('light', 'dark');
      googleAnalytics.trackThemeSwitch('light', 'dark');
      elkAnalytics.trackThemeSwitch('light', 'dark');
      logAnalyticsTest('✅ Theme switch test completed');
      addTestResult('✅ Theme switch test completed');
    } catch (error) {
      logAnalyticsTest.extend('error')('❌ Theme switch test failed:', error);
      addTestResult(`❌ Theme switch test failed: ${error}`);
    }
  };

  const testError = () => {
    try {
      baiduAnalytics.trackError('test_error', 'This is a test error');
      googleAnalytics.trackError('test_error', 'This is a test error', false);
      elkAnalytics.trackError('test_error', 'This is a test error', undefined, 'AnalyticsTestPanel');
      logAnalyticsTest('✅ Error tracking test completed');
      addTestResult('✅ Error tracking test completed');
    } catch (error) {
      logAnalyticsTest.extend('error')('❌ Error tracking test failed:', error);
      addTestResult(`❌ Error tracking test failed: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  if (!status) {
    return <div>Loading analytics status...</div>;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      width: '400px',
      maxHeight: '80vh',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 9999,
      fontSize: '12px',
      overflow: 'auto'
    }}>
      <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>📊 Analytics Test Panel</h3>
      
      {/* 状态显示 */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Status</h4>
        <div style={{ backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
          <div>🔵 Baidu: {status.baidu.enabled ? '✅' : '❌'} ({status.baidu.initialized ? 'Init' : 'Not Init'})</div>
          <div>🟢 Google: {status.google.enabled ? '✅' : '❌'} ({status.google.initialized ? 'Init' : 'Not Init'}) - {status.google.method}</div>
          <div>🟡 ELK: {status.elk.enabled ? '✅' : '❌'} (Queue: {status.elk.queueSize})</div>
        </div>
      </div>

      {/* 测试按钮 */}
      <div style={{ marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Tests</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
          <button onClick={testPageView} style={buttonStyle}>Page View</button>
          <button onClick={testSkillClick} style={buttonStyle}>Skill Click</button>
          <button onClick={testProjectView} style={buttonStyle}>Project View</button>
          <button onClick={testContactClick} style={buttonStyle}>Contact Click</button>
          <button onClick={testLanguageSwitch} style={buttonStyle}>Language Switch</button>
          <button onClick={testThemeSwitch} style={buttonStyle}>Theme Switch</button>
          <button onClick={testError} style={buttonStyle}>Error Track</button>
          <button onClick={updateStatus} style={buttonStyle}>Refresh Status</button>
        </div>
      </div>

      {/* 测试结果 */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h4 style={{ margin: 0, fontSize: '14px' }}>Test Results</h4>
          <button onClick={clearResults} style={{ ...buttonStyle, fontSize: '10px', padding: '2px 6px' }}>Clear</button>
        </div>
        <div style={{
          backgroundColor: '#f8f8f8',
          padding: '8px',
          borderRadius: '4px',
          maxHeight: '200px',
          overflow: 'auto',
          fontFamily: 'monospace',
          fontSize: '10px'
        }}>
          {testResults.length === 0 ? (
            <div style={{ color: '#666' }}>No test results yet...</div>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ marginBottom: '2px' }}>{result}</div>
            ))
          )}
        </div>
      </div>

      {/* 配置信息 */}
      <details style={{ marginTop: '16px' }}>
        <summary style={{ cursor: 'pointer', fontSize: '14px' }}>Configuration</summary>
        <pre style={{
          backgroundColor: '#f0f0f0',
          padding: '8px',
          borderRadius: '4px',
          fontSize: '10px',
          overflow: 'auto',
          marginTop: '8px'
        }}>
          {JSON.stringify(status.config, null, 2)}
        </pre>
      </details>
    </div>
  );
};

const buttonStyle: React.CSSProperties = {
  padding: '4px 8px',
  fontSize: '11px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  backgroundColor: '#f9f9f9',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

export default AnalyticsTestPanel;
