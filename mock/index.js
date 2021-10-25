import Mock from 'mockjs';
import onlineInAPI from './onlineIn';

Mock.setup({
    timeout: '350-600'
});

Mock.mock(/\/onlineIn\/list/, 'get', onlineInAPI.getList);
Mock.mock(/\/onlineIn\/log/, 'get', onlineInAPI.getLog);
