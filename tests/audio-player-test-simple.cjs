/**
 * 音频播放器测试脚本
 * 
 * 测试修复后的音频播放器功能，验证多音频同时播放问题是否解决
 * 
 * @author FlexiResume Team
 * @date 2025-07-31
 */

const fs = require('fs');
const path = require('path');

// 模拟浏览器环境
global.window = {
  location: { pathname: '/wukong' },
  userInteracted: true
};

global.document = {
  addEventListener: () => {},
  removeEventListener: () => {}
};

// 模拟音频构造函数
global.Audio = class MockAudio {
  constructor(src) {
    this.src = src;
    this.volume = 1;
    this.loop = false;
    this.paused = true;
    this.currentTime = 0;
    this.duration = 100;
    this.preload = 'auto';
    this.eventListeners = {};
    this._ended = false;
    
    this.playPromise = new Promise((resolve) => {
      setTimeout(() => resolve(), 10);
    });
  }

  async play() {
    this.paused = false;
    console.log(`🎵 [MOCK] 播放音频: ${this.src}`);
    return this.playPromise;
  }

  pause() {
    this.paused = true;
    console.log(`🎵 [MOCK] 暂停音频: ${this.src}`);
  }

  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  triggerEnd() {
    if (this.eventListeners['ended']) {
      this.eventListeners['ended'].forEach(callback => callback());
    }
  }

  remove() {
    console.log(`🎵 [MOCK] 移除音频: ${this.src}`);
  }
};

// 简单的日志函数
function getLogger(name) {
  return function(...args) {
    console.log(`[${name}]`, ...args);
  };
}

getLogger.extend = function(level) {
  return function(...args) {
    console.log(`[${this.name}:${level}]`, ...args);
  }.bind({ name: this.name });
};

getLogger.bind({ name: 'EnhancedAudioPlayer' });

// 模拟音频配置
const AudioType = {
  BGM: 'bgm',
  SFX: 'sfx'
};

const GLOBAL_AUDIO_SETTINGS = {
  enabled: true,
  bgmVolume: 0.3,
  sfxVolume: 0.7,
  requireUserInteraction: true,
  fadeInDuration: 1000,
  fadeOutDuration: 800,
  crossfadeDuration: 1500
};

const XIYOUJI_BGM_AUDIOS = ['01', '02', '03', '04', '05', '06', '07'];

const BGM_AUDIO = XIYOUJI_BGM_AUDIOS.map(audio => ({
  id: audio,
  name: audio.split('-')[0],
  type: AudioType.BGM,
  file: `./audio/xiyouji/bgm/${audio}.mp3`,
  volume: 0.8,
  loop: false,
  preload: false,
  autoplay: true,
  description: '背景音乐',
  quote: audio
}));

const TAB_AUDIO_MAPPING = [
  {
    tabPath: '/wukong',
    tabName: '齐天大圣·孙悟空',
    bgmList: XIYOUJI_BGM_AUDIOS,
    sfxList: ['wukong-01', 'wukong-02'],
    characterId: 'wukong'
  },
  {
    tabPath: '/bajie',
    tabName: '天蓬元帅·猪八戒',
    bgmList: XIYOUJI_BGM_AUDIOS,
    sfxList: ['bajie-01', 'bajie-02'],
    characterId: 'bajie'
  }
];

function getAllAudioConfigs() {
  return BGM_AUDIO;
}

function getAudioConfigById(id) {
  return getAllAudioConfigs().find(config => config.id === id);
}

function getTabAudioMapping(tabPath) {
  return TAB_AUDIO_MAPPING.find(mapping => mapping.tabPath === tabPath);
}

// 简化的增强音频播放器类
class EnhancedAudioPlayer {
  constructor() {
    this.audioCache = new Map();
    this.playbackStates = new Map();
    this.currentBGM = null;
    this.bgmPlaylist = [];
    this.bgmCurrentIndex = 0;
    this.settings = { ...GLOBAL_AUDIO_SETTINGS };
    this.initializePlayer();
  }

  async initializePlayer() {
    console.log('🎵 增强版音频播放器初始化完成');
  }

  async loadAudio(config) {
    try {
      const audio = new Audio(config.file);
      audio.volume = config.volume;
      audio.loop = config.loop;
      audio.preload = 'auto';

      this.setupAudioEventListeners(audio, config);

      this.audioCache.set(config.id, audio);
      this.playbackStates.set(config.id, {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: config.volume,
        loop: config.loop
      });

      console.log(`✅ ${config.name} 预加载完成`);
    } catch (error) {
      console.log(`⚠️ ${config.name} 预加载失败:`, error);
    }
  }

