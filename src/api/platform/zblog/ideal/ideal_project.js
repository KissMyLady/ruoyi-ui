import request from '@/utils/request'

//
// 分类 Api
//

// 查询列表
export function listIdeal_project(data) {
  return request({
    url: '/ideal_project/ideal_project/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getIdeal_project(id) {
  return request({
    url: '/ideal_project/ideal_project/' + id,
    method: 'get'
  })
}

// ++新增++
export function addIdeal_project(data) {
  return request({
    url: '/ideal_project/ideal_project',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateIdeal_project(data) {
  return request({
    url: '/ideal_project/ideal_project',
    method: 'put',
    data: data
  })
}

// --删除--
export function delIdeal_project(id) {
  return request({
    url: '/ideal_project/ideal_project/' + id,
    method: 'delete'
  })
}
