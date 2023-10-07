import request from '@/utils/request'

// 查询文档历史记录列表
export function listBlog_history(query) {
  return request({
    url: '/blog_history/blog_history/list',
    method: 'get',
    params: query
  })
}

// 查询文档历史记录详细
export function getBlog_history(id) {
  return request({
    url: '/blog_history/blog_history/' + id,
    method: 'get'
  })
}

// 新增文档历史记录
export function addBlog_history(data) {
  return request({
    url: '/blog_history/blog_history',
    method: 'post',
    data: data
  })
}

// 修改文档历史记录
export function updateBlog_history(data) {
  return request({
    url: '/blog_history/blog_history',
    method: 'put',
    data: data
  })
}

// 删除文档历史记录
export function delBlog_history(id) {
  return request({
    url: '/blog_history/blog_history/' + id,
    method: 'delete'
  })
}
