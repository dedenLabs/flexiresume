/**
 * 音频播放器测试脚本
 * 
 * 测试修复后的音频播放器功能，验证多音频同时播放问题是否解决
 * 
 * @author FlexiResume Team
 * @date 2025-07-31
 */

import { enhancedAudioPlayer } from '../src/utils/EnhancedAudioPlayer';
import { getTabAudioMapping } from '../src/config/AudioConfig';

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
    this.playPromise = new Promise((resolve) => {
      setTimeout(() => resolve(), 10);
    });
    this._ended = false;
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

  // 模拟音频结束
  triggerEnd() {
    if (this.eventListeners['ended']) {
      this.eventListeners['ended'].forEach(callback => callback());
    }
  }

  remove() {
    console.log(`🎵 [MOCK] 移除音频: ${this.src}`);
  }
};

async function testAudioPlayer() {
  console.log('🧪 开始测试音频播放器...');

  try {
    // 测试1: 初始化播放器
    console.log('\n📝 测试1: 初始化播放器');
    console.log('当前状态:', enhancedAudioPlayer.getDebugInfo());

    // 测试2: 切换到悟空页签
    console.log('\n📝 测试2: 切换到悟空页签');
    await enhancedAudioPlayer.switchToTabRandomly('/wukong');
    console.log('切换后状态:', enhancedAudioPlayer.getDebugInfo());

    // 等待一段时间
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 测试3: 再次切换到悟空页签（应该不会重复播放）
    console.log('\n📝 测试3: 再次切换到悟空页签');
    await enhancedAudioPlayer.switchToTabRandomly('/wukong');
    console.log('再次切换后状态:', enhancedAudioPlayer.getDebugInfo());

    // 测试4: 切换到八戒页签
    console.log('\n📝 测试4: 切换到八戒页签');
    await enhancedAudioPlayer.switchToTabRandomly('/bajie');
    console.log('切换到八戒后状态:', enhancedAudioPlayer.getDebugInfo());

    // 测试5: 禁用音频
    console.log('\n📝 测试5: 禁用音频');
    await enhancedAudioPlayer.setEnabled(false);
    console.log('禁用后状态:', enhancedAudioPlayer.getDebugInfo());

    // 测试6: 重新启用音频
    console.log('\n📝 测试6: 重新启用音频');
    await enhancedAudioPlayer.setEnabled(true);
    console.log('重新启用后状态:', enhancedAudioPlayer.getDebugInfo());

    // 测试7: 清理播放器
    console.log('\n📝 测试7: 清理播放器');
    enhancedAudioPlayer.cleanup();
    console.log('清理后状态:', enhancedAudioPlayer.getDebugInfo());

    console.log('\n✅ 所有测试完成！');

  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

// 运行测试
testAudioPlayer().catch(console.error);

export { testAudioPlayer };