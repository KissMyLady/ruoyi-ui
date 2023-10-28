<template>
  <div class="app-container">
    <div>
      <el-form :model="blog_detail"
               ref="queryForm"
               size="small"
               :inline="true"
               label-width="88px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="文章标题" prop="name">
              <el-input v-model="blog_detail.name"
                        style="width: 360px"
                        placeholder="请输入文章标题"
                        clearable/>
              <el-button type="primary" plain
                         @click="uploadFiles"
                         class="el-icon-upload2">上传</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="success"
                       plain
                       @click="addArticleBtn"
                       class="el-icon-check">保存内容</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <tinymce-local ref="getTinymceData"/>
    </div>

    <upload-dialog ref="uploadDialog"></upload-dialog>

  </div>
</template>


<script>
import TipMessage from '@/utils/myUtils/TipMessage'
import tinymceLocal from '@/components/tinymce/tinymceLocal'
import uploadDialog from '@/components/FileUploadDialog'
import { addBlog_blog, getBlog_blog, updateBlog_blog } from '@/api/platform/zblog/blog/blog_blog'
import { aesDecrypt2Json, aesEncrypt } from '@/utils/encrypt/encryption'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
export default {
  components: {
    tinymceLocal: tinymceLocal,
    uploadDialog: uploadDialog
  },

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
    let dbId = this.$route.query.dbId
    //获取url携带的 project_id 参数
    let project_id = this.$route.query.project_id
    // TipMessage.isOK("url获取detailId: "+ detailId)
    if (project_id == null) {
      this.blog_detail.projectId = ''
    } else {
      this.blog_detail.projectId = project_id
    }
    if (dbId != undefined || dbId != null) {
      this.blog_detail.id = dbId;
      getBlog_blog(dbId).then((res)=>{
        if (res.code !== 200){
          TipMessage.Warning(res.msg);
          return null;
        }
        let privateObj = res.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log("jsonData: ", jsonData);
        this.blog_detail.name = jsonData.name;
        //设置富文本数据
        this.$refs["getTinymceData"].setData(jsonData.content)
      }).catch((err)=>{
        //TipMessage.Error("错误"+ err);
      })
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
    addArticleBtn(){
      //获取富文本编辑器内容数据
      let tinymceData = this.$refs['getTinymceData'].getData()
      // console.log("发送文章数据打印: ", this.blog_detail);
      this.blog_detail.content = tinymceData;
      let dict2String = changeDictToString(this.blog_detail)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      let dbId = this.$route.query.dbId
      //判断是添加还是保持
      if (dbId !== undefined && dbId !== null && dbId != ""){
        //更新文章
        updateBlog_blog(sendData).then((res)=>{
          if (res.code !== 200){
            TipMessage.Warning(res.msg);
            return null;
          }
          TipMessage.isOK("更新文章:"+res.msg);
        }).catch((err)=>{
          //TipMessage.Error("错误"+ err);
        })
      }else {
        //添加文章
        addBlog_blog(sendData).then((res)=>{
          if (res.code !== 200){
            TipMessage.Warning(res.msg);
            return null;
          }
          TipMessage.isOK("添加文章:"+res.msg);
        }).catch((err)=>{
          //TipMessage.Error("错误"+ err);
        })
      }
    },
    uploadFiles(){
      this.$refs['uploadDialog'].showDialog();
    },
    //==========================底部结束==================================

  }

}
</script>
