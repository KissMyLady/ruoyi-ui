<template>
  <!--任务描述对话框-->
  <el-dialog title="上传文件"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>
      <el-row>
        <!-- 图片上传-->
        <el-col :span="12">
          <el-form ref="form" :model="image_form" label-width="140px">
            <el-form-item label="请选择图片组">
              <el-select v-model="image_form.group_id"
                         style="width: 220px"
                         placeholder="请请选择图片组"
                         @change="openUploadButton"
                         clearable
              >
                <el-option v-for="item in image_groups"
                           :key="item.groupId"
                           :label="' 数量: ' +item.countImage  + ' '+  item.groupName"
                           :value="item.groupId"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="请请选图片">
              <el-col :span="1.5">
                <el-upload class="upload-demo"
                           ref="dialog_upload_image"
                           style="display: inline-block; margin-right: 10px"
                           :action="image_upload.url"
                           :multiple="true"
                           :headers="image_upLoadHeaders()"
                           :on-preview="image_handlePreview"
                           :on-remove="image_handleRemove"
                           :before-upload="image_beforeUpload"
                           :on-success="image_handleFileSuccess"
                           :file-list="image_upload.fileList"
                           list-type="picture"
                >
                  <el-button size="small"
                             :disabled="image_form.allowUpload"
                             style="margin: 0"
                             type="primary"
                  ><i class="el-icon-upload"></i>上传
                  </el-button>
                </el-upload>
              </el-col>
            </el-form-item>
          </el-form>

          <!--表格-->
          <el-table :row-style="{height:'32px'}"
                    :header-row-style="{height:'32px'}"
                    :cell-style="{padding:'1px'}"
                    border
                    stripe
                    :data="image_imageList"
          >
            <!-- <el-table-column type="selection" width="55" align="center"/>-->
            <el-table-column label="预览" align="center" width="100">
              <template slot-scope="scope">
                <el-image v-if="scope.row.fileSuffix === 'jpg' || scope.row.fileSuffix === 'png'"
                          style="margin: 0;padding:0"
                          fit="contain"
                          lazy
                          :src="getSPrefix(scope.row.filePath)"
                          :preview-src-list="[getSPrefix(scope.row.filePath)]"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <!-- <el-table-column label="主键" align="center" prop="id" width="100"/>-->
            <!-- <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>-->
            <!-- <el-table-column align="center" width="auto" label="图片分组" prop="groupId"/>-->
            <!-- <el-table-column align="center" width="auto" label="名称,描述" prop="title"/>-->
            <el-table-column align="left" width="auto" label="文件名" prop="fileName">
              <template slot-scope="scope">
                <el-button tpye="text"
                           size="mini"
                           @click="copyPath(scope.row.filePath, $event)"
                >复制路径
                </el-button>
                <el-link @click="jumpToImageMedia(scope.row.filePath)"
                         type="primary"
                >{{ scope.row.filePath }}
                </el-link>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" width="auto" label="图片路径" prop="filePath"/>-->
            <!-- <el-table-column align="center" width="100" label="文件大小" prop="fileSize"/>-->
            <!-- <el-table-column align="center" width="100" label="上传方式" prop="upMethod"/>-->
            <!-- <el-table-column align="center" width="auto" label="md5校验值" prop="md5"/>-->
            <!-- <el-table-column align="center" width="100" label="图片后缀" prop="fileSuffix"/>-->
          </el-table>

          <pagination v-show="image_total>0"
                      ref="pagination_v2"
                      :total="image_total"
                      :page.sync="image_queryParams.pageNum"
                      :limit.sync="image_queryParams.pageSize"
                      @pagination="get_image_List"
          />

        </el-col>

        <!-- 文件上传-->
        <el-col :span="12">
          <!-- 文件上传 按钮-->
          <el-form ref="form" :model="file_form" label-width="140px">
            <el-form-item label="请选择文件组">
              <el-select v-model="file_form.group_id"
                         style="width: 220px"
                         placeholder="请选择文件组"
                         @change="openUploadButton_file"
                         clearable
              >
                <el-option v-for="item in file_groups"
                           :key="item.groupId"
                           :label="' 数量: ' +item.fileCount  + ' '+  item.groupName"
                           :value="item.groupId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="请选择文件">
              <el-col :span="1.5">
                <el-upload class="upload-demo"
                           ref="dialog_upload_file"
                           style="display: inline-block; margin-right: 10px"
                           :action="file_upload.url"
                           :multiple="true"
                           :headers="file_upLoadHeaders()"
                           :on-preview="file_handlePreview"
                           :on-remove="file_handleRemove"
                           :before-upload="file_beforeUpload"
                           :on-success="file_handleFileSuccess"
                           :file-list="file_upload.fileList"
                           list-type="picture"
                >
                  <el-button size="small"
                             :disabled="file_form.allowUpload"
                             style="margin: 0"
                             type="primary"
                  ><i class="el-icon-upload"></i>上传
                  </el-button>
                </el-upload>
              </el-col>
            </el-form-item>
          </el-form>
          <!-- 表格-->
          <el-table :row-style="{height:'32px'}"
                    :header-row-style="{height:'32px'}"
                    :cell-style="{padding:'1px'}"
                    border
                    stripe
                    :data="file_attachmentList"
          >
            <!-- <el-table-column type="selection" width="55" align="center"/>-->
            <!-- <el-table-column align="center" width="100" label="分组id" prop="groupId"/>-->
            <!-- <el-table-column align="center" width="260" label="名称,描述" prop="title"/>-->
            <!-- <el-table-column align="center" width="auto" label="文件路径" prop="filePath"/>-->
            <el-table-column align="center" width="auto" label="文件名" prop="fileName">
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="4">
                    <el-button tpye="text"
                               size="mini"
                               @click="copyPath(scope.row.filePath, $event)"
                    >复制
                    </el-button>
                  </el-col>
                  <el-col :span="20">
                    <el-link @click="jumpToImageMedia(scope.row.filePath)" type="primary"
                    >{{ scope.row.filePath }}
                    </el-link>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <!-- <el-table-column align="center" width="100" label="文件大小" prop="fileSize"/>-->
          </el-table>
          <pagination v-show="file_total>0"
                      ref="pagination_v1"
                      :total="file_total"
                      :page.sync="file_queryParams.pageNum"
                      :limit.sync="file_queryParams.pageSize"
                      @pagination="get_file_List"
          />
        </el-col>
      </el-row>
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
import { changeDictToString, switchBool2Number } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'
import { listFile_attachment } from '@/api/platform/files/file_attachment'
import { listFile_image } from '@/api/platform/files/file_image'
import {
  listFile_attachment_group,
  list_sqlFile_attachment_group
} from '@/api/platform/files/file_attachment_group'
import {
  listFile_image_group,
  getFile_image_group
} from '@/api/platform/files/file_image_group'

