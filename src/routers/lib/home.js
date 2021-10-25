import component from '../../components/KeepAliveBox';

const home = [
    {
        name: 'home.page',
        path: 'page',
        meta: {
            title: '供应商系统',
            keepAlive: true
        },
        component: () => import('../../views/user/index.vue')
    }
];

const statistic = [
    {
        name: 'home.statistics',
        path: 'statistics/:type?',
        meta: {
            title: '数据统计'
        },
        component: () => import('../../views/statistics/index')
    }
];

const setting = [
    {
        name: 'home.setting',
        path: 'setting',
        meta: { title: '设置' },
        component: () => import('../../views/setting/setting.vue')
    },
    {
        name: 'home.setting.pwd',
        path: 'setting/pwd',
        meta: { title: '修改密码' },
        component: () => import('../../views/setting/changePwd.vue')
    },
    {
        name: 'home.setting.print',
        path: 'setting/print',
        meta: { title: '打印设置' },
        component: () => import('../../views/setting/print.vue')
    }
];

const purchaseList = [
    {
        name: 'home.purchaseList',
        path: 'purchaseList',
        meta: {
            title: '采购单列表',
            keepAlive: true
        },
        component: () => import('../../views/purchaseList/purchaseList.vue')
    },
    {
        name: 'home.purchaseList.info',
        path: 'purchaseList/purchaseInfo',
        meta: {title: '采购单详情'},
        component: () => import('../../views/purchaseList/purchaseInfo.vue')
    },
    {
        name: 'home.purchaseList.share',
        path: 'purchaseList/share',
        meta: { title: '采购单详情' },
        component: () => import('../../views/purchaseList/purchaseInfo.vue')
    },
    {
        name: 'home.purchaseList.printByOneCar',
        path: 'purchaseList/printByOneCar',
        meta: { title: '采购单打印' },
        component: () => import('../../views/purchaseList/printByOneCar.vue')
    },
    {
        name: 'home.purchaseList.printByAllCar',
        path: 'purchaseList/printByAllCar',
        meta: {title: '采购单打印'},
        component: () => import('../../views/purchaseList/printByAllCar.vue')
    }
];

const onlineIn = [
    {
        name: 'home.onlineIn',
        path: 'onlineIn',
        meta: {title: '在线录单'},
        component: () => import('../../views/onlineIn/list.vue')
    }
];

const historyLog = [
    {
        name: 'home.historyLog',
        path: 'historyLog',
        meta: {title: '历史单据'},
        component: () => import('../../views/onlineIn/log.vue')
    }
];

const myPrice = [
    {
        name: 'home.myPrice',
        path: 'myPrice',
        meta: {title: '商品报价'},
        component: () => import('../../views/myPrice/list.vue')
    }
];

const priceLog = [
    {
        name: 'home.priceLog',
        path: 'priceLog',
        meta: {title: '报价记录'},
        component: () => import('../../views/myPrice/log.vue')
    }
];

const orderList = [
    {
        name: 'home.orderList',
        path: 'orderList',
        meta: {title: '预订订单列表'},
        component: () => import('../../views/orderList/list.vue')
    }
];

const tempList = [
    {
        name: 'home.tempList',
        path: 'tempList',
        meta: {
            title: '临时加单',
            keepAlive: true
        },
        component: () => import('../../views/purchaseList/purchaseList.vue')
    },
    {
        name: 'home.tempList.info',
        path: 'tempList/:id',
        meta: {title: '采购单详情'},
        component: () => import('../../views/purchaseList/purchaseInfo.vue')
    }
];

const newNotice = [
    {
        name: 'home.newNotice',
        path: 'newNotice',
        meta: {
            title: '提报申请',
            keepAlive: true
        },
        component: () => import('../../views/newNotice/list.vue')
    },
    {
        name: 'home.newNotice.add',
        path: 'newNotice/add',
        meta: {title: '新增提报申请'},
        component: () => import('../../views/newNotice/add.vue')
    },
    {
        name: 'home.newNotice.edit',
        path: 'newNotice/:id',
        meta: {title: '编辑提报申请'},
        component: () => import('../../views/newNotice/add.vue')
    },
    {
        name: 'home.newNotice.detail',
        path: 'newNotice/detail/:id',
        meta: {title: '提报申请详情'},
        component: () => import('../../views/newNotice/detail.vue')
    }
];

