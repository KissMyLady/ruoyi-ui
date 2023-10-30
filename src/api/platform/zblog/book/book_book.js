import request from '@/utils/request'

//
// 书籍 Api
//

// 查询列表
export function listBook_book(data) {
  return request({
    url: '/book_book/book_book/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getBook_book(id) {
  return request({
    url: '/book_book/book_book/' + id,
    method: 'get'
  })
}

// ++新增++
export function addBook_book(data) {
  return request({
    url: '/book_book/book_book',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateBook_book(data) {
  return request({
    url: '/book_book/book_book',
    method: 'put',
    data: data
  })
}

// --删除--
export function delBook_book(id) {
  return request({
    url: '/book_book/book_book/' + id,
    method: 'delete'
  })
}
