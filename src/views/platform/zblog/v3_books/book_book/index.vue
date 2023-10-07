<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="UUID" prop="uuid">
        <el-input
            v-model="queryParams.uuid"
            placeholder="请输入UUID"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="书籍名称" prop="bookName">
        <el-input
            v-model="queryParams.bookName"
            placeholder="请输入书籍名称"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="书籍封面图" prop="bookCover">
        <el-input
            v-model="queryParams.bookCover"
            placeholder="请输入书籍封面图"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="作者" prop="bAuthor">
        <el-input
            v-model="queryParams.bAuthor"
            placeholder="请输入作者"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出版社" prop="bPublisher">
        <el-input
            v-model="queryParams.bPublisher"
            placeholder="请输入出版社"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出版时间" prop="bPublicData">
        <el-date-picker clearable
                        v-model="queryParams.bPublicData"
                        type="date"
                        @change="handleQuery"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择出版时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="翻译人" prop="bTranslate">
        <el-input
            v-model="queryParams.bTranslate"
            placeholder="请输入翻译人"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始阅读时间" prop="bReadStartTime">
        <el-date-picker clearable
                        v-model="queryParams.bReadStartTime"
                        type="date"
                        @change="handleQuery"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择开始阅读时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="阅读完毕时间" prop="bReadEndTime">
        <el-date-picker clearable
                        v-model="queryParams.bReadEndTime"
                        type="date"
                        @change="handleQuery"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择阅读完毕时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否读完" prop="bIsOver">
        <el-input
            v-model="queryParams.bIsOver"
            placeholder="请输入是否读完"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
        <el-input
            v-model="queryParams.editorMode"
            placeholder="请输入编辑器模式.1md,2富文本"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="浏览次数" prop="visitor">
        <el-input
            v-model="queryParams.visitor"
            placeholder="请输入浏览次数"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限值0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见" prop="role">
        <el-input
            v-model="queryParams.role"
            placeholder="请输入权限值0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子类的排序字段" prop="sortField">
        <el-input
            v-model="queryParams.sortField"
            placeholder="请输入子类的排序字段"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input
            v-model="queryParams.sort"
            placeholder="请输入排序"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="当前分类是否允许评论" prop="isComment">
        <el-input
            v-model="queryParams.isComment"
            placeholder="请输入当前分类是否允许评论"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="置顶" prop="isTop">
        <el-input
            v-model="queryParams.isTop"
            placeholder="请输入置顶"
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
            v-hasPermi="['book_book:book_book:add']"
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
            v-hasPermi="['book_book:book_book:edit']"
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
            v-hasPermi="['book_book:book_book:remove']"
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
            v-hasPermi="['book_book:book_book:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="book_bookList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="UUID" prop="uuid"/>
      <el-table-column align="center" width="auto" label="书籍名称" prop="bookName"/>
      <el-table-column align="center" width="auto" label="书籍封面图" prop="bookCover"/>
      <el-table-column align="center" width="auto" label="作者" prop="bAuthor"/>
      <el-table-column align="center" width="auto" label="出版社" prop="bPublisher"/>
      <el-table-column label="出版时间" align="center" prop="bPublicData" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.bPublicData" placement="top">
            <span>{{ formatTime(scope.row.bPublicData, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="翻译人" prop="bTranslate"/>
      <el-table-column label="开始阅读时间" align="center" prop="bReadStartTime" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.bReadStartTime" placement="top">
            <span>{{ formatTime(scope.row.bReadStartTime, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="阅读完毕时间" align="center" prop="bReadEndTime" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.bReadEndTime" placement="top">
            <span>{{ formatTime(scope.row.bReadEndTime, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="是否读完" align="center" prop="bIsOver">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.bIsOver"/>
        </template>
      </el-table-column>
      <el-table-column label="编辑器模式.1md,2富文本" align="center" prop="editorMode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.doc_editor_mode" :value="scope.row.editorMode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="介绍内容_含html格式" prop="content"/>
      <el-table-column align="center" width="auto" label="介绍内容_预览_纯文本" prop="preContent"/>
      <el-table-column align="center" width="auto" label="浏览次数" prop="visitor"/>
      <el-table-column label="权限值0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见" align="center" prop="role">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.role" :value="scope.row.role"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="权限值" prop="roleValue"/>
      <el-table-column align="center" width="auto" label="子类的排序字段" prop="sortField"/>
      <el-table-column align="center" width="auto" label="排序" prop="sort"/>
      <el-table-column label="当前分类是否允许评论" align="center" prop="isComment">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isComment"/>
        </template>
      </el-table-column>
      <el-table-column label="置顶" align="center" prop="isTop">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isTop"/>
        </template>
      </el-table-column>
      <el-table-column label="逻辑删除" align="center" prop="isDelete">
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
              v-hasPermi="['book_book:book_book:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['book_book:book_book:remove']"
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

    <!-- 添加或修改书籍信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="UUID" prop="uuid">
          <el-input v-model="form.uuid" placeholder="请输入UUID"/>
        </el-form-item>
        <el-form-item label="书籍名称" prop="bookName">
          <el-input v-model="form.bookName" placeholder="请输入书籍名称"/>
        </el-form-item>
        <el-form-item label="书籍封面图" prop="bookCover">
          <el-input v-model="form.bookCover" placeholder="请输入书籍封面图"/>
        </el-form-item>
        <el-form-item label="作者" prop="bAuthor">
          <el-input v-model="form.bAuthor" placeholder="请输入作者"/>
        </el-form-item>
        <el-form-item label="出版社" prop="bPublisher">
          <el-input v-model="form.bPublisher" placeholder="请输入出版社"/>
        </el-form-item>
        <el-form-item label="出版时间" prop="bPublicData">
          <el-date-picker clearable
                          v-model="form.bPublicData"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择出版时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="翻译人" prop="bTranslate">
          <el-input v-model="form.bTranslate" placeholder="请输入翻译人"/>
        </el-form-item>
        <el-form-item label="开始阅读时间" prop="bReadStartTime">
          <el-date-picker clearable
                          v-model="form.bReadStartTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择开始阅读时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="阅读完毕时间" prop="bReadEndTime">
          <el-date-picker clearable
                          v-model="form.bReadEndTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择阅读完毕时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否读完" prop="bIsOver">
          <el-input v-model="form.bIsOver" placeholder="请输入是否读完"/>
        </el-form-item>
        <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
          <el-input v-model="form.editorMode" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="介绍内容_含html格式">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="介绍内容_预览_纯文本">
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
        <el-form-item label="子类的排序字段" prop="sortField">
          <el-input v-model="form.sortField" placeholder="请输入子类的排序字段"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="当前分类是否允许评论" prop="isComment">
          <el-input v-model="form.isComment" placeholder="请输入当前分类是否允许评论"/>
        </el-form-item>
        <el-form-item label="置顶" prop="isTop">
          <el-input v-model="form.isTop" placeholder="请输入置顶"/>
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
  listBook_book,
  getBook_book,
  delBook_book,
  addBook_book,
  updateBook_book
} from '@/api/platform/zblog/v3_books/book_book'

export default {
  dicts: ['watermark_type', 'doc_status', 'is_delete', 'doc_editor_mode', 'role'],
  name: 'Book_book',
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
      // 书籍信息表格数据
      book_bookList: [],
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
        bookName: null,
        bookCover: null,
        bAuthor: null,
        bPublisher: null,
        bPublicData: null,
        bTranslate: null,
        bReadStartTime: null,
        bReadEndTime: null,
        bIsOver: null,
        editorMode: null,
        content: null,
        preContent: null,
        visitor: null,
        role: null,
        roleValue: null,
        sortField: null,
        sort: null,
        isComment: null,
        isTop: null,
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
    /** 查询书籍信息列表 */
    getList() {
      this.loading = true
      listBook_book(this.queryParams).then(response => {
        this.book_bookList = response.rows
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
        bookName: null,
        bookCover: null,
        bAuthor: null,
        bPublisher: null,
        bPublicData: null,
        bTranslate: null,
        bReadStartTime: null,
        bReadEndTime: null,
        bIsOver: null,
        editorMode: null,
        content: null,
        preContent: null,
        visitor: null,
        role: null,
        roleValue: null,
        sortField: null,
        sort: null,
        isComment: null,
        isTop: null,
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
      this.title = '添加书籍信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBook_book(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改书籍信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBook_book(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBook_book(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除书籍信息编号为"' + ids + '"的数据项？').then(function() {
        return delBook_book(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('book_book/book_book/export', {
        ...this.queryParams
      }, `book_book_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
