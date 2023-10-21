import request from '@/utils/request'

//
// api请求-key Api
//

// 查询列表
export function listRequest_api_key(data) {
  return request({
    url: '/request_api_key/request_api_key/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getRequest_api_key(id) {
  return request({
    url: '/request_api_key/request_api_key/' + id,
    method: 'get'
  })
}

// ++新增++
export function addRequest_api_key(data) {
  return request({
    url: '/request_api_key/request_api_key',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateRequest_api_key(data) {
  return request({
    url: '/request_api_key/request_api_key',
    method: 'put',
    data: data
  })
}

// --删除--
export function delRequest_api_key(id) {
  return request({
    url: '/request_api_key/request_api_key/' + id,
    method: 'delete'
  })
}
