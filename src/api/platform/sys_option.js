import request from '@/utils/request'

// 查询系统-操作码列表
export function listSys_option(query) {
    return request({
        url: '/sysOption/sys_option/list',
        method: 'get',
        params: query
    })
}

// 查询系统-操作码详细
export function getSys_option(id) {
    return request({
        url: '/sysOption/sys_option/' + id,
        method: 'get'
    })
}

// 新增系统-操作码
export function addSys_option(data) {
    return request({
        url: '/sysOption/sys_option',
        method: 'post',
        data: data
    })
}

// 修改系统-操作码
export function updateSys_option(data) {
    return request({
        url: '/sysOption/sys_option',
        method: 'put',
        data: data
    })
}

// 删除系统-操作码
export function delSys_option(id) {
    return request({
        url: '/sysOption/sys_option/' + id,
        method: 'delete'
    })
}
