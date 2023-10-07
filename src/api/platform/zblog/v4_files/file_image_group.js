import request from '@/utils/request'

// 查询file_image_group列表
export function listFile_image_group(query) {
  return request({
    url: '/file_image_group/file_image_group/list',
    method: 'get',
    params: query
  })
}

// 查询file_image_group详细
export function getFile_image_group(id) {
  return request({
    url: '/file_image_group/file_image_group/' + id,
    method: 'get'
  })
}

// 新增file_image_group
export function addFile_image_group(data) {
  return request({
    url: '/file_image_group/file_image_group',
    method: 'post',
    data: data
  })
}

// 修改file_image_group
export function updateFile_image_group(data) {
  return request({
    url: '/file_image_group/file_image_group',
    method: 'put',
    data: data
  })
}

// 删除file_image_group
export function delFile_image_group(id) {
  return request({
    url: '/file_image_group/file_image_group/' + id,
    method: 'delete'
  })
}
