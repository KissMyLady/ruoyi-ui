import request from '@/utils/request'

// 查询do_spu列表
export function listDo_spu(query) {
  return request({
    url: '/do_spu/do_spu/list',
    method: 'get',
    params: query
  })
}

// 查询do_spu详细
export function getDo_spu(id) {
  return request({
    url: '/do_spu/do_spu/' + id,
    method: 'get'
  })
}

// 新增do_spu
export function addDo_spu(data) {
  return request({
    url: '/do_spu/do_spu',
    method: 'post',
    data: data
  })
}

// 修改do_spu
export function updateDo_spu(data) {
  return request({
    url: '/do_spu/do_spu',
    method: 'put',
    data: data
  })
}

// 删除do_spu
export function delDo_spu(id) {
  return request({
    url: '/do_spu/do_spu/' + id,
    method: 'delete'
  })
}
