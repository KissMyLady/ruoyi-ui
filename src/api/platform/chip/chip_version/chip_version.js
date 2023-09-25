import request from '@/utils/request'

// 查询硬件版本列表
export function listChip_version(query) {
    return request({
        url: '/chip_version/chip_version/list',
        method: 'get',
        params: query
    })
}

// 查询硬件版本详细
export function getChip_version(id) {
    return request({
        url: '/chip_version/chip_version/' + id,
        method: 'get'
    })
}

// 新增硬件版本
export function addChip_version(data) {
    return request({
        url: '/chip_version/chip_version',
        method: 'post',
        data: data
    })
}

// 修改硬件版本
export function updateChip_version(data) {
    return request({
        url: '/chip_version/chip_version',
        method: 'put',
        data: data
    })
}

// 删除硬件版本
export function delChip_version(id) {
    return request({
        url: '/chip_version/chip_version/' + id,
        method: 'delete'
    })
}
