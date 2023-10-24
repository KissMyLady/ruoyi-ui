import request from '@/utils/request'

//
// 博客文集 Api
//

// 查询列表
export function listBlog_project(data) {
  return request({
    url: '/blog_project/blog_project/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getBlog_project(id) {
  return request({
    url: '/blog_project/blog_project/' + id,
    method: 'get'
  })
}

// ++新增++
export function addBlog_project(data) {
  return request({
    url: '/blog_project/blog_project',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateBlog_project(data) {
  return request({
    url: '/blog_project/blog_project',
    method: 'put',
    data: data
  })
}

// --删除--
export function delBlog_project(id) {
  return request({
    url: '/blog_project/blog_project/' + id,
    method: 'delete'
  })
}
