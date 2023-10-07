import request from '@/utils/request'

// 查询书籍-详情列内容列表
export function listBook_article(query) {
  return request({
    url: '/book_article/book_article/list',
    method: 'get',
    params: query
  })
}

// 查询书籍-详情列内容详细
export function getBook_article(id) {
  return request({
    url: '/book_article/book_article/' + id,
    method: 'get'
  })
}

// 新增书籍-详情列内容
export function addBook_article(data) {
  return request({
    url: '/book_article/book_article',
    method: 'post',
    data: data
  })
}

// 修改书籍-详情列内容
export function updateBook_article(data) {
  return request({
    url: '/book_article/book_article',
    method: 'put',
    data: data
  })
}

// 删除书籍-详情列内容
export function delBook_article(id) {
  return request({
    url: '/book_article/book_article/' + id,
    method: 'delete'
  })
}
