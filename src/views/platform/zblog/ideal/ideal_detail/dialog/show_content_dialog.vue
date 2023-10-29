<template>
  <!--任务描述对话框-->
  <el-dialog :title="title"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>
      <p>创建时间: {{ this.form.createTime }}</p>
      <p>更新时间: {{ this.form.updateTime }}</p>
      <template>
        <v-md-preview-html :html="tinymce_text"
                           preview-class="vuepress-markdown-body"/>
      </template>
    </div>

    <!--确定按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="close">确 定</el-button>
    </div>

  </el-dialog>
</template>

<script>
import "prismjs/plugins/line-numbers/prism-line-numbers.min.js"//行号插件
import "prismjs/themes/prism-coy.min.css"//高亮主题
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css"//行号插件的样式
import 'prismjs/themes/prism.css';
import TipMessage from '@/utils/myUtils/TipMessage'
export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '60%',
      form: {},
      title: '',
      tinymce_text: ''
    }
  },

  created() {
    this.init()
  },
  mounted() {
    //修改宽度
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
  },

  updated() {
  },

  //函数
  methods: {
    init() {
    },
    setDialogWidth() {
      var val = document.body.clientWidth
      const def = 650 // 默认宽度
      if (val < def) {
        this.dialogWidth = '90%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    addButtonClick() {
      TipMessage.isOK('未开通api')
    },
    showDialog(jsonData) {
      // console.log('传递过来的row打印: ', jsonData)
      this.form = jsonData
      this.title = jsonData.title
      this.tinymce_text = jsonData.content
      this.dialogFormVisible = true
      setTimeout(()=>{
        Prism.highlightAll()
      }, 100)
    },
    close() {
      this.dialogFormVisible = false
    }
  },
  beforeDestroy() {
  }

}
</script>
