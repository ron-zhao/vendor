/**
 * helper
 * 开发辅助，用于封装一些常用函数
 * @author    : yunchen
 * @createdAt : 20/07/2018
 */
import _ from 'underscore';

/**
 * 传入多个数组
 * @param datas 更多数组
 */
export const convert2chart = (...datas) => {
    let obj = {};

    _.flatten(datas).forEach(item => {
        if (obj[item.key]) {
            obj[item.key].push(item.value);
        } else {
            obj[item.key] = [item.key, item.value];
        }
    });

    return _.values(obj);
};
