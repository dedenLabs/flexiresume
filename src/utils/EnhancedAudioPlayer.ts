/**
 * 增强版音频播放器
 * 
 * 支持BGM和SFX分离管理，配置化参数，页签音频关联
 * 
 * @author FlexiResume Team
 * @date 2025-07-26
*/

import {
  AudioType,
  AudioConfig,
  TabAudioMapping,
  GLOBAL_AUDIO_SETTINGS,
  getAllAudioConfigs,
  getAudioConfigById,
  getTabAudioMapping,
  getTabBGMList,
  getTabSFXList
} from '../config/AudioConfig';
import { getLogger } from './Logger';
import { cdnManager } from './CDNManager';
import { getCDNConfig } from '../config/ProjectConfig';
import { removeBaseURL } from './URLPathJoiner';

const logEnhancedAudioPlayer = getLogger('EnhancedAudioPlayer');

// 音频播放状态
interface AudioPlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  loop: boolean;
}

// 音频重试状态
interface AudioRetryState {
  retryCount: number;
  cdnIndex: number;
  maxRetries: number;
  enableCDNFallback: boolean;
}

// 增强版音频播放器类
export class EnhancedAudioPlayer {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private playbackStates: Map<string, AudioPlaybackState> = new Map();
  private retryStates: Map<string, AudioRetryState> = new Map();
  private currentBGM: string | null = null;
  private bgmPlaylist: string[] = [];
  private bgmCurrentIndex: number = 0;
  private settings = { ...GLOBAL_AUDIO_SETTINGS };

  constructor() {
    this.initializePlayer();
  }

  /**
   * 初始化播放器
   */
  private async initializePlayer(): Promise<void> {
    // 监听用户首次交互
    this.setupUserInteractionListener();

    // 预加载音频文件
    await this.preloadAudio();

    // 调试日志已移除: console.log('🎵 增强版音频播放器初始化完成');
  }

