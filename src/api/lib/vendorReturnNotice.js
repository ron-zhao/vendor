import http, { PATCH, resource } from '../http';

const base = '/vendorReturnNotices';
export const { list, get } = resource(base);

/**
 * 确认收到退货
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const makeAsRead = (id) => http({url: `${base}/${id}`, method: PATCH});

