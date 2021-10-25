/**
 * user
 * @author    : mour
 * @createdAt : 2019/11/29
 */
import { profile } from '../../api';
import { REFRESH_PROFILE } from '../mutation_type';

const state = {
    user: {}
};

const getters = {
    vendor_id: state => state.user.id,
    printing: state => state.user.printing,
    phone: state => state.user.phone,
    openid: state => state.user.openid
};

/**
 * 同步操作
 * @type {Object}
 */
const mutations = {
    [REFRESH_PROFILE] (state, { user }) {
        // 更新列表
        state.user = user;
    }
};


/**
 * 异步操作
 * @type {Object}
 */
const actions = {
    profile ({ state, commit, rootState }, reload = false) {
        if (!_.isEmpty(state.user) && !reload) return;

        return profile().success(data => {
            commit({
                type: REFRESH_PROFILE,
                user: data
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
