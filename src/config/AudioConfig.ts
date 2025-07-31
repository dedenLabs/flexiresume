/**
 * 音频配置文件
 * 
 * 统一管理音频相关参数，支持BGM和SFX分离管理
 * 
 * @author FlexiResume Team
 * @date 2025-07-26
 */

let JACKCHEN_BUTTON_AUDIOS = [
  // 页签音效
  // "agent-01",
  // "game-01",
  // ...
  // ...Array(1).fill().map((v, i) => `btn-${String(i + 1).padStart(2, '0')}`),
]


let JACKCHEN_BGM_AUDIOS = [
  // "bgm-01",
  // "bgm-02",
  // "bgm-03",
  ...Array(3).fill().map((v, i) => `bgm-${String(i + 1).padStart(2, '0')}`),
]


// 音频类型枚举
export enum AudioType {
  BGM = 'bgm',      // 背景音乐
  SFX = 'sfx'       // 音效
}

// 音频配置接口
export interface AudioConfig {
  id: string;
  name: string;
  type: AudioType;
  file: string;
  volume: number;
  loop: boolean;
  preload: boolean;
  autoplay: boolean;
  description?: string;
  quote?: string;
}

// 页签音频映射接口
export interface TabAudioMapping {
  tabPath: string;
  tabName: string;
  bgmList: string[];     // 背景音乐列表（按顺序轮播）
  sfxList: string[];     // 音效列表
  characterId?: string;  // 关联的西游记角色
}

// 全局音频设置
export interface GlobalAudioSettings {
  enabled: boolean;
  bgmVolume: number;
  sfxVolume: number;
  requireUserInteraction: boolean;  // 是否需要用户交互后才播放
  fadeInDuration: number;           // 淡入时长（毫秒）
  fadeOutDuration: number;          // 淡出时长（毫秒）
  crossfadeDuration: number;        // 交叉淡化时长（毫秒）
}

// 西游记角色音频配置
export const JACKCHEN_BUTTON_AUDIO: AudioConfig[] = JACKCHEN_BUTTON_AUDIOS.map((audio) => {
  return {
    id: audio,
    name: audio.split('-')[0],
    type: AudioType.SFX,
    file: `./audio/jackchen/sfx/${audio}.wav`,
    volume: 0.8,
    loop: false,
    preload: true,
    autoplay: false,
    description: '角色语音',
    quote: audio
  }
});

// 背景音乐配置
export const BGM_AUDIO: AudioConfig[] = JACKCHEN_BGM_AUDIOS.map((audio) => {
  return {
    id: audio,
    name: audio.split('-')[0],
    type: AudioType.BGM,
    file: `./audio/jackchen/bgm/${audio}.mp3`,
    volume: 0.8,
    loop: false,
    preload: false,
    autoplay: true,
    description: '背景音乐',
    quote: audio
  }
});

// 页签音频映射配置
export const TAB_AUDIO_MAPPING: TabAudioMapping[] = [
  {
    tabPath: '/agent',
    tabName: 'AI工程师',
    bgmList: JACKCHEN_BGM_AUDIOS,
    sfxList: JACKCHEN_BUTTON_AUDIOS,
    characterId: 'agent'
  },
  {
    tabPath: '/fullstack',
    tabName: '全栈开发工程师',
    bgmList: JACKCHEN_BGM_AUDIOS,
    sfxList: JACKCHEN_BUTTON_AUDIOS,
    characterId: 'fullstack'
  },
  {
    tabPath: '/game',
    tabName: '游戏主程专家',
    bgmList: JACKCHEN_BGM_AUDIOS,
    sfxList: JACKCHEN_BUTTON_AUDIOS,
    characterId: 'game'
  },
  {
    tabPath: '/cto',
    tabName: '技术管理',
    bgmList: JACKCHEN_BGM_AUDIOS,
    sfxList: JACKCHEN_BUTTON_AUDIOS,
    characterId: 'cto'
  },
  {
    tabPath: '/contracttask',
    tabName: '外包任务',
    bgmList: JACKCHEN_BGM_AUDIOS,
    sfxList: JACKCHEN_BUTTON_AUDIOS,
    characterId: 'contracttask'
  }
];

// 全局音频设置
export const GLOBAL_AUDIO_SETTINGS: GlobalAudioSettings = {
  enabled: true,
  bgmVolume: 0.3,
  sfxVolume: 0.7,
  requireUserInteraction: true,
  fadeInDuration: 1000,
  fadeOutDuration: 800,
  crossfadeDuration: 1500
};

// 获取所有音频配置
export function getAllAudioConfigs(): AudioConfig[] {
  return [...JACKCHEN_BUTTON_AUDIO, ...BGM_AUDIO];
}

// 根据ID获取音频配置
export function getAudioConfigById(id: string): AudioConfig | undefined {
  return getAllAudioConfigs().find(config => config.id === id);
}

// 根据类型获取音频配置
export function getAudioConfigsByType(type: AudioType): AudioConfig[] {
  return getAllAudioConfigs().filter(config => config.type === type);
}

// 根据页签路径获取音频映射
export function getTabAudioMapping(tabPath: string): TabAudioMapping | undefined {
  return TAB_AUDIO_MAPPING.find(mapping => mapping.tabPath === tabPath);
}

// 获取页签的BGM列表
export function getTabBGMList(tabPath: string): AudioConfig[] {
  const mapping = getTabAudioMapping(tabPath);
  if (!mapping) return [];

  return mapping.bgmList
    .map(id => getAudioConfigById(id))
    .filter((config): config is AudioConfig => config !== undefined);
}

// 获取页签的SFX列表
export function getTabSFXList(tabPath: string): AudioConfig[] {
  const mapping = getTabAudioMapping(tabPath);
  if (!mapping) return [];

  return mapping.sfxList
    .map(id => getAudioConfigById(id))
    .filter((config): config is AudioConfig => config !== undefined);
}
