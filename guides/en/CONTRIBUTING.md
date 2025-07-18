# 🤝 FlexiResume Contribution Guide

Thank you for your interest in the FlexiResume project! We welcome all forms of contributions, whether it's code, documentation, design, or ideas.

## 📋 Table of Contents

- [Contributing Ways](#contributing-ways)
- [Setting Up Development Environment](#setting-up-development-environment)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Bug Reporting](#bug-reporting)
- [Feature Suggestions](#feature-suggestions)
- [Code Review](#code-review)

---

## 🎯 Contributing Ways

### 1. Code Contribution

- 🐛 **Bug Fixes**: Fix known issues and errors
- ✨ **New Features**: Add new features and enhancements
- 🎨 **UI/UX Improvements**: Improve user interface and experience
- ⚡ **Performance Optimization**: Enhance application performance and load speed
- 🔧 **Refactoring**: Improve code structure and maintainability

### 2. Documentation Contribution

- 📝 **Documentation Improvement**: Improve the accuracy and completeness of existing documentation
- 🌍 **Translation**: Translate documentation into other languages
- 📖 **Tutorials**: Write usage tutorials and best practices
- 💡 **Examples**: Provide more usage examples and cases

### 3. Design Contribution

- 🎨 **UI Design**: Design new interfaces and components
- 🌈 **Themes**: Create new themes and color schemes
- 📱 **Icons**: Design icons and visual elements
- 🖼️ **Illustrations**: Create explanatory images and charts

### 4. Community Contribution

- 💬 **Discussion Participation**: Participate in discussions on GitHub Discussions
- 🆘 **Helping Others**: Answer questions from other users
- 📢 **Promotion**: Share the project to help more people understand
- 🎉 **Event Organization**: Organize related tech events

---

## 🛠️ Setting Up Development Environment

### 1. Prerequisites

Ensure your development environment meets the following requirements:

```bash
# Node.js version
node --version  # >= 16.0.0

# npm version
npm --version   # >= 8.0.0

# Git version
git --version   # >= 2.0.0
```

### 2. Clone the Project

```bash
# Fork the project to your GitHub account
# Then clone your fork

git clone https://github.com/YOUR_USERNAME/FlexiResume.git
cd FlexiResume

# Add upstream repository
git remote add upstream https://github.com/dedenLabs/FlexiResume.git
```

### 3. Install Dependencies

```bash
# Install project dependencies
npm install

# Verify installation
npm run dev
```

### 4. Recommended Development Tools

- **IDE**: VS Code + Recommended Extensions
- **Browser**: Chrome/Firefox + React DevTools
- **Git Client**: GitHub Desktop or Command Line

#### VS Code Recommended Extensions

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

## 📏 Code Style

### 1. Code Style

We use ESLint and Prettier to maintain consistent code style:

```bash
# Check code style
npm run lint

# Auto-fix
npm run lint:fix

# Format code
npm run format
```

### 2. TypeScript Style

- Use strict TypeScript configuration
- Provide type annotations for all functions and components
- Avoid using `any` type
- Use interfaces to define data structures

```typescript
// ✅ Good example
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

// ❌ Avoid this example
const UserCard = (props: any) => {
  return <div>{props.name}</div>;
};
```

### 3. Component Style

- Use functional components and Hooks
- Use PascalCase for component names
- Component file names should match the component names
- Each component should have its corresponding type definition
```typescript
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

### 4. Commit Message Specifications

We use the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```bash
# Format
<type>[optional scope]: <description>

# Examples
feat: add dark theme support
fix: resolve mobile layout issue
docs: update API documentation
style: format code with prettier
refactor: simplify theme switching logic
test: add unit tests for UserCard component
chore: update dependencies
```

**Commit Type Descriptions:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Code formatting (does not affect functionality)
- `refactor`: Code refactoring
- `test`: Test-related
- `chore`: Build process or utility changes

---

## 🔄 Commit Process

### 1. Create Branch

```bash
# Sync with upstream code
git fetch upstream
git checkout main
git merge upstream/main

# Create a feature branch
git checkout -b feature/your-feature-name
# Or
git checkout -b fix/your-bug-fix
```

### 2. Development and Testing

```bash
# Commit regularly during development
git add .
git commit -m "feat: add new feature"

# Run tests
npm test

# Check code quality
npm run lint
npm run type-check
```

### 3. Submit Pull Request

```bash
# Push branch
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

#### Pull Request Template

```markdown
## 📝 Change Description

Briefly describe the changes you made.

## 🎯 Change Type

- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance optimization
- [ ] Code refactoring
- [ ] Other

## 🧪 Testing

- [ ] Added unit tests
- [ ] Added integration tests
- [ ] Manual tests passed
- [ ] All existing tests passed

## 📸 Screenshots (if applicable)

If the change is UI-related, provide screenshots.

## 📋 Checklist

- [ ] Code follows project standards
- [ ] Related documentation updated
- [ ] Necessary tests added
- [ ] Commit message follows standards
- [ ] All conflicts resolved

## 🔗 Related Issue

Closes #issue_number
```

# 🐛 Issue Report

### 1. Search Existing Issues

Before creating a new issue, please first search to see if the same issue already exists.

### 2. Use the Issue Template

```markdown
## 🐛 Bug Description

Describe the problem you are encountering clearly and concisely.

## 🔄 Steps to Reproduce

1. Go to '...'
2. Click on '....'
3. Scroll to '....'
4. See the error

## 🎯 Expected Behavior

Describe the behavior you expect to occur.

## 📸 Screenshot

If applicable, add a screenshot to help explain the issue.

## 🖥️ Environment Information

- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 96, Firefox 95]
- Node.js: [e.g. 16.13.0]
- npm: [e.g. 8.1.0]

## 📋 Additional Information

Add any other relevant context information.
```

---

# 💡 Feature Suggestion

### 1. Feature Request Template

```markdown
## 🚀 Feature Description

Describe the feature you want to implement clearly and concisely.

## 🎯 Problem Context

What problem does this feature solve?

## 💭 Solution

Describe how you would like to implement this feature.

## 🔄 Alternative Solutions

Describe other solutions you have considered.

## 📋 Additional Information

Add any other relevant context, screenshots, or examples.
```

### 2. Feature Discussion

For major features, it is recommended to discuss them first in GitHub Discussions:

1. Create a new discussion topic
2. Describe the feature requirements in detail
3. Collect community feedback
4. Create an issue after reaching a consensus

---

# 👀 Code Review

### 1. Review Standards

- **Functionality**: Does the code work as expected?
- **Readability**: Is the code easy to understand?
- **Performance**: Are there any performance issues?
- **Security**: Are there any security vulnerabilities?
- **Testing**: Is there sufficient test coverage?

### 2. Review Process

1. **Automated Checks**: CI/CD pipeline runs tests automatically
2. **Code Review**: Maintainers and contributors conduct code reviews
3. **Discussion**: Discuss specific implementation details in the PR
4. **Modification**: Make necessary changes based on feedback
5. **Merge**: Merge into the main branch after passing the review

### 3. Review Etiquette

- Maintain a friendly and constructive attitude
- Provide specific suggestions instead of vague criticism
- Explain why a particular change is needed
- Acknowledge good code and ideas

---

# 🏆 Contributor Recognition

### 1. Contributor List

All contributors will be recognized in the project:

- The contributors section in README.md
- Thanks in release notes
- GitHub contributors graph

### 2. Special Contributions

For major contributions, we will:

- Mention them specially in release notes
- Share on social media
- Invite them to become project maintainers

---

# 📞 Getting Help

If you encounter any problems while contributing:

1. **Check Documentation**: First, check the relevant documentation
2. **Search Issues**: Search to see if a similar issue exists
3. **GitHub Discussions**: Ask in the discussion area
4. **Contact Maintainers**: Contact the project maintainers directly

---

# 📜 Code of Conduct

We are committed to providing everyone with a friendly, safe, and welcoming environment. Please adhere to the following guidelines:

- Use friendly and inclusive language
- Respect different opinions and experiences
- Accept constructive criticism gracefully
- Focus on what benefits the community most
- Show empathy to other community members

---

<div align="center">

**Thank you for your contribution! 🙏**

Every contribution makes FlexiResume better!

</div>

## 🌐 Language Versions

- [🇨🇳 中文版本](../zh/CONTRIBUTING.md) 
- [🇺🇸 English Version](CONTRIBUTING.md)(Current)

