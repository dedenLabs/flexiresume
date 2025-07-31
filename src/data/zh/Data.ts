import { IFlexiResume, IHeaderInfo } from "../../types/IFlexiResume";
import { assignDeep } from "../../utils/Tools";
/**
 * 懒加载职位数据
 *
 * 根据不同的职位类型动态加载对应的数据文件，
 * 这样可以减少初始包大小，提升首屏加载速度
 *
 * @param position 职位标识符
 * @returns Promise<职位数据对象>
 */
const loadPositionData = async (position: string) => {
    switch (position) {        
        // 西游记团队角色职位数据
        case 'xuanzang':
            // 唐僧 - 项目经理/团队领导
            return (await import("./position/DataXuanzang")).default;
        case 'wukong':
            // 孙悟空 - 首席技术专家/问题解决专家
            return (await import("./position/DataWukong")).default;
        case 'bajie':
            // 猪八戒 - 业务拓展经理/后勤保障专家
            return (await import("./position/DataBajie")).default;
        case 'wujing':
            // 沙僧 - 高级运维工程师/质量保证专家
            return (await import("./position/DataWujing")).default;
        default:
            return {};
    }
};

/**
 * 懒加载完整技能数据
 */
const loadSkillsData = async () => {
    const { getSkillsData } = await import("./SkillsData");
    return getSkillsData();
};


