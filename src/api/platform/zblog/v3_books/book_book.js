import request from '@/utils/request'

// 查询书籍信息列表
export function listBook_book(query) {
  return request({
    url: '/book_book/book_book/list',
    method: 'get',
    params: query
  })
}

// 查询书籍信息详细
export function getBook_book(id) {
  return request({
    url: '/book_book/book_book/' + id,
    method: 'get'
  })
}

// 新增书籍信息
export function addBook_book(data) {
  return request({
    url: '/book_book/book_book',
    method: 'post',
    data: data
  })
}

// 修改书籍信息
export function updateBook_book(data) {
  return request({
    url: '/book_book/book_book',
    method: 'put',
    data: data
  })
}

// 删除书籍信息
export function delBook_book(id) {
  return request({
    url: '/book_book/book_book/' + id,
    method: 'delete'
  })
}
