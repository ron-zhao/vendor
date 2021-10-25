/**
 * date
 * @desc      : 日期处理
 * @author    : yunchen
 * @createdAt : 2017/9/18
 */

/**
 * 格式化
 * @param { Date } day
 * @param { String } fmt
 * @returns { String } time
 */
export const format = (day = new Date(), fmt = 'YYYY-MM-DD HH:mm:ss') => {
    let o = {
        'M+': day.getMonth() + 1, // 月份
        'D+': day.getDate(), // 日
        'H+': day.getHours(), // 小时
        'm+': day.getMinutes(), // 分
        's+': day.getSeconds(), // 秒
        'q+': Math.floor((day.getMonth() + 3) / 3), // 季度
        'S': day.getMilliseconds() // 毫秒
    };
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (day.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return fmt;
};
