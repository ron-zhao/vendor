/**
 * 解析mock参数
 * @author    : yunchen
 * @createdAt : 03/07/2018
 */
export default {
    get (url) {
        const search = url.split('?')[1];
        if (!search) {
            return {};
        }
        return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
    }
};
