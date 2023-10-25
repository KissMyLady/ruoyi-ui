<template>
  <div class="app-container">

    <div class="box-specialist">
      <div class="box-tips">
        <span class="blue-tag"></span>
        <span>markdown添加</span>
      </div>
    </div>

    <div>
      <template>
        <v-md-editor v-model="text"
                     :disabled-menus="[]"
                     :left-toolbar="left_toolbar_default"
                     :right-toolbar="right_toolbar_default"
                     :autofocus="autofocus"
                     @upload-image="handleUploadImage"
                     @copy-code-success="handleCopyCodeSuccess"
                     height="550px"
        ></v-md-editor>
      </template>
    </div>

  </div>
</template>


<script>

import TipMessage from '@/utils/myUtils/TipMessage'
import clip from '@/components/vab/clipboardVab'

export default {
  components: {},

  data() {
    return {
      tableDataLoading: false,
      //表格数据
      dataTabList: [],
      dataQuery: {
        'isShowDelete': false,
        'total': 1,
        'page': 1,
        'pageSize': 20
      },
      columns: [
        { align: 'center', label: '创建时间', width: 'auto', prop: 'createTime' }
      ],
      left_toolbar_default : "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code emoji | save",
      right_toolbar_default: "preview toc sync-scroll fullscreen",
      autofocus: true,
      default_fullscreen: true,
      text: '',
      blog_detail: {
        'id': '',
        'projectId': '',
        'userId': '',
        'parentBlog': '',
        'name': '',
        'editorMode': '',
        'content': '',
        'preContent': '',
        'sort': '',
        'status': '',
        'editOpenChildren': '',
        'showOpenChildren': '',
        'authorityCode': '',
        'authorityValue': '',
        'isWatermark': '',
        'watermarkType': '',
        'watermarkValue': '',
        'visitor': '',
        'isDelete': ''
      }

      //==========================底部结束==================================
    }
  },

  created() {
    let detailId = this.$route.query.project_id
    TipMessage.isOK('url获取detailId: ' + detailId)
    if (detailId == null) {
      this.blog_detail.projectId = ''
    } else {
      this.blog_detail.projectId = detailId
    }
    this.initialization()
  },

  methods: {
    initialization() {
      this.getTableData()  //初始化表格数据
    },
    //表格数据获取
    getTableData() {
      // this.tableDataLoading = false
      // this.dataTabList = res.data.data.records
      // this.dataQuery.total = res.data.total
    },
    flushTableData() {
      this.getTableData()
      TipMessage.isOK('刷新成功')
    },
    //分页组件
    handleSizeChange(val) {
      this.dataQuery.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.dataQuery.page = val
      this.getTableData()
    },
    modifyCategoryButton(row) {

    },
    handleCopyCodeSuccess(code) {
      clip(code, event)
    },
    //图片上传
    handleUploadImage(event, insertImage, files){
      //参考文档: https://ckang1229.gitee.io/vue-markdown-editor/zh/senior/upload-image.html
      // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      console.log(files);
      // 此处只做示例
      insertImage({
        url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
        desc: '七龙珠',
        // width: 'auto',
        // height: 'auto',
      });
    },
    //==========================底部结束==================================

  }

}
</script>

<style>
.CodeMirror {
  font-family: Helvetica,Microsoft Yahei,Hiragino Sans GB;
  font-size: 16px;
}

.CodeMirror pre.CodeMirror-line {
  font-size: 14px ;
  line-height: 25px ;
}
.CodeMirror-linenumber{
  font-size: 14px ;
  line-height: 25px ;
}
</style>
