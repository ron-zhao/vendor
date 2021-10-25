import http, { GET, POST, DELETE, PATCH } from './http';

/**
 * 登录方法
 * @param {Object} user
 */
export const login = (user) => http({ url: '/login', body: user, method: POST });

/**
 * 退出方法
 */
export const logout = () => http({ url: '/logout', method: DELETE });

/**
 * 获取供应商信息
 */
export const profile = () => http({ url: '/profile', method: GET });

/**
 * 修改密码
 */
export const changePwd = (user) => http({ url: '/pwd', body: user, method: PATCH });

/**
 * 打印设置
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const printingSetting = data => http({url: '/printing', body: data, method: PATCH});

/**
 * 供应商采购单列表
 */
export const purchases = (data) => http({ url: '/purchases', params: data, method: GET });

/**
 * 供应商采购单详情
 */
export const purchaseDetail = (data) => http({ url: '/purchases/detail', params: data, method: GET });

/**
 * 明日预订订单列表
 * 获取在线录单
 */
export const onlineInList = (id) => http({ url: `/vendorOnlineEntries/${id}`, method: GET });

/**
 * 提交在线录单
 */
export const editonlineIn = (data) => http({ url: `/vendorOnlineEntries/${data.id}`, body: data, method: PATCH });

/**
 * 历史单据
 */
export const onlineInLog = (data) => http({ url: '/vendorOnlineEntries', params: data, method: GET });

/**
 * 商品报价
 */
export const vendorPrices = (id) => http({ url: `/quotations/${id}`, method: GET });

/**
 * 提交商品报价
 */
export const editPrices = (data) => http({ url: '/quotations', body: data, method: POST });

/**
 * 报价记录
 */
export const vendorPricesLog = (data) => http({ url: '/quotations', params: data, method: GET });
/**
 * 临时加单详情
 */
export const tempListDetail = (data) => http({ url: `/purchases/${data.id}`, params: data, method: GET });

/**
 * 明日预订订单列表
 */
export const orders = (data) => http({ url: '/purchases/predict', method: GET });

/**
 * 获取微信配置
 */
export const wxConfig = (data) => http({ url: '/wx/config', method: GET, params: data });

/**
 * 获取采购单打印信息
 */
export const purchasePrint = (data) => http({ url: '/purchases/print', method: GET, params: data });

/**
 * 获取验证码
 * @param {string} phone - 手机号码
 * @return {*}
 */
export const captcha = (phone) => http({url: '/captcha', method: POST, body: {phone}});

/**
 * 通过hash获取openId和token
 */
export const getOpenId = (data) => http({ url: '/openid', method: GET, params: data });

/**
 * 获取sku销量， focus=sku(sku销量)/sales_value(销售额)
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const statisticsList = params => http({url: '/statistics', method: GET, params});

/**
 * 数据统计 > 缺货统计
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getLack = (data) => http({ url: '/statistics/lack', method: GET, params: data });

/**
 * 数据统计 > 退货统计
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getReturn = (data) => http({ url: '/statistics/return', method: GET, params: data });

/**
 * 数据统计概览
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const statisticsOverview = params => http({url: '/statistics/overview', method: GET, params});

/**
 * 首页消息未读状态
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const overview = () => http({url: '/overview', method: GET});

/**
 * 七牛获取token
 */
export const qiniuToken = (obj) => http({ url: '/resource/token', body: obj, method: POST });
