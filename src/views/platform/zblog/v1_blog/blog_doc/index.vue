<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
      <el-form-item label="筛选文集" prop="projectId">
        <el-select v-model="queryParams.projectId"
                   @change="handleQuery"
                   placeholder="筛选文集"
                   clearable
        >
          <el-option v-for="dict in projectList"
                     :key="dict.id"
                     :label="dict.id +' '+ dict.name"
                     :value="dict.id"
          />
        </el-select>

      </el-form-item>
      <el-form-item label="标题筛选" prop="name">
        <el-input v-model="queryParams.name"
                  placeholder="请输入标题"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限" prop="name">
        <el-input v-model="queryParams.dataRowAuth"
                  style="width: 100px"
                  placeholder="请输入数字"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="状态码" prop="status">
        <el-select v-model="queryParams.status"
                   @change="handleQuery"
                   placeholder="0草稿,1发布,2删除" clearable
        >
          <el-option v-for="dict in dict.type.doc_status"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item label="删除筛选" prop="isDelete">
        <el-select v-model="queryParams.isDelete"
                   style="width: 120px"
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
      <el-form-item label="更新时间" prop="modifyTime">
        <el-date-picker clearable
                        v-model="queryParams.modifyTime"
                        type="date"
                        @change="handleQuery"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择更新时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['blog_doc:blog_doc:add']"
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
            v-hasPermi="['blog_doc:blog_doc:edit']"
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
            v-hasPermi="['blog_doc:blog_doc:remove']"
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
            v-hasPermi="['blog_doc:blog_doc:export']"
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
              :data="blog_docList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <!--      <el-table-column align="center" width="auto" label="创建用户id" prop="createUserId"/>-->
      <el-table-column align="center" width="auto" label="所属文集" prop="projectId"/>
      <!--      <el-table-column align="center" width="auto" label="父级文档" prop="parentDoc"/>-->
      <el-table-column align="center" width="auto" label="标题" prop="name"/>
      <!--      <el-table-column label="编辑器" align="center" prop="editorMode">-->
      <!--        <template slot-scope="scope">-->
      <!--          <dict-tag :options="dict.type.doc_editor_mode" :value="scope.row.editorMode"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" width="auto" label="文档内容" prop="content"/>-->
      <!--      <el-table-column align="center" width="auto" label="文档内容_预览_纯文本" prop="preContent"/>-->
      <!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
      <el-table-column label="状态码" align="center" prop="status" width="100">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.doc_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="打开下级" prop="openChildren"/>-->
      <!--      <el-table-column align="center" width="auto" label="显示下级" prop="showChildren"/>-->
      <el-table-column label="数据权限" width="75" align="center" prop="dataRowAuth">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.dataRowAuth == 9"
                  @click="switchDataAuthState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger">超管
          </el-tag>
          <el-tag v-else-if="scope.row.dataRowAuth == 0"
                  @click="switchDataAuthState(scope.row.id, 9)"
                  style="cursor:pointer;">公开
          </el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="水印状态" prop="isWatermark"/>-->
      <!--      <el-table-column label="水印类型" align="center" prop="watermarkType">-->
      <!--        <template slot-scope="scope">-->
      <!--          <dict-tag :options="dict.type.watermark_type" :value="scope.row.watermarkType"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" width="auto" label="水印内容" prop="watermarkValue"/>-->
      <el-table-column align="center" width="75" label="浏览次数" prop="visitor"/>
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
      <el-table-column label="创建时间" align="center" prop="createTime" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.createTime" placement="top">
            <span>{{ formatTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['blog_doc:blog_doc:edit']">修改
          </el-button>
          <el-button icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['blog_doc:blog_doc:remove']"
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

    <!-- 添加或修改文章对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="所属文集id" prop="projectId">
          <el-input v-model="form.projectId" placeholder="请输入所属文集id"/>
        </el-form-item>
        <el-form-item label="父级文档" prop="parentDoc">
          <el-input v-model="form.parentDoc" placeholder="请输入父级文档"/>
        </el-form-item>
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="编辑器模式" prop="editorMode">
          <el-input v-model="form.editorMode" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="文档内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="文档内容_预览_纯文本">
          <el-input v-model="form.preContent"
                    type="textarea"
                    :autosize="{ minRows: 8, maxRows: 16}"
                    placeholder="文档内容_预览_纯文本"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="状态码" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
                v-for="dict in dict.type.doc_status"
                :key="dict.value"
                :label="parseInt(dict.value)"
            >{{ dict.label }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="打开下级" prop="openChildren">
          <el-input v-model="form.openChildren" placeholder="请输入打开下级"/>
        </el-form-item>
        <el-form-item label="显示下级" prop="showChildren">
          <el-input v-model="form.showChildren" placeholder="请输入显示下级"/>
        </el-form-item>
        <el-form-item label="数据行权限" prop="dataRowAuth">
          <el-input v-model="form.dataRowAuth" placeholder="请输入数据行权限"/>
        </el-form-item>
        <el-form-item label="水印状态" prop="isWatermark">
          <el-input v-model="form.isWatermark" placeholder="请输入水印状态"/>
        </el-form-item>
        <el-form-item label="水印类型" prop="watermarkType">
          <el-select v-model="form.watermarkType" placeholder="请选择水印类型">
            <el-option
                v-for="dict in dict.type.watermark_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="水印内容" prop="watermarkValue">
          <el-input v-model="form.watermarkValue" placeholder="请输入水印内容"/>
        </el-form-item>
        <el-form-item label="浏览次数" prop="visitor">
          <el-input v-model="form.visitor" placeholder="请输入浏览次数"/>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入逻辑删除"/>
        </el-form-item>
        <el-form-item label="更新时间" prop="modifyTime">
          <el-date-picker clearable
                          v-model="form.modifyTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择更新时间"
          >
          </el-date-picker>
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
  listBlog_doc,
  getBlog_doc,
  delBlog_doc,
  addBlog_doc,
  updateBlog_doc
} from '@/api/platform/zblog/v1_blog/blog_doc'
import TipMessage from '@/utils/myUtils/TipMessage'
import {
  listBlog_project,
  getBlog_project,
  delBlog_project,
  addBlog_project,
  updateBlog_project
} from '@/api/platform/zblog/v1_blog/blog_project'

export default {
  //dicts: ['is_delete'],
  name: 'Blog_doc',
  dicts: ['watermark_type', 'doc_status', 'is_delete', 'doc_editor_mode', 'role'],
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
      // 文章表格数据
      blog_docList: [],
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
        createUserId: null,
        projectId: null,
        parentDoc: null,
        name: null,
        editorMode: null,
        content: null,
        preContent: null,
        sort: null,
        status: null,
        openChildren: null,
        showChildren: null,
        dataRowAuth: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        visitor: null,
        isDelete: null,
        modifyTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //文集列表
      projectList: [],
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
    this.getProjectList();
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      this.loading = true
      listBlog_doc(this.queryParams).then(response => {
        this.blog_docList = response.rows
        this.total = response.total
        this.loading = false
      }).catch((err) => {
        this.loading = false
        //Message({ message: ""+err, type: 'error' })
        console.log('请求错误: ', err)
      })
    },
    getProjectList() {
      let sendData = {
        orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        pageNum: 1,
        pageSize: 100,
      }
      listBlog_project(sendData).then(response => {
        this.projectList = response.rows
      }).catch((err) => {
        this.loading = false
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
        createUserId: null,
        projectId: null,
        parentDoc: null,
        name: null,
        editorMode: null,
        content: null,
        preContent: null,
        sort: null,
        status: null,
        openChildren: null,
        showChildren: null,
        dataRowAuth: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        visitor: null,
        isDelete: null,
        createTime: null,
        modifyTime: null
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
      this.title = '添加文章'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBlog_doc(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改文章'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBlog_doc(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBlog_doc(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除文章编号为"' + ids + '"的数据项？').then(function () {
        return delBlog_doc(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('blog_doc/blog_doc/export', {
        ...this.queryParams
      }, `blog_doc_${new Date().getTime()}.xlsx`)
    },
    //删除切换
    switchDeleteState(rowId, isD) {
      //console.log("删除切换row: ", rowId);
      let sendData = {
        "id": rowId,
        "isDelete": isD
      }
      updateBlog_doc(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg);
          return null;
        }
        if (isD == 1) {
          TipMessage.Warning("删除成功");
        } else {
          TipMessage.isOK("取消删除成功");
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    //权限切换
    switchDataAuthState(rowId, isD) {
      let sendData = {
        "id": rowId,
        "dataRowAuth": isD
      }
      updateBlog_doc(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg);
          return null;
        }
        if (isD == 9) {
          TipMessage.Warning(rowId + " 切换为超级管理员可见");
        } else {
          TipMessage.isOK(rowId + " 切换为公开");
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    //==================================底部结束===================================
  }
}
</script>
