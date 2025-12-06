#!/usr/bin/env node

/**
 * 测试运行脚本
 * 
 * 提供便捷的测试运行命令
 * 
 * @author 陈剑
 * @date 2025-01-12
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 测试分类
const categories = {
  ui: 'UI界面测试',
  responsive: '响应式设计测试',
  performance: '性能测试',
  integration: '集成测试',
  cdn: 'CDN相关测试',
  functionality: '功能测试'
};

/**
 * 显示帮助信息
 */
function showHelp() {
  console.log(`
🧪 FlexiResume 测试运行器

用法:
  node tests/run-tests.js [选项] [分类]

选项:
  --help, -h          显示帮助信息
  --headed            显示浏览器界面
  --debug             调试模式
  --report            生成并显示报告
  --list              列出所有测试分类

分类:
${Object.entries(categories).map(([key, desc]) => `  ${key.padEnd(12)} ${desc}`).join('\n')}

示例:
  node tests/run-tests.js ui                    # 运行UI测试
  node tests/run-tests.js responsive --headed   # 带界面运行响应式测试
  node tests/run-tests.js --list               # 列出所有分类
  node tests/run-tests.js --report             # 显示测试报告
`);
}

/**
 * 列出测试分类
 */
function listCategories() {
  console.log('\n📋 可用的测试分类:\n');
  Object.entries(categories).forEach(([key, desc]) => {
    console.log(`  🎯 ${key.padEnd(12)} - ${desc}`);
  });
  console.log('');
}

/**
 * 运行Playwright命令
 */
function runPlaywright(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('npx', ['playwright', 'test', ...args], {
      stdio: 'inherit',
      shell: true,
      cwd: path.dirname(__dirname)
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`测试失败，退出码: ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * 显示测试报告
 */
function showReport() {
  console.log('📊 打开测试报告...');
  return runPlaywright(['show-report', 'tests/reports/html']);
}

/**
 * 运行特定分类的测试
 */
async function runCategoryTests(category, options = {}) {
  if (!categories[category]) {
    console.error(`❌ 未知的测试分类: ${category}`);
    console.log('💡 使用 --list 查看所有可用分类');
    process.exit(1);
  }

  console.log(`🚀 运行 ${categories[category]}...\n`);

  const args = [`tests/categories/${category}/`];

  if (options.headed) {
    args.push('--headed');
  }

  if (options.debug) {
    args.push('--debug');
  }

  try {
    await runPlaywright(args);
    console.log(`\n✅ ${categories[category]} 完成!`);
    
    if (options.report) {
      await showReport();
    }
  } catch (error) {
    console.error(`\n❌ ${categories[category]} 失败:`, error.message);
    process.exit(1);
  }
}

/**
 * 运行所有测试
 */
async function runAllTests(options = {}) {
  console.log('🚀 运行所有测试...\n');

  const args = ['tests/categories/'];

  if (options.headed) {
    args.push('--headed');
  }

  if (options.debug) {
    args.push('--debug');
  }

  try {
    await runPlaywright(args);
    console.log('\n✅ 所有测试完成!');
    
    if (options.report) {
      await showReport();
    }
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    process.exit(1);
  }
}

/**
 * 解析命令行参数
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    headed: false,
    debug: false,
    report: false,
    help: false,
    list: false
  };
  
  let category = null;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--headed':
        options.headed = true;
        break;
      case '--debug':
        options.debug = true;
        break;
      case '--report':
        options.report = true;
        break;
      case '--list':
        options.list = true;
        break;
      default:
        if (!arg.startsWith('--') && !category) {
          category = arg;
        }
        break;
    }
  }

  return { options, category };
}

/**
 * 主函数
 */
async function main() {
  const { options, category } = parseArgs();

  if (options.help) {
    showHelp();
    return;
  }

  if (options.list) {
    listCategories();
    return;
  }

  if (options.report && !category) {
    await showReport();
    return;
  }

  if (category) {
    await runCategoryTests(category, options);
  } else {
    await runAllTests(options);
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 运行失败:', error.message);
  process.exit(1);
});
