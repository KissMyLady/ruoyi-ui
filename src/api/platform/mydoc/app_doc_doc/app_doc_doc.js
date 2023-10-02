import request from '@/utils/request'

// 查询app_doc_doc列表
export function listApp_doc_doc(query) {
  return request({
    url: '/app_doc_doc/app_doc_doc/list',
    method: 'get',
    params: query
  })
}

// 查询app_doc_doc详细
export function getApp_doc_doc(id) {
  return request({
    url: '/app_doc_doc/app_doc_doc/' + id,
    method: 'get'
  })
}

// 新增app_doc_doc
export function addApp_doc_doc(data) {
  return request({
    url: '/app_doc_doc/app_doc_doc',
    method: 'post',
    data: data
  })
}

// 修改app_doc_doc
export function updateApp_doc_doc(data) {
  return request({
    url: '/app_doc_doc/app_doc_doc',
    method: 'put',
    data: data
  })
}

// 删除app_doc_doc
export function delApp_doc_doc(id) {
  return request({
    url: '/app_doc_doc/app_doc_doc/' + id,
    method: 'delete'
  })
}
