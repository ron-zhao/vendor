/**
 * wap-mall-v2 > index.js
 * @desc      : 指令
 * @author    : yunchen
 * @createdAt : 2017/10/11
 */
import Vue from 'vue';
import fixed from './fixed';

export default function () {
    Vue.directive('fixed', fixed);
}
