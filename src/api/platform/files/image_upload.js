import request from '@/utils/request'

//
// 素材图片 Api
//

// 查询列表
export function image_upload(data) {
  return request({
    url: '/file_image/file_image/list',
    method: 'post',
    data: data
  })
}
