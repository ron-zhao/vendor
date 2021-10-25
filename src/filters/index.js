import Vue from 'vue';
import * as filter from './filter';
// 初始化
export default function () {
    for (let key in filter) {
        Vue.filter(key, filter[key]);
    };
}
