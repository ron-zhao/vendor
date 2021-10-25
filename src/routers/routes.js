/**
 * routes
 * @desc      : 路由配置文件
 * @author    : yunchen
 * @createdAt : 2017/9/18
 */
import App from '../App.vue';
import message from './lib/message';
import home from './lib/home';

export default [
    {
        path: '/login',
        name: 'login',
        meta: { title: '供应商系统登录' },
        component: () => import('../views/user/login.vue')
    },
    {
        name: '404',
        path: '404',
        meta: { title: '404' },
        component: () => import('../views/user/404.vue')
    },
    {
        path: '/',
        component: App,
        meta: { title: '供应商系统' },
        children: [
            ...home,
            ...message
        ]
    }
];





