<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
      <el-form-item label="创建用户id" prop="userId">
        <el-input
            v-model="queryParams.userId"
            placeholder="请输入创建用户id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分组id" prop="groupId">
        <el-input
            v-model="queryParams.groupId"
            placeholder="请输入分组id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="组名" prop="groupName">
        <el-input
            v-model="queryParams.groupName"
            placeholder="请输入组名"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="逻辑删除" prop="isDelete">
        <el-input
            v-model="queryParams.isDelete"
            placeholder="请输入逻辑删除"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
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
            v-hasPermi="['file_attachment_group:file_attachment_group:add']"
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
            v-hasPermi="['file_attachment_group:file_attachment_group:edit']"
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
            v-hasPermi="['file_attachment_group:file_attachment_group:remove']"
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
            v-hasPermi="['file_attachment_group:file_attachment_group:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="file_attachment_groupList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="上传文件" align="left" width="260">
        <template slot-scope="scope">
          <el-upload class="upload-demo"
                     :ref="'uploadFile' + scope.row.groupId"
                     style="display: inline-block; margin-right: 10px"
                     :action="upload.url"
                     :multiple="false"
                     :headers="upLoadHeaders(scope.row.groupId)"
                     :on-preview="handlePreview"
                     :on-remove="handleRemove"
                     :before-upload="beforeUpload"
                     :on-success="handleFileSuccess"
                     :file-list="upload.fileList"
                     list-type="picture">
            <el-button size="small" plain
                       style="margin: 0"
                       icon="el-icon-upload"
                       type="primary">上传到 {{scope.row.groupName}}</el-button>
          </el-upload>
        </template>
      </el-table-column>
<!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
<!--      <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>-->
      <el-table-column align="center" width="auto" label="分组id" prop="groupId"/>
      <el-table-column align="center" width="auto" label="组名" prop="groupName"/>
      <el-table-column align="center" width="auto" label="文件数量" prop="fileCount"/>
      <el-table-column align="center" width="auto" label="备注" prop="note"/>
      <el-table-column align="center" width="auto" label="逻辑删除" prop="isDelete">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1"
                  @click="switchDeleteState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger"
          >是
          </el-tag>
          <el-tag v-else-if="scope.row.isDelete == 0"
                  @click="switchDeleteState(scope.row.id, 1)"
                  style="cursor:pointer;"
          >否
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['file_attachment_group:file_attachment_group:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['file_attachment_group:file_attachment_group:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    />

    <!-- 添加或修改附件分组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="分组id" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入分组id"/>
        </el-form-item>
        <el-form-item label="组名" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入组名"/>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" autosize type="textarea" placeholder="请输入内容"/>
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
  listFile_attachment_group,
  list_sqlFile_attachment_group,
  getFile_attachment_group,
  delFile_attachment_group,
  addFile_attachment_group,
  updateFile_attachment_group
} from "@/api/platform/files/file_attachment_group";
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import { getToken } from "@/utils/auth";
import clip from '@/components/vab/clipboardVab'
export default {
  dicts: ['is_delete'],
  name: "File_attachment_group",
  components: {

  },
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
      // 附件分组表格数据
      file_attachment_groupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        sortStr: 'create_time',
        isAsc: "desc",  //desc, acs
        //sortStr: "-create_time",  //sql排序字段
        pageNum: 1,
        pageSize: 10,
        userId: null,
        groupId: null,
        groupName: null,
        note: null,
        isDelete: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        {align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true},
        {align: 'center', width: 'auth', label: `创建用户id`, prop: 'user_id', visible: true},
        {align: 'center', width: 'auth', label: `分组id`, prop: 'group_id', visible: true},
        {align: 'center', width: 'auth', label: `组名`, prop: 'group_name', visible: true},
        {align: 'center', width: 'auth', label: `备注`, prop: 'note', visible: true},
        {align: 'center', width: 'auth', label: `逻辑删除`, prop: 'is_delete', visible: true},
        {align: 'center', width: 'auth', label: `创建时间`, prop: 'create_time', visible: true},
        {align: 'center', width: 'auth', label: `更新时间`, prop: 'update_time', visible: true},
      ],
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
        url: process.env.VUE_APP_target_url + '/file_attachment/upload/upload'
      },
      group_ids: [],//组ids

    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询附件分组列表 */
    getList() {
      this.loading = true;
      list_sqlFile_attachment_group(this.queryParams).then(response => {
        let privateObj = response.text;
        let jsonData = aesDecrypt2Json(privateObj);
        //  let jsonData = JSON.parse(publicObj);
        console.log("jsonData: ", jsonData);
        this.file_attachment_groupList =jsonData;
        var gList = [];
        for (let i = 0; i < jsonData.length; i++) {
          let resData = jsonData[i];
          let group_ud = resData['groupId'];
          gList.push(group_ud);
        }
        this.group_ids = gList;
        this.total = response.total;
        this.loading = false;
      }).catch((err) => {
        this.loading = false
        //Message({ message: ""+err, type: 'error' })
        console.log("请求错误: ", err);
      });
      //清除文件上传
      this.clearFilesMethod();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        groupId: null,
        groupName: null,
        note: null,
        isDelete: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
      this.clearFilesMethod();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加附件分组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      //重新查询赋值
      getFile_attachment_group(id).then(response => {
        let privateObj = response.text;
        let jsonData = aesDecrypt2Json(privateObj);

        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        console.log("修改按钮点击jsonData: ", jsonData);
        this.form = jsonData;
        this.open = true;
        this.title = "修改附件分组";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //对表单加密
          let dict2String = changeDictToString(this.form);
          //发起请求, 获取请求
          let sendData = {
            "a": aesEncrypt("1024"),
            "b": aesEncrypt(dict2String),
            "c": aesEncrypt("Hello World !")
          }
          if (this.form.id != null) {
            updateFile_attachment_group(sendData).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFile_attachment_group(sendData).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除附件分组编号为"' + ids + '"的数据项？').then(function () {
        return delFile_attachment_group(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('file_attachment_group/file_attachment_group/export', {
        ...this.queryParams
      }, `file_attachment_group_${new Date().getTime()}.xlsx`)
    },
    uploadAttachment(){
      TipMessage.isOK("文件上传");
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      console.log("文件上传成功处理: ", response);
      // this.upload.isUploading = false
      // this.form.filePath = response.url
      // this.msgSuccess(response.msg);
      TipMessage.isOK(response.msg);
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
    jumpToImageMedia(filePath){
      let url = process.env.VUE_APP_target_url + filePath;
      window.open(url, "_blank")
    },
    upLoadHeaders(group_id){
      return {
        "Authorization": 'Bearer ' + getToken(),
        "http-group-id": group_id
      }
    },
    //删除切换
    switchDeleteState(rowId, isD) {
      //console.log("删除切换row: ", rowId);
      let sendForm = {
        'id': rowId,
        'isDelete': isD
      }
      let dict2String = changeDictToString(sendForm);
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      updateFile_attachment_group(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        if (isD == 1) {
          TipMessage.Warning('删除成功')
        } else {
          TipMessage.isOK('取消删除成功')
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    //清除已上传的文件列表
    clearFilesMethod() {
      let groupIds = this.group_ids;
      for (let i = 0; i < groupIds.length; i++) {
        let group_id = groupIds[i];
        this.$refs['uploadFile' + group_id].clearFiles();
      }
      // this.$refs['uploadFile' + groupId].clearFiles();
    },
    copyPath(url, event) {
      clip(url, event)
    }
    //====================================底部结束=========================================
  }
};
</script>
