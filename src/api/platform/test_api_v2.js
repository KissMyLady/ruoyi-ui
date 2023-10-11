import request from '@/utils/request'


export function get_hello_api_v2(query) {
  return request({
    url: '/hi/v2',
    method: 'post',
    data: query
  })
}


export function get_hello_api_v3(data) {
  return request({
    url: '/hi/v3',
    method: 'post',
    data: data
  })
}
