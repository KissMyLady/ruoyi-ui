import request from '@/utils/request'

//
// api请求记录 Api
//

// 查询列表
export function listRequest_api_key_log(data) {
  return request({
    url: '/request_api_key_log/request_api_key_log/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getRequest_api_key_log(id) {
  return request({
    url: '/request_api_key_log/request_api_key_log/' + id,
    method: 'get'
  })
}

// ++新增++
export function addRequest_api_key_log(data) {
  return request({
    url: '/request_api_key_log/request_api_key_log',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateRequest_api_key_log(data) {
  return request({
    url: '/request_api_key_log/request_api_key_log',
    method: 'put',
    data: data
  })
}

// --删除--
export function delRequest_api_key_log(id) {
  return request({
    url: '/request_api_key_log/request_api_key_log/' + id,
    method: 'delete'
  })
}
