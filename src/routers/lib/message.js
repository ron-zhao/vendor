import component from '../../components/KeepAliveBox';

const message = [
    {
        name: 'message.page',
        path: '',
        meta: {
            title: '消息通知',
            keepAlive: true
        },
        component: () => import('../../views/message/index.vue')
    },
    {
        name: 'message.page.info',
        path: ':id',
        meta: {
            title: '消息详情'
        },
        component: () => import('../../views/message/info.vue')
    }
];

export default [{
    name: 'message',
    path: 'message',
    component,
    redirect: {
        name: 'message.page'
    },
    children: [
        ...message
    ]
}];
