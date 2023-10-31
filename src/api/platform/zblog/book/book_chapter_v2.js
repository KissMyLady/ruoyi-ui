import request from '@/utils/request'

//
// 章节 Api
//

// 查询列表最近的几篇文章
export function queryBookChapterLastTen_api(data) {
  return request({
    url: '/book_chapter/chapter/queryBookChapterLastTen',
    method: 'post',
    data: data
  })
}
