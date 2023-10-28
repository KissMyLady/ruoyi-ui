import axios from 'axios'
import TipMessage from '@/utils/myUtils/TipMessage'
import { getToken } from '@/utils/auth'

var config = {
  headers: {
    'Authorization': 'Bearer ' + getToken(),
    'http-group-id': ''
  },//请求头
  timeout: { timeout: 300000 }
} //添加请求头 //timeout 5分钟

var uploadUrl = process.env.VUE_APP_target_url + '/file_image/upload/upload'

// 粘贴/拖拽上传参考文章:
// https://blog.csdn.net/weixin_42619772/article/details/114627101
async function uploadImg(file, Editor) {
  const formData = new FormData()
  const fileName = new Date().getTime() + '.' + file.name.split('.').pop()
  formData.append('file', file, fileName)
  axios.post(uploadUrl, formData, config).then(
    response => {
      // console.log('上传返回response内容: ', response)
      var prefixName = ''
      if (/\.(png|jpg|jpeg|gif|bmp|ico)$/.test(response.data.originalFilename)) {
        prefixName = ''
      } else {
        prefixName = '点击下载附件'
      }
      Editor.insertValue('![' + prefixName + response.data.originalFilename + '](' + response.data.fileName + ')')
    },
    error => {
      TipMessage.Warning('上传失败: ' + error)
    }
  )
}

function initPasteDragImg(Editor) {
  //console.log('init paste drag image')
  const doc = document.getElementById(Editor.id)
  doc.addEventListener('paste', function(event) {
    const items = (event.clipboardData || window.clipboardData).items
    let file = null
    // console.log(items)
    // console.log(items.length)
    if (items && items.length) {
      // 搜索剪切板items
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          file = items[i].getAsFile()
          break
        }
      }
    } else {
      console.log('items: ', items)
      console.log('items.length: ', items.length)
      console.log('当前浏览器不支持粘贴上传')
      return
    }
    if (!file) {
      console.log('粘贴内容非图片')
      return
    }
    uploadImg(file, Editor)
  })

  const dashboard = document.getElementById(Editor.id)

  dashboard.addEventListener('dragover', function(e) {
    e.preventDefault()
    e.stopPropagation()
  })
  dashboard.addEventListener('dragenter', function(e) {
    e.preventDefault()
    e.stopPropagation()
  })
  dashboard.addEventListener('drop', function(e) {
    e.preventDefault()
    e.stopPropagation()
    const files = this.files || e.dataTransfer.files
    uploadImg(files[0], Editor)
  })
}

export { initPasteDragImg }
