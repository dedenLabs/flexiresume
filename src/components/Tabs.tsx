import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { formatResumeFilename, getCurrentPositionName } from '../utils/Tools';
import flexiResumeStore from '../store/Store';

const borderColor = `#aaa`;
const minWidth = `${920}px`;

const TabsWrapper = styled.nav` 
  padding: 0 40px;
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  max-width: ${minWidth};
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-end; 
  

  @media (min-width: ${minWidth}) { 
    position: absolute;
    width: 45px;
    display: flex;
    flex-direction: column; 
    top: 115px;
    left: 50%;
    transform: translateX(405px);
    border-radius: 8px 8px 0 0;
    align-items: flex-end;
  }

  /* 在打印时隐藏 */
  @media print {
    display: none; 
  }
`;

const TabLink = styled(NavLink)`
  padding: 10px 20px;
  text-decoration: none;
  color: black;
  border: 2px solid transparent; /* 默认无边框 */
  border-radius: 8px 8px 0 0;
  border-top: 1px solid ${borderColor};
  border-right: 1px solid ${borderColor};
  border-bottom: 0px solid ${borderColor};
  border-left: 1px solid ${borderColor};
  transition: background-color 0.3s, border 0.3s;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  &:hover, &.active {
    background-color: #f0f0f0;
    border-color: #333; /* 激活状态时显示边框颜色 */
    border-top: 2px solid #333; /* 激活状态显示右侧边框 */
  }

  @media (min-width: ${minWidth}) { 
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    
    /* 竖向排列文本 */ 
    writing-mode: vertical-rl;
    text-orientation: mixed;            
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid ${borderColor};
    border-right: 1px solid ${borderColor};
    border-bottom: 1px solid ${borderColor};
    border-left: 0px solid ${borderColor};


    &:hover, &.active {
      background-color: #f0f0f0;
      border-right: 2px solid #333; /* 激活状态显示右侧边框 */
    }
  }
`;

/**
 * 显示简历页签
 *
 * @return {*} 
 */
const Tabs: React.FC = () => {
  const data = flexiResumeStore.data;
  const tabs = flexiResumeStore.tabs;
  if (!tabs.length) {
    document.title = data?.header_info?.position || 'My Resume';
    return null;
  } 
  const location = useLocation();
  useEffect(() => {
    const currentPosition = getCurrentPositionName(location);
    const title = formatResumeFilename(data?.header_info?.resume_name_format || `{position}-{name}-{age}-{location}`,
      Object.assign({}, data.header_info, { position: currentPosition }));

    // 更新页面标题
    document.title = title;  
  }, [location]);

  return (
    <TabsWrapper> 
      {
        tabs.map(([position, url], index) => (
          <TabLink key={url} className="no-link-icon" to={url}>{position}</TabLink>
        ))
      }
    </TabsWrapper>
  );
};

export default Tabs;
