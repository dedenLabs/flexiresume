/**
 * 西游记音频控制器组件
 * 
 * 提供音频播放控制功能，包括音量调节、启用/禁用等
 * 
 * @author dedenlabs
 * @date 2024-12-27
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../theme';
import { useI18n } from '../i18n';
import { enhancedAudioPlayer } from '../utils/EnhancedAudioPlayer';

// 样式组件
const AudioControllerContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
`;

const AudioButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark' && prop !== 'active',
})<{ isDark: boolean; active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: ${props => props.active
    ? 'var(--color-primary)'
    : 'transparent'
  };
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  cursor: pointer;
  color: ${props => props.active
    ? 'var(--color-text-inverse)'
    : 'var(--color-text-primary)'
  };
  font-size: 14px;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active
      ? 'var(--color-primary)'
      : 'var(--color-surface)'
    };
    border-color: var(--color-border-medium);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const VolumeSlider = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  width: 60px;
  height: 4px;
  background: var(--color-border-light);
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--color-primary);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: ${props => props.isDark ? 'var(--color-primary)' : 'var(--color-primary)'};
    border-radius: 50%;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: scale(1.2);
    }
  }
`;



const AudioLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'isDark',
})<{ isDark: boolean }>`
  font-size: 12px;
  color: ${props => props.isDark ? '#e2e8f0' : '#2c3e50'};
  white-space: nowrap;
`;

interface AudioControllerProps {
  className?: string;
}

const AudioController: React.FC<AudioControllerProps> = ({ className }) => {
  const { isDark } = useTheme();
  const { t } = useI18n();

  // 从localStorage读取保存的音频设置
  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('audioEnabled');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [volume, setVolume] = useState(() => {
    try {
      const saved = localStorage.getItem('audioVolume');
      return saved !== null ? parseFloat(saved) : 0.7;
    } catch {
      return 0.7;
    }
  });

  // 初始化音频设置
  useEffect(() => {
    enhancedAudioPlayer.setEnabled(isEnabled);
    // 修复：BGM和SFX都使用相同的音量控制
    enhancedAudioPlayer.setGlobalVolume(volume, volume);
  }, [isEnabled, volume]);

  // 保存音频启用状态到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('audioEnabled', JSON.stringify(isEnabled));
    } catch (error) {
      console.warn('Failed to save audio enabled state to localStorage:', error);
    }
  }, [isEnabled]);

  // 保存音量设置到localStorage
  useEffect(() => {
    try {
      localStorage.setItem('audioVolume', volume.toString());
    } catch (error) {
      console.warn('Failed to save audio volume to localStorage:', error);
    }
  }, [volume]);

  // 切换音频启用状态
  const toggleAudio = async () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    await enhancedAudioPlayer.setEnabled(newState);
  };

  // 调节音量
  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };



  return (
    <AudioControllerContainer isDark={isDark} className={className}>
      {/* 音量控制 */}
      {isEnabled && (
        <>
          <AudioLabel isDark={isDark}>音量</AudioLabel>
          <VolumeSlider
            isDark={isDark}
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            title={`音量: ${Math.round(volume * 100)}%`}
          />
        </>
      )}

      {/* 音频开关 - 移动到音量控制条右侧 */}
      <AudioButton
        isDark={isDark}
        active={isEnabled}
        onClick={toggleAudio}
        title={isEnabled ? '关闭音效' : '开启音效'}
      >
        {isEnabled ? '🔊' : '🔇'}
      </AudioButton>
    </AudioControllerContainer>
  );
};

export default AudioController;
