/**
 * index
 * @desc      : 路由配置入口文件
 * @author    : yunchen
 * @createdAt : 2017/9/18
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import RouterEvent from './event';
import routes from './routes';

Vue.use(VueRouter);

// 初始化路由
const router = new VueRouter({
    /**
     * @scrollBehavior
     * @type {String}
     */
    // mode: 'history',
    /**
     * @mode
     * 如果你要模拟『滚动到锚点』的行为：
     * 官方列子：
     * scrollBehavior (to, from, savedPosition) {
     *     if (to.hash) {
     *      return {
     *         selector: to.hash
     *       }
     *     }
     *  }
     *
     * 当前代码：
     * savedPosition = { selector: some_hash}
     *
     * @return { Object }
     */
    scrollBehavior (to, from, savedPosition = { x: 0, y: 0 }) {
        return (savedPosition);
    },
    routes
});


// 初始化路由监听
RouterEvent(router);

export default router;