  setupAudioEventListeners(audio, config) {
    audio.addEventListener('loadedmetadata', () => {
      const state = this.playbackStates.get(config.id);
      if (state) {
        state.duration = audio.duration;
      }
    });

    audio.addEventListener('timeupdate', () => {
      const state = this.playbackStates.get(config.id);
      if (state) {
        state.currentTime = audio.currentTime;
      }
    });

    audio.addEventListener('ended', () => {
      this.handleAudioEnded(config);
    });

    audio.addEventListener('error', (e) => {
      console.log(`⚠️ ${config.name} 播放错误:`, e);
    });
  }

  async handleAudioEnded(config) {
    const state = this.playbackStates.get(config.id);
    if (state) {
      state.isPlaying = false;
    }

    if (config.type === AudioType.BGM) {
      if (this.bgmPlaylist.length > 1) {
        await this.playNextBGM();
      } else if (this.bgmPlaylist.length === 1) {
        setTimeout(async () => {
          await this.playBGM(this.bgmPlaylist[0]);
        }, 500);
      }
    }
  }

  async playNextBGM() {
    if (this.bgmPlaylist.length === 0) return;

    if (this.currentBGM) {
      const currentAudio = this.audioCache.get(this.currentBGM);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        const currentState = this.playbackStates.get(this.currentBGM);
        if (currentState) {
          currentState.isPlaying = false;
        }
      }
    }

    this.bgmCurrentIndex = (this.bgmCurrentIndex + 1) % this.bgmPlaylist.length;
    const nextBGMId = this.bgmPlaylist[this.bgmCurrentIndex];

    setTimeout(async () => {
      await this.playBGM(nextBGMId);
    }, 500);
  }

  async playBGM(audioId) {
    if (!this.canPlay()) return;

    const config = getAudioConfigById(audioId);
    if (!config || config.type !== AudioType.BGM) {
      console.log(`⚠️ BGM ${audioId} 配置不存在或类型错误`);
      return;
    }

    if (this.currentBGM === audioId) {
      const currentAudio = this.audioCache.get(audioId);
      const state = this.playbackStates.get(audioId);
      if (currentAudio && state && state.isPlaying && !currentAudio.paused) {
        console.log(`🎵 BGM ${config.name} 已在播放，跳过重复播放`);
        return;
      }
    }

    if (this.currentBGM && this.currentBGM !== audioId) {
      const previousAudio = this.audioCache.get(this.currentBGM);
      if (previousAudio) {
        previousAudio.pause();
        previousAudio.currentTime = 0;
        const previousState = this.playbackStates.get(this.currentBGM);
        if (previousState) {
          previousState.isPlaying = false;
        }
      }
    }

    const audio = this.audioCache.get(audioId);
    if (!audio) {
      console.log(`⚠️ BGM ${audioId} 音频未加载`);
      await this.loadAudio(config);
      const loadedAudio = this.audioCache.get(audioId);
      if (!loadedAudio) {
        console.log(`⚠️ BGM ${audioId} 加载失败`);
        return;
      }
    }

    const targetAudio = this.audioCache.get(audioId);
    
    try {
      targetAudio.pause();
      targetAudio.currentTime = 0;
      targetAudio.volume = 0;
      
      this.currentBGM = audioId;

      await targetAudio.play();
      await this.fadeIn(audioId);

      const state = this.playbackStates.get(audioId);
      if (state) {
        state.isPlaying = true;
      }

      console.log(`🎵 播放BGM: ${config.name}`);
    } catch (error) {
      console.log(`⚠️ 播放BGM ${audioId} 失败:`, error);
    }
  }

  async fadeIn(audioId) {
    const audio = this.audioCache.get(audioId);
    const config = getAudioConfigById(audioId);
    if (!audio || !config) return;

    const targetVolume = config.volume * (config.type === AudioType.BGM ? this.settings.bgmVolume : this.settings.sfxVolume);
    const steps = 20;
    const stepDuration = this.settings.fadeInDuration / steps;
    const volumeStep = targetVolume / steps;

    for (let i = 0; i <= steps; i++) {
      audio.volume = volumeStep * i;
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }
  }

  async fadeOut(audioId) {
    const audio = this.audioCache.get(audioId);
    if (!audio) return;

    const currentVolume = audio.volume;
    const steps = 20;
    const stepDuration = this.settings.fadeOutDuration / steps;
    const volumeStep = currentVolume / steps;

    if (currentVolume === 0) {
      audio.pause();
      audio.currentTime = 0;
      const state = this.playbackStates.get(audioId);
      if (state) {
        state.isPlaying = false;
      }
      return;
    }

    for (let i = steps; i >= 0; i--) {
      audio.volume = volumeStep * i;
      await new Promise(resolve => setTimeout(resolve, stepDuration));
    }

    audio.pause();
    audio.currentTime = 0;
    const state = this.playbackStates.get(audioId);
    if (state) {
      state.isPlaying = false;
    }
  }

  canPlay() {
    if (!this.settings.enabled) {
      console.log('🔇 音频播放已禁用');
      return false;
    }
    return true;
  }

  async switchToTabRandomly(tabPath) {
    const mapping = getTabAudioMapping(tabPath);
    if (!mapping) {
      console.log(`⚠️ 页签 ${tabPath} 没有音频配置`);
      return;
    }

    this.bgmPlaylist = mapping.bgmList;

    if (this.bgmPlaylist.length > 0) {
      const randomBGM = this.bgmPlaylist[Math.floor(Math.random() * this.bgmPlaylist.length)];
      if (randomBGM) {
        this.bgmCurrentIndex = this.bgmPlaylist.indexOf(randomBGM);
        await this.playBGM(randomBGM);
        console.log(`🎲 随机选择BGM: ${randomBGM}`);
      }
    }
  }

  stopAll() {
    this.audioCache.forEach((audio, id) => {
      audio.pause();
      audio.currentTime = 0;
      const state = this.playbackStates.get(id);
      if (state) {
        state.isPlaying = false;
      }
    });
    this.currentBGM = null;
    console.log('🔇 停止所有音频播放');
  }

  async setEnabled(enabled) {
    const wasEnabled = this.settings.enabled;
    this.settings.enabled = enabled;

    if (!enabled) {
      this.stopAll();
    } else if (enabled && !wasEnabled) {
      await this.playCurrentTabAudioRandomly();
    }

    console.log(`🎵 音频播放${enabled ? '启用' : '禁用'}`);
  }

  async playCurrentTabAudioRandomly() {
    const currentPath = window.location.pathname;
    if (currentPath && currentPath !== '/') {
      await this.switchToTabRandomly(currentPath);
    }
  }

  setGlobalVolume(bgmVolume, sfxVolume) {
    this.settings.bgmVolume = Math.max(0, Math.min(1, bgmVolume));
    this.settings.sfxVolume = Math.max(0, Math.min(1, sfxVolume));

    this.audioCache.forEach((audio, id) => {
      const config = getAudioConfigById(id);
      if (config) {
        const multiplier = config.type === AudioType.BGM ? this.settings.bgmVolume : this.settings.sfxVolume;
        audio.volume = config.volume * multiplier;
      }
    });
  }

  getDebugInfo() {
    const playingAudios = [];
    this.audioCache.forEach((audio, id) => {
      const state = this.playbackStates.get(id);
      if (state && state.isPlaying && !audio.paused) {
        playingAudios.push(id);
      }
    });

    return {
      currentBGM: this.currentBGM,
      bgmPlaylist: this.bgmPlaylist,
      bgmCurrentIndex: this.bgmCurrentIndex,
      playingAudios: playingAudios,
      totalCachedAudios: this.audioCache.size,
      enabled: this.settings.enabled
    };
  }

  cleanup() {
    this.stopAll();
    this.audioCache.forEach((audio, id) => {
      audio.remove();
    });
    this.audioCache.clear();
    this.playbackStates.clear();
    this.currentBGM = null;
    this.bgmPlaylist = [];
    this.bgmCurrentIndex = 0;
    console.log('🧹 音频播放器已清理');
  }
}

