/**
 * 购物车
 */
import { REFRESH_NOTICE_COUNT } from '../mutation_type';
import * as vendorNotice from '../../api/lib/vendorNotice';

const state = {
    count: null // 默认为null, 0也处理为null
};

const getters = {};

/**
 * 同步操作
 * @type {Object}
 */
const mutations = {
    [REFRESH_NOTICE_COUNT] (state, { count }) {
        state.count = count;
    }
};


/**
 * 异步操作
 * @type {Object}
 */
const actions = {
    refresh ({state, commit, rootState}, data) {
        // 1、请求接口
        vendorNotice.getCount().success(({ count = null }) => {
            // 2、提交数据
            commit({
                type: REFRESH_NOTICE_COUNT,
                count
            });
        });
    }
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