export default {
    header_info: {
        "type": "header_info", // 简历头部模块
        name: "FlexiResume",
        email: "demo@flexiresume.com",
        gender: "男",
        avatar: "images/avatar-ai.png",//https://photocartoon.net/ 这是一个将照片转换为卡通形象的网站
        location: "全球",
        is_male: "1",// 1男 0女 显示图标
        status: "⚡功能展示",//⚡离职-天庭当职 🕐在职-月内到岗 🔒在职-暂不换工作

        // 🌐 主流通讯方式 - 国际化支持（取消注释后显示）
        // phone: "+86-138-0000-0000",
        wechat: "taomeejack",
        // telegram: "@flexiresume",      // Telegram
        // whatsapp: "+86-138-0000-0000", // WhatsApp
        // skype: "flexiresume.demo",     // Skype
        // linkedin: "linkedin.com/in/flexiresume", // LinkedIn
        // discord: "FlexiResume#0000",   // Discord
        // slack: "@flexiresume",         // Slack
        // line: "flexiresume_demo",      // Line (日韩流行)
        // kakao: "flexiresume_demo",     // KakaoTalk (韩国流行)
        age: "功能演示",
        education: "完整功能展示",
        work_experience_num: "所有功能特性",
        position: "智能简历生成器",
        expected_salary: "开源免费",

        //用来保存简历时的简历名称格式,同时也是浏览器title的格式
        resume_name_format: "{position}-{name}-{location}",

        // 🏠 个人主页配置 - 支持多种显示方式
        home_page: "https://dedenlabs.github.io/flexiresume",
        // home_page: "https://deden.web.app", // 备用主页

        // 📁 静态资源目录白名单 - CDN优化支持
        cdn_static_assets_dirs: ["images", "docs", "assets"],

        // 🌐 静态资源目录的基础名称 - 支持动态和静态配置
        route_base_name: new URL(location.href).pathname.split("/").slice(0, -1).join("/") + "/",// 动态获取
        // route_base_name: "flexiresume/", // 静态配置示例

        // 📱 二维码功能 - 支持动态生成和固定URL
        qrcode: true,// 不指定特定URL会默认根据当前URL地址动态生成二维码,或直接填写URL地址生成固定的二维码
        // qrcode: "https://dedenlabs.github.io/flexiresume",// 生成固定的URL地址二维码
        qrcode_msg: "扫码查看在线简历",//二维码提示信息
    } as IHeaderInfo,
    /**
     * 🎯 期望职位配置 - FlexiResume 功能展示
     *
     * 这里展示了FlexiResume的所有功能特性，包括：
     * - 📱 多种通讯方式支持 (微信、电话、邮箱、Telegram、WhatsApp等)
     * - 🎨 个性化头像和二维码
     * - 🌐 多语言和国际化支持
     * - 📊 不同职位类型的数据结构
     * - 🔧 懒加载和性能优化
     * - 🛡️ 安全防护和数据验证
     * - 📋 灵活的模块化配置
     */
    expected_positions: {
         
        // === 🎭 西游记团队角色职位配置 - 展示创意主题功能 ===
        // 唐僧 - 项目经理/团队领导
        "xuanzang": {
            is_home_page: true, // 是否作为主页展示
            header_info: { 
                name: "唐僧·陈玄奘",
                gender: "男",
                position: "团队领导",
                expected_salary: "",
                avatar: "images/xiyouji/xuanzhan-icon.png",
                location: "东土大唐·长安",
                email: "xuanzang@datang.gov",
                phone: "+86-138-0000-0001",
                website: "https://xuanzang.datang.gov",
                age: "成年",
                education: "佛学硕士",
                work_experience_num: "14年项目管理经验",
                status: "⚡天庭当职",
                qrcode_msg: "西天取经项目经理",
            }
        },

        // 孙悟空 - 首席技术专家/问题解决专家
        "wukong": {
            header_info: {
                name: "齐天大圣·孙悟空",
                gender: "🐵公猴",
                position: "问题解决专家",
                expected_salary: "",
                avatar: "images/xiyouji/wukong-icon.png", // 使用现有图片作为孙悟空头像
                location: "花果山·水帘洞",
                email: "wukong@huaguoshan.com",
                phone: "+86-138-0000-0002",
                website: "https://wukong.huaguoshan.com",
                age: "500+岁",
                education: "菩提祖师技术学院",
                work_experience_num: "500+年技术经验",
                status: "⚡天庭当职",
                qrcode_msg: "七十二变技术专家",
            }
        },

        // 猪八戒 - 业务拓展经理/后勤保障专家
        "bajie": {
            header_info: {
                name: "天蓬元帅·猪八戒",
                gender: "🐷公猪",
                position: "后勤保障专家",
                expected_salary: "",
                avatar: "images/xiyouji/zhubajie-icon.png", // 使用现有图片作为猪八戒头像
                location: "高老庄",
                email: "bajie@gaolaozhuang.com",
                phone: "+86-138-0000-0003",
                website: "https://bajie.gaolaozhuang.com",
                age: "成年",
                education: "天庭管理学院",
                work_experience_num: "14年业务拓展经验",
                status: "⚡天庭当职",
                qrcode_msg: "业务拓展专家",
            }
        },

        // 沙僧 - 高级运维工程师/质量保证专家
        "wujing": {
            header_info: {
                name: "卷帘大将·沙悟净",
                gender: "男",
                position: "质量保证专家",
                expected_salary: "",
                avatar: "images/xiyouji/wujing-icon.png", // 使用现有图片作为沙悟净头像
                location: "流沙河",
                email: "wujing@liushahe.com",
                phone: "+86-138-0000-0004",
                website: "https://wujing.liushahe.com",
                age: "成年",
                education: "天庭军事学院",
                work_experience_num: "800+年运维经验",
                status: "⚡天庭当职",
                qrcode_msg: "运维质量专家",
            }
        }, 
    },

    /**
     * 🚀 FlexiResume 功能特性说明
     *
     * 本配置文件展示了FlexiResume的所有核心功能：
     *
     * 📱 通讯方式支持：
     * - phone: 电话号码
     * - wechat: 微信号
     * - telegram: Telegram用户名
     * - whatsapp: WhatsApp号码
     * - skype: Skype用户名
     * - linkedin: LinkedIn个人资料
     * - discord: Discord用户名
     * - slack: Slack用户名
     * - line: Line用户名 (日韩流行)
     * - kakao: KakaoTalk用户名 (韩国流行)
     *
     * 🎨 个性化配置：
     * - avatar: 个人头像 (支持多种格式)
     * - qrcode: 二维码生成 (动态/固定URL)
     * - qrcode_msg: 二维码提示信息
     * - home_page: 个人主页链接
     * - status: 工作状态 (⚡天庭当职 🕐月内到岗 🔒暂不换工作)
     *
     * 🌐 国际化功能：
     * - 支持多语言界面
     * - 支持全球通讯方式
     * - 支持不同地区的文化习惯
     *
     * 📊 数据管理：
     * - 懒加载优化性能
     * - 模块化数据结构
     * - 灵活的配置系统
     *
     * 🛡️ 安全特性：
     * - XSS防护
     * - 内容安全策略(CSP)
     * - 数据验证和过滤
     *
     * 🎯 职位类型：
     * - 技术类：前端、后端、全栈、AI、游戏开发
     * - 管理类：项目经理、技术负责人
     * - 咨询类：技术顾问、外包服务
     * - 创意类：西游记主题角色
     * - 设计类：UI/UX设计师
     * - 国际化：多语言支持专家
     */

    // 导出懒加载函数供外部使用
    loadPositionData,
    loadSkillsData
}// as IFlexiResume; // 这里不关联编辑是更友好,能直接跳转到配置位置