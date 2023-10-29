import request from '@/utils/request'

//批量修改 文件组
export function file_batch_change_group(data) {
  return request({
    url: '/file_attachment/group/batchChangeFileGroup',
    method: 'post',
    data: data
  })
}

//批量修改 图片组
export function file_batchChangeImageGroup(data) {
  return request({
    url: '/file_image/group/batchChangeImageGroup',
    method: 'post',
    data: data
  })
}
