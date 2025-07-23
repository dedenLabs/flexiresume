/**
 * 国际化配置
 * 
 * 支持中英文切换功能
 * 
 * @author 陈剑
 * @date 2024-12-27
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { recordLanguageChangeTime } from '../utils/PerformanceMonitor';

// 支持的语言类型
export type Language = 'zh' | 'en';

// 国际化文本接口
export interface I18nTexts {
  // 导航相关
  nav: {
    frontend: string;
    backend: string;
    cto: string;
    contract: string;
    agent: string;
    gamedev: string;
  };

  // 通用文本
  common: {
    loading: string;
    error: string;
    retry: string;
    contact: string;
    download: string;
    print: string;
    share: string;
    switchLanguage: string;
    switchTheme: string;
    lightMode: string;
    darkMode: string;
    controlPanel: string;
    theme: string;
    language: string;
    downloadPDF: string;
    originalPDF: string;
    colorPDF: string;
    grayscalePDF: string;
    generating: string;
    pdfGenerationFailed: string;
    unknownError: string;
    buildGuide: string;
    close: string;
    reset: string;
    networkError: string;
    resourceLoadError: string;
    runtimeError: string;
    pageLoadError: string;
    retrying: string;
    maxRetriesReached: string;
    reload: string;
    developmentMode: string;
    developmentDescription: string;
    buildGuideButton: string;
    resetButton: string;
    buildGuideAlert: string;
    resetAlert: string;
    developmentTips: string;
    developmentEnvironment: string;
  };

  // 简历模块标题
  resume: {
    personalInfo: string;
    personalStrengths: string;
    skills: string;
    employmentHistory: string;
    projectExperience: string;
    educationHistory: string;
    personalInfluence: string;
    careerPlanning: string;
    openSourceProjects: string;
  };

  // 个人信息
  profile: {
    position: string;
    expectedSalary: string;
    status: string;
    phone: string;
    email: string;
    location: string;
    experience: string;
    education: string;
  };

  // 时间相关
  time: {
    present: string;
    years: string;
    months: string;
  };
}

// 中文文本
const zhTexts: I18nTexts = {

  common: {
    loading: '加载中...',
    error: '加载失败',
    retry: '重试',
    contact: '联系我',
    download: '下载简历',
    print: '打印简历',
    share: '分享',
    switchLanguage: '切换语言',
    switchTheme: '切换主题',
    lightMode: '浅色模式',
    darkMode: '深色模式',
    controlPanel: '控制面板',
    theme: '主题',
    language: '语言',
    downloadPDF: '下载PDF',
    originalPDF: '原版PDF',
    colorPDF: '彩色PDF',
    grayscalePDF: '黑白PDF',
    generating: '生成中...',
    pdfGenerationFailed: 'PDF生成失败',
    unknownError: '未知错误',
    buildGuide: '构建指南',
    close: '关闭提示',
    reset: '重置',
    networkError: '网络连接问题',
    resourceLoadError: '资源加载失败',
    runtimeError: '运行时错误',
    pageLoadError: '页面加载出错了',
    retrying: '重试中...',
    maxRetriesReached: '已达最大重试次数',
    reload: '重新加载',
    developmentMode: '开发环境模式 (npm run dev)',
    developmentDescription: '如需完整功能测试，建议使用 npm run build 构建后预览。',
    buildGuideButton: '📖 构建指南',
    resetButton: '🔄 重置',
    buildGuideAlert: '📖 构建指南已输出到控制台\n💡 请打开浏览器控制台查看详细信息',
    resetAlert: '已重置',
    developmentTips: `📍 当前模式: 开发环境 (npm run dev)
🔧 特性说明:
  • 热重载 (HMR) 已启用
⚠️  注意事项:
  • Mermaid图表可能需要手动刷新
💡 建议:
  • 如需完整功能测试，请使用: npm run build
  • 生产环境预览: npm run preview`,
    developmentEnvironment: '🚀 FlexiResume 开发环境'
  },

  resume: {
    personalInfo: '个人信息',
    personalStrengths: '个人优势',
    skills: '技能清单',
    employmentHistory: '工作经历',
    projectExperience: '项目经历',
    educationHistory: '教育背景',
    personalInfluence: '个人影响力',
    careerPlanning: '职业规划',
    openSourceProjects: '开源项目'
  },

  profile: {
    position: '求职意向',
    expectedSalary: '期望薪资',
    status: '工作状态',
    phone: '联系电话',
    email: '邮箱地址',
    location: '所在地区',
    experience: '工作经验',
    education: '学历'
  },

  time: {
    present: '至今',
    years: '年',
    months: '个月'
  }
};

// 英文文本
const enTexts: I18nTexts = {
  common: {
    loading: 'Loading...',
    error: 'Load Failed',
    retry: 'Retry',
    contact: 'Contact Me',
    download: 'Download Resume',
    print: 'Print Resume',
    share: 'Share',
    switchLanguage: 'Switch Language',
    switchTheme: 'Switch Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    controlPanel: 'Control Panel',
    theme: 'Theme',
    language: 'Language',
    downloadPDF: 'Download PDF',
    originalPDF: 'Original PDF',
    colorPDF: 'Color PDF',
    grayscalePDF: 'Grayscale PDF',
    generating: 'Generating...',
    pdfGenerationFailed: 'PDF generation failed',
    unknownError: 'Unknown error',
    buildGuide: 'Build Guide',
    close: 'Close',
    reset: 'Reset',
    networkError: 'Network Connection Issue',
    resourceLoadError: 'Resource Load Failed',
    runtimeError: 'Runtime Error',
    pageLoadError: 'Page Load Error',
    retrying: 'Retrying...',
    maxRetriesReached: 'Max retries reached',
    reload: 'Reload',
    developmentMode: 'Development Mode (npm run dev)',
    developmentDescription: 'For complete functionality testing, please use npm run build to build and preview.',
    buildGuideButton: '📖 Build Guide',
    resetButton: '🔄 Reset',
    buildGuideAlert: '📖 Build guide has been output to console\n💡 Please open browser console for detailed information',
    resetAlert: 'Reset completed',
    developmentTips: `📍 Current mode: Development (npm run dev)
🔧 Features:
  • Hot Module Replacement (HMR) enabled
⚠️  Notes:
  • Mermaid charts may need manual refresh
💡 Recommendations:
  • For complete functionality testing, use: npm run build
  • Production preview: npm run preview`,
    developmentEnvironment: '🚀 FlexiResume Development Environment'
  },

  resume: {
    personalInfo: 'Personal Information',
    personalStrengths: 'Personal Strengths',
    skills: 'Skills',
    employmentHistory: 'Work Experience',
    projectExperience: 'Project Experience',
    educationHistory: 'Education',
    personalInfluence: 'Personal Influence',
    careerPlanning: 'Career Planning',
    openSourceProjects: 'Open Source Projects'
  },

  profile: {
    position: 'Position',
    expectedSalary: 'Expected Salary',
    status: 'Status',
    phone: 'Phone',
    email: 'Email',
    location: 'Location',
    experience: 'Experience',
    education: 'Education'
  },

  time: {
    present: 'Present',
    years: ' years',
    months: ' months'
  }
};

// 语言文本映射
const texts: Record<Language, I18nTexts> = {
  zh: zhTexts,
  en: enTexts
};

// 国际化上下文
interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: I18nTexts;
}

// 增强的语言切换函数，包含性能监控
const createLanguageSetter = (setLanguage: React.Dispatch<React.SetStateAction<Language>>) => {
  return (newLang: Language) => {
    const startTime = performance.now();

    setLanguage(prevLang => {
      // 记录语言切换性能
      setTimeout(() => {
        const changeTime = performance.now() - startTime;
        recordLanguageChangeTime(prevLang, newLang, changeTime);
      }, 0);

      return newLang;
    });
  };
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// 国际化Provider
export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // 从localStorage读取保存的语言设置
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'zh' || saved === 'en')) {
      return saved;
    }

    // 根据浏览器语言自动选择
    const browserLang = navigator.language.toLowerCase();
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  useEffect(() => {
    // 保存语言设置到localStorage
    localStorage.setItem('language', language);
  }, [language]);

  // 创建带性能监控的语言切换函数
  const enhancedSetLanguage = createLanguageSetter(setLanguage);

  const value: I18nContextType = {
    language,
    setLanguage: enhancedSetLanguage,
    t: texts[language]
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

// 使用国际化的Hook
export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// 导出默认语言文本（用于类型检查）
export { zhTexts, enTexts };
