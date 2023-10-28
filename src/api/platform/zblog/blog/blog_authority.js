import request from '@/utils/request'

//
// 权限修改
//

// 批量修改权限
export function batchChangeAuth(data) {
  return request({
    url: '/blog_blog/authority/batchChangeAuth',
    method: 'post',
    data: data
  })
}
