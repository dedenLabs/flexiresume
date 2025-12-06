import React, { useEffect, useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { formatResumeFilename, getCurrentPositionName } from "../utils/Tools";

import flexiResumeStore from "../store/Store";
import {
  extractRoleTitle,
  formatTabLabelWithConfig,
} from "../utils/TabFormatter";
import { useTheme } from "../theme";
import { pageDataCache } from "../utils/MemoryManager";
import { getLogger } from "../utils/Logger";
import { SmartImage } from "./SmartImage";
const logTabs = getLogger("Tabs");

const borderColor = `#aaa`;
const minWidth = `${920}px`;

const TabsWrapper = styled.nav.withConfig({
  shouldForwardProp: (prop) => prop !== "isDark",
})<{ isDark?: boolean }>`
  /* 移动端样式 - 修复横向溢出问题 */
  padding: 0 10px; /* 适当的左右padding */
  position: relative;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  width: 100%; /* 确保不超出容器宽度 */
  max-width: 800px; /* 不超出父容器 */
  box-sizing: border-box;
  top: 2px;
  justify-content: flex-start; /* 改为左对齐，避免溢出 */
  overflow-x: auto; /* 允许横向滚动 */
  overflow-y: hidden;
  gap: 2px; /* 减少标签间距 */

  /* 移动端特殊处理 */
  @media (max-width: 768px) {
    padding: 0 5px;
    margin: 20px 5px 0 5px;
    width: calc(100% - 10px);
    max-width: calc(100vw - 10px);
  }

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 0 2px;
    margin: 20px 2px 0 2px;
    width: calc(100% - 4px);
    max-width: calc(100vw - 4px);
    gap: 1px;
  }

  /* 隐藏滚动条但保持功能 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  /* 完全移除滚动提示渐变遮罩 - 用户反馈不需要此功能 */
  &::after {
    display: none !important;
    content: none !important;
  }

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
    overflow: visible; /* 桌面端恢复正常 */
    gap: 2px; /* 桌面端也减少间距 */

    /* 桌面端不需要滚动提示 - 强制隐藏 */
    &::after {
      display: none !important;
      content: none !important;
    }
  }

  /* 在打印时隐藏 */
  @media print {
    display: none;
  }
`;

const TabLink = styled(NavLink).withConfig({
  shouldForwardProp: (prop) => prop !== "isDark",
})<{ isDark?: boolean }>`
  /* 基础样式 */
  text-decoration: none;
  color: ${(props) => (props.isDark ? "var(--color-text-primary)" : "black")};
  border: 2px solid transparent;
  border-radius: 6px 6px 0 0;
  border-top: 1px solid
    ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};
  border-right: 1px solid
    ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};
  border-bottom: 0px solid
    ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};
  border-left: 1px solid
    ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};
  transition:
    background-color 0.3s,
    border 0.3s,
    color 0.3s,
    transform 0.2s;
  box-shadow: 0 0 10px
    ${(props) =>
      props.isDark ? "var(--color-shadow-medium)" : "rgba(0, 0, 0, 0.1)"};
  background-color: ${(props) =>
    props.isDark ? "var(--color-background)" : "var(--color-background)"};
  white-space: nowrap;
  flex-shrink: 0;
  box-sizing: border-box;

  /* 移动端样式 */
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 500;
  min-width: fit-content;
  max-width: 140px; /* 增加最大宽度以容纳头像 */
  overflow: hidden;
  text-overflow: ellipsis;

  /* 超小屏幕适配 */
  @media (max-width: 480px) {
    padding: 4px 6px;
    font-size: 11px;
    max-width: 120px; /* 增加超小屏幕的最大宽度 */
  }

  &:hover,
  &.active {
    background-color: ${(props) =>
      props.isDark ? "var(--color-surface)" : "var(--color-primary)"};
    border-color: ${(props) =>
      props.isDark
        ? "var(--color-primary)"
        : "#333"}; /* 激活状态时显示边框颜色 */
    border-top: 2px solid
      ${(props) => (props.isDark ? "var(--color-primary)" : "#333")}; /* 激活状态显示顶部边框 */
    color: ${(props) => (props.isDark ? "var(--color-primary)" : "inherit")};
    transform: translateY(-1px); /* 轻微上移效果 */
  }

  @media (min-width: ${minWidth}) {
    padding: 10px 10px;
    margin: 2px 0;
    border: none;
    text-align: center;
    font-size: 16px; /* 桌面端恢复正常字体大小 */

    /* 竖向排列文本 */
    writing-mode: vertical-rl;
    text-orientation: mixed;
    border-radius: 0px 8px 8px 0px;
    border-top: 1px solid
      ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};
    border-right: 1px solid
      ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};
    border-bottom: 1px solid
      ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};
    border-left: 0px solid
      ${(props) => (props.isDark ? "var(--color-border-medium)" : borderColor)};

    &:hover,
    &.active {
      background-color: ${(props) =>
        props.isDark ? "var(--color-surface)" : "var(--color-surface)"};
      border-right: 2px solid
        ${(props) => (props.isDark ? "var(--color-primary)" : "#333")}; /* 激活状态显示右侧边框 */
      color: ${(props) => (props.isDark ? "var(--color-primary)" : "inherit")};
    }
  }
`;

const SmartImageStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "1px solid var(--color-border-light)",
  flexShrink: "0",
};

