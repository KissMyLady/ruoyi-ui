import request from '@/utils/request'

// 查询看理想-类别列表
export function listIdeal_category(query) {
  return request({
    url: '/ideal_category/ideal_category/list',
    method: 'get',
    params: query
  })
}

// 查询看理想-类别详细
export function getIdeal_category(id) {
  return request({
    url: '/ideal_category/ideal_category/' + id,
    method: 'get'
  })
}

// 新增看理想-类别
export function addIdeal_category(data) {
  return request({
    url: '/ideal_category/ideal_category',
    method: 'post',
    data: data
  })
}

// 修改看理想-类别
export function updateIdeal_category(data) {
  return request({
    url: '/ideal_category/ideal_category',
    method: 'put',
    data: data
  })
}

// 删除看理想-类别
export function delIdeal_category(id) {
  return request({
    url: '/ideal_category/ideal_category/' + id,
    method: 'delete'
  })
}
