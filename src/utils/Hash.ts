/**
 * 将字符串转换为唯一的短ID
 * @param content 输入字符串
 * @param length 输出ID的长度（默认8）
 * @returns 唯一的短ID
 */
export function generateUniqueId(content: string, length: number = 8): string {
  // 使用FNV-1a哈希算法生成基础哈希值
  let hash = 0x811C9DC5; // FNV_offset_basis

  for (let i = 0; i < content.length; i++) {
    hash ^= content.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
    hash = hash >>> 0; // 确保是32位无符号整数
  }

  // 添加时间戳和随机数，确保唯一性
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2);

  // 组合哈希值、时间戳和随机数
  const combined = hash.toString(36) + timestamp + randomPart;

  // 确保结果长度符合要求
  if (combined.length < length) {
    // 如果组合后的字符串仍然太短，用随机字符填充
    const padding = Math.random().toString(36).substring(2, length - combined.length + 2);
    return (combined + padding).substring(0, length);
  }

  // 如果足够长，截取所需长度
  return combined.substring(0, length);
}


/**
 * 生成唯一ID的辅助函数
 * @param prefix ID前缀
 * @param content 内容标识
 * @returns 唯一ID
 */
export function generateUniqueIdWithCounter(prefix: string, content: string = ""): string {
  // 生成唯一ID，使用更强的唯一性保证
  // 使用递增计数器避免同一毫秒内的ID冲突
  if (!(window as any).__mermaidIdCounter) {
    (window as any).__mermaidIdCounter = 0;
  }
  const counter = ++(window as any).__mermaidIdCounter;
  return `${prefix}-${content}-${counter}`;
};
