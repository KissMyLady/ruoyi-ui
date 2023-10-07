<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
      <!--      <el-form-item label="创建用户id" prop="createUserId">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.createUserId"-->
      <!--            placeholder="请输入创建用户id"-->
      <!--            clearable-->
      <!--            @change="handleQuery"-->
      <!--            @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="所属文集id" prop="projectId">
        <el-input v-model="queryParams.projectId"
                  placeholder="请输入所属文集id"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="父级文档" prop="parentDoc">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.parentDoc"-->
      <!--            placeholder="请输入父级文档"-->
      <!--            clearable-->
      <!--            @change="handleQuery"-->
      <!--            @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="标题" prop="name">
        <el-input v-model="queryParams.name"
                  placeholder="请输入标题"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
        <el-input v-model="queryParams.editorMode"
                  placeholder="请输入编辑器模式.1md,2富文本"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态码" prop="status">
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
      </el-form-item>
      <el-form-item label="数据行权限" prop="dataRowAuth">
        <el-input v-model="queryParams.dataRowAuth"
                  placeholder="请输入数据行权限"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水印状态" prop="isWatermark">
        <el-input v-model="queryParams.isWatermark"
                  placeholder="请输入水印状态"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水印类型" prop="watermarkType">
        <el-select v-model="queryParams.watermarkType"
                   @change="handleQuery"
                   placeholder="请选择水印类型" clearable
        >
          <el-option v-for="dict in dict.type.watermark_type"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="水印内容" prop="watermarkValue">
        <el-input
            v-model="queryParams.watermarkValue"
            placeholder="请输入水印内容"
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
              border
              stripe
              :data="blog_docList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="创建用户id" prop="createUserId"/>
      <el-table-column align="center" width="auto" label="所属文集id" prop="projectId"/>
      <el-table-column align="center" width="auto" label="父级文档" prop="parentDoc"/>
      <el-table-column align="center" width="auto" label="标题" prop="name"/>
      <el-table-column label="编辑器" align="center" prop="editorMode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.doc_editor_mode" :value="scope.row.editorMode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="文档内容" prop="content"/>
      <el-table-column align="center" width="auto" label="文档内容_预览_纯文本" prop="preContent"/>
      <el-table-column align="center" width="auto" label="排序" prop="sort"/>
      <el-table-column label="状态码" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.doc_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="打开下级" prop="openChildren"/>
      <el-table-column align="center" width="auto" label="显示下级" prop="showChildren"/>
      <el-table-column label="数据行权限" align="center" prop="dataRowAuth">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.role" :value="scope.row.dataRowAuth"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="水印状态" prop="isWatermark"/>
      <el-table-column label="水印类型" align="center" prop="watermarkType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.watermark_type" :value="scope.row.watermarkType"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="水印内容" prop="watermarkValue"/>
      <el-table-column align="center" width="auto" label="浏览次数" prop="visitor"/>
      <el-table-column label="逻辑删除" align="center" prop="isDelete">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" prop="modifyTime" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.modifyTime" placement="top">
            <span>{{ formatTime(scope.row.modifyTime, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['blog_doc:blog_doc:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
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
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
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
          <editor v-model="form.preContent" :min-height="192"/>
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

export default {
  //dicts: ['is_delete'],
  name: 'Blog_doc',
  dicts: ['watermark_type', 'doc_status'],
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
      rules: {}
    }
  },
  created() {
    this.getList()
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
      this.$modal.confirm('是否确认删除文章编号为"' + ids + '"的数据项？').then(function() {
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
    }
  }
}
</script>
