import request from '@/utils/request'

// 查询app_doc_doc列表
export function listApp_doc_list2(query) {
  return request({
    url: '/app_doc_doc/doc/list2',
    method: 'post',
    //params: query,
    data: query
  })
}
