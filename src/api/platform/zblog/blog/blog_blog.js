import request from '@/utils/request'

//
// 博客文档 Api
//

// 查询列表
export function listBlog_blog(data) {
  return request({
    url: '/blog_blog/blog_blog/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getBlog_blog(id) {
  return request({
    url: '/blog_blog/blog_blog/' + id,
    method: 'get'
  })
}

// ++新增++
export function addBlog_blog(data) {
  return request({
    url: '/blog_blog/blog_blog',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateBlog_blog(data) {
  return request({
    url: '/blog_blog/blog_blog',
    method: 'put',
    data: data
  })
}

// --删除--
export function delBlog_blog(id) {
  return request({
    url: '/blog_blog/blog_blog/' + id,
    method: 'delete'
  })
}
