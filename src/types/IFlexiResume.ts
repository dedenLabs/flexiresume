export interface IModuleInfo {
    type: string; // 类型
    name: string; // 名称
    hidden?: boolean, // 是否隐藏,默认显示
}
// 简历信息
export interface IHeaderInfo extends IModuleInfo {
    email: string; // 邮箱
    gender: string; // 性别
    location: string;   // 地址
    is_male: string; // 性别
    phone: string; // 电话
    wechat: string; // 微信
    status: string; // 状态
    age: string; // 年龄
    education: string; // 学历
    work_experience_num: string; // 工作年限
    position: string; // 职位
    expected_salary: string; // 期望薪资
    resume_name_format: string; // 简历名称
}
// 技能等级
export interface ISkillLevel extends IModuleInfo {
    list: [string, number][];
}



// 工作经历
export interface EmploymentHistoryItemProps {
    key: number; // 索引
    company_name: string; // 公司名称
    start_time: string; // 开始时间
    end_time: string; // 结束时间
    position: string; // 职位
    description: string; // 描述
    collapsed: boolean, // 是否折叠
    onToggleCollapse: () => void, // 折叠事件
}

// 期望职位信息
export interface IExpectedPosition {
    [key: string]: IFlexiResume;
}

// 类型别名，包含所有可能的类型
export type IModuleTypes = IModuleInfo | IHeaderInfo | ISkillLevel | IDataEducationInfo | IExpectedPosition;

export interface IFlexiResume {
    header_info: IHeaderInfo; // 简历信息
    skill_level: ISkillLevel; // 技能等级
    expected_positions: IExpectedPosition; // 期望职位
    [key: string]: IModuleTypes; // 类型别名，包含所有可能的类型
}