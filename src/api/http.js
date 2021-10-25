/**
 * TODO: http
 * 请求处理公共方法
 * @author    : yunchen
 * @createdAt : 04/04/2018
 */
import Axios from 'axios';
import 'es6-promise/auto';
import { baseURL, TOKEN_LOSE } from '@root/config/global.config';
import {
    requestEvent,
    responseEvent,
    requestErrorEvent,
    responseErrorEvent
} from './event';
import { tool } from '@root/common/util';
import Router from '@root/routers';
import { Dialog, Toast } from 'vant';

const CancelToken = Axios.CancelToken;

// 创建如此一个实例
const instance = Axios.create({
    baseURL,
    timeout: 1000 * 10,
    headers: {
        common: {
            'Authorization': 'zhangchuwang'
        },
        post: {'Content-Type': 'application/x-www-form-urlencoded'}
    }
});

/**
 * 请求数据的方法
 * @return {Promise<AxiosResponse<any>>}
 */
const http = ({ url, method = GET, params, data, body }) => {
    const source = CancelToken.source();

    data = body || data;
    // 对参数进行转换
    if (method === GET && !params && data) {
        params = data;
    }

    let next = instance({
        url,
        method,
        params,
        data,
        cancelToken: source.token
    }).then(({ data }) => {
        /* parse data */
        return data.data;
    }).catch(httpError => {
        // token 过期
        if (TOKEN_LOSE.indexOf(httpError.code) > -1) {
            Router.push({
                name: 'login'
            });
            tool.$local.rm('token');
        }

        // 需要确认的错误
        if (httpError.code >= 2000) {
            Dialog.alert({
                title: '提示',
                message: httpError.message
            });
        }

        // 普通的提示
        if (httpError.code < 1010 && httpError.code > 0) {
            Toast.fail(httpError.message);
        }
        // 请求超时
        if (httpError.code === 'ECONNABORTED') {
            Toast.fail('加载数据失败，请重新请求！');
        }
        /* Error do */
        return Promise.reject(httpError);
    });

    next.success = (calb) => {
        next.then(calb).catch((httpError) => { /* nothing to do */ });
        return next;
    };

    /**
     * 不实现
     * @param calb
     */
    next.cache = (calb) => {
        next.success(calb);
        return next;
    };

    next.error = (calb) => {
        next.catch((httpError) => calb(httpError, {status: httpError.code}));
        return next;
    };

    next.cancel = source.cancel;

    return next;
};


/**
 * RESTful 风格接口
 * 返回方法
 *  list/get/add/update/delete
 * @param url
 */
const _resource = (url) => {
    return {
        list (params) {
            return http({url, params, method: GET});
        },
        add (data) {
            return http({url, data, method: POST});
        },
        update (data) {
            return http({url: [url, data.id].join('/'), data, method: PUT});
        },
        get (id) {
            return http({url: [url, id].join('/'), method: GET});
        },
        delete (id) {
            return http({url: [url, id].join('/'), method: DELETE});
        }
    };
};

// 注入req、resp拦截
instance.interceptors.request.use(requestEvent, requestErrorEvent);
instance.interceptors.response.use(responseEvent, responseErrorEvent);

// 请求方式：顺序不能乱
export const [ GET, POST, PUT, DELETE, PATCH ] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
export const resource = _resource;
export default http;
