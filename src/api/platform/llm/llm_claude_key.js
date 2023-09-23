import request from '@/utils/request'

// 查询语言模型,api,claude连接池列表
export function listLlm_claude_key(query) {
    return request({
        url: '/llm_claude_key/llm_claude_key/list',
        method: 'get',
        params: query
    })
}

// 查询语言模型,api,claude连接池详细
export function getLlm_claude_key(id) {
    return request({
        url: '/llm_claude_key/llm_claude_key/' + id,
        method: 'get'
    })
}

// 新增语言模型,api,claude连接池
export function addLlm_claude_key(data) {
    return request({
        url: '/llm_claude_key/llm_claude_key',
        method: 'post',
        data: data
    })
}

// 修改语言模型,api,claude连接池
export function updateLlm_claude_key(data) {
    return request({
        url: '/llm_claude_key/llm_claude_key',
        method: 'put',
        data: data
    })
}

// 删除语言模型,api,claude连接池
export function delLlm_claude_key(id) {
    return request({
        url: '/llm_claude_key/llm_claude_key/' + id,
        method: 'delete'
    })
}
