<template>
  <div class="app-container">
    <div>
      <el-form :model="ideal_detail"
               ref="queryForm"
               size="small"
               :inline="true"
               label-width="88px"
      >

        <el-row>
          <el-col :span="12">
            <el-form-item label="文章标题" prop="name">
              <el-input v-model="ideal_detail.title"
                        style="width: 360px;font-size: 16px"
                        placeholder="请输入ideal的标题"
                        clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-button type="success"
                       plain
                       @click="addArticleBtn"
                       class="el-icon-check"
            >保存内容
            </el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="资源url地址" prop="srcUrl">
              <el-input v-model="ideal_detail.srcUrl"
                        style="width: 420px;font-size: 16px"
                        placeholder="请输入资源url地址"
                        clearable
              />
              <el-button type="primary" plain
                         @click="uploadFiles"
                         class="el-icon-upload2"
              >上传
              </el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12"></el-col>
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
import {
  listIdeal_detail,
  getIdeal_detail,
  delIdeal_detail,
  addIdeal_detail,
  updateIdeal_detail
} from '@/api/platform/zblog/ideal/ideal_detail'

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
      ideal_detail: {
        'id': '',
        'projectId': '',
        'userId': '',
        'title': '',
        'descNote': '',
        'editorMode': '2',
        'sort': '',
        'authorityCode': '0',
        'authorityValue': '',
        'indexImgStatic': '',
        'srcType': '1',
        'srcUrl': '',
        'visitor': '',
        'isAllowComment': '1',
        'isDelete': '0'
      }
      //==========================底部结束==================================
    }
  },

  created() {
    let dbId = this.$route.query.dbId
    //获取url携带的 project_id 参数
    let project_id = this.$route.query.project_id
    // TipMessage.isOK("url获取detailId: "+ detailId)
    if (dbId !== undefined && dbId !== null) {
      this.ideal_detail.id = dbId
      getIdeal_detail(dbId).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        let privateObj = res.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('jsonData: ', jsonData)
        this.ideal_detail = jsonData
        //设置富文本数据
        this.$refs['getTinymceData'].setData(jsonData.content)
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    }
    if (project_id == null) {
      this.ideal_detail.projectId = ''
    } else {
      this.ideal_detail.projectId = project_id
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
      //获取富文本编辑器内容数据
      let tinymceData = this.$refs['getTinymceData'].getData()
      let textData = this.$refs['getTinymceData'].getTextData()
      // console.log("发送文章数据打印: ", this.ideal_detail);
      this.ideal_detail.content = tinymceData
      this.ideal_detail.preContent = textData
      let dict2String = changeDictToString(this.ideal_detail)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      let dbId = this.$route.query.dbId
      //判断是添加还是保持
      if (dbId !== undefined && dbId !== null && dbId != '') {
        //更新文章
        updateIdeal_detail(sendData).then((res) => {
          if (res.code !== 200) {
            TipMessage.Warning(res.msg)
            return null
          }
          TipMessage.isOK('更新文章:' + res.msg)
        }).catch((err) => {
          //TipMessage.Error("错误"+ err);
          TipMessage.Error('更新文章失败:' + err)
        })
      } else {
        //添加文章
        addIdeal_detail(sendData).then((res) => {
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
