<template>
  <!--任务描述对话框-->
  <el-dialog title="上传文件"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close">
    <div>
      <el-form ref="form"
               :model="form"
               label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="请选择上传组">
              <el-select v-model="form.group_id"
                         style="width: 220px"
                         placeholder="请选择上传组"
                         @change="openUploadButton"
                         clearable>
                <el-option v-for="item in fileGroupList"
                           :key="item.groupId"
                           :label="' 数量: ' +item.fileCount  + ' '+  item.groupName"
                           :value="item.groupId"/>
              </el-select>
            </el-form-item>

            <el-form-item label="请选择要上传的文件">
              <el-col :span="1.5">
                <el-upload class="upload-demo"
                           ref="dialog_upload_file"
                           style="display: inline-block; margin-right: 10px"
                           :action="upload.url"
                           :multiple="true"
                           :headers="upLoadHeaders()"
                           :on-preview="handlePreview"
                           :on-remove="handleRemove"
                           :before-upload="beforeUpload"
                           :on-success="handleFileSuccess"
                           :file-list="upload.fileList"
                           list-type="picture">
                  <el-button size="small"
                             :disabled="form.allowUpload"
                             style="margin: 0"
                             type="primary"
                  ><i class="el-icon-upload"></i>上传文件到该分类
                  </el-button>
                </el-upload>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--确定按钮-->
    <div slot="footer" class="dialog-footer">
      <!-- <el-button @click="dialogFormVisible=false">关闭</el-button>-->
      <el-button type="success" @click="addButtonClick">确 定</el-button>
    </div>
  </el-dialog>
</template>


<script>
import TipMessage from '@/utils/myUtils/TipMessage'
import { getToken } from '@/utils/auth'
import {
  list_sqlFile_attachment_group
} from '@/api/platform/files/file_attachment_group'
import { aesDecrypt2Json } from '@/utils/encrypt/encryption'

export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '47%',
      form: {
        group_id: undefined,
        allowUpload: true
      },
      //文件组
      fileGroupList: [],
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        filePath: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: {
          Authorization: 'Bearer ' + getToken()
        },
        fileList: [],//文件列表
        // 上传的地址
        url: process.env.VUE_APP_target_url + '/file_attachment/upload/upload'
      }
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
    showDialog(data) {
      this.getFileGroupList()
      this.dialogFormVisible = true
    },
    init() {

    },
    openUploadButton() {
      // console.log("this.form.group_id: ", this.form.group_id);
      if (this.form.group_id == null || this.form.group_id == '') {
        this.form.allowUpload = true
      } else {
        this.form.allowUpload = false
      }
    },
    //查询全部分组
    getFileGroupList() {
      let senData = {
        isDelete: 0,
        pageNum: 1,
        pageSize: 100
      }
      list_sqlFile_attachment_group(senData).then(response => {
        let privateObj = response.text;
        let jsonData = aesDecrypt2Json(privateObj);
        console.log("jsonData: ", jsonData);
        this.fileGroupList = jsonData
      }).catch((error) => {
        TipMessage.Error('请求错误' + error)
      })
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
    //确定按钮点击
    addButtonClick() {
      this.close()
    },
    close() {
      this.$refs['dialog_upload_file'].clearFiles()
      this.$emit('file_upload')
      this.dialogFormVisible = false
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log('文件上传成功处理: ', response)
      // this.upload.isUploading = false
      // this.form.filePath = response.url
      // this.msgSuccess(response.msg);
      if (response.code !== 200) {
        TipMessage.Warning(response.msg)
        return null
      }
      TipMessage.isOK(response.msg + response.url)
      this.upload.isUploading = false
    },
    beforeUpload(file) {
      if (this.form.group_id == undefined || this.form.group_id == '') {
        TipMessage.Warning('请选择一个分组上传')
        this.upload.isUploading = false
        return null
      }
      this.upload.isUploading = true
    },
    handlePreview(file) {
      console.log('handlePreview: ', file)
    },
    //移除
    handleRemove(file, fileList) {
      console.log('handleRemove, file: ', file)
      console.log('handleRemove, fileList: ', fileList)
    },
    upLoadHeaders(group_id) {
      return {
        'Authorization': 'Bearer ' + getToken(),
        'http-group-id': this.form.group_id
      }
    }
    //=====================================底部结束=====================================
  },
  beforeDestroy() {
  }

}
</script>


<style scoped>
h1 {
  color: #000;
}
</style>