  /**
   * 设置用户交互监听器
   */
  private setupUserInteractionListener(): void {
    // 预加载一个音频文件，以便在用户首次交互时播放
    this.playCurrentTabAudioRandomly();
    const handleFirstInteraction = () => {
      if (!this.settings.requireUserInteraction) return;
      window.userInteracted = true;
      logEnhancedAudioPlayer('🎵 用户首次交互，音频播放已启用');

      // 用户首次交互后，主动播放当前页签的背景音乐和音效
      this.playBGM(this.getCurrentBGM());

      // 移除监听器
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
  }


  /**
   * 预加载音频文件
   */
  private async preloadAudio(): Promise<void> {
    const configs = getAllAudioConfigs().filter(config => config.preload);

    for (const config of configs) {
      if (!config.preload) continue;
      this.loadAudio(config);
    }
  }
  private async loadAudio(config: AudioConfig): Promise<void> {
    try {
      // 创建重试状态
      const retryState: AudioRetryState = {
        retryCount: 0,
        cdnIndex: 0,
        maxRetries: 3,
        enableCDNFallback: true
      };
      this.retryStates.set(config.id, retryState);

      // 创建带CDN支持的音频元素
      const audio = this.createAudioWithCDN(config, 0);
      if (!audio) {
        logEnhancedAudioPlayer.extend('error')(`❌ ${config.name} 音频创建失败`);
        return;
      }

      // 监听事件
      this.setupAudioEventListeners(audio, config);

      this.audioCache.set(config.id, audio);
      this.playbackStates.set(config.id, {
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: config.volume,
        loop: config.loop
      });

      // 调试日志已移除: console.log(`✅ ${config.name} 预加载完成`);
    } catch (error) {
      logEnhancedAudioPlayer.extend('warn')(`⚠️ ${config.name} 预加载失败:`, error);
    }
  }

  /**
   * 设置音频事件监听器
   */
  private setupAudioEventListeners(audio: HTMLAudioElement, config: AudioConfig): void {
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
      this.handleAudioError(config, e);
    });
  }

  /**
   * 处理音频播放结束
   */
  private async handleAudioEnded(config: AudioConfig): Promise<void> {
    const state = this.playbackStates.get(config.id);
    if (state) {
      state.isPlaying = false;
    }

    // 重置重试状态
    const retryState = this.retryStates.get(config.id);
    if (retryState) {
      retryState.retryCount = 0;
      retryState.cdnIndex = 0;
    }

    // 如果是BGM，智能处理播放列表
    if (config.type === AudioType.BGM) {
      if (this.bgmPlaylist.length > 1) {
        // 多首BGM时播放下一首
        await this.playNextBGM();
      } else if (this.bgmPlaylist.length === 1) {
        // 只有一首BGM时重播
        setTimeout(async () => {
          await this.playBGM(this.bgmPlaylist[0]);
        }, 500); // 短暂间隔后重播
      }
    }
  }

  /**
   * 处理音频加载错误
   */
  private handleAudioError(config: AudioConfig, error: Event): void {
    const retryState = this.retryStates.get(config.id);
    if (!retryState) {
      logEnhancedAudioPlayer.extend('warn')(`⚠️ ${config.name} 加载错误:`, error);
      return;
    }

    logEnhancedAudioPlayer.extend('warn')(`⚠️ ${config.name} 加载错误 (重试 ${retryState.retryCount + 1}/${retryState.maxRetries})`);
    
    if (this.tryNextSource(config, retryState)) {
      return;
    }

    logEnhancedAudioPlayer.extend('error')(`❌ ${config.name} 所有重试失败`);
  }

  /**
   * 尝试下一个音频源（简化版）
   */
  private tryNextSource(config: AudioConfig, retryState: AudioRetryState): boolean {
    const cdnConfig = getCDNConfig();
    
    // 如果没有CDN配置或禁用降级，直接返回失败
    if (!retryState.enableCDNFallback || cdnConfig.baseUrls.length === 0) {
      return false;
    }

    // 计算当前尝试的源索引
    const totalSources = cdnConfig.baseUrls.length;
    const currentSourceIndex = retryState.retryCount * totalSources + retryState.cdnIndex;
    
    // 如果还有更多源可以尝试
    if (currentSourceIndex < totalSources * retryState.maxRetries) {
      retryState.cdnIndex = (retryState.cdnIndex + 1) % totalSources;
      if (retryState.cdnIndex === 0) {
        retryState.retryCount++;
      }
      
      // 延迟重试
      setTimeout(() => {
        const newAudio = this.createAudioWithCDN(config, retryState.cdnIndex);
        if (newAudio) {
          // 替换音频元素
          const oldAudio = this.audioCache.get(config.id);
          if (oldAudio) {
            oldAudio.remove();
          }
          
          this.audioCache.set(config.id, newAudio);
          this.setupAudioEventListeners(newAudio, config);
          
          logEnhancedAudioPlayer(`🔄 重试 ${retryState.retryCount}/${retryState.maxRetries}, CDN ${retryState.cdnIndex + 1}: ${config.name}`);
        }
      }, 1000 * retryState.retryCount);
      
      return true;
    }

    return false;
  }

  /**
   * 创建带CDN支持的音频元素（简化版）
   */
  private createAudioWithCDN(config: AudioConfig, cdnIndex: number = 0): HTMLAudioElement | null {
    const cdnConfig = getCDNConfig();
    let audioUrl: string;
    
    if (cdnConfig.enabled && cdnConfig.baseUrls.length > 0 && cdnIndex < cdnConfig.baseUrls.length) {
      // 使用指定的CDN
      const baseUrl = cdnConfig.baseUrls[cdnIndex];
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
      const relativePath = removeBaseURL(config.file, cdnManager.getProjectBasePath());
      const cleanResourcePath = relativePath.startsWith('./') ? relativePath.slice(2) : relativePath;
      
      audioUrl = `${cleanBaseUrl}/${cleanResourcePath}`;
    } else {
      // 降级到本地文件
      audioUrl = config.file;
    }

    logEnhancedAudioPlayer(`🌐 使用音频源: ${audioUrl}`);

    try {
      const audio = new Audio(audioUrl);
      audio.volume = config.volume;
      audio.loop = config.loop;
      audio.preload = 'auto';
      return audio;
    } catch (error) {
      logEnhancedAudioPlayer.extend('error')(`❌ 创建音频失败: ${audioUrl}`, error);
      return null;
    }
  }
  private async playNextBGM(): Promise<void> {
    if (this.bgmPlaylist.length === 0) return;

    // 先停止当前播放的BGM
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

    // 更新索引
    this.bgmCurrentIndex = (this.bgmCurrentIndex + 1) % this.bgmPlaylist.length;
    const nextBGMId = this.bgmPlaylist[this.bgmCurrentIndex];

    // 短暂延迟后播放下一首
    setTimeout(async () => {
      await this.playBGM(nextBGMId);
    }, 500);
  }

  /**
   * 播放BGM
   */
  public async playBGM(audioId: string): Promise<void> {
    if (!this.canPlay()) return;

    const config = getAudioConfigById(audioId);
    if (!config || config.type !== AudioType.BGM) {
      logEnhancedAudioPlayer.extend('warn')(`⚠️ BGM ${audioId} 配置不存在或类型错误`);
      return;
    }

    // 如果当前正在播放相同的BGM且未暂停，则不重新开始播放
    if (this.currentBGM === audioId) {
      const currentAudio = this.audioCache.get(audioId);
      const state = this.playbackStates.get(audioId);
      if (currentAudio && state && state.isPlaying && !currentAudio.paused) {
        logEnhancedAudioPlayer(`🎵 BGM ${config.name} 已在播放，跳过重复播放`);
        return;
      }
    }

    // 立即停止当前BGM（如果是不同的BGM）
    if (this.currentBGM && this.currentBGM !== audioId) {
      const previousAudio = this.audioCache.get(this.currentBGM);
      if (previousAudio) {
        // 立即暂停并重置，而不是等待淡出完成
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
      logEnhancedAudioPlayer.extend('warn')(`⚠️ BGM ${audioId} 音频未加载`);
      await this.loadAudio(config);
      const loadedAudio = this.audioCache.get(audioId);
      if (!loadedAudio) {
        logEnhancedAudioPlayer.extend('warn')(`⚠️ BGM ${audioId} 加载失败`);
        return;
      }
    }

    const targetAudio = this.audioCache.get(audioId)!;
    
    try {
      // 先重置音频状态
      targetAudio.pause();
      targetAudio.currentTime = 0;
      targetAudio.volume = 0; // 从零音量开始
      
      // 更新当前BGM引用
      this.currentBGM = audioId;

      await targetAudio.play();
      await this.fadeIn(audioId);

      const state = this.playbackStates.get(audioId);
      if (state) {
        state.isPlaying = true;
      }

      logEnhancedAudioPlayer(`🎵 播放BGM: ${config.name}`);
    } catch (error) {
      logEnhancedAudioPlayer.extend('warn')(`⚠️ 播放BGM ${audioId} 失败:`, error);
    }
  }

  /**
   * 播放SFX
   */
  public async playSFX(audioId: string): Promise<void> {
    // 调试日志已移除: console.log(`🎵 [DEBUG] playSFX调用: ${audioId}`);

    if (!this.canPlay()) {
      // 调试日志已移除: console.log(`🔇 [DEBUG] playSFX被canPlay()阻止`);
      return;
    }

    const config = getAudioConfigById(audioId);
    if (!config || config.type !== AudioType.SFX) {
      // 调试日志已移除: console.warn(`⚠️ [DEBUG] SFX ${audioId} 配置不存在或类型错误`);
      return;
    }

    // 调试日志已移除: console.log(`🎵 [DEBUG] SFX配置找到: ${config.name}, 文件: ${config.url}`);

    const audio = this.audioCache.get(audioId);
    if (!audio) {
      // 调试日志已移除: console.warn(`⚠️ [DEBUG] SFX ${audioId} 音频未加载`);
      this.loadAudio(config);
    }

    // 调试日志已移除: console.log(`🎵 [DEBUG] 音频元素获取成功`);

    try {
      audio.currentTime = 0;
      audio.volume = config.volume * this.settings.sfxVolume;
      // 调试日志已移除: console.log(`🎵 [DEBUG] 设置音量: ${audio.volume} (配置: ${config.volume}, 全局: ${this.settings.sfxVolume})`);

      // 调试日志已移除: console.log(`🎵 [DEBUG] 开始播放音频...`);
      await audio.play();
      // 调试日志已移除: console.log(`🎵 [DEBUG] 音频播放成功!`);

      const state = this.playbackStates.get(audioId);
      if (state) {
        state.isPlaying = true;
      }

      logEnhancedAudioPlayer(`🎵 播放SFX: ${config.name} - "${config.quote || ''}"`);
    } catch (error) {
      // 调试日志已移除: console.error(`❌ [DEBUG] SFX播放失败: ${audioId}`, error);
    }
  }

  /**
   * 切换到指定页签的音频
   */
  public async switchToTab(tabPath: string): Promise<void> {
    const mapping = getTabAudioMapping(tabPath);
    if (!mapping) {
      logEnhancedAudioPlayer(`⚠️ 页签 ${tabPath} 没有音频配置`);
      return;
    }

    // 调试日志已移除: console.log(`🎵 切换到页签: ${mapping.tabName} (${tabPath})`);

    // 设置BGM播放列表
    this.bgmPlaylist = mapping.bgmList;
    this.bgmCurrentIndex = 0;

    // 智能播放BGM逻辑
    if (this.bgmPlaylist.length > 0) {
      const targetBGM = this.bgmPlaylist[0];

      // 如果当前BGM正在播放且是目标BGM，则不重新播放
      if (this.currentBGM === targetBGM) {
        const currentAudio = this.audioCache.get(targetBGM);
        const state = this.playbackStates.get(targetBGM);
        if (currentAudio && state && state.isPlaying && !currentAudio.paused) {
          // 调试日志已移除: console.log(`🎵 BGM已在播放，无需切换`);
        } else {
          // 如果BGM暂停或停止，则重新播放
          await this.playBGM(targetBGM);
        }
      } else {
        // 切换到新的BGM
        await this.playBGM(targetBGM);
      }
    }

    // 播放角色语音SFX（如果用户已交互且音频启用）
    if (mapping.sfxList.length > 0 && this.canPlay()) {
      // 延迟播放SFX，避免与BGM冲突
      setTimeout(() => {
        this.playSFX(mapping.sfxList[0]);
      }, 1000);
    }
  }

  /**
   * 切换到指定页签的音频（随机选择）
   */
  public async switchToTabRandomly(tabPath: string): Promise<void> {
    // 调试日志已移除: console.log(`🎵 [DEBUG] 页签切换音频播放开始: ${tabPath}`);

    const mapping = getTabAudioMapping(tabPath);
    if (!mapping) {
      // 调试日志已移除: console.log(`⚠️ [DEBUG] 页签 ${tabPath} 没有音频配置`);
      return;
    }

    // 调试日志已移除: console.log(`🎵 [DEBUG] 找到页签音频配置: ${mapping.tabName} (${tabPath})`);
    // 调试日志已移除: console.log(`🎵 [DEBUG] BGM列表:`, mapping.bgmList);
    // 调试日志已移除: console.log(`🎵 [DEBUG] SFX列表:`, mapping.sfxList);

    // 设置BGM播放列表
    this.bgmPlaylist = mapping.bgmList;

    // 随机播放BGM
    if (this.bgmPlaylist.length > 0) {
      const randomBGM = this.getRandomElement(this.bgmPlaylist);
      if (randomBGM) {
        // 更新当前索引为随机选择的BGM
        this.bgmCurrentIndex = this.bgmPlaylist.indexOf(randomBGM);
        // 调试日志已移除: console.log(`🎵 [DEBUG] 准备播放BGM: ${randomBGM}`);
        await this.playBGM(randomBGM);
        logEnhancedAudioPlayer(`🎲 随机选择BGM: ${randomBGM}`);
      }
    }

    // 页签切换时必定播放随机音效（如果用户已交互且音频启用）
    // 调试日志已移除: console.log(`🎵 [DEBUG] 准备播放页签音效`);
    this.playRandomSFXForTab(mapping);
  }

  /**
   * 为页签播放随机音效（必定播放）
   */
  private playRandomSFXForTab(mapping: TabAudioMapping): void {
    // 调试日志已移除: console.log(`🎵 [DEBUG] 页签音效播放检查开始`);
    // 调试日志已移除: console.log(`🎵 [DEBUG] SFX列表长度: ${mapping.sfxList.length}`);
    // 调试日志已移除: console.log(`🎵 [DEBUG] SFX列表内容:`, mapping.sfxList);
    // 调试日志已移除: console.log(`🎵 [DEBUG] canPlay()结果: ${this.canPlay()}`);
    // 调试日志已移除: console.log(`🎵 [DEBUG] 音频启用状态: ${this.settings.enabled}`);
    // 调试日志已移除: console.log(`🎵 [DEBUG] 用户交互状态: ${window.userInteracted}`);
    // 调试日志已移除: console.log(`🎵 [DEBUG] 需要用户交互: ${this.settings.requireUserInteraction}`);

    if (mapping.sfxList.length > 0 && this.canPlay()) {
      const randomSFX = this.getRandomElement(mapping.sfxList);
      // 调试日志已移除: console.log(`🎲 [DEBUG] 随机选择的SFX: ${randomSFX}`);

      if (randomSFX) {
        // 延迟播放SFX，避免与BGM冲突
        setTimeout(() => {
          // 调试日志已移除: console.log(`🎵 [DEBUG] 开始播放SFX: ${randomSFX}`);
          this.playSFX(randomSFX);
          // 调试日志已移除: console.log(`🎲 页签切换必定播放随机SFX: ${randomSFX}`);
        }, 1000);
      } else {
        // 调试日志已移除: console.warn(`⚠️ [DEBUG] 随机选择SFX失败`);
      }
    } else {
      // 调试日志已移除: console.warn(`⚠️ [DEBUG] 页签音效播放条件不满足`);
      if (mapping.sfxList.length === 0) {
        // 调试日志已移除: console.warn(`⚠️ [DEBUG] SFX列表为空`);
      }
      if (!this.canPlay()) {
        // 调试日志已移除: console.warn(`⚠️ [DEBUG] canPlay()返回false`);
      }
    }
  }

  /**
   * 检查是否可以播放
   */
  private canPlay(): boolean {
    if (!this.settings.enabled) {
      logEnhancedAudioPlayer('🔇 音频播放已禁用');
      return false;
    }

    // if (this.settings.requireUserInteraction && !window.userInteracted) {
    //   logEnhancedAudioPlayer('🔇 等待用户交互后播放音频');
    //   return false;
    // }

    return true;
  }

  /**
   * 淡入效果
   */
  private async fadeIn(audioId: string): Promise<void> {
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

  /**
   * 淡出效果
   */
  private async fadeOut(audioId: string): Promise<void> {
    const audio = this.audioCache.get(audioId);
    if (!audio) return;

    const currentVolume = audio.volume;
    const steps = 20;
    const stepDuration = this.settings.fadeOutDuration / steps;
    const volumeStep = currentVolume / steps;

    // 如果音量已经是0，直接停止
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

    // 确保音频完全停止
    audio.pause();
    audio.currentTime = 0;
    const state = this.playbackStates.get(audioId);
    if (state) {
      state.isPlaying = false;
    }
  }

  /**
   * 停止所有音频
   */
  public stopAll(): void {
    this.stopAllBGM();
    this.stopAllSFX();
  }

  /**
   * 停止所有音效
   */
  public stopAllSFX(): void {
    this.stopAudio(AudioType.SFX);
  }

  /**
   * 停止所有背景音乐
   */
  public stopAllBGM(): void {
    this.stopAudio(AudioType.BGM);
  }
  private stopAudio(type: AudioType): void {
    this.audioCache.forEach((audio, id) => {
      const config = getAudioConfigById(id);
      if (config && config.type === type) {
        audio.pause();
        audio.currentTime = 0;
        const state = this.playbackStates.get(id);
        if (state) {
          state.isPlaying = false;
        }
      }
    });
    if (type === AudioType.BGM) {
      this.currentBGM = null;
      logEnhancedAudioPlayer('🔇 停止所有背景音乐播放');
    } else {
      logEnhancedAudioPlayer('🔇 停止所有音效播放');
    }
  }

  /**
   * 设置全局音量
   */
  public setGlobalVolume(bgmVolume: number, sfxVolume: number): void {
    this.settings.bgmVolume = Math.max(0, Math.min(1, bgmVolume));
    this.settings.sfxVolume = Math.max(0, Math.min(1, sfxVolume));

    // 更新当前播放的音频音量
    this.audioCache.forEach((audio, id) => {
      const config = getAudioConfigById(id);
      if (config) {
        const multiplier = config.type === AudioType.BGM ? this.settings.bgmVolume : this.settings.sfxVolume;
        audio.volume = config.volume * multiplier;
      }
    });
  }

  /**
   * 启用/禁用音频
   */
  public async setEnabled(enabled: boolean): Promise<void> {
    const wasEnabled = this.settings.enabled;
    this.settings.enabled = enabled;

    if (!enabled) {
      this.stopAll();
    } else if (enabled && !wasEnabled) {
      // 从禁用状态重新启用时，重新播放当前页签的音频（随机选择）
      await this.playCurrentTabAudioRandomly();
    }

    logEnhancedAudioPlayer(`🎵 音频播放${enabled ? '启用' : '禁用'}`);
  }

  /**
   * 重新播放当前页签音频（随机选择）
   */
  private async playCurrentTabAudioRandomly(): Promise<void> {
    // 获取当前路径
    const currentPath = window.location.pathname;

    if (currentPath && currentPath !== '/') {
      await this.switchToTabRandomly(currentPath);
    }
  }

  /**
   * 随机选择数组中的元素
   */
  private getRandomElement<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }

  /**
   * 获取播放状态
   */
  public getPlaybackState(audioId: string): AudioPlaybackState | undefined {
    return this.playbackStates.get(audioId);
  }

  /**
   * 获取当前BGM
   */
  public getCurrentBGM(): string | null {
    return this.currentBGM;
  }

  /**
   * 清理所有音频实例（防止内存泄漏）
   */
  public cleanup(): void {
    this.stopAll();
    this.audioCache.forEach((audio, id) => {
      audio.remove();
    });
    this.audioCache.clear();
    this.playbackStates.clear();
    this.retryStates.clear();
    this.currentBGM = null;
    this.bgmPlaylist = [];
    this.bgmCurrentIndex = 0;
    logEnhancedAudioPlayer('🧹 音频播放器已清理');
  }

  /**
   * 获取当前播放状态（用于调试）
   */
  public getDebugInfo(): any {
    const playingAudios: string[] = [];
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
}

// 全局增强版音频播放器实例
export const enhancedAudioPlayer = new EnhancedAudioPlayer();

/**
 * 播放页签对应的音频（兼容旧接口）
 */
export async function playPathAudio(path: string): Promise<void> {
  await enhancedAudioPlayer.switchToTab(path);
}

// 导出类型和配置
// export { AudioType, AudioConfig, TabAudioMapping } from '../config/AudioConfig';
