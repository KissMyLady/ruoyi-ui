import request from '@/utils/request'

// 查询文章分类列表
export function listBlog_project(query) {
  return request({
    url: '/blog_project/blog_project/list',
    method: 'get',
    params: query
  })
}

// 查询文章分类详细
export function getBlog_project(id) {
  return request({
    url: '/blog_project/blog_project/' + id,
    method: 'get'
  })
}

// 新增文章分类
export function addBlog_project(data) {
  return request({
    url: '/blog_project/blog_project',
    method: 'post',
    data: data
  })
}

// 修改文章分类
export function updateBlog_project(data) {
  return request({
    url: '/blog_project/blog_project',
    method: 'put',
    data: data
  })
}

// 删除文章分类
export function delBlog_project(id) {
  return request({
    url: '/blog_project/blog_project/' + id,
    method: 'delete'
  })
}
