<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="图片组名" prop="groupName">
        <el-input
            v-model="queryParams.groupName"
            placeholder="请输入图片组名"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="逻辑删除" prop="isDelete">
        <el-select v-model="queryParams.isDelete"
                   style="width:90px"
                   @change="handleQuery"
                   placeholder="选择"
                   clearable
        >
          <el-option v-for="dict in dict.type.is_delete"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['file_image_group:file_image_group:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['file_image_group:file_image_group:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['file_image_group:file_image_group:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['file_image_group:file_image_group:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              border
              stripe
              :data="file_image_groupList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column align="center" width="100" label="图片组Id" prop="groupId"/>
      <el-table-column label="上传操作" align="center" width="atuo" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-col :span="1.5">
            <el-upload class="upload-demo"
                       style="display: inline-block;"
                       :action="upload.url"
                       :multiple="false"
                       :headers="upLoadHeaders(scope.row.groupId)"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :before-upload="beforeUpload"
                       :on-success="handleFileSuccess"
                       :file-list="upload.fileList"
                       list-type="picture">
              <el-button icon="el-icon-upload"
                         style="margin: 0"
                         type="primary"
              >上传至 {{ scope.row.groupName }}
              </el-button>
            </el-upload>
          </el-col>
        </template>
      </el-table-column>
      <!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <el-table-column align="center" width="100" label="创建用户" prop="userId">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }} {{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" width="300" label="图片组名" prop="groupName"/> -->
      <el-table-column align="center" width="100" label="图片数量" prop="sumCount"/>
      <el-table-column label="逻辑删除" width="85" align="center" prop="isDelete">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1"
                  @click="switchDeleteState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger">是
          </el-tag>
          <el-tag v-else-if="scope.row.isDelete == 0"
                  @click="switchDeleteState(scope.row.id, 1)"
                  style="cursor:pointer;">否
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-col :span="1.5" style="margin-top: 6px;">
            <el-button size="small"
                       icon="el-icon-edit"
                       @click="handleUpdate(scope.row)"
                       v-hasPermi="['file_image_group:file_image_group:edit']"
            >修改
            </el-button>
            <el-button size="small"
                       icon="el-icon-delete"
                       @click="handleDelete(scope.row)"
                       v-hasPermi="['file_image_group:file_image_group:remove']"
            >删除
            </el-button>
          </el-col>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <!-- 添加或修改file_image_group对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="图片组ID"
                      :rules="[
                          { required: true, message: '分组id不能为空'},
                          { type: 'number', message: 'id必须为数字'}]"
                      prop="groupId">
          <el-input v-model.number="form.groupId"
                    :disabled="notAllowEditGroupId"
                    placeholder="请输入图片组ID"/>
        </el-form-item>
        <el-form-item label="图片组名" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入图片组名"/>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入逻辑删除"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listFile_image_group,
  getFile_image_group,
  delFile_image_group,
  addFile_image_group,
  updateFile_image_group
} from '@/api/platform/zblog/v4_files/file_image_group'
import TipMessage from '@/utils/myUtils/TipMessage'
import {getToken} from '@/utils/auth'

export default {
  dicts: ['is_delete'],
  name: 'File_image_group',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // file_image_group表格数据
      file_image_groupList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        pageNum: 1,
        pageSize: 10,
        userId: null,
        groupName: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      notAllowEditGroupId: true,
      // 用户导入参数
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
        url: process.env.VUE_APP_target_url + '/file_image/upload/upload'
      }
    }
  },
  created() {
    let is_showSearch = window.localStorage.getItem('showSearch');
    if (is_showSearch == 'false'){
        this.showSearch = false;
    }
    if (is_showSearch == 'true'){
        this.showSearch = true;
    }
    this.getList()
  },
  methods: {
    /** 查询file_image_group列表 */
    getList() {
      this.loading = true
      listFile_image_group(this.queryParams).then(response => {
        this.file_image_groupList = response.rows
        this.total = response.total
        this.loading = false
      }).catch((err) => {
        this.loading = false
        //Message({ message: ""+err, type: 'error' })
        console.log('请求错误: ', err)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        groupName: null,
        isDelete: null,
        createTime: null,
        updateTime: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加file_image_group'
      this.notAllowEditGroupId = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.notAllowEditGroupId = true;
      this.reset()
      const id = row.id || this.ids
      getFile_image_group(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改file_image_group'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFile_image_group(this.form).then(response => {
              this.$modal.msgSuccess(response.msg)
              this.open = false
              this.getList()
            })
          } else {
            addFile_image_group(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除file_image_group编号为"' + ids + '"的数据项？').then(function () {
        return delFile_image_group(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('file_image_group/file_image_group/export', {
        ...this.queryParams
      }, `file_image_group_${new Date().getTime()}.xlsx`)
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
      TipMessage.isOK('上传成功')
      this.getList()
    },
    beforeUpload(file) {
      this.upload.isUploading = true
    },
    handlePreview(file) {
      //console.log(': ', file)
    },
    //移除
    handleRemove(file, fileList) {
    },
    jumpToImageMedia(filePath) {
      let url = process.env.VUE_APP_target_url + filePath
      window.open(url, '_blank')
    },
    upLoadHeaders(group_id) {
      let token = getToken();
      return {
        "Authorization": 'Bearer ' + getToken(),
        "group_id": group_id
      }
    },
    switchDeleteState(rowId, isD){
      //console.log("删除切换row: ", rowId);
      let sendData = {
        "id": rowId,
        "isDelete": isD
      }
      updateFile_image_group(sendData).then((res)=>{
        if (res.code !== 200){
          TipMessage.Warning(res.msg);
          return null;
        }
        if(isD == 1){
          TipMessage.Warning("删除成功");
        }else {
          TipMessage.isOK("取消删除成功");
        }
        this.getList()
      }).catch((err)=>{
        //TipMessage.Error("错误"+ err);
      })
    },
    // ===========================底部结束====================================
  }
}
</script>
