import request from '@/utils/request'

// 查询file_attachment列表
export function listFile_attachment(query) {
  return request({
    url: '/file_attachment/file_attachment/list',
    method: 'get',
    params: query
  })
}

// 查询file_attachment详细
export function getFile_attachment(id) {
  return request({
    url: '/file_attachment/file_attachment/' + id,
    method: 'get'
  })
}

// 新增file_attachment
export function addFile_attachment(data) {
  return request({
    url: '/file_attachment/file_attachment',
    method: 'post',
    data: data
  })
}

// 修改file_attachment
export function updateFile_attachment(data) {
  return request({
    url: '/file_attachment/file_attachment',
    method: 'put',
    data: data
  })
}

// 删除file_attachment
export function delFile_attachment(id) {
  return request({
    url: '/file_attachment/file_attachment/' + id,
    method: 'delete'
  })
}
