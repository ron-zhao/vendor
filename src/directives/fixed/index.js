/**
 * wap-mall-v2 > index.js
 * @desc      : [note]
 * @author    : yunchen
 * @createdAt : 2017/10/13
 */

import {FixedHelper} from './model';

// 初始化一个FixedHelper 对象
const fixedHelper = new FixedHelper();

export default {
    inserted (el, {value = 0, modifiers}, {data, context}) {
        // 初始化fixed数据
        fixedHelper.push(el, {
            uid: context._uid, // 唯一标志，在更新dom时用
            topOrBottom: modifiers.top || modifiers.buttom, // 判断是否定点
            unit: data.attrs ? data.attrs.unit : 'px', // 单位
            calb: data.attrs ? data.attrs.calb : null, // 回调
            value
        });
    },
    update (el, {value = 0}, {data, context}) {
        // 该组件中只有这三个参数
        fixedHelper.update(context._uid, {
            unit: data.attrs ? data.attrs.unit : 'px', // 单位
            calb: data.attrs ? data.attrs.calb : null, // 回调
            value
        });
    }
};
