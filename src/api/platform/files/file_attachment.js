import request from '@/utils/request'

//
// 附件 Api
//

// 查询列表
export function listFile_attachment(data) {
  return request({
    url: '/file_attachment/file_attachment/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getFile_attachment(id) {
  return request({
    url: '/file_attachment/file_attachment/' + id,
    method: 'get'
  })
}

// ++新增++
export function addFile_attachment(data) {
  return request({
    url: '/file_attachment/file_attachment',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateFile_attachment(data) {
  return request({
    url: '/file_attachment/file_attachment',
    method: 'put',
    data: data
  })
}

// --删除--
export function delFile_attachment(id) {
  return request({
    url: '/file_attachment/file_attachment/' + id,
    method: 'delete'
  })
}
