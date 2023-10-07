import request from '@/utils/request'

// 查询素材图片列表
export function listFile_image(query) {
  return request({
    url: '/file_image/file_image/list',
    method: 'get',
    params: query
  })
}

// 查询素材图片详细
export function getFile_image(id) {
  return request({
    url: '/file_image/file_image/' + id,
    method: 'get'
  })
}

// 新增素材图片
export function addFile_image(data) {
  return request({
    url: '/file_image/file_image',
    method: 'post',
    data: data
  })
}

// 修改素材图片
export function updateFile_image(data) {
  return request({
    url: '/file_image/file_image',
    method: 'put',
    data: data
  })
}

// 删除素材图片
export function delFile_image(id) {
  return request({
    url: '/file_image/file_image/' + id,
    method: 'delete'
  })
}
