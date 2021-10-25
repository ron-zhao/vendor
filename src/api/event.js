/**
 * TODO event
 * 请求处理、响应处理
 * @author    : yunchen
 * @createdAt : 04/04/2018
 */
import statusMap from './code';
import { tool } from '@root/common/util';

export const requestEvent = (config) => {
    // 登录凭证
    config.headers.token = tool.$local.get('vendor_token') || '';
    return config;
};

export const requestErrorEvent = (error) => {
    return Promise.reject(error);
};

export const responseEvent = (resp) => {
    // 添加过期时间
    // resp.expiredDate = new Date();

    // 解析数据
    let { request, status, headers } = resp;
    let { responseText } = request;
    let data = JSON.parse(responseText);
    let code = status;

    if (status === 200) {
        // 检查数据中是否包含错误码
        // 错误码转换
        if (data.code !== 0) {
            code = data.code;
            return Promise.reject(new HttpError(code, data.message));
        }
    } else {
        code = status;
        // 错误码转换
        return Promise.reject(new HttpError(code, data.message));
    }

    // 刷新token
    if (headers.token) {
        tool.$local.set('vendor_token', headers.token);
    }

    return resp;
};

export const responseErrorEvent = (error) => {
    error.name = '';
    // Axios 400~500 错误，不返回错误码
    if (!('code' in error)) {
        let status = 0;
        if (error.request) {
            status = error.request.status;
        }
        if (error.response) {
            status = error.response.status;
        }
        error.code = status;
    }

    error.message = statusMap[error.code] || error.message || statusMap.default;

    return Promise.reject(error);
};

/**
 * 继承 Error，实现name, message 属性
 */
export class HttpError extends Error {
    /**
   * 构造
   * @param code {Number}
   */
    constructor (code, msg) {
        super();
        this.name = '';
        this.code = code;
        this.message = msg || statusMap[code];
    }
}
