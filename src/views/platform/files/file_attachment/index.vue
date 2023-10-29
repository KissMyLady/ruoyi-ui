<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="分组id" prop="groupId">
        <el-input
            v-model="queryParams.groupId"
            placeholder="请输入分组id"
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
      <el-form-item label="文件名" prop="fileName">
        <el-input
            v-model="queryParams.fileName"
            placeholder="请输入文件名"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="上传方式" prop="upMethod">
        <el-input
            v-model="queryParams.upMethod"
            placeholder="请输入上传方式"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文件后缀" prop="fileSuffix">
        <el-input
            v-model="queryParams.fileSuffix"
            placeholder="请输入文件后缀"
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
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   @click="uploadFileDialog">上传
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button type="primary"-->
<!--                   plain-->
<!--                   icon="el-icon-plus"-->
<!--                   size="mini"-->
<!--                   @click="handleAdd"-->
<!--                   v-hasPermi="['file_attachment:file_attachment:add']"-->
<!--        >新增-->
<!--        </el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
<!--        <el-button type="success"-->
<!--                   plain-->
<!--                   icon="el-icon-edit"-->
<!--                   size="mini"-->
<!--                   :disabled="single"-->
<!--                   @click="handleUpdate"-->
<!--                   v-hasPermi="['file_attachment:file_attachment:edit']"-->
<!--        >修改-->
<!--        </el-button>-->
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   @click="batchChangeGroup"
                   v-hasPermi="['file_attachment:file_attachment:edit']"
        >批量修改分组
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['file_attachment:file_attachment:remove']"
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
            v-hasPermi="['file_attachment:file_attachment:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              border
              stripe
              :data="file_attachmentList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <!--      <el-table-column label="预览" align="center" width="200">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-image v-if="scope.row.fileSuffix === 'jpg' || scope.row.fileSuffix === 'png'"-->
      <!--                    style="margin: 0;padding:0"-->
      <!--                    fit="contain"-->
      <!--                    lazy-->
      <!--                    :src="scope.row.url"-->
      <!--                    :preview-src-list="[scope.row.url]"-->
      <!--          >-->
      <!--            <div slot="error" class="image-slot">-->
      <!--              <i class="el-icon-picture-outline"></i>-->
      <!--            </div>-->
      <!--          </el-image>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" width="auto" label="用户ID" prop="userId"/>-->
      <el-table-column align="center" width="100" label="分组id" prop="groupId"/>
      <el-table-column align="center" width="200" label="名称,描述" prop="title"/>
      <!--      <el-table-column align="center" width="auto" label="文件路径" prop="filePath"/>-->
      <el-table-column align="left" width="auto" label="文件名" prop="fileName">
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
      <el-table-column align="center" width="100" label="文件大小" prop="fileSize"/>
      <el-table-column align="center" width="100" label="上传方式" prop="upMethod"/>
      <!-- <el-table-column align="center" width="100" label="文件后缀" prop="fileSuffix"/> -->
      <!--      <el-table-column align="center" width="auto" label="url链接" prop="url"/>-->
      <!--      <el-table-column align="center" width="auto" label="在存储地址的真实绝对路径" prop="absPath"/>-->
      <!--      <el-table-column align="center" width="auto" label="md5校验值" prop="md5"/>-->
      <el-table-column align="center" width="85" label="逻辑删除" prop="isDelete">
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
      <el-table-column label="操作" align="center" width="140" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['file_attachment:file_attachment:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['file_attachment:file_attachment:remove']"
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

    <!-- 添加或修改附件对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId"
                    disabled
                    placeholder="请输入用户ID"/>
        </el-form-item>
        <el-form-item label="分组id" prop="groupId">
          <el-input v-model="form.groupId"
                    placeholder="请输入分组id"/>
        </el-form-item>
        <el-form-item label="名称,描述" prop="title">
          <el-input v-model="form.title" placeholder="请输入名称,描述"/>
        </el-form-item>
        <el-form-item label="文件路径" prop="filePath">
          <el-input v-model="form.filePath"
                    disabled
                    placeholder="请输入文件路径"
          />
          <el-button tpye="text"
                     size="mini"
                     @click="copyPath(form.filePath, $event)"
          >复制文件路径
          </el-button>
        </el-form-item>
        <el-form-item label="文件名" prop="fileName">
          <el-input v-model="form.fileName"
                    disabled
                    placeholder="请输入文件名"
          />
        </el-form-item>
        <el-form-item label="文件大小" prop="fileSize">
          <el-input v-model="form.fileSize"
                    disabled
                    placeholder="请输入文件大小"
          />
        </el-form-item>
        <el-form-item label="上传方式" prop="upMethod">
          <el-input v-model="form.upMethod" placeholder="请输入上传方式"/>
        </el-form-item>
        <el-form-item label="文件后缀" prop="fileSuffix">
          <el-input v-model="form.fileSuffix"
                    disabled
                    placeholder="请输入文件后缀"
          />
        </el-form-item>
        <el-form-item label="url链接" prop="url">
          <el-input v-model="form.url"
                    disabled
                    autosize
                    type="textarea" placeholder="请输入内容"
          />
          <el-button tpye="text"
                     size="mini"
                     @click="copyPath(form.url, $event)"
          >复制url链接
          </el-button>
        </el-form-item>
        <el-form-item label="绝对路径" prop="absPath">
          <el-input v-model="form.absPath"
                    disabled
                    autosize
                    type="textarea" placeholder="请输入内容"
          />
          <el-button tpye="text"
                     size="mini"
                     @click="copyPath(form.absPath, $event)"
          >复制绝对路径
          </el-button>
        </el-form-item>
        <el-form-item label="md5校验值" prop="md5">
          <el-input v-model="form.md5"
                    disabled
                    placeholder="请输入md5校验值"
          />
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

    <!-- 上传图片到组-->
    <file_upload ref="file_upload" @file_upload="file_upload"/>

    <!--批量修改文件所属组-->
    <batch_change_group ref="batch_change_group" @batch_change_group="batch_change_group"/>
  </div>
</template>

<script>
import {
  listFile_attachment,
  getFile_attachment,
  delFile_attachment,
  addFile_attachment,
  updateFile_attachment
} from '@/api/platform/files/file_attachment'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString, switchBool2Number } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'
import file_upload from '@/views/platform/files/file_attachment/dialog/file_upload'
import batch_change_group
  from '@/views/platform/files/file_attachment/dialog/batch_change_group.vue'
