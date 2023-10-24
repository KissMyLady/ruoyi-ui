import request from '@/utils/request'

//
// 博客文档历史记录 Api
//

// 查询列表
export function listBlog_history(data) {
  return request({
    url: '/blog_history/blog_history/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getBlog_history(id) {
  return request({
    url: '/blog_history/blog_history/' + id,
    method: 'get'
  })
}

// ++新增++
export function addBlog_history(data) {
  return request({
    url: '/blog_history/blog_history',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateBlog_history(data) {
  return request({
    url: '/blog_history/blog_history',
    method: 'put',
    data: data
  })
}

// --删除--
export function delBlog_history(id) {
  return request({
    url: '/blog_history/blog_history/' + id,
    method: 'delete'
  })
}