const refundNotify = [
    {
        name: 'home.refundNotify',
        path: 'refundNotify',
        meta: {
            title: '退货通知',
            keepAlive: true
        },
        component: () => import('../../views/refundNotify/index.vue')
    },
    {
        name: 'home.refundNotify.info',
        path: 'refundNotify/:id',
        meta: {
            title: '退货通知详情'
        },
        component: () => import('../../views/refundNotify/info.vue')
    }
];


const promotion = [
    {
        name: 'home.promotion',
        path: 'promotion',
        meta: {
            title: '促销申请',
            keepAlive: true
        },
        component: () => import('../../views/promotion/list.vue')
    },
    {
        name: 'home.promotion.edit',
        path: 'promotion/edit/:id?',
        meta: {
            title: '促销申请详情'
        },
        component: () => import('../../views/promotion/edit.vue')
    },
    {
        name: 'home.promotion.info',
        path: 'promotion/:id',
        meta: {
            title: '促销申请详情'
        },
        component: () => import('../../views/promotion/info.vue')
    }
];

const upAndDownProduct = [
    {
        name: 'home.upAndDownProduct',
        path: 'upAndDownProduct',
        meta: {
            title: '上下架申请',
            keepAlive: true
        },
        component: () => import('../../views/upAndDownProduct/list.vue')
    },
    {
        name: 'home.upAndDownProduct.edit',
        path: 'upAndDownProduct/edit/:id?',
        meta: {
            title: '上架申请编辑'
        },
        component: () => import('../../views/upAndDownProduct/edit.vue')
    },
    {
        name: 'home.upAndDownProduct.product',
        path: 'upAndDownProduct/product',
        meta: {
            title: '上架申请'
        },
        component: () => import('../../views/upAndDownProduct/product.vue')
    },
    {
        name: 'home.upAndDownProduct.info',
        path: 'upAndDownProduct/:id',
        meta: {
            title: '上架申请详情'
        },
        component: () => import('../../views/upAndDownProduct/info.vue')
    }
];


const bill = [
    {
        name: 'home.bill',
        path: 'bill',
        meta: {
            title: '验货单',
            keepAlive: true
        },
        component: () => import('../../views/bill/list.vue')
    },
    {
        name: 'home.bill.info',
        path: 'bill/:id',
        meta: {
            title: '验货单详情'
        },
        component: () => import('../../views/bill/info.vue')
    },
    {
        name: 'home.bill.edit',
        path: 'bill/edit/:id',
        meta: {
            title: '验货单异议'
        },
        component: () => import('../../views/bill/edit.vue')
    }
];


const statement = [
    {
        name: 'home.statement',
        path: 'statement',
        meta: {
            title: '对账单',
            keepAlive: true
        },
        component: () => import('../../views/statement/list.vue')
    },
    {
        name: 'home.statement.info',
        path: 'statement/:id',
        meta: {
            title: '对账单详情'
        },
        component: () => import('../../views/statement/info.vue')
    },
    {
        name: 'home.statement.bill',
        path: 'statement/bill/:id',
        meta: {
            title: '验货单详情'
        },
        component: () => import('../../views/bill/info.vue')
    }
];


export default [{
    name: 'home',
    path: '',
    component,
    redirect: {
        name: 'home.page'
    },
    children: [
        ...home,
        ...statistic,
        ...setting,
        ...purchaseList,
        ...tempList,
        ...onlineIn,
        ...historyLog,
        ...priceLog,
        ...myPrice,
        ...orderList,
        ...newNotice,
        ...refundNotify,
        ...promotion,
        ...upAndDownProduct,
        ...bill,
        ...statement
    ]
}];
