import request from '@/utils/request'

// 查询api请求-key列表
export function listRequest_api_key(query) {
    return request({
        url: '/request_api_key/request_api_key/list',
        method: 'get',
        params: query
    })
}

// 查询api请求-key详细
export function getRequest_api_key(id) {
    return request({
        url: '/request_api_key/request_api_key/' + id,
        method: 'get'
    })
}

// 新增api请求-key
export function addRequest_api_key(data) {
    return request({
        url: '/request_api_key/request_api_key',
        method: 'post',
        data: data
    })
}

// 修改api请求-key
export function updateRequest_api_key(data) {
    return request({
        url: '/request_api_key/request_api_key',
        method: 'put',
        data: data
    })
}

// 删除api请求-key
export function delRequest_api_key(id) {
    return request({
        url: '/request_api_key/request_api_key/' + id,
        method: 'delete'
    })
}
