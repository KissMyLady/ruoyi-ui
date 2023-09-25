import request from '@/utils/request'

// 查询用户芯片-序列号列表
export function listChip_user_sn(query) {
    return request({
        url: '/chip_user_sn/chip_user_sn/list',
        method: 'get',
        params: query
    })
}

// 查询用户芯片-序列号详细
export function getChip_user_sn(id) {
    return request({
        url: '/chip_user_sn/chip_user_sn/' + id,
        method: 'get'
    })
}

// 新增用户芯片-序列号
export function addChip_user_sn(data) {
    return request({
        url: '/chip_user_sn/chip_user_sn',
        method: 'post',
        data: data
    })
}

// 修改用户芯片-序列号
export function updateChip_user_sn(data) {
    return request({
        url: '/chip_user_sn/chip_user_sn',
        method: 'put',
        data: data
    })
}

// 删除用户芯片-序列号
export function delChip_user_sn(id) {
    return request({
        url: '/chip_user_sn/chip_user_sn/' + id,
        method: 'delete'
    })
}
