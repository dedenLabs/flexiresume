/**
 * Open Source Projects Data Module
 * Unified as object structure, including content_head and list
 */

export default {
    content_head: ``,
    list: [
    {
        "company_name": "FlexiResume Multi-Position Custom Resume Generator",
        "start_time": "2024/10",
        "end_time": "Ongoing",
        "position": "Completed Independently",
        "description": `
<p align="center">
    <img class="no-effect-icon" src="images/flexiresume.webp" alt="FlexiResume" style="width:60%">
</p>
<p align="center" style="font-size:3rem">
FlexiResume
</p>

**Project Origin:**

> When looking for a job, I found that even for some **1-3 years of experience positions**, my resume was repeatedly marked as "unsuitable" or "experience differences".
I began to think about the reasons, exploring possibilities such as age, education, salary requirements, etc.
Although my experience and abilities fully meet the job requirements, and the salary is within the job requirements range, the resume seems to fail to accurately convey my core competitiveness.

> This situation made me realize that **resumes need to be personalized according to the specific needs of the position**, so that recruiters can quickly find the information they need.
Out of this need, I designed this open-source project, aiming to provide myself and others with a **highly customizable, extensible resume generation tool**.


**Project Overview**
> Developed a highly customizable resume generator that supports multiple job applications, allowing users to flexibly configure resume content and format to meet the needs of different careers. FlexiResume is a technologically advanced, architecturally clear, and feature-complete modern resume generator. The project adopts industry best practices, has good code quality and extensibility. Through intelligent CDN management, multi-position customization, Mermaid chart integration, multi-language support, theme switching, and other special features, it provides users with an excellent resume presentation experience. The project continues to iterate and optimize, constantly enhancing user experience and feature completeness.

**Core Features**
- **Multi-Position Customization**: Supports 6 position modes (AI Engineer, Full-stack Developer, Frontend Developer, Backend Developer, Game Developer, CTO), each position displays different skill focuses and project experiences.
- **Smart PDF Export**: Provides three PDF export modes (Original, Color, Grayscale) to meet different scenario needs, supporting mainstream browsers like Chrome.
- **Multi-language Support**: Complete Chinese-English bilingual support, including internationalization of interface text and resume content.
- **Theme Switching**: Supports light/dark theme switching, providing a comfortable reading experience.
- **Mermaid Chart Integration**: Supports various visualization charts such as skill distribution charts, ability radar charts, project timelines, with lazy loading and zoom functionality.
- **Intelligent CDN Management**: Multi-CDN source intelligent switching ensures resource loading stability and speed.
- **Skill Highlighting**: Intelligently highlights skills based on user-defined proficiency levels, helping recruiters quickly identify key abilities.
- **Responsive Design**: Ensures that resumes are displayed well on different devices, adapting to various screen sizes.
- **Performance Optimization**: Multiple performance optimization techniques including skeleton screen loading, lazy loading, code splitting.
- **Security Protection**: Security mechanisms including XSS protection, data validation, secure Markdown processing.

**Technical Architecture**
The technology stack uses **React 18 + TypeScript + Vite + Styled Components + MobX + Framer Motion + Mermaid**, with no third-party UI framework embedded to maximize support for user customization needs. Adopts modular architecture design, supporting on-demand loading and extension.

**Testing & Quality Assurance**
- **Automated Testing**: Uses Playwright for end-to-end testing to ensure functional stability
- **Code Quality**: 100% TypeScript coverage, ESLint code standard checking
- **Performance Monitoring**: Integrated Baidu Analytics, Google Analytics, ELK Stack and other multi-dimensional data analysis
- **Continuous Integration**: GitHub Actions automated build and deployment

**Project Achievements**: Provided a feature-complete, technologically advanced resume generation tool to help users stand out in job searches. The project has high code quality, clear architecture, good extensibility and maintainability, and can serve as a best practice reference for modern frontend projects.

#### [FlexiResume Open Source Project ![github](/images/github.svg) *https://github.com/dedenLabs/FlexiResume.git*](https://github.com/dedenLabs/FlexiResume.git)
> 
`
    },
    {
        "company_name": "XCast Configuration Generation Collaboration Tool",
        "start_time": "2024/09",
        "end_time": "Present",
        "position": "Completed Independently",
        "description": `---
<p align="center">
    <img class="no-effect-icon" src="images/xcast.webp" alt="XCast" style="width:60%">
</p>
    <p align="center" style="font-size:3rem">
XCast
</p>

**Project Overview**  
> XCast is an Excel conversion tool designed specifically for game development, software configuration management, and other fields, supporting efficient conversion of Excel files to JSON or CSV formats.
This tool is particularly suitable for projects that rely on complex data configurations and multi-person collaboration (such as numerical planning or configuration information management),
it can generate parsing class files for various programming languages and frameworks, providing code hints and Markdown format comments for users, greatly improving development efficiency and data management standardization.

**Project Achievements**  
> The XCast project once participated in the **Wing IDE Developer Plugin Competition** hosted by Egret White鹭 Engine and won the first prize.
This version is a desktop application based on Adobe Air, developed with AS3 language, with complete functions but not conducive to modern expansion.
With the increasing demand for open source, the source code conversion work has recently been launched, aiming to support a wider range of development environments and user needs, and the open-source release is also imminent.

> #### [XCast Open Source Project ![github](/images/github.svg) *https://github.com/dedenLabs/XCast.git*](https://github.com/dedenLabs/XCast.git)

**Core Features**  

- **Multi-Language Support**: Facilitates the application of global projects, supporting multi-language configuration.
- **Strict Typing and Complex Fields**: Provides strict type checking for fields and supports flexible configuration of complex field relationships (such as "reference", "interface", "nested"), ensuring data consistency and integrity.
- **Multi-Platform Parsing Class Generation**: Can generate parsing classes for various target environments (such as TypeScript, Unity, Unreal Engine, Node.js, Go, Python, C++, etc.), providing developers with efficient code ready to use.
- **Code Hints and Comment Support**: The generated parsing class files support code hints and automatically obtain comments (Markdown format) from Excel, facilitating developers to quickly grasp the configuration content.

**Application Scenarios**  
XCast is particularly suitable for game development projects and enterprise software configuration management needs that require high configuration file and numerical settings:

- **Game Development**: Suitable for numerical planning, logic configuration, and multi-person real-time collaboration development projects, solving version management and data consistency issues.
- **Enterprise Software Configuration**: Suitable for managing and standardizing configuration data of software projects, achieving efficient synchronization, conversion, and use.

**Technology Stack**  
XCast will be refactored using modern technology stacks to enhance scalability and adaptability, enabling it to run efficiently on various development environments and systems.
`
    },
    ]
};