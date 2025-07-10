# 🤝 FlexiResume 贡献指南

感谢您对 FlexiResume 项目的关注！我们欢迎所有形式的贡献，无论是代码、文档、设计还是想法。

## 📋 目录

- [贡献方式](#贡献方式)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [提交流程](#提交流程)
- [问题报告](#问题报告)
- [功能建议](#功能建议)
- [代码审查](#代码审查)

---

## 🎯 贡献方式

### 1. 代码贡献

- 🐛 **修复 Bug**: 修复已知问题和错误
- ✨ **新功能**: 添加新的功能和特性
- 🎨 **UI/UX 改进**: 改善用户界面和体验
- ⚡ **性能优化**: 提升应用性能和加载速度
- 🔧 **重构**: 改进代码结构和可维护性

### 2. 文档贡献

- 📝 **文档完善**: 改进现有文档的准确性和完整性
- 🌍 **翻译**: 将文档翻译成其他语言
- 📖 **教程**: 编写使用教程和最佳实践
- 💡 **示例**: 提供更多使用示例和案例

### 3. 设计贡献

- 🎨 **UI 设计**: 设计新的界面和组件
- 🌈 **主题**: 创建新的主题和配色方案
- 📱 **图标**: 设计图标和视觉元素
- 🖼️ **插图**: 创建说明性图片和图表

### 4. 社区贡献

- 💬 **讨论参与**: 在 GitHub Discussions 中参与讨论
- 🆘 **帮助他人**: 回答其他用户的问题
- 📢 **推广**: 分享项目，帮助更多人了解
- 🎉 **活动组织**: 组织相关的技术活动

---

## 🛠️ 开发环境设置

### 1. 前置要求

确保您的开发环境满足以下要求：

```bash
# Node.js 版本
node --version  # >= 16.0.0

# npm 版本
npm --version   # >= 8.0.0

# Git 版本
git --version   # >= 2.0.0
```

### 2. 克隆项目

```bash
# Fork 项目到您的 GitHub 账户
# 然后克隆您的 Fork

git clone https://github.com/YOUR_USERNAME/FlexiResume.git
cd FlexiResume

# 添加上游仓库
git remote add upstream https://github.com/dedenLabs/FlexiResume.git
```

### 3. 安装依赖

```bash
# 安装项目依赖
npm install

# 验证安装
npm run dev
```

### 4. 开发工具推荐

- **IDE**: VS Code + 推荐扩展
- **浏览器**: Chrome/Firefox + React DevTools
- **Git 客户端**: GitHub Desktop 或命令行

#### VS Code 推荐扩展

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "styled-components.vscode-styled-components",
    "ms-vscode.vscode-json"
  ]
}
```

---

## 📏 代码规范

### 1. 代码风格

我们使用 ESLint 和 Prettier 来保持代码风格的一致性：

```bash
# 检查代码风格
npm run lint

# 自动修复
npm run lint:fix

# 格式化代码
npm run format
```

### 2. TypeScript 规范

- 使用严格的 TypeScript 配置
- 为所有函数和组件提供类型注解
- 避免使用 `any` 类型
- 使用接口定义数据结构

```typescript
// ✅ 好的示例
interface UserProps {
  name: string;
  age: number;
  email?: string;
}

const UserCard: React.FC<UserProps> = ({ name, age, email }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
    </div>
  );
};

// ❌ 避免的示例
const UserCard = (props: any) => {
  return <div>{props.name}</div>;
};
```

### 3. 组件规范

- 使用函数组件和 Hooks
- 组件名使用 PascalCase
- 文件名与组件名保持一致
- 每个组件都应该有对应的类型定义

```typescript
// 文件: src/components/UserCard.tsx
import React from 'react';
import styled from 'styled-components';

interface UserCardProps {
  user: User;
  onClick?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  return (
    <Container onClick={onClick}>
      <Name>{user.name}</Name>
      <Email>{user.email}</Email>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
`;

const Name = styled.h3`
  margin: 0 0 8px 0;
`;

const Email = styled.p`
  margin: 0;
  color: #666;
`;

export default UserCard;
```

### 4. 提交信息规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 格式
<type>[optional scope]: <description>

# 示例
feat: add dark theme support
fix: resolve mobile layout issue
docs: update API documentation
style: format code with prettier
refactor: simplify theme switching logic
test: add unit tests for UserCard component
chore: update dependencies
```

**提交类型说明:**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式化（不影响功能）
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

---

## 🔄 提交流程

### 1. 创建分支

```bash
# 同步上游代码
git fetch upstream
git checkout main
git merge upstream/main

# 创建功能分支
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发和测试

```bash
# 开发过程中定期提交
git add .
git commit -m "feat: add new feature"

# 运行测试
npm test

# 检查代码质量
npm run lint
npm run type-check
```

### 3. 提交 Pull Request

```bash
# 推送分支
git push origin feature/your-feature-name

# 在 GitHub 上创建 Pull Request
```

#### Pull Request 模板

```markdown
## 📝 变更描述

简要描述您的更改内容。

## 🎯 变更类型

- [ ] Bug 修复
- [ ] 新功能
- [ ] 文档更新
- [ ] 性能优化
- [ ] 代码重构
- [ ] 其他

## 🧪 测试

- [ ] 已添加单元测试
- [ ] 已添加集成测试
- [ ] 手动测试通过
- [ ] 所有现有测试通过

## 📸 截图（如适用）

如果是 UI 相关的更改，请提供截图。

## 📋 检查清单

- [ ] 代码遵循项目规范
- [ ] 已更新相关文档
- [ ] 已添加必要的测试
- [ ] 提交信息符合规范
- [ ] 已解决所有冲突

## 🔗 相关 Issue

Closes #issue_number
```

---

## 🐛 问题报告

### 1. 搜索现有 Issue

在创建新 Issue 之前，请先搜索是否已有相关问题。

### 2. 使用 Issue 模板

```markdown
## 🐛 Bug 描述

清晰简洁地描述遇到的问题。

## 🔄 复现步骤

1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

## 🎯 期望行为

描述您期望发生的行为。

## 📸 截图

如果适用，添加截图来帮助解释问题。

## 🖥️ 环境信息

- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 16.13.0]
- npm: [e.g. 8.1.0]

## 📋 附加信息

添加任何其他相关的上下文信息。
```

---

## 💡 功能建议

### 1. 功能请求模板

```markdown
## 🚀 功能描述

清晰简洁地描述您想要的功能。

## 🎯 问题背景

这个功能解决了什么问题？

## 💭 解决方案

描述您希望如何实现这个功能。

## 🔄 替代方案

描述您考虑过的其他解决方案。

## 📋 附加信息

添加任何其他相关的上下文、截图或示例。
```

### 2. 功能讨论

对于重大功能，建议先在 GitHub Discussions 中讨论：

1. 创建新的讨论主题
2. 详细描述功能需求
3. 收集社区反馈
4. 形成共识后创建 Issue

---

## 👀 代码审查

### 1. 审查标准

- **功能性**: 代码是否按预期工作？
- **可读性**: 代码是否易于理解？
- **性能**: 是否有性能问题？
- **安全性**: 是否存在安全隐患？
- **测试**: 是否有足够的测试覆盖？

### 2. 审查流程

1. **自动检查**: CI/CD 流水线自动运行测试
2. **代码审查**: 维护者和贡献者进行代码审查
3. **讨论**: 在 PR 中讨论具体的实现细节
4. **修改**: 根据反馈进行必要的修改
5. **合并**: 审查通过后合并到主分支

### 3. 审查礼仪

- 保持友善和建设性的态度
- 提供具体的建议而不是模糊的批评
- 解释为什么需要某个更改
- 认可好的代码和想法

---

## 🏆 贡献者认可

### 1. 贡献者列表

所有贡献者都会在项目中得到认可：

- README.md 中的贡献者部分
- 发布说明中的感谢
- GitHub 贡献者图表

### 2. 特殊贡献

对于重大贡献，我们会：

- 在发布说明中特别提及
- 在社交媒体上分享
- 邀请成为项目维护者

---

## 📞 获取帮助

如果您在贡献过程中遇到任何问题：

1. **查看文档**: 首先查看相关文档
2. **搜索 Issues**: 搜索是否有类似问题
3. **GitHub Discussions**: 在讨论区提问
4. **联系维护者**: 直接联系项目维护者

---

## 📜 行为准则

我们致力于为每个人提供友好、安全和欢迎的环境。请遵循以下准则：

- 使用友善和包容的语言
- 尊重不同的观点和经验
- 优雅地接受建设性批评
- 关注对社区最有利的事情
- 对其他社区成员表现出同理心

---

<div align="center">

**感谢您的贡献！🙏**

每一个贡献都让 FlexiResume 变得更好！

</div>


## 🌐 Language Versions

- 🇨🇳 中文版本 (当前)
- [🇺🇸 English Version](../en/CONTRIBUTING.md)