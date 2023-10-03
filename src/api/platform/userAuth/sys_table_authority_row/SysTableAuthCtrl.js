import request from '@/utils/request'

//查询id数据有哪些权限
export function select_auth_dept_data_api(query) {
  return request({
    url: '/SysTableAuthCtrl/SysTableAuthCtrl/rowAuth',
    method: 'post',
    data: query
  })
}

// 批量更新
export function batchSaveOrUpdate_api(query) {
  return request({
    url: '/SysTableAuthCtrl/SysTableAuthCtrl/batchSaveOrUpdate',
    method: 'post',
    data: query
  })
}
