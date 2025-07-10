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
        "end_time": "2024/11",
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
> Developed a highly customizable resume generator that supports multiple job applications, allowing users to flexibly configure resume content and format to meet the needs of different careers.

**Core Features**  
- **Highly Customizable**: Users can freely customize various parts of the resume according to personal needs to ensure that the resume highlights personal characteristics and advantages, adding more depth information to the resume.
- **Markdown Support**: Supports using Markdown language to write resume content, simplifying the text formatting process and enhancing user experience.
- **Skill Highlighting**: Highlights skills based on user-defined proficiency levels, helping recruiters quickly identify key abilities.
- **Modular Configuration**: Resume data is modularly configured, supporting different parameters and module counts (such as expected salary, number of work experience sections) for different positions.
- **Responsive Design**: Ensures that resumes are displayed well on different devices, adapting to various screen sizes.
- **Portfolio Links and Timelines**: Provides portfolio link functionality and allows embedding timelines to describe skills or growth paths, showcasing the user's career development journey.

The technology stack uses **Vite+React+SWC+TypeScript+Mobx+framer-motion+remark-html**, with no third-party UI framework embedded to maximize support for user customization needs. Through this project, I hope to not only optimize my own job search experience but also help more people find more suitable opportunities.

**Project Achievements**: Provided a flexible and efficient resume generation tool to help users stand out in the job search and receive positive feedback.

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