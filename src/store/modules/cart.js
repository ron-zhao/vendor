/**
 * 购物车
 */
import { REFRESH_CART } from '../mutation_type';

const state = {
    list: [],
    length: 0
};


const getters = {

};


/**
 * 同步操作
 * @type {Object}
 */
const mutations = {
    [REFRESH_CART] (state, list) {
        // 更新列表
        state.list = list;
        state.length = list.length;
    }
};


/**
 * 异步操作
 * @type {Object}
 */
const actions = {
    refresh ({ state, commit, rootState }, data) {
        // 1、请求接口

        // 2、提交数据
        commit({
            type: REFRESH_CART,
            list: null
        });
    }
};


export default {
    state,
    getters,
    actions,
    mutations
};
