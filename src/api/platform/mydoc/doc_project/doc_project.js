import request from '@/utils/request'

// 查询doc_project列表
export function listDoc_project(query) {
  return request({
    url: '/doc_project/doc_project/list',
    method: 'get',
    params: query
  })
}

// 查询doc_project详细
export function getDoc_project(id) {
  return request({
    url: '/doc_project/doc_project/' + id,
    method: 'get'
  })
}

// 新增doc_project
export function addDoc_project(data) {
  return request({
    url: '/doc_project/doc_project',
    method: 'post',
    data: data
  })
}

// 修改doc_project
export function updateDoc_project(data) {
  return request({
    url: '/doc_project/doc_project',
    method: 'put',
    data: data
  })
}

// 删除doc_project
export function delDoc_project(id) {
  return request({
    url: '/doc_project/doc_project/' + id,
    method: 'delete'
  })
}
