import { IFlexiResume, IHeaderInfo } from "../../types/IFlexiResume";
import { assignDeep } from "../../utils/Tools";
/**
 * Lazy loading position data
 *
 * Dynamically load corresponding data files based on different position types,
 * this reduces initial package size and improves first-screen loading speed
 *
 * @param position Position identifier
 * @returns Promise<Position data object>
 */
const loadPositionData = async (position: string) => {
    switch (position) {        
        // Journey to the West team role position data
        case 'xuanzang':
            // Tang Monk - Project Manager/Team Leader
            return (await import("./position/DataXuanzang")).default;
        case 'wukong':
            // Sun Wukong - Chief Technical Expert/Problem Solving Expert
            return (await import("./position/DataWukong")).default;
        case 'bajie':
            // Zhu Bajie - Business Development Manager/Logistics Support Expert
            return (await import("./position/DataBajie")).default;
        case 'wujing':
            // Sha Wujing - Senior Operations Engineer/Quality Assurance Expert
            return (await import("./position/DataWujing")).default;
        default:
            return {};
    }
};

/**
 * Lazy loading complete skills data
 */
const loadSkillsData = async () => {
    const { getSkillsData } = await import("./SkillsData");
    return getSkillsData();
};


export default {
    header_info: {
        "type": "header_info", // Resume header module
        name: "FlexiResume",
        email: "demo@flexiresume.com",
        gender: "Male",
        avatar: "/images/avatar-ai.png",//https://photocartoon.net/ This is a website that converts photos to cartoon images
        location: "Global",
        is_male: "1",// 1 male 0 female display icon
        status: "⚡Feature Demo",//⚡Available-Heavenly Palace 🕐On duty-Arrive within month 🔒On duty-Not changing jobs for now

        // 🌐 Mainstream communication methods - Internationalization support (uncomment to display)
        // phone: "+86-138-0000-0000",
        wechat: "taomeejack",
        // telegram: "@flexiresume",      // Telegram
        // whatsapp: "+86-138-0000-0000", // WhatsApp
        // skype: "flexiresume.demo",     // Skype
        // linkedin: "linkedin.com/in/flexiresume", // LinkedIn
        // discord: "FlexiResume#0000",   // Discord
        // slack: "@flexiresume",         // Slack
        // line: "flexiresume_demo",      // Line (popular in Japan/Korea)
        // kakao: "flexiresume_demo",     // KakaoTalk (popular in South Korea)
        age: "Feature Demo",
        education: "Complete Feature Showcase",
        work_experience_num: "All Feature Features",
        position: "Smart Resume Generator",
        expected_salary: "Open Source Free",

        // Resume name format when saving resume, also browser title format
        resume_name_format: "{position}-{name}-{location}",

        // 🏠 Personal homepage configuration - supports multiple display methods
        home_page: "https://dedenlabs.github.io/flexiresume",
        // home_page: "https://deden.web.app", // Alternative homepage

        // 📁 Static resource directory whitelist - CDN optimization support
        cdn_static_assets_dirs: ["images", "docs", "assets"],

        // 🌐 Base name for static resource directories - supports dynamic and static configuration
        route_base_name: new URL(location.href).pathname.split("/").slice(0, -1).join("/") + "/",// Dynamic acquisition
        // route_base_name: "flexiresume/", // Static configuration example

        // 📱 QR code functionality - supports dynamic generation and fixed URLs
        qrcode: true,// If no specific URL is specified, QR code will be dynamically generated based on current URL, or fill in URL directly to generate fixed QR code
        // qrcode: "https://dedenlabs.github.io/flexiresume",// Generate fixed URL QR code
        qrcode_msg: "Scan to view online resume",// QR code prompt message
    } as IHeaderInfo,
    /**
     * 🎯 Expected Position Configuration - FlexiResume Feature Showcase
     *
     * This showcases all features of FlexiResume, including:
     * - 📱 Multiple communication methods support (WeChat, phone, email, Telegram, WhatsApp, etc.)
     * - 🎨 Personalized avatar and QR code
     * - 🌐 Multi-language and internationalization support
     * - 📊 Different position type data structures
     * - 🔧 Lazy loading and performance optimization
     * - 🛡️ Security protection and data validation
     * - 📋 Flexible modular configuration
     */
    expected_positions: {
         
        // === 🎭 Journey to the West Team Role Position Configuration - Showcasing Creative Theme Features ===
        // Tang Monk - Project Manager/Team Leader
        "xuanzang": {
            is_home_page: true, // Whether to display as homepage
            header_info: { 
                name: "Tang Monk·Chen Xuanzang",
                gender: "Male",
                position: "Team Leader",
                expected_salary: "",
                avatar: "/images/xiyouji/xuanzhan-icon.png",
                location: "East Tang Dynasty·Chang'an",
                email: "xuanzang@datang.gov",
                phone: "+86-138-0000-0001",
                website: "https://xuanzang.datang.gov",
                age: "Adult",
                education: "Master of Buddhist Studies",
                work_experience_num: "14 years of project management experience",
                status: "⚡Heavenly Palace Duty",
                qrcode_msg: "Westward Journey Project Manager",
            }
        },

        // Sun Wukong - Chief Technical Expert/Problem Solving Expert
        "wukong": {
            header_info: {
                name: "Great Sage Equal to Heaven·Sun Wukong",
                gender: "🐵Male Monkey",
                position: "Problem Solving Expert",
                expected_salary: "",
                avatar: "/images/xiyouji/wukong-icon.png", // Use existing image as Sun Wukong avatar
                location: "Flower-Fruit Mountain·Water Curtain Cave",
                email: "wukong@huaguoshan.com",
                phone: "+86-138-0000-0002",
                website: "https://wukong.huaguoshan.com",
                age: "500+ years old",
                education: "Bodhi Patriarch Technical College",
                work_experience_num: "500+ years of technical experience",
                status: "⚡Heavenly Palace Duty",
                qrcode_msg: "Seventy-two Transformations Technical Expert",
            }
        },

        // Zhu Bajie - Business Development Manager/Logistics Support Expert
        "bajie": {
            header_info: {
                name: "Marshal Tianpeng·Zhu Bajie",
                gender: "🐷Male Pig",
                position: "Logistics Support Expert",
                expected_salary: "",
                avatar: "/images/xiyouji/zhubajie-icon.png", // Use existing image as Zhu Bajie avatar
                location: "Gao Lao Zhuang",
                email: "bajie@gaolaozhuang.com",
                phone: "+86-138-0000-0003",
                website: "https://bajie.gaolaozhuang.com",
                age: "Adult",
                education: "Heavenly Palace Management College",
                work_experience_num: "14 years of business development experience",
                status: "⚡Heavenly Palace Duty",
                qrcode_msg: "Business Development Expert",
            }
        },

        // Sha Wujing - Senior Operations Engineer/Quality Assurance Expert
        "wujing": {
            header_info: {
                name: "Curtain-Lifting General·Sha Wujing",
                gender: "Male",
                position: "Quality Assurance Expert",
                expected_salary: "",
                avatar: "/images/xiyouji/wujing-icon.png", // Use existing image as Sha Wujing avatar
                location: "Flowing Sand River",
                email: "wujing@liushahe.com",
                phone: "+86-138-0000-0004",
                website: "https://wujing.liushahe.com",
                age: "Adult",
                education: "Heavenly Palace Military College",
                work_experience_num: "800+ years of operations experience",
                status: "⚡Heavenly Palace Duty",
                qrcode_msg: "Operations Quality Expert",
            }
        }, 
    },

    /**
     * 🚀 FlexiResume Feature Description
     *
     * This configuration file demonstrates all core features of FlexiResume:
     *
     * 📱 Communication Methods Support:
     * - phone: Phone number
     * - wechat: WeChat ID
     * - telegram: Telegram username
     * - whatsapp: WhatsApp number
     * - skype: Skype username
     * - linkedin: LinkedIn profile
     * - discord: Discord username
     * - slack: Slack username
     * - line: Line username (popular in Japan/Korea)
     * - kakao: KakaoTalk username (popular in South Korea)
     *
     * 🎨 Personalization Configuration:
     * - avatar: Personal avatar (supports multiple formats)
     * - qrcode: QR code generation (dynamic/fixed URL)
     * - qrcode_msg: QR code prompt message
     * - home_page: Personal homepage link
     * - status: Work status (⚡Heavenly Palace Duty 🕐Arrive within month 🔒Not changing jobs for now)
     *
     * 🌐 Internationalization Features:
     * - Multi-language interface support
     * - Global communication methods support
     * - Support for different regional cultural habits
     *
     * 📊 Data Management:
     * - Lazy loading performance optimization
     * - Modular data structure
     * - Flexible configuration system
     *
     * 🛡️ Security Features:
     * - XSS protection
     * - Content Security Policy (CSP)
     * - Data validation and filtering
     *
     * 🎯 Position Types:
     * - Technical: Frontend, Backend, Full Stack, AI, Game Development
     * - Management: Project Manager, Technical Lead
     * - Consulting: Technical Consultant, Outsourcing Services
     * - Creative: Journey to the West themed roles
     * - Design: UI/UX Designer
     * - Internationalization: Multi-language support expert
     */

    // Export lazy loading functions for external use
    loadPositionData,
    loadSkillsData
}// as IFlexiResume; // 这里不关联编辑是更友好,能直接跳转到配置位置