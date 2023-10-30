import request from '@/utils/request'

//
// 章节 Api
//

// 查询列表
export function listBook_chapter(data) {
  return request({
    url: '/book_chapter/book_chapter/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getBook_chapter(id) {
  return request({
    url: '/book_chapter/book_chapter/' + id,
    method: 'get'
  })
}

// ++新增++
export function addBook_chapter(data) {
  return request({
    url: '/book_chapter/book_chapter',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateBook_chapter(data) {
  return request({
    url: '/book_chapter/book_chapter',
    method: 'put',
    data: data
  })
}

// --删除--
export function delBook_chapter(id) {
  return request({
    url: '/book_chapter/book_chapter/' + id,
    method: 'delete'
  })
}
