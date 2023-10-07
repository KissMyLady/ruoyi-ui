import request from '@/utils/request'

// 查询看理想-详情列表
export function listIdeal_detail_content(query) {
  return request({
    url: '/ideal_detail_content/ideal_detail_content/list',
    method: 'get',
    params: query
  })
}

// 查询看理想-详情详细
export function getIdeal_detail_content(id) {
  return request({
    url: '/ideal_detail_content/ideal_detail_content/' + id,
    method: 'get'
  })
}

// 新增看理想-详情
export function addIdeal_detail_content(data) {
  return request({
    url: '/ideal_detail_content/ideal_detail_content',
    method: 'post',
    data: data
  })
}

// 修改看理想-详情
export function updateIdeal_detail_content(data) {
  return request({
    url: '/ideal_detail_content/ideal_detail_content',
    method: 'put',
    data: data
  })
}

// 删除看理想-详情
export function delIdeal_detail_content(id) {
  return request({
    url: '/ideal_detail_content/ideal_detail_content/' + id,
    method: 'delete'
  })
}
