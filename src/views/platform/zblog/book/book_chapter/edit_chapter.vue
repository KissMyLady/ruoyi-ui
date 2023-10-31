<template>
  <div class="app-container">
    <div>
      <el-form :model="chapter_detail"
               ref="queryForm"
               size="small"
               :inline="true"
               label-width="138px"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item label="章节标题" prop="title">
              <el-input v-model="chapter_detail.title"
                        style="width: 360px"
                        placeholder="请输入章节标题"
                        clearable
              />
              <el-button type="primary" plain
                         @click="uploadFiles"
                         class="el-icon-upload2"
              >上传
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="" prop="bookId">
              <el-input v-model="chapter_detail.bookId"
                        style="width: 180px"
                        placeholder="请输入所属图书编号"
                        clearable
              />
              <el-button type="success"
                         style="margin-left: 10px"
                         plain
                         @click="addArticleBtn"
                         class="el-icon-check"
              >保存内容
              </el-button>
            </el-form-item>
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
import { aesDecrypt2Json, aesEncrypt } from '@/utils/encrypt/encryption'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import {
  listBook_chapter,
  getBook_chapter,
  delBook_chapter,
  addBook_chapter,
  updateBook_chapter
} from '@/api/platform/zblog/book/book_chapter'

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
      chapter_detail: {
        'id': '',
        'userId': '1',
        'bookId': '',
        'parentId': '',
        'title': '',
        'editorMode': '2',
        'content': '',
        'preContent': '',
        'editOpenChildren': '',
        'showOpenChildren': '',
        'visitor': '',
        'authorityCode': '',
        'authorityValue': '',
        'allowComment': '',
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
      this.chapter_detail.projectId = ''
    } else {
      this.chapter_detail.projectId = project_id
    }
    if (dbId != undefined || dbId != null) {
      this.chapter_detail.id = dbId
      getBook_chapter(dbId).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        let privateObj = res.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('jsonData: ', jsonData)
        // this.chapter_detail = jsonData
        this.chapter_detail.title = jsonData.title
        this.chapter_detail.bookId = jsonData.bookId
        //设置富文本数据
        this.$refs['getTinymceData'].setData(jsonData.content)
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
    addArticleBtn() {
      if (this.chapter_detail.title === undefined || this.chapter_detail.title === null || this.chapter_detail.title === '') {
        TipMessage.Info('标题不能为空')
        return null
      }
      //获取富文本编辑器内容数据
      let tinymceData = this.$refs['getTinymceData'].getData()
      let textData = this.$refs['getTinymceData'].getTextData()
      if (textData === undefined || textData === null || textData === '') {
        TipMessage.Info('内容不能为空')
        return null
      }
      // console.log("发送文章数据打印: ", this.chapter_detail);
      this.chapter_detail.content = tinymceData
      this.chapter_detail.preContent = textData
      let dict2String = changeDictToString(this.chapter_detail)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      let dbId = this.$route.query.dbId
      //判断是添加还是保持
      if (dbId !== undefined && dbId !== null && dbId != '') {
        //更新文章
        updateBook_chapter(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('更新文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
        })
      } else {
        //添加文章
        addBook_chapter(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('添加文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
        })
      }
    },
    uploadFiles() {
      this.$refs['uploadDialog'].showDialog()
    }
    //==========================底部结束==================================

  }

}
</script>
