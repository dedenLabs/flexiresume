import { action, makeAutoObservable, observable } from 'mobx';
import { IFlexiResume } from '../types/IFlexiResume';
class FlexiResumeStore {
    // 当前合并后的简历信息
    data: IFlexiResume = {};

    // 简历页签
    tabs: [string, number][] = [];

    // 技能等级对照表
    skillMap: [string, number][] = [];

    // 技能数值
    skills: [string, number][] = [];

    // 折叠信息对照表，使用 observable.map 以便 MobX 追踪变化
    collapsedMap = new Map<string, boolean>();

    constructor() {
        makeAutoObservable(this);
    } 
}

const flexiResumeStore = new FlexiResumeStore();
export default flexiResumeStore;
