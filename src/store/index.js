/**
 * Vuex
 */
import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import notice from './modules/notice';
import user from './modules/user';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        notice,
        user
    },
    mutations
});
