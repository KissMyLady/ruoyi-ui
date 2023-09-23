import request from '@/utils/request'

// 查询语言模型聊天记录列表
export function listLlm_chat_log(query) {
    return request({
        url: '/llm_chat_log/llm_chat_log/list',
        method: 'get',
        params: query
    })
}

// 查询语言模型聊天记录详细
export function getLlm_chat_log(id) {
    return request({
        url: '/llm_chat_log/llm_chat_log/' + id,
        method: 'get'
    })
}

// 新增语言模型聊天记录
export function addLlm_chat_log(data) {
    return request({
        url: '/llm_chat_log/llm_chat_log',
        method: 'post',
        data: data
    })
}

// 修改语言模型聊天记录
export function updateLlm_chat_log(data) {
    return request({
        url: '/llm_chat_log/llm_chat_log',
        method: 'put',
        data: data
    })
}

// 删除语言模型聊天记录
export function delLlm_chat_log(id) {
    return request({
        url: '/llm_chat_log/llm_chat_log/' + id,
        method: 'delete'
    })
}
