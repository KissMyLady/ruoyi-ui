import request from '@/utils/request'

// 查询do_sku列表
export function listDo_sku(query) {
  return request({
    url: '/do_sku/do_sku/list',
    method: 'get',
    params: query
  })
}

// 查询do_sku详细
export function getDo_sku(id) {
  return request({
    url: '/do_sku/do_sku/' + id,
    method: 'get'
  })
}

// 新增do_sku
export function addDo_sku(data) {
  return request({
    url: '/do_sku/do_sku',
    method: 'post',
    data: data
  })
}

// 修改do_sku
export function updateDo_sku(data) {
  return request({
    url: '/do_sku/do_sku',
    method: 'put',
    data: data
  })
}

// 删除do_sku
export function delDo_sku(id) {
  return request({
    url: '/do_sku/do_sku/' + id,
    method: 'delete'
  })
}
