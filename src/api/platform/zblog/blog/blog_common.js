import request from '@/utils/request'

//
// 博客评论 Api
//

// 查询列表
export function listBlog_common(data) {
  return request({
    url: '/blog_common/blog_common/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getBlog_common(id) {
  return request({
    url: '/blog_common/blog_common/' + id,
    method: 'get'
  })
}

// ++新增++
export function addBlog_common(data) {
  return request({
    url: '/blog_common/blog_common',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateBlog_common(data) {
  return request({
    url: '/blog_common/blog_common',
    method: 'put',
    data: data
  })
}

// --删除--
export function delBlog_common(id) {
  return request({
    url: '/blog_common/blog_common/' + id,
    method: 'delete'
  })
}