export default {
  name: 'FileUploadDialog',
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '77%',
      form: {
        group_id: undefined,
        allowUpload: true
      },
      //文件组
      fileGroupList: [],
      image_upload: {
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
        url: process.env.VUE_APP_target_url + '/file_image/upload/upload'
      },
      file_upload: {
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
      },
      file_form: {
        group_id: undefined,
        allowUpload: true
      },
      image_form: {
        group_id: undefined,
        allowUpload: true
      },
      //图片
      image_imageList: [],
      image_groups: [], //图片组select

      image_total: 0,
      image_queryParams: {
        isAsc: 'desc',  //desc, acs
        sortStr: 'create_time',  //sql排序字段
        pageNum: 1,
        pageSize: 5,
        groupId: null,
        title: null,
        fileName: null,
        upMethod: null,
        fileSuffix: null,
        isDelete: null
      },
      //附件
      file_attachmentList: [],
      file_groups: [],  //文件组select
      file_total: 0,
      file_queryParams: {
        isAsc: 'desc',  //desc, acs
        sortStr: 'create_time',  //sql排序字段
        pageNum: 1,
        pageSize: 10,
        groupId: null,
        title: null,
        fileName: null,
        upMethod: null,
        fileSuffix: null,
        isDelete: null
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
    init() {

    },
    get_image_List() {
      this.image_imageList = []
      listFile_image(this.image_queryParams).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        //console.log('image list数据查询结果', jsonData)
        this.image_imageList = jsonData
        this.image_total = response.total
      }).catch((err) => {
        console.log('图片请求错误: ', err)
      })
    },
    get_file_List() {
      listFile_attachment(this.file_queryParams).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        //console.log('file list数据查询结果', jsonData)
        this.file_attachmentList = jsonData
        //this.file_attachmentList = response.rows;
        this.file_total = response.total
      }).catch((err) => {
        console.log('附件请求错误: ', err)
      })
    },
    showDialog() {
      this.get_image_List()
      this.get_file_List()
      this.get_image_groups()
      this.get_file_groups()
      this.dialogFormVisible = true
    },
    //查询全部分组
    get_file_groups() {
      let senData = {
        isDelete: 0,
        pageNum: 1,
        pageSize: 100
      }
      list_sqlFile_attachment_group(senData).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('查询文件组: ', jsonData)
        this.file_groups = jsonData
      }).catch((error) => {
        TipMessage.Error('请求错误' + error)
      })
    },
    //查询图片组 image_groups
    get_image_groups() {
      let senData = {
        isDelete: 0,
        pageNum: 1,
        pageSize: 100
      }
      listFile_image_group(senData).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('查询图片组: ', jsonData)
        this.image_groups = jsonData
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
      this.$refs['dialog_upload_image'].clearFiles()
      this.$refs['dialog_upload_file'].clearFiles()
      this.$emit('upload_dialog')
      this.dialogFormVisible = false
    },
    copyPath(url, event) {
      clip(url, event)
    },
    jumpToImageMedia(filePath) {
      let url = process.env.VUE_APP_media_domain + filePath
      window.open(url, '_blank')
    },
    //媒体文件: 前缀+路径
    getSPrefix(filePath) {
      return process.env.VUE_APP_media_domain + filePath
    },
    openUploadButton() {
      if (this.image_form.group_id == null || this.image_form.group_id == '') {
        this.image_form.allowUpload = true
      } else {
        this.image_form.allowUpload = false
      }
    },
    openUploadButton_file() {
      if (this.file_form.group_id == null || this.file_form.group_id == '') {
        this.file_form.allowUpload = true
      } else {
        this.file_form.allowUpload = false
      }
    },
    //==========================图片上传==================================
    // 文件上传中处理
    image_handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    image_handleFileSuccess(response, file, fileList) {
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
    image_beforeUpload(file) {
      if (this.image_form.group_id == undefined || this.image_form.group_id == '') {
        TipMessage.Warning('请选择一个分组上传')
        this.image_upload.isUploading = false
        return null
      }
      this.image_upload.isUploading = true
    },
    image_handlePreview(file) {
      console.log('handlePreview: ', file)
    },
    //移除
    image_handleRemove(file, fileList) {
      console.log('handleRemove, file: ', file)
      console.log('handleRemove, fileList: ', fileList)
    },
    image_upLoadHeaders(group_id) {
      return {
        'Authorization': 'Bearer ' + getToken(),
        'http-group-id': this.image_form.group_id
      }
    },
    //==========================文件上传==================================
    // 文件上传中处理
    file_handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    file_handleFileSuccess(response, file, fileList) {
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
    file_beforeUpload(file) {
      if (this.file_form.group_id == undefined || this.file_form.group_id == '') {
        TipMessage.Warning('请选择一个分组上传')
        this.file_upload.isUploading = false
        return null
      }
      this.file_upload.isUploading = true
    },
    file_handlePreview(file) {
      console.log('handlePreview: ', file)
    },
    //移除
    file_handleRemove(file, fileList) {
      console.log('handleRemove, file: ', file)
      console.log('handleRemove, fileList: ', fileList)
    },
    file_upLoadHeaders(group_id) {
      return {
        'Authorization': 'Bearer ' + getToken(),
        'http-group-id': this.file_form.group_id
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
