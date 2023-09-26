import request from '@/utils/request'

// 查询api请求记录列表
export function listRequest_api_key_send_log(query) {
    return request({
        url: '/request_api_key_send_log/request_api_key_send_log/list',
        method: 'get',
        params: query
    })
}

// 查询api请求记录详细
export function getRequest_api_key_send_log(id) {
    return request({
        url: '/request_api_key_send_log/request_api_key_send_log/' + id,
        method: 'get'
    })
}

// 新增api请求记录
export function addRequest_api_key_send_log(data) {
    return request({
        url: '/request_api_key_send_log/request_api_key_send_log',
        method: 'post',
        data: data
    })
}

// 修改api请求记录
export function updateRequest_api_key_send_log(data) {
    return request({
        url: '/request_api_key_send_log/request_api_key_send_log',
        method: 'put',
        data: data
    })
}

// 删除api请求记录
export function delRequest_api_key_send_log(id) {
    return request({
        url: '/request_api_key_send_log/request_api_key_send_log/' + id,
        method: 'delete'
    })
}
