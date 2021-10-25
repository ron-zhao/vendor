/**
 * 类型检测
 * @desc      : 提供数组、对象、数字、函数检测
 * @author    : yunchen
 * @createdAt : 2017/9/7
 */

/**
 * 检测是否为数组
 * @param {Array} arr
 */
export const isArray = (arr) => arr && (arr instanceof Array);

/**
 * 检测是否为对象
 * @param {Object} obj
 */
export const isObject = (obj) => obj && (Object.prototype.toString.call(obj) === '[object Object]');

/**
 * 检测是否为数字，NaN 不会被认定为number
 * @param {Number} num
 */
export const isNumber = (num) => !isNaN(num) && (typeof num === 'number');

/**
 * 检测是否为function
 * @param {Function} fn
 */
export const isFunction = (fn) => fn && (typeof fn === 'function');


