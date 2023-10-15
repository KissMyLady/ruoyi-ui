import request from '@/utils/request'

// 查询附件分组列表
export function listFile_attachment_group(query) {
  return request({
    url: '/file_attachment_group/file_attachment_group/list',
    method: 'get',
    params: query
  })
}

//查询列表, sql查询
export function list_sqlFile_attachment_group(data) {
  return request({
    url: '/file_attachment_group/file_attachment_group/list_sql',
    method: 'post',
    data: data
  })
}

//第三个版本, 返回为ResultVo类型
export function list_sqlFile_attachment_group_v3(data) {
  return request({
    url: '/file_attachment_group/file_attachment_group/list_sql_v3',
    method: 'post',
    data: data
  })
}


// 查询附件分组详细
export function getFile_attachment_group(id) {
  return request({
    url: '/file_attachment_group/file_attachment_group/' + id,
    method: 'get'
  })
}

// 新增附件分组
export function addFile_attachment_group(data) {
  return request({
    url: '/file_attachment_group/file_attachment_group',
    method: 'post',
    data: data
  })
}

// 修改附件分组
export function updateFile_attachment_group(data) {
  return request({
    url: '/file_attachment_group/file_attachment_group',
    method: 'put',
    data: data
  })
}

// 删除附件分组
export function delFile_attachment_group(id) {
  return request({
    url: '/file_attachment_group/file_attachment_group/' + id,
    method: 'delete'
  })
}
