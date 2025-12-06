import debug from "debug";

/** 获取日志 */
export function getLogger(moduleName: string) {
    return debug('app:' + moduleName);
}