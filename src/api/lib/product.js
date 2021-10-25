/**
 * 商品查询
 * @author    : mour
 * @createdAt : 2019/11/29
 */
import { resource } from '../http';

const base = '/products';

export const { list, get } = resource(base);
