/**
 * wap-sup > tool
 * @desc      : 工具类
 * @author    : yunchen
 * @createdAt : 2017/9/18
 */
import { isFunction, isArray, isObject } from './type';
import $cookie from 'js-cookie';

/**
 * 防抖
 * @param  {Function} calb 需要执行的函数
 * @param  {Number}   time 方法执行间隔时间
 * @return {Function} 调用方法
 */
export const debounce = (calb, time) => {
    let calbTimer = null;

    // 参数类型验证
    if (!isFunction(calb)) {
        throw new TypeError('Expected a function');
    }

    // 参数类型转换
    time = +time;

    return () => {
        clearTimeout(calbTimer);
        // retFn 参数
        let arg = arguments;
        // 回调函数
        calbTimer = setTimeout(function () {
            calb.apply(null, arg);
        }, time);
    };
};

/**
 * 本地存储，在某些情况下无法存储
 * 存储在cookie和localStorage中
 *  1. 环境为ios新版本（具体不知）
 *  2. 在unload 或者 beforeunload 中操作
 * @type {{get: (function(*=)), set: (function(*=, *=)), rm: (function(*=))}}
 */
export const $local = {
    get (key) {
        // 如果内容为对象或者数组（解析）
        let str = $cookie.get(key, {path: '/'}) || localStorage.getItem(key);
        // 匹配成对的箭头符号
        if (/[{|[].*[}|\]]/g.test(str)) {
            try {
                return JSON.parse(str);
            } catch (e) {
                return null;
            }
        }
        return str;
    },
    set (key, value) {
        // 赋值， 如果值为对象 -> 格式化
        if (isArray(value) || isObject(value)) {
            value = JSON.stringify(value);
        }
        $cookie.set(key, value, { expires: 9999, path: '/' });
        localStorage.setItem(key, value);
        return $cookie.get(key);
    },
    rm (key) {
        let b = $cookie.get(key, {path: '/'}) || $local.get(key);
        $cookie.remove(key, {path: '/'});
        localStorage.removeItem(key);
        return b;
    }
};

/**
 * 获取？后面的参数
 * @param key
 * @returns {null}
 */
export const $query = function (key) {
    let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)');
    let r = window.location.search.substring(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
};