const TabText = styled.span`
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 480px) {
    font-size: 0.85em; /* 小屏幕时稍微减小字体 */
  }
`;

const TabContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row; /* 始终使用水平布局，头像在左侧 */
  gap: 6px; /* 头像和文字之间的间距 */

  /* 确保在所有屏幕尺寸下都是水平布局 */
  @media (max-width: 767px) {
    gap: 4px; /* 小屏幕时减小间距 */
  }

  @media (max-width: 480px) {
    gap: 3px; /* 超小屏幕时进一步减小间距 */
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
  const { isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate(); // 使用React Router的导航

  // 预加载页签数据
  const preloadTabData = useCallback(async (url: string) => {
    const cacheKey = `preload-${url}`;

    if (pageDataCache.has(cacheKey)) {
      // 调试日志已移除: console.log(`📦 [DEBUG] 数据已预加载: ${url}`);
      return;
    }

    try {
      // 调试日志已移除: console.log(`🔄 [DEBUG] 开始预加载数据: ${url}`);
      const positionName = url.replace("/", "");

      // 预加载位置数据到缓存
      pageDataCache.set(cacheKey, true);
      // 调试日志已移除: console.log(`✅ [DEBUG] 数据预加载完成: ${url}`);
    } catch (error) {
      // 调试日志已移除: console.error(`❌ [DEBUG] 数据预加载失败: ${url}`, error);
    }
  }, []);

  // 处理页签悬停事件，触发预加载
  const handleTabHover = useCallback(
    (url: string) => {
      // 延迟预加载，避免快速滑过时的不必要请求
      const timer = setTimeout(() => {
        preloadTabData(url);
      }, 200);

      return () => clearTimeout(timer);
    },
    [preloadTabData],
  );

  // 处理页签点击事件，只进行SPA导航，音频由FlexiResume统一处理
  const handleTabClick = useCallback(
    async (url: string, event: React.MouseEvent) => {
      // 阻止默认的链接行为
      event.preventDefault();

      // 立即进行导航，不等待音频播放完成
      navigate(url);

      logTabs(`页签导航: ${url}`);
    },
    [navigate],
  );

  useEffect(() => {
    if (!tabs.length) {
      document.title = data?.header_info?.position || "My Resume";
      return;
    }

    const currentPosition = getCurrentPositionName(location);
    const headerInfo = Object.assign({}, data?.header_info);
    const title = formatResumeFilename(
      data?.header_info?.resume_name_format ||
        `{position}-{name}-{age}-{location}`,
      headerInfo,
    );

    // 更新页面标题，确保不为空
    const finalTitle =
      title && title.trim()
        ? title
        : currentPosition || data?.header_info?.position || "My Resume";
    document.title = finalTitle;
  }, [location, data, tabs.length]);

  if (!tabs.length) {
    return null;
  }

  // 获取角色数据
  const getCharacterData = (url: string) => {
    const positionKey = url.replace("/", "");
    const positionData = data?.expected_positions?.[positionKey];
    return positionData?.header_info;
  };

  return (
    <TabsWrapper data-testid="navigation-tabs" isDark={isDark}>
      {tabs.map(([position, url, b, avatarStr], index) => {
        const characterData = getCharacterData(url);
        const characterName = characterData?.name || position;
        const avatar = characterData?.avatar || avatarStr;
        // console.log(`🔍 [DEBUG] 当前位置: ${position} ${characterData?.position}  `);
        // 调试信息
        // 调试日志已移除: console.log('Tab debug:', { url, characterData, avatar, characterName, roleTitle });

        return (
          <TabLink
            key={url}
            className="no-link-icon"
            to={url}
            isDark={isDark}
            onMouseEnter={() => {
              // 调试日志已移除: console.log(`🔄 [DEBUG] TabLink悬停事件触发: ${url}`);
              const cleanup = handleTabHover(url);
              // 清理函数会在组件卸载或下次悬停时调用
              return cleanup;
            }}
            onClick={(e) => {
              // 调试日志已移除: console.log(`🎵 [DEBUG] TabLink点击事件触发: ${url}`);
              // 使用优化后的SPA导航处理函数
              handleTabClick(url, e);
            }}
          >
            <TabContent>
              {avatar && (
                <SmartImage
                  key={`avatar-${url}-${avatar}`} // 强制重新渲染
                  src={avatar}
                  alt={characterName}
                  enableCDNFallback={true}
                  maxRetries={0} // 不重试，直接换cdn源
                  showLoadingState={true} // 不显示加载状态
                  showErrorState={false} // 不显示错误状态
                  loadingText="" // 不显示错误状态
                  defaultSize={{ width: "20px", height: "20px" }} // 设置默认尺寸保持布局
                  onError={(error) => {
                    logTabs.extend("error")(
                      "Avatar load error:",
                      avatar,
                      error,
                    );
                  }}
                  onLoad={() => {
                    logTabs("Avatar loaded successfully:", avatar);
                  }}
                  style={SmartImageStyle}
                />
              )}

              <TabText>{position}</TabText>
            </TabContent>
          </TabLink>
        );
      })}
    </TabsWrapper>
  );
};

export default Tabs;
