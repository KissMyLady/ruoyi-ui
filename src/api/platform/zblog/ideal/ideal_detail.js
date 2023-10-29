import request from '@/utils/request'

//
// 详情 Api
//

// 查询列表
export function listIdeal_detail(data) {
  return request({
    url: '/ideal_detail/ideal_detail/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getIdeal_detail(id) {
  return request({
    url: '/ideal_detail/ideal_detail/' + id,
    method: 'get'
  })
}

// ++新增++
export function addIdeal_detail(data) {
  return request({
    url: '/ideal_detail/ideal_detail',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateIdeal_detail(data) {
  return request({
    url: '/ideal_detail/ideal_detail',
    method: 'put',
    data: data
  })
}

// --删除--
export function delIdeal_detail(id) {
  return request({
    url: '/ideal_detail/ideal_detail/' + id,
    method: 'delete'
  })
}
