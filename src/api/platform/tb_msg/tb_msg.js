import request from '@/utils/request'

//
// 消息 Api
//

// 查询列表
export function listTb_msg(data) {
  return request({
    url: '/tb_msg/tb_msg/list',
    method: 'post',
    data: data
  })
}

// 详细
export function getTb_msg(id) {
  return request({
    url: '/tb_msg/tb_msg/' + id,
    method: 'get'
  })
}

// ++新增++
export function addTb_msg(data) {
  return request({
    url: '/tb_msg/tb_msg',
    method: 'post',
    data: data
  })
}

// +修改+
export function updateTb_msg(data) {
  return request({
    url: '/tb_msg/tb_msg',
    method: 'put',
    data: data
  })
}

// --删除--
export function delTb_msg(id) {
  return request({
    url: '/tb_msg/tb_msg/' + id,
    method: 'delete'
  })
}