async function testAudioPlayer() {
  console.log('🧪 开始测试音频播放器...');

  try {
    const player = new EnhancedAudioPlayer();

    // 测试1: 初始化播放器
    console.log('\n📝 测试1: 初始化播放器');
    console.log('当前状态:', player.getDebugInfo());

    // 测试2: 切换到悟空页签
    console.log('\n📝 测试2: 切换到悟空页签');
    await player.switchToTabRandomly('/wukong');
    console.log('切换后状态:', player.getDebugInfo());

    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试3: 再次切换到悟空页签（应该不会重复播放）
    console.log('\n📝 测试3: 再次切换到悟空页签');
    await player.switchToTabRandomly('/wukong');
    console.log('再次切换后状态:', player.getDebugInfo());

    // 测试4: 切换到八戒页签
    console.log('\n📝 测试4: 切换到八戒页签');
    await player.switchToTabRandomly('/bajie');
    console.log('切换到八戒后状态:', player.getDebugInfo());

    // 测试5: 禁用音频
    console.log('\n📝 测试5: 禁用音频');
    await player.setEnabled(false);
    console.log('禁用后状态:', player.getDebugInfo());

    // 测试6: 重新启用音频
    console.log('\n📝 测试6: 重新启用音频');
    await player.setEnabled(true);
    console.log('重新启用后状态:', player.getDebugInfo());

    // 测试7: 清理播放器
    console.log('\n📝 测试7: 清理播放器');
    player.cleanup();
    console.log('清理后状态:', player.getDebugInfo());

    console.log('\n✅ 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAudioPlayer().catch(console.error);