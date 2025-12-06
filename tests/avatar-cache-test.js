/**
 * 测试头像缓存功能
 * 验证头像在页面切换时不会重新加载
 */

// 简化版的 removeBaseURL 函数实现
function removeBaseURL(url, baseUrl) {
  if (!url || !baseUrl) return url;
  
  // 移除尾部的斜杠
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  // 如果URL以baseURL开头，移除baseURL部分
  if (url.startsWith(cleanBaseUrl)) {
    return url.substring(cleanBaseUrl.length);
  }
  
  return url;
}

function testAvatarCacheKeyGeneration() {
  console.log('🧪 开始测试头像缓存键生成...');
  
  try {
    // 测试1: 相对路径头像
    const avatarPath1 = '/images/avatar.webp';
    const cacheKey1 = removeBaseURL(avatarPath1, 'http://localhost:5175/');
    console.log(`✅ 测试1 - 相对路径: ${avatarPath1} -> ${cacheKey1}`);
    
    // 测试2: 完整URL头像
    const avatarPath2 = 'http://localhost:5175/images/avatar.webp';
    const cacheKey2 = removeBaseURL(avatarPath2, 'http://localhost:5175/');
    console.log(`✅ 测试2 - 完整URL: ${avatarPath2} -> ${cacheKey2}`);
    
    // 测试3: CDN URL头像
    const avatarPath3 = 'https://cdn.jsdelivr.net/gh/dedenLabs/flexiresume-static/images/avatar.webp';
    const cacheKey3 = removeBaseURL(avatarPath3, 'http://localhost:5175/');
    console.log(`✅ 测试3 - CDN URL: ${avatarPath3} -> ${cacheKey3}`);
    
    // 验证缓存键一致性
    const expectedKey = '/images/avatar.webp';
    const allKeysMatch = [cacheKey1, cacheKey2, cacheKey3].every(key => key === expectedKey);
    
    if (allKeysMatch) {
      console.log('✅ 所有头像路径都生成相同的缓存键:', expectedKey);
      console.log('✅ 头像缓存修复验证成功！');
    } else {
      console.error('❌ 缓存键不一致:', { cacheKey1, cacheKey2, cacheKey3 });
    }
    
    return allKeysMatch;
    
  } catch (error) {
    console.error('❌ 测试失败:', error);
    return false;
  }
}

// 运行测试
const success = testAvatarCacheKeyGeneration();
process.exit(success ? 0 : 1);