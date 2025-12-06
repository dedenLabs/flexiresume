import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import flexiResumeStore from '../store/Store';

interface SEOHeadProps {
  position?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ position }) => {
  const location = useLocation();
  const data = flexiResumeStore.data;
  const headerInfo = data?.header_info;

  useEffect(() => {
    if (!headerInfo) return;

    // 动态更新页面标题
    let title = headerInfo.resume_name_format
      ? headerInfo.resume_name_format
          .replace('{position}', headerInfo.position || '')
          .replace('{name}', headerInfo.name || '')
          .replace('{age}', headerInfo.age || '')
          .replace('{location}', headerInfo.location || '')
      : `${headerInfo.position} - ${headerInfo.name}`;

    // 清理标题，避免显示 "---" 等无意义内容
    const cleanTitle = title.replace(/[-\s]+/g, ' ').trim();
    if (!cleanTitle || cleanTitle === '-' || cleanTitle === '--' || cleanTitle === '---') {
      title = headerInfo.position || headerInfo.name || 'My Resume';
    }

    document.title = title;

    // 更新meta描述
    const description = `${headerInfo.name}的${headerInfo.position}简历，${headerInfo.work_experience_num}，${headerInfo.education}学历，期望薪资${headerInfo.expected_salary}`;
    updateMetaTag('description', description);

    // 更新关键词
    const keywords = [
      headerInfo.position,
      headerInfo.name,
      headerInfo.location,
      '简历',
      '求职',
      headerInfo.work_experience_num?.replace('工作经验', ''),
      headerInfo.education
    ].filter(Boolean).join(',');
    updateMetaTag('keywords', keywords);

    // 更新Open Graph标签
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', 'profile', 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    
    if (headerInfo.avatar) {
      updateMetaTag('og:image', new URL(headerInfo.avatar, window.location.origin).href, 'property');
    }

    // 更新Twitter Card标签
    updateMetaTag('twitter:card', 'summary', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');

    // 更新canonical链接
    updateCanonicalLink(window.location.href);

    // 添加结构化数据
    addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: headerInfo.name,
      jobTitle: headerInfo.position,
      email: headerInfo.email,
      telephone: headerInfo.phone,
      address: {
        '@type': 'PostalAddress',
        addressLocality: headerInfo.location
      },
      url: headerInfo.home_page,
      image: headerInfo.avatar ? new URL(headerInfo.avatar, window.location.origin).href : undefined,
      description: description
    });

  }, [headerInfo, location.pathname]);

  return null; // 这个组件不渲染任何内容
};

// 辅助函数：更新meta标签
function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, name);
    document.head.appendChild(meta);
  }
  
  meta.content = content;
}

// 辅助函数：更新canonical链接
function updateCanonicalLink(href: string) {
  let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  
  canonical.href = href;
}

// 辅助函数：添加结构化数据
function addStructuredData(data: any) {
  // 移除现有的结构化数据
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) {
    existing.remove();
  }

  // 添加新的结构化数据
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

export default SEOHead;
