import request from '@/utils/request'

//
// 图片分组 Api
//

// 查询列表
export function listFile_image_group(data) {
  return request({
    url: '/file_image_group/file_image_group/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getFile_image_group(id) {
  return request({
    url: '/file_image_group/file_image_group/' + id,
    method: 'get'
  })
}

// ++新增++
export function addFile_image_group(data) {
  return request({
    url: '/file_image_group/file_image_group',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateFile_image_group(data) {
  return request({
    url: '/file_image_group/file_image_group',
    method: 'put',
    data: data
  })
}

// --删除--
export function delFile_image_group(id) {
  return request({
    url: '/file_image_group/file_image_group/' + id,
    method: 'delete'
  })
}
