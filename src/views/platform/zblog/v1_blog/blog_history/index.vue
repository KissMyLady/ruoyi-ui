<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <!--      <el-form-item label="创建用户" prop="userId">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.userId"-->
      <!--            placeholder="请输入创建用户"-->
      <!--            clearable-->
      <!--            @change="handleQuery"-->
      <!--            @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="逻辑删除" prop="isDelete">
        <el-input v-model="queryParams.isDelete"
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
            v-hasPermi="['blog_history:blog_history:add']"
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
            v-hasPermi="['blog_history:blog_history:edit']"
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
            v-hasPermi="['blog_history:blog_history:remove']"
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
            v-hasPermi="['blog_history:blog_history:export']"
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
              :data="blog_historyList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="120" label="文档id" prop="blogDocId"/>
<!--      <el-table-column align="center" width="auto" label="历史内容" prop="preContent"/>-->
      <el-table-column align="center" width="120" label="创建用户" prop="userId"/>
      <el-table-column label="逻辑删除" align="center" prop="isDelete" width="120">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.createTime" placement="top">
            <span>{{ formatTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
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
              v-hasPermi="['blog_history:blog_history:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['blog_history:blog_history:remove']"
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

    <!-- 添加或修改文档历史记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="文档id" prop="blogDocId">
          <el-input v-model="form.blogDocId" placeholder="请输入文档id"/>
        </el-form-item>
        <el-form-item label="文档历史编辑内容">
          <el-input v-model="form.preContent"
                    type="textarea"
                    :autosize="{ minRows: 8, maxRows: 16}"
                    placeholder="文档内容_预览_纯文本"/>
        </el-form-item>
        <el-form-item label="创建用户" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入创建用户"/>
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
  listBlog_history,
  getBlog_history,
  delBlog_history,
  addBlog_history,
  updateBlog_history
} from '@/api/platform/zblog/v1_blog/blog_history'

export default {
  dicts: ['is_delete'],
  name: 'Blog_history',
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
      // 文档历史记录表格数据
      blog_historyList: [],
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
        blogDocId: null,
        preContent: null,
        userId: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        blogDocId: [
          { required: true, message: '文档id不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询文档历史记录列表 */
    getList() {
      this.loading = true
      listBlog_history(this.queryParams).then(response => {
        this.blog_historyList = response.rows
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
        blogDocId: null,
        preContent: null,
        userId: null,
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
      this.title = '添加文档历史记录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBlog_history(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改文档历史记录'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBlog_history(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBlog_history(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除文档历史记录编号为"' + ids + '"的数据项？').then(function() {
        return delBlog_history(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('blog_history/blog_history/export', {
        ...this.queryParams
      }, `blog_history_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
