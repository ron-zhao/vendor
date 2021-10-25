/**
 * 验货单
 */
import { resource } from '../http';

const base = '/vendorBills';
export const { list, get, update } = resource(base);

