/**
 * object
 * @desc      : [note]
 * @author    : yunchen
 * @createdAt : 2017/9/7
 */
import { isArray } from './type';

/**
 * find 方法
 * @param {Array} arr
 * @param {Object} obj
 * @returns {Object}
 */
export const find = (arr, obj) => {
    let key = null; // 所需要寻找的对象的标识
    let result = null;
    for (let i in obj) {
        key = i;
    }
    arr.forEach((value /* , index */) => {
        if (value[key] && (obj[key] === value[key])) {
            result = value;
        }
    });

    return result;
};

/**
 * 将数组转换为对象
 * @param {Array}  arr 数组
 * @param {String} key 索引key
 * @param {Object} obj 可选，返回一个融合了arr 数组的对象
 * @returns {Object || null} 当数组结构不正确时，返回null
 */
export const object = (arr, key, obj = {}) => {
    if (isArray(arr) && arr.length && typeof arr[0] !== 'object') {
        return null;
    }

    for (let item of arr) {
        obj[item[key]] = item;
    }
    return obj;
};



