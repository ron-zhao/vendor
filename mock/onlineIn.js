import Mock from 'mockjs';

let List = Mock.mock({
    'data|1-20': [{
        'id': '@INTEGER(1000,9999)',
        'name': '@CWORD(4,20)',
        'price': '@INTEGER(10, 30)',
        'quantity': '@INTEGER(1, 30)',
        'spec|1': ['斤', '箱', '个', '捆', '桶', '件', '把'],
        'ud|1': ['斤', '箱', '个', '捆', '桶', '件', '把'],
        'un': '@INTEGER(1, 20)'
    }],
    'status|1': ['commit', 'sure_price', 'sure_num', 'finish']
});

let log = Mock.mock({
    'data|1-50': [{
        'id': '@INTEGER(1,100)',
        'inPrice_day': '@DATETIME',
        'count_sku': '@INTEGER(10, 30)',
        'status|1': ['commit', 'sure_price', 'sure_num', 'finish']
    }]
});


export default {
    getList: () => {
        return {
            'data': {
                meta: List.data,
                status: List.status,
                total: List.data.length
            },
            'code': 0
        };
    },
    getLog: () => {
        return {
            'data': {
                meta: log.data,
                total: log.data.length
            },
            'code': 0
        };
    }
};

