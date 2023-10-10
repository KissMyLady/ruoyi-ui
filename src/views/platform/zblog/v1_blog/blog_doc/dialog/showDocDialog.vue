<template>
  <el-dialog :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             :title="blog_title"
             top="8px"
             @close="close">
    <!--文本框-->
    <div v-if="hasContent"
         class="blog-article-dialog-content"
         style="">

      <!--Md文档-->
      <div v-if="isMd">
        <el-input type="textarea"
                  style="font-size: 16px"
                  :autosize="{ minRows: 10, maxRows: 80}"
                  placeholder="请输入内容"
                  v-model="preContent">
        </el-input>
      </div>

      <!--富文本-->
      <div v-else>
        <template>
          <!-- preview-class 为主题的样式类名，例如vuepress就是vuepress-markdown-body -->
          <editor v-model="tinymceContent" :min-height="192"/>
        </template>

      </div>

      <div v-else>
        <p>当前没有内容</p>
      </div>

    </div>

  </el-dialog>
</template>

<script>
import {
  listBlog_doc,
  getBlog_doc,
  delBlog_doc,
  addBlog_doc,
  updateBlog_doc
} from '@/api/platform/zblog/v1_blog/blog_doc'
import TipMessage from '@/utils/myUtils/TipMessage'

export default {
  //组件
  components: {
  },
  data() {
    return {
      dialogFormVisible: false,
      hasContent: true,

      dialogWidth: '67%',

      isMd: false,
      blog_title: "",
      preContent: "",
      tinymceContent: "",
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
  //函数
  methods: {
    init() {
    },
    setDialogWidth() {
      var val = document.body.clientWidth
      const def = 850 // 默认宽度
      if (val < def) {
        this.dialogWidth = '90%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    //加载
    loadTextData(jsonData) {
      this.hasContent = false
      //优先展示md文档
      if(jsonData.editorMode == '1' || jsonData.editorMode == 1){
        this.isMd = true
        this.hasContent = true
        this.preContent = jsonData.preContent;
        this.blog_title = jsonData.name
      }
      else if(jsonData.editorMode == '2' || jsonData.editorMode == 2){
        this.hasContent = true
        this.blog_title = jsonData.name
        this.tinymceContent = jsonData.content
      }else {
        this.hasContent = false
        this.content.blog_title = '无'
      }
    },
    showDialog(row) {
      let transferData = {
        db_id : row.db_id,
        preContent : row.preContent,
        content : row.content,
        editorMode : row.editorMode,
      }
      //请求数
      getBlog_doc(row.db_id).then((res)=>{
        if (res.code !== 200){
          TipMessage.Warning(res.msg);
          return null;
        }
        this.dialogFormVisible = true
        this.loadTextData(res.data)
      }).catch((err)=>{
        //TipMessage.Error("错误"+ err);
      })
    },

    close() {
      this.isMd = false
      this.dialogFormVisible = false
    }
  }

}
</script>


<style>
h1 {
  color: #000;
}

.blog-article-dialog-content {
  height: auto;
  border: 1px solid #eee;
  color: #000000;
  font-size: 18px
}

.blog-article-dialog-content .tinymce-data-style img {
  display: block;
  margin: 0 auto;
  height: 95%;
  width: 95%;
  max-width: 100%;
  border-radius: 5px;
  box-shadow: 0 4px 12px #84A1A8;
  border: 0;
}

/*.blog-article-dialog-content .tinymce-data-style pre {*/

/*}*/

img {
  border-radius: 2px;
  height: 80%;
}
</style>
