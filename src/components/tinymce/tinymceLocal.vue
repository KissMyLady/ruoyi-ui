<template>
  <div class="tinymce-container">
    <!--富文本,本地渲染,不需要网络加载-->
    <editor api-key="0gxtokd1ebq1qi7h5h0qivrsh6sk0re38i0ym6onoa954l33"
            v-model="tinymceDatabase"
            :init="tinymceData"
    />
  </div>
</template>

<script>
// vue参考文档: https://www.tiny.cloud/docs/integrations/vue/
import { tinymcePlugins, tinymceToolbar } from './config'
import Editor from '@tinymce/tinymce-vue'

import '/public/tinymce/tinymce'
// Default icons are required for TinyMCE 5.3 or above
import '/public/tinymce/icons/default'
// Import themes
import '/public/tinymce/themes/silver'
import '/public/tinymce/themes/mobile'
// Any plugins you want to use has to be imported
import '/public/tinymce/plugins/advlist'
import '/public/tinymce/plugins/anchor'
import '/public/tinymce/plugins/autoresize'
import '/public/tinymce/plugins/autolink'
import '/public/tinymce/plugins/autosave'
import '/public/tinymce/plugins/charmap'
import '/public/tinymce/plugins/code'
import '/public/tinymce/plugins/codesample'
import '/public/tinymce/plugins/directionality'
import '/public/tinymce/plugins/emoticons'
import '/public/tinymce/plugins/fullpage'
import '/public/tinymce/plugins/fullscreen'
import '/public/tinymce/plugins/help'
import '/public/tinymce/plugins/hr'
import '/public/tinymce/plugins/image'
import '/public/tinymce/plugins/imagetools'
import '/public/tinymce/plugins/insertdatetime'
import '/public/tinymce/plugins/link'
import '/public/tinymce/plugins/lists'
import '/public/tinymce/plugins/media'
import '/public/tinymce/plugins/nonbreaking'
import '/public/tinymce/plugins/noneditable'
import '/public/tinymce/plugins/pagebreak'
import '/public/tinymce/plugins/paste'
import '/public/tinymce/plugins/preview'
import '/public/tinymce/plugins/print'
import '/public/tinymce/plugins/save'
import '/public/tinymce/plugins/searchreplace'
import '/public/tinymce/plugins/spellchecker'
import '/public/tinymce/plugins/tabfocus'
import '/public/tinymce/plugins/table'
import '/public/tinymce/plugins/template'
import '/public/tinymce/plugins/textpattern'
import '/public/tinymce/plugins/visualblocks'
import '/public/tinymce/plugins/visualchars'
import '/public/tinymce/plugins/wordcount'
import axios from 'axios'
import TipMessage from '@/utils/myUtils/TipMessage'
import { getToken } from '@/utils/auth'

