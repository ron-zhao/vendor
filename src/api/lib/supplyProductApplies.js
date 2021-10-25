/**
 * 新品提报
 * @author    : mour
 * @createdAt : 2019/11/29
 */
import http, { POST, resource } from '../http';
const base = '/supplyProductApplies';

export const { list, get, add, update } = resource(base);

/**
 * 重新提交申请
 * @param id
 * @param data
 * @returns {HttpPromise|Promise<AxiosResponse<any>>}
 */
export const reapply = ({ id, ...data }) => http({url: `${base}/reapply/${id}`, method: POST, data});
