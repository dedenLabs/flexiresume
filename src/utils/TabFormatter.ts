/**
 * 页签标签格式化工具
 * 
 * 支持通过环境变量配置页签标签的显示格式
 * 
 * @author FlexiResume Team
 * @date 2025-07-27
 */

import { getProjectConfig } from '../config/ProjectConfig';

/**
 * 页签标签数据接口
 */
export interface TabLabelData {
  /** 姓名 */
  name?: string;
  /** 职位 */
  position?: string;
  /** 其他自定义字段 */
  [key: string]: any;
}

/**
 * 格式化页签标签
 * 
 * @param template 格式模板，支持变量如 {name}, {position}
 * @param data 标签数据
 * @returns 格式化后的标签文本
 */
export function formatTabLabel(template: string, data: TabLabelData): string {
  if (!template || !data) {
    return data?.position || '';
  }

  let result = template;
  
  // 替换所有支持的变量
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value !== undefined && value !== null) {
      const placeholder = `{${key}}`;
      result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), String(value));
    }
  });

  // 清理未替换的占位符
  result = result.replace(/\{[^}]*\}/g, '');
  
  // 清理多余的分隔符和空格
  result = result.replace(/\s*\/\s*$/, '').replace(/^\s*\/\s*/, '').trim();
  
  return result || data.position || '';
}

/**
 * 解析页签标签（用于向后兼容）
 * 
 * @param label 标签文本
 * @param separator 分隔符
 * @returns 解析后的数据
 */
export function parseTabLabel(label: string, separator: string = " / "): TabLabelData {
  if (!label) {
    return {};
  }

  const parts = label.split(separator);
  
  if (parts.length >= 2) {
    return {
      name: parts[0]?.trim(),
      position: parts[1]?.trim()
    };
  }
  
  return {
    position: label.trim()
  };
}

/**
 * 获取配置的页签标签格式
 * 
 * @returns 页签配置
 */
export function getTabConfig() {
  const config = getProjectConfig();
  return {
    labelFormat: config.tabs.labelFormat,
    labelSeparator: config.tabs.labelSeparator
  };
}

/**
 * 使用配置格式化页签标签
 * 
 * @param data 标签数据
 * @returns 格式化后的标签文本
 */
export function formatTabLabelWithConfig(data: TabLabelData): string {
  const { labelFormat } = getTabConfig();
  return formatTabLabel(labelFormat, data);
}

/**
 * 使用配置解析页签标签
 * 
 * @param label 标签文本
 * @returns 解析后的数据
 */
export function parseTabLabelWithConfig(label: string): TabLabelData {
  const { labelSeparator } = getTabConfig();
  return parseTabLabel(label, labelSeparator);
}

/**
 * 提取角色标题（用于显示）
 * 
 * @param position 职位字符串
 * @returns 角色标题
 */
export function extractRoleTitle(position: string): string {
  if (!position) {
    return '';
  }

  const { labelSeparator } = getTabConfig();
  const parts = position.split(labelSeparator);
  
  // 返回最后一部分作为角色标题，如果只有一部分则返回整个字符串
  return parts[parts.length - 1]?.trim() || position.trim();
}