export default {
  name: 'Tinymce22',
  components: {
    'editor': Editor
  },

  data() {
    return {
      tinymceDatabase: '',  //富文本数据
      tinymcePlugins: tinymcePlugins,
      tinymceToolbar: tinymceToolbar,

      //本地引入参考文档: https://segmentfault.com/a/1190000018358304
      tinymceData: {
        language: 'zh_CN',
        height: 570,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        skin_url: '/tinymce/skins/ui/oxide',
        language_url: '/tinymce/langs/zh_CN.js',
        menubar: false,  //顶部菜单栏, 一定要打开的
        plugins: tinymcePlugins,  //插件
        toolbar: tinymceToolbar,  //顶部栏
        advlist_bullet_styles: 'squar',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: true,
        nonbreaking_force_tab: false,
        convert_urls: true,
        paste_data_images: true, //粘贴同时图片自动上传
        images_upload_handler: (blobInfo, success, failure) => {
          this.handleImgUpload(blobInfo, success, failure)
        },

        //粘贴上传
        init_instance_callback: editor => {
          if (this.value) {
            editor.setContent(this.value)
          }
          this.hasInit = true
          editor.on('NodeChange Change KeyUp SetContent', () => {
            // this.hasChange = true
            // // const val = editor.getContent().replace(/<p><img\s?src="data.*?<\/p>/g, '')
            // this.$emit('input', editor.getContent())
          })
          editor.on('paste', evt => {
            // 监听粘贴事件
            console.log('监听粘贴事件', evt)
            this.onPaste(evt)
          })
        }
      },
      uploadUrl: process.env.VUE_APP_target_url + '/file_image/upload/upload'
      //==========================底部结束==================================
    }
  },

  methods: {
    //子组件调用父组件, 返回创建的数据
    getTinymceData() {
      return this.tinymceDatabase
    },
    setTinymceData(data) {
      //富组件调用, 回写数据到富文本
      console.log('富组件调用, 回写数据到富文本: ', data)
      this.tinymceDatabase = data
    },
    //子组件调用父组件, 返回创建的数据
    getData() {
      return this.tinymceDatabase
    },
    setData(data) {
      //富组件调用, 回写数据到富文本
      this.tinymceDatabase = data
    },
    //图片上传
    handleImgUpload(blobInfo, success, failure) {
      let formdata = new FormData()
      //formdata.set('upload_file', blobInfo.blob())
      formdata.append('file', blobInfo.blob())//通过append向form对象添加数据
      let config = {
        headers: this.upLoadHeaders(),//请求头
        timeout: { timeout: 300000 }
      } //添加请求头 //timeout 5分钟
      axios.post(this.uploadUrl, formdata, config).then(
          response => {
            // console.log('上传返回response内容: ', response)
            success(response.data.fileName)
          },
          error => {
            TipMessage.Warning('上传图片失败: ' + error)
          }
      )
    },
    upLoadHeaders() {
      //默认上传到 0 分组
      return {
        'Authorization': 'Bearer ' + getToken(),
        'http-group-id': ''
      }
    },
    onPaste(event, success, failure) {
      // 实现图⽚粘贴上传
      const items = (event.clipboardData || window.clipboardData).items
      // items为伪数组微信/QQ截图以及此富⽂本区域内复制粘贴的length为1,⿏标右键复制粘贴图⽚以及⽂本的复制粘贴的length为2;
      let len = items.length
      for (let i = 0; i < len; i++) {
        if (items[i].kind == 'file' && items[i].type.indexOf('image') != -1) {
          // 判断是否为图⽚类型
          event.preventDefault() // 如果是图⽚阻⽌⾃动粘贴到富⽂本编辑器
          let file = items[i].getAsFile() // 获取⽂件数据
          let blob = new Blob([file], { type: file.type }) //实例化⼀个blob 将图⽚⼤⼩以及类型初始化到blob⾥
          // let index = file.name.lastIndexOf(".");
          // let fileName =
          //   Date.now() + file.name.substring(index, file.name.length);
          // fileName --- 图⽚名称可⾃⾏处理
          console.log('粘贴的是图⽚类型', blob, file)
          // let file = blobInfo.blob();
          const isLt2M = file.size / 1024 < 500
          // if (!isLt2M) {
          //   TipMessage.Warning('上传失败，图片不可超过500KB!')
          //   return false
          // }
          const formdate = new FormData()
          formdate.append('file', file) //imageFile文件名和后端统一
          axios({
            url: this.uploadUrl,
            method: 'post',
            data: formdate,
            headers: this.upLoadHeaders(),
          }).then(response => {
            let filePath = response.data.fileName
            tinymce.execCommand(
                'mceReplaceContent',
                false, //是否保存更改
                `<img class="wscnph" src="${filePath}" width="500">`
            )
          }).catch(function(err) {
            // 上传错误可⾃⾏给出提⽰
            TipMessage.Error(""+err)
          })
        } else {
          // 不是图⽚类型直接粘贴, 跳过oss上传处理
          TipMessage.Error('粘贴的不是图⽚')
        }
      }
    }
    //==========================底部结束==================================
  }
}
</script>

<style lang="scss" scoped>
.tinymce-container {
  position: relative;
  line-height: normal;
  margin: 6px;

  .mce-fullscreen {
    z-index: 10000;
  }
}

.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 1002;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}

textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
