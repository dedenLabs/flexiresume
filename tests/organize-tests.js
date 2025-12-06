/**
 * 测试文件组织脚本
 * 
 * 将现有的测试文件按功能分类移动到对应目录
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试文件分类映射
const testCategories = {
  ui: [
    'console-error-check.spec.ts',
    'console-check.spec.ts',
    'console-error-capture.spec.ts',
    'page-verification.spec.ts',
    'resume-pages.spec.ts',
    'game-page-test.spec.ts',
    'error-detection.spec.ts'
  ],
  
  responsive: [
    'responsive-collapse-test.spec.ts',
    'responsive-language-switcher.spec.ts',
    'mobile-responsive-test.spec.ts',
    'mobile-overflow-fix-test.spec.ts',
    'manual-mobile-test.spec.ts'
  ],
  
  performance: [
    'performance.spec.ts',
    'cdn-health-check.spec.ts'
  ],
  
  integration: [
    'data-structure-validation.spec.ts',
    'deep-verification.spec.ts',
    'mermaid-fix-verification.spec.ts'
  ],
  
  cdn: [
    'cdn-cors-fix-test.spec.ts',
    'cdn-fallback-test.spec.ts',
    'cdn-basic-test.spec.ts',
    'simple-cdn-test.spec.ts'
  ],
  
  functionality: [
    'print-functionality.spec.ts',
    'mermaid-simple-test.spec.ts'
  ]
};

/**
 * 移动文件到指定目录
 */
function moveFile(sourceFile, targetDir) {
  const sourcePath = path.join(__dirname, sourceFile);
  const targetPath = path.join(__dirname, 'categories', targetDir, sourceFile);
  
  // 检查源文件是否存在
  if (!fs.existsSync(sourcePath)) {
    console.log(`⚠️  源文件不存在: ${sourceFile}`);
    return false;
  }
  
  // 确保目标目录存在
  const targetDirPath = path.dirname(targetPath);
  if (!fs.existsSync(targetDirPath)) {
    fs.mkdirSync(targetDirPath, { recursive: true });
  }
  
  try {
    // 移动文件
    fs.renameSync(sourcePath, targetPath);
    console.log(`✅ 移动: ${sourceFile} → categories/${targetDir}/`);
    return true;
  } catch (error) {
    console.error(`❌ 移动失败: ${sourceFile} - ${error.message}`);
    return false;
  }
}

/**
 * 创建分类索引文件
 */
function createCategoryIndex(category, files) {
  const indexContent = `# ${category.toUpperCase()} 测试

## 测试文件列表

${files.map(file => `- [${file}](./${file})`).join('\n')}

## 运行测试

\`\`\`bash
# 运行此分类下的所有测试
npx playwright test tests/categories/${category}/

# 运行特定测试文件
npx playwright test tests/categories/${category}/${files[0]}
\`\`\`
`;

  const indexPath = path.join(__dirname, 'categories', category, 'README.md');
  fs.writeFileSync(indexPath, indexContent);
  console.log(`📝 创建索引: categories/${category}/README.md`);
}

/**
 * 主函数
 */
function main() {
  console.log('🚀 开始组织测试文件...\n');
  
  let totalMoved = 0;
  let totalFiles = 0;
  
  // 遍历每个分类
  for (const [category, files] of Object.entries(testCategories)) {
    console.log(`📁 处理分类: ${category}`);
    
    let movedCount = 0;
    
    // 移动文件
    for (const file of files) {
      totalFiles++;
      if (moveFile(file, category)) {
        movedCount++;
        totalMoved++;
      }
    }
    
    // 创建分类索引
    if (movedCount > 0) {
      createCategoryIndex(category, files.filter(file => 
        fs.existsSync(path.join(__dirname, 'categories', category, file))
      ));
    }
    
    console.log(`   移动了 ${movedCount}/${files.length} 个文件\n`);
  }
  
  console.log(`✨ 组织完成!`);
  console.log(`   总计: ${totalMoved}/${totalFiles} 个文件已移动`);
  console.log(`   分类数: ${Object.keys(testCategories).length}`);
}

// 直接运行主函数
main();

export {
  testCategories,
  moveFile,
  createCategoryIndex
};
