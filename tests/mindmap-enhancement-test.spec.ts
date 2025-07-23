/**
 * 智能脑图记忆辅助功能增强测试
 * 
 * 测试主动分析项目并生成脑图的功能
 */

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('智能脑图记忆辅助功能增强', () => {
  test('验证自动生成的脑图文件存在', async () => {
    console.log('🧪 测试自动生成的脑图文件');
    
    const mindmapsDir = '.augment/mindmaps';
    
    // 检查自动生成的架构图
    const autoArchitectureFile = path.join(mindmapsDir, 'architecture', 'auto-generated-architecture.mmd');
    expect(fs.existsSync(autoArchitectureFile)).toBeTruthy();
    console.log('✅ 自动生成架构图存在');
    
    // 检查自动生成的技术栈图
    const autoTechStackFile = path.join(mindmapsDir, 'architecture', 'auto-generated-tech-stack.mmd');
    expect(fs.existsSync(autoTechStackFile)).toBeTruthy();
    console.log('✅ 自动生成技术栈图存在');
    
    // 检查自动生成的目录结构图
    const autoDirectoryFile = path.join(mindmapsDir, 'structure', 'auto-generated-directory.mmd');
    expect(fs.existsSync(autoDirectoryFile)).toBeTruthy();
    console.log('✅ 自动生成目录结构图存在');
    
    // 检查自动生成的用户流程图
    const autoUserFlowFile = path.join(mindmapsDir, 'workflow', 'auto-generated-user-flow.mmd');
    expect(fs.existsSync(autoUserFlowFile)).toBeTruthy();
    console.log('✅ 自动生成用户流程图存在');
    
    // 检查自动生成的任务时间线图
    const autoTimelineFile = path.join(mindmapsDir, 'progress', 'auto-generated-task-timeline.mmd');
    expect(fs.existsSync(autoTimelineFile)).toBeTruthy();
    console.log('✅ 自动生成任务时间线图存在');
  });

  test('验证脑图文件内容质量', async () => {
    console.log('🧪 测试脑图文件内容质量');
    
    // 检查架构图内容
    const architectureFile = '.augment/mindmaps/architecture/auto-generated-architecture.mmd';
    const architectureContent = fs.readFileSync(architectureFile, 'utf-8');
    
    expect(architectureContent).toContain('graph TB');
    expect(architectureContent).toContain('用户界面层');
    expect(architectureContent).toContain('React组件层');
    expect(architectureContent).toContain('数据管理层');
    expect(architectureContent).toContain('技术栈层');
    expect(architectureContent).toContain('classDef');
    console.log('✅ 架构图内容质量良好');
    
    // 检查技术栈图内容
    const techStackFile = '.augment/mindmaps/architecture/auto-generated-tech-stack.mmd';
    const techStackContent = fs.readFileSync(techStackFile, 'utf-8');
    
    expect(techStackContent).toContain('graph LR');
    expect(techStackContent).toContain('React');
    expect(techStackContent).toContain('TypeScript');
    expect(techStackContent).toContain('Vite');
    expect(techStackContent).toContain('Mermaid');
    console.log('✅ 技术栈图内容质量良好');
    
    // 检查用户流程图内容
    const userFlowFile = '.augment/mindmaps/workflow/auto-generated-user-flow.mmd';
    const userFlowContent = fs.readFileSync(userFlowFile, 'utf-8');
    
    expect(userFlowContent).toContain('graph TD');
    expect(userFlowContent).toContain('用户访问网站');
    expect(userFlowContent).toContain('切换语言');
    expect(userFlowContent).toContain('切换主题');
    expect(userFlowContent).toContain('下载PDF');
    console.log('✅ 用户流程图内容质量良好');
    
    // 检查时间线图内容
    const timelineFile = '.augment/mindmaps/progress/auto-generated-task-timeline.mmd';
    const timelineContent = fs.readFileSync(timelineFile, 'utf-8');
    
    expect(timelineContent).toContain('timeline');
    expect(timelineContent).toContain('FlexiResume 项目开发时间线');
    expect(timelineContent).toContain('项目初始化');
    expect(timelineContent).toContain('核心功能开发');
    expect(timelineContent).toContain('智能功能开发');
    console.log('✅ 时间线图内容质量良好');
  });

  test('验证脑图索引文件更新', async () => {
    console.log('🧪 测试脑图索引文件更新');
    
    const indexFile = '.augment/mindmaps/index.md';
    expect(fs.existsSync(indexFile)).toBeTruthy();
    
    const indexContent = fs.readFileSync(indexFile, 'utf-8');
    
    // 检查是否包含自动生成的脑图
    expect(indexContent).toContain('自动生成架构图');
    expect(indexContent).toContain('自动生成技术栈图');
    expect(indexContent).toContain('自动生成用户流程图');
    expect(indexContent).toContain('自动生成任务时间线图');
    
    // 检查是否包含智能生成说明
    expect(indexContent).toContain('智能脑图记忆辅助功能');
    expect(indexContent).toContain('自动生成');
    expect(indexContent).toContain('智能更新');
    
    console.log('✅ 脑图索引文件更新正确');
  });

  test('验证脑图文件格式规范', async () => {
    console.log('🧪 测试脑图文件格式规范');
    
    const mindmapFiles = [
      '.augment/mindmaps/architecture/auto-generated-architecture.mmd',
      '.augment/mindmaps/architecture/auto-generated-tech-stack.mmd',
      '.augment/mindmaps/structure/auto-generated-directory.mmd',
      '.augment/mindmaps/workflow/auto-generated-user-flow.mmd',
      '.augment/mindmaps/progress/auto-generated-task-timeline.mmd'
    ];
    
    for (const file of mindmapFiles) {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf-8');
        
        // 检查文件头部注释
        expect(content).toMatch(/^%%.*自动生成/);
        expect(content).toContain('生成时间');
        expect(content).toContain('触发原因');
        expect(content).toContain('项目: FlexiResume');
        
        // 检查Mermaid语法
        const hasMermaidSyntax = content.includes('graph') || 
                                content.includes('timeline') || 
                                content.includes('flowchart');
        expect(hasMermaidSyntax).toBeTruthy();
        
        // 检查样式定义（如果是图形类型）
        if (content.includes('graph')) {
          expect(content).toContain('classDef');
          expect(content).toContain('color:#000000'); // 确保字体颜色已修复
        }
        
        console.log(`✅ ${path.basename(file)} 格式规范正确`);
      }
    }
  });

  test('验证智能分析功能', async () => {
    console.log('🧪 测试智能分析功能');
    
    // 检查是否正确识别了项目类型
    const architectureFile = '.augment/mindmaps/architecture/auto-generated-architecture.mmd';
    const architectureContent = fs.readFileSync(architectureFile, 'utf-8');
    
    // 应该包含React相关组件
    expect(architectureContent).toContain('React');
    expect(architectureContent).toContain('TypeScript');
    
    // 检查技术栈识别
    const techStackFile = '.augment/mindmaps/architecture/auto-generated-tech-stack.mmd';
    const techStackContent = fs.readFileSync(techStackFile, 'utf-8');
    
    // 应该包含项目实际使用的技术
    expect(techStackContent).toContain('Vite');
    expect(techStackContent).toContain('Styled Components');
    expect(techStackContent).toContain('MobX');
    expect(techStackContent).toContain('Playwright');
    
    // 检查目录结构识别
    const directoryFile = '.augment/mindmaps/structure/auto-generated-directory.mmd';
    const directoryContent = fs.readFileSync(directoryFile, 'utf-8');
    
    // 应该包含实际的目录结构
    expect(directoryContent).toContain('src/');
    expect(directoryContent).toContain('components/');
    expect(directoryContent).toContain('data/');
    expect(directoryContent).toContain('utils/');
    
    console.log('✅ 智能分析功能正常工作');
  });

  test('验证脑图生成器工具', async () => {
    console.log('🧪 测试脑图生成器工具');
    
    const generatorFile = '.augment/utils/MindmapGenerator.js';
    expect(fs.existsSync(generatorFile)).toBeTruthy();
    
    const generatorContent = fs.readFileSync(generatorFile, 'utf-8');
    
    // 检查关键功能
    expect(generatorContent).toContain('class MindmapGenerator');
    expect(generatorContent).toContain('analyzeProject');
    expect(generatorContent).toContain('generateArchitectureDiagram');
    expect(generatorContent).toContain('generateTechStackDiagram');
    expect(generatorContent).toContain('generateAllMindmaps');
    
    console.log('✅ 脑图生成器工具完整');
  });

  test('验证配置文件集成', async () => {
    console.log('🧪 测试配置文件集成');
    
    const configFile = '.augment/config.json';
    expect(fs.existsSync(configFile)).toBeTruthy();
    
    const configContent = fs.readFileSync(configFile, 'utf-8');
    const config = JSON.parse(configContent);
    
    // 检查脑图相关配置
    expect(config.mindmaps).toBeDefined();
    expect(config.mindmaps.storageDirectory).toBe('.augment/mindmaps');
    expect(config.mindmaps.migrationCompleted).toBe(true);
    
    console.log('✅ 配置文件集成正确');
  });
});
