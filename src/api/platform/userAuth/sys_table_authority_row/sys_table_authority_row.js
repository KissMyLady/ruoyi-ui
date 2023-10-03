import request from '@/utils/request'

// 查询数据权限列表
export function listSys_table_authority_row(query) {
  return request({
    url: '/sys_table_authority_row/sys_table_authority_row/list',
    method: 'get',
    params: query
  })
}

// 查询数据权限详细
export function getSys_table_authority_row(id) {
  return request({
    url: '/sys_table_authority_row/sys_table_authority_row/' + id,
    method: 'get'
  })
}

// 新增数据权限
export function addSys_table_authority_row(data) {
  return request({
    url: '/sys_table_authority_row/sys_table_authority_row',
    method: 'post',
    data: data
  })
}

// 修改数据权限
export function updateSys_table_authority_row(data) {
  return request({
    url: '/sys_table_authority_row/sys_table_authority_row',
    method: 'put',
    data: data
  })
}

// 删除数据权限
export function delSys_table_authority_row(id) {
  return request({
    url: '/sys_table_authority_row/sys_table_authority_row/' + id,
    method: 'delete'
  })
}
