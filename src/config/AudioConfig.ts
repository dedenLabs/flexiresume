/**
 * 音频配置文件
 * 
 * 统一管理音频相关参数，支持BGM和SFX分离管理
 * 
 * @author FlexiResume Team
 * @date 2025-07-26
 */

let XIYOUJI_CHARACTER_AUDIOS = [
  // 唐僧
  // "tangseng-01",
  // "tangseng-02",
  // ...
  ...Array(4).fill().map((v, i) => `tangseng-${String(i + 1).padStart(2, '0')}`),
  // 悟空
  // "wukong-01",
  // "wukong-02",
  // ...
  ...Array(10).fill().map((v, i) => `wukong-${String(i + 1).padStart(2, '0')}`),
  // 八戒
  // "bajie-01",
  // "bajie-02",
  // ...
  ...Array(9).fill().map((v, i) => `bajie-${String(i + 1).padStart(2, '0')}`),
  // 悟净
  // "wujing-01",
  // "wujing-02",
  // ...
  ...Array(1).fill().map((v, i) => `wujing-${String(i + 1).padStart(2, '0')}`),
]


let XIYOUJI_BGM_AUDIOS = [
  // "01",
  // "02",
  // "03",
  ...Array(7).fill().map((v, i) => `${String(i + 1).padStart(2, '0')}`),
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
export const XIYOUJI_CHARACTER_AUDIO: AudioConfig[] = XIYOUJI_CHARACTER_AUDIOS.map((audio) => {
  return {
    id: audio,
    name: audio.split('-')[0],
    type: AudioType.SFX,
    file: `./audio/xiyouji/${audio}.mp3`,
    volume: 0.8,
    loop: false,
    preload: true,
    autoplay: false,
    description: '角色语音',
    quote: audio
  }
});

// 背景音乐配置
export const BGM_AUDIO: AudioConfig[] = XIYOUJI_BGM_AUDIOS.map((audio) => {
  return {
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
  }
});

// 页签音频映射配置
export const TAB_AUDIO_MAPPING: TabAudioMapping[] = [
  {
    tabPath: '/xuanzang',
    tabName: '唐僧·陈玄奘',
    bgmList: XIYOUJI_BGM_AUDIOS,
    sfxList: XIYOUJI_CHARACTER_AUDIOS.filter(audio => audio.startsWith('tangseng')),
    characterId: 'xuanzang'
  },
  {
    tabPath: '/wukong',
    tabName: '齐天大圣·孙悟空',
    bgmList: XIYOUJI_BGM_AUDIOS,
    sfxList: XIYOUJI_CHARACTER_AUDIOS.filter(audio => audio.startsWith('wukong')),
    characterId: 'wukong'
  },
  {
    tabPath: '/bajie',
    tabName: '天蓬元帅·猪八戒',
    bgmList: XIYOUJI_BGM_AUDIOS,
    sfxList: XIYOUJI_CHARACTER_AUDIOS.filter(audio => audio.startsWith('bajie')),
    characterId: 'bajie'
  },
  {
    tabPath: '/wujing',
    tabName: '卷帘大将·沙悟净',
    bgmList: XIYOUJI_BGM_AUDIOS,
    sfxList: XIYOUJI_CHARACTER_AUDIOS.filter(audio => audio.startsWith('wujing')),
    characterId: 'wujing'
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
  return [...XIYOUJI_CHARACTER_AUDIO, ...BGM_AUDIO];
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
