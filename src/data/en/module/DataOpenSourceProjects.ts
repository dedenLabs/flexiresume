/**
 * Open Source Project Data Module
 * Unified as an object structure, including content_head and list
 */

export default {
    content_head: ``,
    list: [
        {
            "company_name": "FlexiResume Multi-Position Custom Resume Generator",
            "start_time": "2024/10",
            "end_time": "Continuous updates",
            "position": "Completed independently",
            "description": `
<p align="center">
    <img class="no-effect-icon" src="images/flexiresume.webp" alt="FlexiResume" style="width:60%">
</p>
<p align="center" style="font-size:3rem">
FlexiResume
</p>

**Project Overview**
> Developed a highly customizable resume generator that supports multi-position applications. Users can flexibly configure the content and format of their resumes to meet different professional needs. FlexiResume is a modern resume generator with advanced technology, clear architecture, and comprehensive features. The project adopts industry best practices, ensuring good code quality and scalability. With features like smart CDN management, multi-position customization, Mermaid chart integration, multi-language support, and theme switching, it provides an excellent resume display experience. The project continues to iterate and optimize, constantly enhancing user experience and functional completeness.

**Project Rating**: ⭐⭐⭐⭐⭐ (5/5)
**Recommended Level**: Highly Recommended
**Technical Level**: Industry-Leading

**Core Features**
- **Multi-Position Customization**: Supports 6 position modes (AI Engineer, Full-Stack Developer, Front-End Developer, Back-End Developer, Game Developer, CTO), each showcasing different skill highlights and project experiences.
- **Smart PDF Export**: Offers three PDF export modes (Original, Color, Black and White) to meet different scenarios and supports mainstream browsers like Chrome.
- **Multi-Language Support**: Complete bilingual support (Chinese and English), including internationalized interface text and resume content.
- **Theme Switching**: Supports light/dark theme switching, providing a comfortable reading experience.
- **Mermaid Chart Integration**: Supports various visual charts like skill distribution, capability radar, and project timelines, with lazy loading and zoom features.
- **Smart CDN Management**: Intelligent switching between multiple CDN sources to ensure stable and fast resource loading.
- **Skill Highlighting**: intelligently highlights skills based on user-defined proficiency, helping recruiters quickly identify key abilities.
- **Responsive Design**: Ensures resumes display well on different devices and adapts to various screen sizes.
- **Performance Optimization**: Uses techniques like skeleton screen loading, lazy loading, and code splitting for performance optimization.
- **Security Measures**: Includes XSS protection, data validation, and secure Markdown handling.

**Technical Architecture**
The tech stack uses **React 18 + TypeScript + Vite + Styled Components + MobX + Framer Motion + Mermaid**, and the project does not embed any third-party UI frameworks to the maximum extent to support users' personalized adjustments. It adopts a modular architecture design, supporting on-demand loading and expansion.

**Testing and Quality Assurance**
- **Automated Testing**: Uses Playwright for end-to-end testing to ensure functional stability.
- **Code Quality**: 100% TypeScript coverage, ESLint code style checks.
- **Performance Monitoring**: Integrated with Baidu Statistics, Google Analytics, ELK Stack for multi-dimensional data analysis.
- **Continuous Integration**: GitHub Actions for automated building and deployment.

**Project Outcomes**: Provided a comprehensive and technologically advanced resume generation tool to help users stand out in their job applications. The project has high code quality, a clear architecture, good scalability, and maintainability, serving as a best practice reference for modern front-end projects.

#### [FlexiResume Open Source Project ![github](/images/github.svg) *https://github.com/dedenLabs/FlexiResume.git*](https://github.com/dedenLabs/FlexiResume.git)
> 
`
        },
        {
            "company_name": "XCast Configuration Generation Collaboration Tool",
            "start_time": "2024/09",
            "end_time": "To date",
            "position": "Completed independently",
            "description": `--- 
<p align="center">
    <img class="no-effect-icon" src="images/xcast.webp" alt="XCast" style="width:60%">
</p>
    <p align="center" style="font-size:3rem">
XCast
</p>

**Project Overview**  
> XCast is an Excel conversion tool designed specifically for game development, software configuration management, and other fields. It efficiently converts Excel files to JSON or CSV formats.
This tool is particularly suitable for projects that rely on complex data configurations and multi-person collaboration (e.g., numerical planning or configuration information management),
it can generate parsing class files for multiple programming languages and frameworks, providing code hints and Markdown-formatted comments to greatly improve development efficiency and data management standardization. 

**Project Achievements**  
> The XCast project participated in the **Wing IDE Developer Plugin Competition** organized by the Egret White Bird Engine and won first prize.
This version is a desktop application based on Adobe Air, developed with AS3 language, fully functional but not conducive to modern expansion.
With the growing demand for open-source, the source code conversion has recently been started with the goal of supporting a broader development environment and user needs, and the open-source release is imminent. 

> #### [XCast  Open Source Project ![github](/images/github.svg)  *https://github.com/dedenLabs/XCast.git*](https://github.com/dedenLabs/XCast.git)

**Core Features**  

- **Multi-Language Support**: Facilitates global project applications, supporting multi-language configurations.
- **Strict Types and Complex Fields**: Offers strict type checking for fields, supporting flexible configuration of complex field relationships (e.g., "reference," "interface," "nested") to ensure data consistency and completeness.
- **Multi-Platform Parsing Class Generation**: Can generate parsing classes for multiple target environments (such as TypeScript, Unity, Unreal Engine, Node.js, Go, Python, C++), providing developers with ready-to-use efficient code.
- **Code Hints and Comment Support**: The generated parsing class files support code hints and automatically retrieve comments from Excel in Markdown format, enabling developers to quickly grasp the configuration content. 

**Applicable Scenarios**  
XCast is particularly suitable for game development projects and enterprise software configuration management needs with high requirements for configuration files and numerical settings:

- **Game Development**: Suitable for development projects involving numerical planning, logical configuration, and real-time multi-person collaboration, solving version management and data consistency challenges.
- **Enterprise Software Configuration**: Suitable for managing and standardizing configuration data of software projects, achieving efficient synchronization, conversion, and usage. 

**Tech Stack**  
XCast will be refactored using modern tech stacks to enhance expandability and adaptability, enabling it to run efficiently across multiple development environments and systems. 

`
        },
    ]
};

