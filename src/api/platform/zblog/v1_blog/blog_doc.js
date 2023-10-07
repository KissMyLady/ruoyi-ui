import request from '@/utils/request'

// 查询文章列表
export function listBlog_doc(query) {
  return request({
    url: '/blog_doc/blog_doc/list',
    method: 'get',
    params: query
  })
}

// 查询文章详细
export function getBlog_doc(id) {
  return request({
    url: '/blog_doc/blog_doc/' + id,
    method: 'get'
  })
}

// 新增文章
export function addBlog_doc(data) {
  return request({
    url: '/blog_doc/blog_doc',
    method: 'post',
    data: data
  })
}

// 修改文章
export function updateBlog_doc(data) {
  return request({
    url: '/blog_doc/blog_doc',
    method: 'put',
    data: data
  })
}

// 删除文章
export function delBlog_doc(id) {
  return request({
    url: '/blog_doc/blog_doc/' + id,
    method: 'delete'
  })
}
