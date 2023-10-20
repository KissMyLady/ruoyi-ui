import request from '@/utils/request'

//
// 素材图片 Api
//

// 查询列表
export function listFile_image(data) {
  return request({
    url: '/file_image/file_image/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getFile_image(id) {
  return request({
    url: '/file_image/file_image/' + id,
    method: 'get'
  })
}

// ++新增++
export function addFile_image(data) {
  return request({
    url: '/file_image/file_image',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateFile_image(data) {
  return request({
    url: '/file_image/file_image',
    method: 'put',
    data: data
  })
}

// --删除--
export function delFile_image(id) {
  return request({
    url: '/file_image/file_image/' + id,
    method: 'delete'
  })
}
