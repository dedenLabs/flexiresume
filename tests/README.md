# 🧪 FlexiResume 测试套件

## 📋 目录结构

```
tests/
├── 📁 categories/                    # 分类测试目录
│   ├── 📁 ui/                       # UI界面测试
│   ├── 📁 responsive/               # 响应式设计测试
│   ├── 📁 performance/              # 性能测试
│   ├── 📁 integration/              # 集成测试
│   ├── 📁 cdn/                      # CDN相关测试
│   └── 📁 functionality/            # 功能测试
├── 📁 utils/                        # 测试工具和辅助函数
├── 📁 config/                       # 测试配置文件
├── 📁 screenshots/                  # 测试截图
├── 📁 reports/                      # 测试报告
└── 📄 README.md                     # 本文档
```

## 🎯 测试分类

### 1. UI界面测试 (`categories/ui/`)
测试用户界面的正确性和交互功能。

| 文件名 | 描述 | 状态 |
|--------|------|------|
| `console-error-check.spec.ts` | 控制台错误检查 | ✅ |
| `page-verification.spec.ts` | 页面验证测试 | ✅ |
| `resume-pages.spec.ts` | 简历页面测试 | ✅ |
| `game-page-test.spec.ts` | 游戏页面专项测试 | ✅ |

### 2. 响应式设计测试 (`categories/responsive/`)
测试不同屏幕尺寸下的布局和交互。

| 文件名 | 描述 | 状态 |
|--------|------|------|
| `responsive-collapse-test.spec.ts` | 响应式折叠功能测试 | ✅ |
| `responsive-language-switcher.spec.ts` | 响应式语言切换测试 | ✅ |
| `mobile-responsive-test.spec.ts` | 移动端响应式测试 | ✅ |
| `mobile-overflow-fix-test.spec.ts` | 移动端溢出修复测试 | ✅ |
| `manual-mobile-test.spec.ts` | 手动移动端测试 | ✅ |

### 3. 性能测试 (`categories/performance/`)
测试应用的性能指标和优化效果。

| 文件名 | 描述 | 状态 |
|--------|------|------|
| `performance.spec.ts` | 性能基准测试 | ✅ |
| `cdn-health-check.spec.ts` | CDN健康检查性能 | ✅ |

### 4. 集成测试 (`categories/integration/`)
测试组件间的集成和数据流。

| 文件名 | 描述 | 状态 |
|--------|------|------|
| `data-structure-validation.spec.ts` | 数据结构验证 | ✅ |
| `deep-verification.spec.ts` | 深度验证测试 | ✅ |
| `mermaid-fix-verification.spec.ts` | Mermaid修复验证 | ✅ |

### 5. CDN相关测试 (`categories/cdn/`)
测试CDN功能和跨域问题解决方案。

| 文件名 | 描述 | 状态 |
|--------|------|------|
| `cdn-cors-fix-test.spec.ts` | CDN跨域问题修复测试 | ✅ |
| `cdn-fallback-test.spec.ts` | CDN降级测试 | ✅ |
| `cdn-basic-test.spec.ts` | CDN基础功能测试 | ✅ |
| `simple-cdn-test.spec.ts` | 简单CDN测试 | ✅ |

### 6. 功能测试 (`categories/functionality/`)
测试特定功能的正确性。

| 文件名 | 描述 | 状态 |
|--------|------|------|
| `print-functionality.spec.ts` | 打印功能测试 | ✅ |
| `mermaid-simple-test.spec.ts` | Mermaid简单测试 | ✅ |
| `error-detection.spec.ts` | 错误检测测试 | ✅ |

## ⚙️ 环境配置

### 环境变量
测试套件支持以下环境变量配置：

```bash
# 基础配置
TEST_BASE_URL=http://localhost:5177    # 测试基础URL
TEST_TIMEOUT=30000                     # 默认超时时间(ms)
TEST_HEADLESS=false                    # 是否无头模式运行

# 浏览器配置
TEST_BROWSER=chromium                  # 测试浏览器 (chromium|firefox|webkit)
TEST_VIEWPORT_WIDTH=1280               # 默认视口宽度
TEST_VIEWPORT_HEIGHT=720               # 默认视口高度

# 截图配置
SCREENSHOT_ON_FAILURE=true             # 失败时截图
SCREENSHOT_DIR=tests/screenshots       # 截图保存目录

# 报告配置
TEST_REPORT_DIR=tests/reports          # 报告保存目录
GENERATE_HTML_REPORT=true              # 生成HTML报告

# CDN测试配置
CDN_TEST_TIMEOUT=8000                  # CDN测试超时时间
CDN_HEALTH_CHECK_ENABLED=true          # 启用CDN健康检查

# 移动端测试配置
MOBILE_TEST_DEVICES=iPhone,Samsung     # 移动端测试设备
```

### 配置文件
- `playwright.config.ts` - Playwright主配置
- `global-setup.ts` - 全局测试设置
- `global-teardown.ts` - 全局测试清理

## 🚀 快速开始

### 运行所有测试
```bash
npm run test
```

### 运行特定分类测试
```bash
# UI测试
npx playwright test tests/categories/ui/

# 响应式测试
npx playwright test tests/categories/responsive/

# 性能测试
npx playwright test tests/categories/performance/

# CDN测试
npx playwright test tests/categories/cdn/
```

### 运行单个测试文件
```bash
npx playwright test tests/categories/ui/console-error-check.spec.ts
```

### 带界面运行测试
```bash
npx playwright test --headed
```

### 生成测试报告
```bash
npx playwright show-report tests/reports/html
```

## 📊 测试统计

- **总测试文件**: 20+
- **测试用例数**: 100+
- **覆盖的页面**: 6个主要页面
- **支持的设备**: 桌面端 + 5种移动设备
- **支持的浏览器**: Chromium, Firefox, WebKit

## 🔧 工具和辅助函数

### `tests/utils/test-helpers.ts`
提供常用的测试辅助函数：
- 页面加载等待
- 元素可见性检查
- 截图工具
- 错误捕获

### `tests/utils/page-objects.ts`
页面对象模式实现：
- 控制面板对象
- 语言切换器对象
- 主题切换器对象

## 📝 编写测试指南

### 1. 测试文件命名规范
- 功能测试: `feature-name.spec.ts`
- 页面测试: `page-name-test.spec.ts`
- 修复验证: `fix-name-verification.spec.ts`

### 2. 测试结构
```typescript
import { test, expect } from '@playwright/test';

test.describe('测试组描述', () => {
  test('具体测试用例描述', async ({ page }) => {
    // 测试实现
  });
});
```

### 3. 最佳实践
- 使用有意义的测试描述
- 添加适当的等待和超时
- 失败时截图记录
- 使用页面对象模式
- 避免硬编码值

## 🐛 故障排除

### 常见问题
1. **测试超时**: 增加 `timeout` 配置
2. **元素找不到**: 检查选择器和页面加载状态
3. **截图失败**: 确保截图目录存在且有写权限
4. **CDN测试失败**: 检查网络连接和CDN配置

### 调试技巧
- 使用 `--headed` 查看浏览器行为
- 使用 `page.pause()` 暂停执行
- 查看测试报告中的截图和视频
- 检查控制台输出

---

**更新时间**: 2025-01-12  
**维护者**: 陈剑  
**版本**: v1.0.0
