import { date as d } from '../common/util';
import { qiniuUrl } from '@root/config/global.config.js';
import { object } from '@root/common/util';
/**
 * 格式化
 * @param { String, Number, Date } value
 * @param { String }formatString
 */
export const date = (value = new Date(), formatString = 'YYYY-MM-DD HH:mm') => d.format(new Date(value), formatString);

/**
 * 格式化货币
 * @param { String, Number } value
 * @param { String } format
 * @param { Number } fixed
 */
export const money = (value, format = '¥', fixed = 2) => format + (+value).toFixed(fixed).replace('.00', '');

/**
 * 格式化数字
 * @param { String, Number } value
 * @param { Number } fixed
 */
export const number = (value, fixed = 2) => (+value).toFixed(fixed).replace('.00', '');

/**
 * 千分位‘，’分割
 * @param value
 */
export const thousands = (value = '') => ('' + value).replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,');

/**
 * 七牛
 * @param value
 * @param def
 */
export const qiniu = (value, def) => `${qiniuUrl}/${value}?${def}`;

/**
 * keyValue转换
 * @param value
 */
export const keyValue = (value, arr = [], key = 'id', returnVal = 'name') => {
    let matched = object.find(arr, {[key]: value});
    if (matched) {
        return matched[returnVal];
    }
    return '无';
};
