import request from '@/utils/request'


// 查询部门树
export function get_dept_tree(query) {
  return request({
    url: '/CommonUserDeptRoleCtrl/dept/tree',
    method: 'post',
    data: query
  })
}
