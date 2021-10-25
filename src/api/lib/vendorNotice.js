import http, { GET, resource } from '../http';

const base = '/vendorNotices';
export const { list, get } = resource(base);

/**
 * 获取未读消息条数
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getCount = () => http({url: `${base}/count`, method: GET});
