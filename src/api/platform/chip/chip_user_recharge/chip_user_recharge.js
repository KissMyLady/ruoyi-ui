import request from '@/utils/request'

// 查询用户芯片-用户充值列表
export function listChip_user_recharge(query) {
    return request({
        url: '/chip_user_recharge/chip_user_recharge/list',
        method: 'get',
        params: query
    })
}

// 查询用户芯片-用户充值详细
export function getChip_user_recharge(id) {
    return request({
        url: '/chip_user_recharge/chip_user_recharge/' + id,
        method: 'get'
    })
}

// 新增用户芯片-用户充值
export function addChip_user_recharge(data) {
    return request({
        url: '/chip_user_recharge/chip_user_recharge',
        method: 'post',
        data: data
    })
}

// 修改用户芯片-用户充值
export function updateChip_user_recharge(data) {
    return request({
        url: '/chip_user_recharge/chip_user_recharge',
        method: 'put',
        data: data
    })
}

// 删除用户芯片-用户充值
export function delChip_user_recharge(id) {
    return request({
        url: '/chip_user_recharge/chip_user_recharge/' + id,
        method: 'delete'
    })
}
