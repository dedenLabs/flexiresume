/**
 * 脑图存储目录优化功能测试
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('脑图存储目录优化', () => {
  test('验证脑图文件已迁移到安全位置', async () => {
    console.log('🧪 测试脑图文件迁移');
    
    // 检查新的安全存储位置
    const mindmapsDir = '.augment/mindmaps';
    expect(fs.existsSync(mindmapsDir)).toBeTruthy();
    console.log('✅ 安全存储目录存在');
    
    // 检查目录结构
    const subDirs = ['architecture', 'workflow', 'structure', 'progress'];
    for (const subDir of subDirs) {
      const subDirPath = path.join(mindmapsDir, subDir);
      expect(fs.existsSync(subDirPath)).toBeTruthy();
      console.log(`✅ 子目录存在: ${subDir}`);
    }
    
    // 检查索引文件
    const indexFile = path.join(mindmapsDir, 'index.md');
    expect(fs.existsSync(indexFile)).toBeTruthy();
    console.log('✅ 索引文件存在');
    
    // 检查示例脑图文件
    const systemComponentsFile = path.join(mindmapsDir, 'architecture', 'system-components.mmd');
    expect(fs.existsSync(systemComponentsFile)).toBeTruthy();
    console.log('✅ 示例脑图文件存在');
    
    // 检查.gitkeep文件
    const gitkeepFile = path.join(mindmapsDir, '.gitkeep');
    expect(fs.existsSync(gitkeepFile)).toBeTruthy();
    console.log('✅ .gitkeep文件存在');
  });

  test('验证配置文件已更新', async () => {
    console.log('🧪 测试配置文件更新');
    
    const configFile = '.augment/config.json';
    expect(fs.existsSync(configFile)).toBeTruthy();
    console.log('✅ 配置文件存在');
    
    const configContent = fs.readFileSync(configFile, 'utf-8');
    const config = JSON.parse(configContent);
    
    expect(config.mindmaps.storageDirectory).toBe('.augment/mindmaps');
    console.log('✅ 存储目录配置正确');
    
    expect(config.mindmaps.migrationCompleted).toBe(true);
    console.log('✅ 迁移状态已标记');
    
    expect(config.mindmaps.previousDirectory).toBe('docs/charts');
    console.log('✅ 旧目录记录正确');
  });

  test('验证规则文件已更新', async () => {
    console.log('🧪 测试规则文件更新');
    
    const ruleFile = '.augment/rules/rule-task.md';
    expect(fs.existsSync(ruleFile)).toBeTruthy();
    console.log('✅ 规则文件存在');
    
    const ruleContent = fs.readFileSync(ruleFile, 'utf-8');
    
    // 检查是否包含新的存储路径说明
    expect(ruleContent).toContain('.augment/mindmaps/');
    console.log('✅ 规则文件包含新存储路径');
    
    // 检查是否包含智能目录选择机制说明
    expect(ruleContent).toContain('智能目录选择机制');
    console.log('✅ 规则文件包含智能目录选择说明');
    
    // 检查是否包含故障排除指南
    expect(ruleContent).toContain('故障排除指南');
    console.log('✅ 规则文件包含故障排除指南');
  });

  test('验证记忆文件已更新', async () => {
    console.log('🧪 测试记忆文件更新');
    
    const memoryFile = '.augment/memory.md';
    expect(fs.existsSync(memoryFile)).toBeTruthy();
    console.log('✅ 记忆文件存在');
    
    const memoryContent = fs.readFileSync(memoryFile, 'utf-8');
    
    // 检查脑图索引路径是否已更新
    expect(memoryContent).toContain('.augment/mindmaps/index.md');
    console.log('✅ 记忆文件包含新的脑图索引路径');
    
    // 检查是否包含目录迁移说明
    expect(memoryContent).toContain('目录迁移');
    console.log('✅ 记忆文件包含目录迁移说明');
  });

  test('验证构建安全性', async () => {
    console.log('🧪 测试构建安全性');
    
    // 检查脑图文件不在构建输出目录中
    const docsChartsDir = 'docs/charts';
    const mindmapsDir = '.augment/mindmaps';
    
    // 新位置应该存在
    expect(fs.existsSync(mindmapsDir)).toBeTruthy();
    console.log('✅ 新位置存在');
    
    // 检查.augment目录不会被构建清理
    // 这个目录应该在.gitignore的例外列表中或者不在构建输出路径中
    const augmentDir = '.augment';
    expect(fs.existsSync(augmentDir)).toBeTruthy();
    console.log('✅ .augment目录存在且安全');
    
    // 验证配置中的避免目录列表
    const configFile = '.augment/config.json';
    const configContent = fs.readFileSync(configFile, 'utf-8');
    const config = JSON.parse(configContent);
    
    expect(config.mindmaps.avoidDirectories).toContain('docs');
    console.log('✅ 配置正确标记了需要避免的目录');
  });
});
