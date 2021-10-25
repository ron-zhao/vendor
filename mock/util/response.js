/**
 * response
 * @author    : yunchen
 * @createdAt : 03/07/2018
 */

/**
 * 返回成功
 * @param body {object} 数据内容
 * @param limit {number} 分页
 * @return {{code: number, [p: string]: number}}
 */
export function successBody (body, limit = 0) {
    return {
        [`data${limit ? '|' + limit : ''}`]: body,
        'code': 0
    };
}

/**
 * 返回失败
 * @param body {object} 错误内容
 * @param code {number} 错误代码
 * @return {{data: *, code: number}}
 */
export function errorBody (body, code = 1001) {
    return {
        'data': body,
        'code': code
    };
}
