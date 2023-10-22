<template>
  <div>

    <div class="box-specialist">
      <div class="box-tips">
        <span class="blue-tag"></span>
        <span>测试模块 markdown v1</span>
      </div>
    </div>

    <div class="tableArea">
      <el-form :inline="true" style="margin-bottom:10px">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="标题" style="margin-left: 6px;margin-bottom: 0;"></el-form-item>
            <el-button type="primary" plain
                       @click="getMdData">获取文本</el-button>
            <el-button type="primary" plain
                       @click="setMdData">设置内容</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary"
                       @click="flushTableData"
                       class=""
                       plain>刷新
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

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
      left_toolbar_default : "undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code emoji | save",
      right_toolbar_default: "preview toc sync-scroll fullscreen",
      autofocus: true,
      default_fullscreen: true,

      columns: [
        { align: 'center', label: '创建时间', width: 'auto', prop: 'createTime' }
      ],
      text: '',
    }
  },

  created() {
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
    copyPath(url, event) {
      clip(url, event)
    },
    getMdData(){
      TipMessage.isOK("获取markdown内容"+this.text);
      console.log("获取markdown内容: ", this.text);
    },
    setMdData(){
      this.text = "Hello World !";
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
<style lang="scss">
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
