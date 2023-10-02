import request from '@/utils/request'

// 查询文集列表
export function listApp_doc_project(query) {
  return request({
    url: '/app_doc_project/app_doc_project/list',
    method: 'get',
    params: query
  })
}

// 查询文集详细
export function getApp_doc_project(id) {
  return request({
    url: '/app_doc_project/app_doc_project/' + id,
    method: 'get'
  })
}

// 新增文集
export function addApp_doc_project(data) {
  return request({
    url: '/app_doc_project/app_doc_project',
    method: 'post',
    data: data
  })
}

// 修改文集
export function updateApp_doc_project(data) {
  return request({
    url: '/app_doc_project/app_doc_project',
    method: 'put',
    data: data
  })
}

// 删除文集
export function delApp_doc_project(id) {
  return request({
    url: '/app_doc_project/app_doc_project/' + id,
    method: 'delete'
  })
}
