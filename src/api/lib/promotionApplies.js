/**
 * 促销商品申请
 * @author    : mour
 * @createdAt : 2019/11/29
 */
import http, { resource, POST } from '../http';

const base = '/promotionApplies';

export const { list, get, add, update } = resource(base);

/**
 * 再次申请
 * @param id
 * @param data
 */
export const reapply = ({ id, ...data }) => http({url: `${base}/reapply/${id}`, method: POST, data});
