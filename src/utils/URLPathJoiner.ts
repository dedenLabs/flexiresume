/**
 * URL路径拼接工具类
 * 
 * 支持相对路径、绝对路径和标准化的URL路径拼接
 * 类似Node.js的path.join，但专门为URL路径优化
 * 
 * @author FlexiResume Team
 * @date 2025-07-31
 */

/**
 * URL路径拼接工具
 * 
 * 支持以下路径格式：
 * - join("base/a/", "../b") => "base/b"
 * - join("base/a/", "/b") => "base/b" (去除绝对路径开头的/)
 * - join("base/a/", "./b") => "base/a/b"
 * - join("base/a/", "b") => "base/a/b"
 * - join("base/a/", "https://cdn.com/b") => "https://cdn.com/b"
 */
export class URLPathJoiner {
  /**
   * 拼接URL路径
   * @param paths 路径片段数组
   * @returns 拼接后的标准化路径
   */
  static join(...paths: string[]): string {
    if (paths.length === 0) {
      return '';
    }

    if (paths.length === 1) {
      return this.normalizePath(paths[0]);
    }

    // 检查是否有绝对URL（包含协议）
    const hasAbsoluteURL = paths.some(path => this.isAbsoluteURL(path));
    
    if (hasAbsoluteURL) {
      // 如果有绝对URL，找到第一个绝对URL，后面的路径都相对于它拼接
      let absoluteURLFound = false;
      let result = '';
      
      for (const path of paths) {
        if (this.isAbsoluteURL(path)) {
          absoluteURLFound = true;
          result = path;
        } else if (absoluteURLFound) {
          result = this.joinTwoPaths(result, path);
        }
        // 如果还没找到绝对URL，跳过相对路径
      }
      
      return this.normalizePath(result);
    }

    // 处理相对路径拼接
    let result = paths[0];
    
    for (let i = 1; i < paths.length; i++) {
      result = this.joinTwoPaths(result, paths[i]);
    }

    return this.normalizePath(result);
  }

  /**
   * 拼接两个路径
   */
  private static joinTwoPaths(base: string, relative: string): string {
    // 处理空路径
    if (!relative || relative === '.') {
      return base;
    }

    // 处理以 / 开头的路径（在URL中视为相对路径）
    if (relative.startsWith('/')) {
      relative = relative.substring(1);
    }

    // 处理 ../
    if (relative.startsWith('../')) {
      const baseWithoutTrailingSlash = base.endsWith('/') ? base.slice(0, -1) : base;
      const baseParent = this.getParentPath(baseWithoutTrailingSlash);
      const remainingRelative = relative.substring(3);
      return this.joinTwoPaths(baseParent, remainingRelative);
    }

    // 处理 ./
    if (relative.startsWith('./')) {
      const remainingRelative = relative.substring(2);
      return this.joinTwoPaths(base, remainingRelative);
    }

    // 正常拼接
    const baseWithTrailingSlash = base.endsWith('/') ? base : base + '/';
    return baseWithTrailingSlash + relative;
  }

  /**
   * 获取父路径
   */
  private static getParentPath(path: string): string {
    const cleanPath = path.endsWith('/') ? path.slice(0, -1) : path;
    const lastSlashIndex = cleanPath.lastIndexOf('/');
    
    if (lastSlashIndex === -1) {
      return '';
    }

    return cleanPath.substring(0, lastSlashIndex);
  }

  /**
   * 标准化路径
   */
  private static normalizePath(path: string): string {
    if (!path) {
      return '';
    }

    // 如果是绝对URL，直接返回
    if (this.isAbsoluteURL(path)) {
      return path;
    }

    // 移除开头的 /
    let normalizedPath = path.startsWith('/') ? path.substring(1) : path;

    // 处理连续的斜杠
    normalizedPath = normalizedPath.replace(/\/+/g, '/');

    // 处理 ./ 和 ../
    const segments = normalizedPath.split('/');
    const result: string[] = [];

    for (const segment of segments) {
      if (segment === '' || segment === '.') {
        continue;
      }

      if (segment === '..') {
        if (result.length > 0) {
          result.pop();
        }
      } else {
        result.push(segment);
      }
    }

    return result.join('/');
  }

  /**
   * 检查是否为绝对URL
   */
  private static isAbsoluteURL(url: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(url);
  }

  /**
   * 移除基础路径
   * @param fullPath 完整路径
   * @param basePath 基础路径
   * @returns 相对路径
   */
  static removeBasePath(fullPath: string, basePath: string): string {
    if (!fullPath || !basePath) {
      return fullPath;
    }

    // 标准化路径
    const normalizedFull = this.normalizePath(fullPath);
    const normalizedBase = this.normalizePath(basePath);

    // 如果完整路径以基础路径开头，移除基础路径
    if (normalizedFull.startsWith(normalizedBase)) {
      const relativePath = normalizedFull.substring(normalizedBase.length);
      return relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    }

    // 如果不是以基础路径开头，直接返回
    return normalizedFull;
  }

  /**
   * 添加基础路径
   * @param relativePath 相对路径
   * @param basePath 基础路径
   * @returns 完整路径
   */
  static addBasePath(relativePath: string, basePath: string): string {
    if (!relativePath) {
      return basePath;
    }

    if (!basePath) {
      return relativePath;
    }

    // 如果已经是绝对URL，直接返回
    if (this.isAbsoluteURL(relativePath)) {
      return relativePath;
    }

    return this.join(basePath, relativePath);
  }
}

/**
 * 便捷函数
 */
export function joinURL(...paths: string[]): string {
  return URLPathJoiner.join(...paths);
}

/**
 * 移除基础路径的便捷函数
 */
export function removeBaseURL(fullPath: string, basePath: string): string {
  return URLPathJoiner.removeBasePath(fullPath, basePath);
}

/**
 * 添加基础路径的便捷函数
 */
export function addBaseURL(relativePath: string, basePath: string): string {
  return URLPathJoiner.addBasePath(relativePath, basePath);
}