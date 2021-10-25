/**
 * 对账单
 */
import { resource } from '../http';

const base = '/vendorStatements';
export const { list, get } = resource(base);

