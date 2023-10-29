<template>
  <div class="app-container">
    <div>
      <el-form :model="blog_detail"
               ref="queryForm"
               size="small"
               :inline="true"
               label-width="88px"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item label="文章标题" prop="name">
              <el-input v-model="blog_detail.name"
                        style="width: 360px"
                        placeholder="请输入文章标题"
                        clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="primary" plain
                       @click="uploadFiles"
                       class="el-icon-upload2"
            >上传
            </el-button>
            <el-button type="primary"
                       plain
                       @click="addArticleBtn"
                       class="el-icon-check"
            >保存内容
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div>
      <!--md编辑器-->
      <el-row>
        <el-col :span="24">
          <md_v3 ref="md_v3" @md_v3="md_v3"></md_v3>
        </el-col>
      </el-row>
    </div>

    <upload-dialog ref="uploadDialog"></upload-dialog>
  </div>
</template>


<script>
import {
  listBlog_blog,
  getBlog_blog,
  delBlog_blog,
  addBlog_blog,
  updateBlog_blog
} from '@/api/platform/zblog/blog/blog_blog'
import TipMessage from '@/utils/myUtils/TipMessage'
import clip from '@/components/vab/clipboardVab'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesDecrypt2Json, aesEncrypt } from '@/utils/encrypt/encryption'
import uploadDialog from '@/components/FileUploadDialog/index.vue'
import { getToken } from '@/utils/auth'
import axios from 'axios'
import md_v3 from "@/components/markdown/md_v3.vue"
export default {
  components: {
    uploadDialog,
    md_v3:md_v3,
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
        'authorityCode': '1',  //默认私密
        'authorityValue': '',
        'isWatermark': '',
        'watermarkType': '',
        'watermarkValue': '',
        'visitor': '',
        'isDelete': ''
      },
      uploadUrl: process.env.VUE_APP_target_url + '/file_image/upload/upload'
      //==========================底部结束==================================
    }
  },

  created() {
    let dbId = this.$route.query.dbId
    // console.log('dbId: ', dbId)
    let project_id = this.$route.query.project_id
    if (project_id === undefined || project_id === null) {
      this.blog_detail.projectId = ''
    } else {
      this.blog_detail.projectId = project_id
    }
    if (dbId != undefined || dbId != null) {
      this.blog_detail.id = dbId
      getBlog_blog(dbId).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        let privateObj = res.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('jsonData: ', jsonData)
        this.blog_detail.name = jsonData.name
        //this.text = jsonData.preContent
        this.$refs['md_v3'].setMdData(jsonData.preContent);
      }).catch((err) => {
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
    //保存功能
    saveContent(text, html) {
      let dbId = this.$route.query.dbId
      let project_id = this.$route.query.project_id
      //是否有id主键, 判断保存
      if (dbId !== undefined && dbId !== null && dbId !== '') {
        let sendContent = {
          'id': dbId,
          'preContent': text,
          'content': html,
          'name': this.blog_detail.name
        }
        //点击触发事件
        // TipMessage.isOK("保存")
        // console.log("text: ", text);
        // console.log("html: ", html);
        // console.log("发送文章数据打印: ", this.blog_detail);
        let dict2String = changeDictToString(sendContent)
        let sendData = {
          'a': aesEncrypt('1024'),
          'b': aesEncrypt(dict2String),
          'c': aesEncrypt('Hello World !')
        }
        // console.log('dbId: ', dbId)
        //更新文章
        updateBlog_blog(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('更新文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
        })
        return null
      }
      //判断是是否为直接添加
      if (project_id !== undefined && project_id !== null && project_id !== '') {
        let sendContent = {
          'project_id': project_id,
          'preContent': text,
          'content': html,
          'name': this.blog_detail.name
        }
        let dict2String = changeDictToString(sendContent)
        let sendData = {
          'a': aesEncrypt('1024'),
          'b': aesEncrypt(dict2String),
          'c': aesEncrypt('Hello World !')
        }
        //添加文章
        addBlog_blog(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('添加文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
        })
        return null
      }
    },
    //文章添加
    addArticleBtn() {
      let markdownData = this.$refs["md_v3"].getMarkdown();
      let text_html = this.$refs["md_v3"].getHTML();

      this.blog_detail.content = text_html
      this.blog_detail.preContent = markdownData
      // console.log("发送文章数据打印: ", this.blog_detail);
      let dict2String = changeDictToString(this.blog_detail)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      let dbId = this.$route.query.dbId
      // console.log('dbId: ', dbId)
      let project_id = this.$route.query.project_id

      //判断是是否为直接添加
      if (project_id !== undefined && project_id !== null && project_id !== '') {
        //添加文章
        addBlog_blog(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('添加文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
        })
        return null
      }
      if (dbId !== undefined && dbId !== null && dbId !== '') {
        //更新文章
        updateBlog_blog(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('更新文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
        })
        return null
      } else {
        //添加文章
        addBlog_blog(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('添加文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
        })
        return null
      }
    },
    uploadFiles() {
      this.$refs['uploadDialog'].showDialog()
    },
    upLoadHeaders() {
      //默认上传到 0 分组
      return {
        'Authorization': 'Bearer ' + getToken(),
        'http-group-id': ''
      }
    },
    md_v3(){
      //子组件回调
    },
    //==========================底部结束==================================

  }

}
</script>

<style>
.CodeMirror {
  font-family: Helvetica, Microsoft Yahei, Hiragino Sans GB;
  font-size: 16px;
}

.CodeMirror pre.CodeMirror-line {
  font-size: 14px;
  line-height: 25px;
}

.CodeMirror-linenumber {
  font-size: 14px;
  line-height: 25px;
}
</style>
