import request from '@/utils/request'

//
// 权限修改
//

// 批量修改权限
export function ideal_batchChangeAuth(data) {
  return request({
    url: '/ideal_detail/authority/batchChangeAuth',
    method: 'post',
    data: data
  })
}
