<template>
  <div class="app-container">
    <el-form :model="queryParams" 
             ref="queryForm" 
             size="small" 
             :inline="true" v-show="showSearch" 
             label-width="88px">

      <el-form-item label="类别" prop="forBookBookId">
        <el-input
            v-model="queryParams.forBookBookId"
            placeholder="类别选择"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限值" prop="role">
        <el-input
            v-model="queryParams.role"
            placeholder="0表示公开，1表示私密"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="删除标记" prop="isDelete">
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
        <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['book_article:book_article:add']"
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
            v-hasPermi="['book_article:book_article:edit']"
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
            v-hasPermi="['book_article:book_article:remove']"
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
            v-hasPermi="['book_article:book_article:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="book_articleList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <!-- <el-table-column align="center" width="auto" label="uuid" prop="uuid"/> -->
      <el-table-column align="center" width="auto" label="类别" prop="forBookBookId"/>
      <!-- <el-table-column align="center" width="auto" label="上级文档" prop="parentDoc"/> -->
      <!-- <el-table-column align="center" width="auto" label="封面图" prop="coverImg"/> -->
      <el-table-column align="center" width="auto" label="标题" prop="title"/>
      <!-- <el-table-column align="center" width="auto" label="简单描述" prop="descNote"/> -->
      <!-- <el-table-column label="编辑器" align="center" prop="editorMode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.doc_editor_mode" :value="scope.row.editorMode"/>
        </template>
      </el-table-column> -->
      <el-table-column align="center" width="85" label="浏览次数" prop="visitor"/>
      <el-table-column label="权限" width="85" align="center" prop="role">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.role" :value="scope.row.role"/>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" width="auto" label="权限值" prop="roleValue"/> -->
      <el-table-column label="允许评论" width="85" align="center" prop="allowComment">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.allowComment"/>
        </template>
      </el-table-column>
      <el-table-column label="删除标记" width="85" align="center" prop="isDelete">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['book_article:book_article:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['book_article:book_article:remove']"
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

    <!-- 添加或修改书籍-详情列内容对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="uuid" prop="uuid">
          <el-input v-model="form.uuid" placeholder="请输入uuid"/>
        </el-form-item>
        <el-form-item label="关联类别" prop="forBookBookId">
          <el-input v-model="form.forBookBookId" placeholder="请输入关联类别"/>
        </el-form-item>
        <el-form-item label="上级文档" prop="parentDoc">
          <el-input v-model="form.parentDoc" placeholder="请输入上级文档"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="简单描述" prop="descNote">
          <el-input v-model="form.descNote" placeholder="请输入简单描述"/>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImg">
          <el-input v-model="form.coverImg" placeholder="请输入封面图"/>
        </el-form-item>
        <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
          <el-input v-model="form.editorMode" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="文档内容_含html格式">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="文档内容_预览_纯文本">
          <editor v-model="form.preContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="浏览次数" prop="visitor">
          <el-input v-model="form.visitor" placeholder="请输入浏览次数"/>
        </el-form-item>
        <el-form-item label="权限值0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见" prop="role">
          <el-input v-model="form.role"
                    placeholder="请输入权限值0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见"
          />
        </el-form-item>
        <el-form-item label="权限值" prop="roleValue">
          <el-input v-model="form.roleValue" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="当前是否允许评论" prop="allowComment">
          <el-input v-model="form.allowComment" placeholder="请输入当前是否允许评论"/>
        </el-form-item>
        <el-form-item label="删除标记" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入删除标记"/>
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
  listBook_article,
  getBook_article,
  delBook_article,
  addBook_article,
  updateBook_article
} from '@/api/platform/zblog/v3_books/book_article'

export default {
  dicts: ['watermark_type', 'doc_status', 'is_delete', 'doc_editor_mode', 'role'],
  name: 'Book_article',
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
      // 书籍-详情列内容表格数据
      book_articleList: [],
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
        uuid: null,
        forBookBookId: null,
        parentDoc: null,
        title: null,
        descNote: null,
        coverImg: null,
        editorMode: null,
        content: null,
        preContent: null,
        visitor: null,
        role: null,
        roleValue: null,
        allowComment: null,
        isDelete: null
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
    /** 查询书籍-详情列内容列表 */
    getList() {
      this.loading = true
      listBook_article(this.queryParams).then(response => {
        this.book_articleList = response.rows
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
        uuid: null,
        forBookBookId: null,
        parentDoc: null,
        title: null,
        descNote: null,
        coverImg: null,
        editorMode: null,
        content: null,
        preContent: null,
        visitor: null,
        role: null,
        roleValue: null,
        allowComment: null,
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
      this.title = '添加书籍-详情列内容'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBook_article(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改书籍-详情列内容'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBook_article(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBook_article(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除书籍-详情列内容编号为"' + ids + '"的数据项？').then(function() {
        return delBook_article(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('book_article/book_article/export', {
        ...this.queryParams
      }, `book_article_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