export default {
  //dicts: ['is_delete'],
  name: 'File_attachment',
  components: {
    file_upload: file_upload,
    batch_change_group: batch_change_group
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
      // 附件表格数据
      file_attachmentList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        //orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        sortStr: 'create_time',  //sql排序字段
        pageNum: 1,
        pageSize: 20,
        groupId: null,
        title: null,
        fileName: null,
        upMethod: null,
        fileSuffix: null,
        isDelete: 0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        { key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true },
        { key: 'user_id', align: 'center', width: 'auth', label: `用户ID`, prop: 'user_id', visible: true },
        { key: 'group_id', align: 'center', width: 'auth', label: `分组id`, prop: 'group_id', visible: true },
        { key: 'title', align: 'center', width: 'auth', label: `名称,描述`, prop: 'title', visible: true },
        { key: 'file_path', align: 'center', width: 'auth', label: `文件路径`, prop: 'file_path', visible: true },
        { key: 'file_name', align: 'center', width: 'auth', label: `文件名`, prop: 'file_name', visible: true },
        { key: 'file_size', align: 'center', width: 'auth', label: `文件大小`, prop: 'file_size', visible: true },
        { key: 'up_method', align: 'center', width: 'auth', label: `上传方式`, prop: 'up_method', visible: true },
        { key: 'file_suffix', align: 'center', width: 'auth', label: `文件后缀`, prop: 'file_suffix', visible: true },
        { key: 'url', align: 'center', width: 'auth', label: `url链接`, prop: 'url', visible: true },
        {
          key: 'abs_path',
          align: 'center',
          width: 'auth',
          label: `在存储地址的真实绝对路径`,
          prop: 'abs_path',
          visible: true
        },
        { key: 'md5', align: 'center', width: 'auth', label: `md5校验值`, prop: 'md5', visible: true },
        { key: 'is_delete', align: 'center', width: 'auth', label: `逻辑删除`, prop: 'is_delete', visible: true },
        { key: 'create_time', align: 'center', width: 'auth', label: `创建时间`, prop: 'create_time', visible: true },
        { key: 'update_time', align: 'center', width: 'auth', label: `更新时间`, prop: 'update_time', visible: true }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询附件列表 */
    getList() {
      //this.loading = true
      listFile_attachment(this.queryParams).then(response => {
        let privateObj = response.text
        // let publicObj = aesDecrypt(privateObj);
        // let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('查询结果jsonData', jsonData)
        this.file_attachmentList = jsonData
        //this.file_attachmentList = response.rows;
        this.total = response.total
        //this.loading = false
      }).catch((err) => {
        //this.loading = false
        //Message({ message: ""+err, type: 'error' })
        console.log('请求错误: ', err)
        TipMessage.Info("查询无数据!")
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
        filePath: null,
        fileName: null,
        fileSize: null,
        upMethod: null,
        fileSuffix: null,
        url: null,
        absPath: null,
        md5: null,
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
      this.title = '添加附件'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getFile_attachment(id).then(response => {
        let privateObj = response.text
        let publicObj = aesDecrypt2Json(privateObj)
        //console.log('查询结果打印: ', publicObj)
        this.form = publicObj
        //this.form = response.data;
        this.open = true
        this.title = '修改附件'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          //对表单加密
          let dict2String = changeDictToString(this.form)
          let sendData = {
            'a': aesEncrypt('1024'),
            'b': aesEncrypt(dict2String),
            'c': aesEncrypt('Hello World !')
          }

          //发送内容加密
          if (this.form.id != null) {
            updateFile_attachment(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addFile_attachment(sendData).then(response => {
              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

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
      this.$modal.confirm('是否确认删除附件编号为"' + ids + '"的数据项？').then(function() {
        return delFile_attachment(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('file_attachment/file_attachment/export', {
        ...this.queryParams
      }, `file_attachment_${new Date().getTime()}.xlsx`)
    },
    //删除切换
    switchDeleteState(rowId, isD) {
      //console.log("删除切换row: ", rowId);
      let sendForm = {
        'id': rowId,
        'isDelete': isD
      }
      let dict2String = changeDictToString(sendForm)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      updateFile_attachment(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        if (isD == 1) {
          TipMessage.Info('删除成功')
        } else {
          TipMessage.isOK('取消删除成功')
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    jumpToImageMedia(filePath) {
      let url = process.env.VUE_APP_media_domain + filePath
      window.open(url, '_blank')
    },
    copyPath(url, event) {
      clip(url, event)  //调用封装的剪切板组件
    },
    //上传文件
    uploadFileDialog(){
      this.$refs["file_upload"].showDialog()
    },
    file_upload(){
      //子组件回调
      // TipMessage.isOK("子组件回调")
      this.getList()
    },
    //批量修改分组
    batchChangeGroup(){
      this.$refs["batch_change_group"].showDialog(this.ids)
    },
    batch_change_group(){
      this.getList()
    },
    //==========================底部结束==================================
  }
}
</script>
