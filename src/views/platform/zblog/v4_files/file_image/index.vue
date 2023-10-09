<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
      <el-form-item label="图片组" prop="groupId">
        <el-input
            v-model="queryParams.groupId"
            placeholder="请输入图片组"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="名称,描述" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入名称,描述"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件名/路径" prop="filePath">
        <el-input
            v-model="queryParams.filePath"
            placeholder="请输入图片路径"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片后缀" prop="fileSuffix">
        <el-input
            v-model="queryParams.fileSuffix"
            placeholder="筛选后缀"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="逻辑删除" prop="isDelete">
        <el-select v-model="queryParams.isDelete"
                   @change="handleQuery"
                   placeholder="筛选删除"
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
        <el-button type="primary"
            icon="el-icon-upload"
            @click="handleAdd"
            v-hasPermi="['file_image:file_image:add']"
        >上传
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
            v-hasPermi="['file_image:file_image:edit']"
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
            v-hasPermi="['file_image:file_image:remove']"
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
            v-hasPermi="['file_image:file_image:export']"
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
              :data="file_imageList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="80"/>
      <!-- <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/> -->
      <el-table-column align="center" width="120" label="图片展示" prop="groupId">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px"
                    fit="contain"
                    lazy
                    :src="getImageUrl(scope.row.filePath)"
                    :preview-src-list="tableImageList">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="图片组Id" prop="groupId">
        <template slot-scope="scope">
          <p style="margin:0;padding:0">{{ scope.row.groupId }}</p>
          <p style="margin:0;padding:0">{{ scope.row.groupName }}</p>
        </template>
      </el-table-column>
      <!--<el-table-column align="center" width="200" label="组名称" prop="groupName"/>-->
      <el-table-column align="center" width="auto" label="名称,描述" prop="title"/>
      <!-- <el-table-column align="center" width="auto" label="图片名称" prop="fileName"/> -->
      <el-table-column align="left" width="auto" label="图片路径" prop="filePath">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark"
                      :content="scope.row.filePath" placement="right">
            <el-link @click="jumpToImageMedia(scope.row.filePath)"
                   type="primary">{{ scope.row.fileName }}</el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" width="auto" label="md5校验值" prop="md5"/> -->
<!--      <el-table-column align="center" width="85" label="图片后缀" prop="fileSuffix"/>-->
      <el-table-column label="创建时间" align="center" prop="createTime" width="110">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.createTime" placement="top">
            <span>{{ formatTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="逻辑删除" width="75" align="center" prop="isDelete">
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
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['file_image:file_image:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['file_image:file_image:remove']"
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

    <!-- 添加或修改素材图片对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="图片分组" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入图片分组"/>
        </el-form-item>
        <el-form-item label="名称,描述" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称,描述"/>
        </el-form-item>
        <el-form-item label="图片名称" prop="fileName">
          <el-input v-model="form.fileName" placeholder="请输入图片名称"/>
        </el-form-item>
        <el-form-item label="图片路径" prop="filePath">
          <el-input v-model="form.filePath"
                    disabled
                    placeholder="请输入图片路径"/>
        </el-form-item>
        <el-form-item label="md5校验值" prop="md5">
          <el-input v-model="form.md5" placeholder="请输入md5校验值"/>
        </el-form-item>
        <el-form-item label="图片后缀" prop="fileSuffix">
          <el-input v-model="form.fileSuffix" disabled placeholder="请输入图片后缀"/>
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

    <upload_dialog ref="upload_dialog" @upload_dialog="upload_dialog"/>

  </div>
</template>

<script>
import {
  listFile_image,
  getFile_image,
  delFile_image,
  addFile_image,
  updateFile_image
} from '@/api/platform/zblog/v4_files/file_image'
import { updateFile_attachment } from '@/api/platform/zblog/v4_files/file_attachment'
import TipMessage from '@/utils/myUtils/TipMessage'
import upload_dialog from '@/components/FileUpload/upload_dialog.vue'
export default {
  dicts: ['is_delete'],
  name: 'File_image',
  components: {
    upload_dialog: upload_dialog
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
      // 素材图片表格数据
      file_imageList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        pageNum: 1,
        pageSize: 5,
        userId: null,
        groupId: null,
        title: null,
        fileName: null,
        filePath: null,
        md5: null,
        fileSuffix: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //图片列表
      tableImageList: [],
    }
  },
  created() {
    let is_showSearch = window.localStorage.getItem('showSearch');
    if (is_showSearch == 'true'){
      this.showSearch = true;
    }else{
      this.showSearch = false;
    }
    this.getList()
  },
  methods: {
    /** 查询素材图片列表 */
    getList() {
      this.loading = true
      listFile_image(this.queryParams).then(response => {
        this.file_imageList = response.rows
        this.total = response.total
        this.loading = false

        //getImageList
        this.getImageListMethod(response.rows)
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
        groupId: null,
        title: null,
        fileName: null,
        filePath: null,
        md5: null,
        fileSuffix: null,
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
      // this.reset()
      // this.open = true
      // this.title = '添加素材图片'
      this.$refs["upload_dialog"].showDialog("ok");
    },
    //子组件关闭后调用
    upload_dialog(){
      this.getList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getFile_image(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改素材图片'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateFile_image(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addFile_image(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除素材图片编号为"' + ids + '"的数据项？').then(function() {
        delFile_image(ids).then((res)=>{
          if (res.code !== 200){
            TipMessage.Warning(res.msg);
            return null;
          }
          TipMessage.isOK(res.msg);
          this.getList()
        }).catch((err)=>{
          //TipMessage.Error("错误"+ err);
        })
        //return delFile_image(ids)
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('file_image/file_image/export', {
        ...this.queryParams
      }, `file_image_${new Date().getTime()}.xlsx`)
    },
    //删除切换
    switchDeleteState(rowId, isD){
      //console.log("删除切换row: ", rowId);
      let sendData = {
        "id": rowId,
        "isDelete": isD
      }
      updateFile_image(sendData).then((res)=>{
        if (res.code !== 200){
          TipMessage.Warning(res.msg);
          return null;
        }
        TipMessage.isOK(res.msg);
        this.getList()
      }).catch((err)=>{
        //TipMessage.Error("错误"+ err);
      })
    },
    jumpToImageMedia(filePath){
      let url = process.env.VUE_APP_target_url + filePath;
      window.open(url, "_blank")
    },
    getImageUrl(filePath){
      return process.env.VUE_APP_target_url + filePath;
    },
    getImageListMethod(row){
      //console.log("row: ", row);
      var imgList = [];
      for (let i=0; i<row.length; i++){
        let imaUrl = this.getImageUrl(row[i].filePath)
        //console.log("imaUrl: ", imaUrl);
        imgList.push(imaUrl)
      }
      this.tableImageList = imgList;
    },
    // ===========================================
  }
}
</script>
