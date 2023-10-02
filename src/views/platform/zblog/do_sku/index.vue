<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
      <el-form-item label="删除标记" prop="isDelete">
        <el-input
            v-model="queryParams.isDelete"
            placeholder="请输入删除标记"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章分类" prop="forCategoryId">
        <el-input
            v-model="queryParams.forCategoryId"
            placeholder="请输入文章SPU分类"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="编辑器1富文本2md" prop="modifyModel" label-width="138px">
        <el-input
            v-model="queryParams.modifyModel"
            placeholder="编辑器模式1富文本2md"
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
            v-hasPermi="['do_sku:do_sku:add']"
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
            v-hasPermi="['do_sku:do_sku:edit']"
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
            v-hasPermi="['do_sku:do_sku:remove']"
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
            v-hasPermi="['do_sku:do_sku:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="do_skuList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="100" label="文章分类" prop="forCategoryId"/>
      <el-table-column align="left" width="auto" label="标题" prop="blogTitle"/>
      <el-table-column align="center" width="100" label="文章浏览量" prop="seeCount"/>
      <!--      <el-table-column align="center" width="auto" label="点赞数" prop="likeCount"/>-->
      <!--      <el-table-column align="center" width="auto" label="父Id" prop="pid"/>-->
      <!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
      <el-table-column align="center" width="110" label="1富文本2md" prop="modifyModel"/>
      <el-table-column label="删除标记" width="90" align="center" prop="isDelete">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="超管可见" width="90" align="center" prop="isSuperuser">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isSuperuser"/>
        </template>
      </el-table-column>
      <el-table-column label="登录可见" width="90" align="center" prop="isLoginView">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isLoginView"/>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" width="auto" label="作者" prop="blogAuth"/>-->
<!--      <el-table-column align="center" width="auto" label="摘要" prop="blogSummary"/>-->
<!--      <el-table-column align="center" width="auto" label="静态文章封面图片" prop="imageStaticUrl"/>-->
<!--      <el-table-column align="center" width="auto" label="tinymce" prop="comArticleTinymce"/>-->
<!--      <el-table-column align="center" width="auto" label="markdown" prop="comBody"/>-->
<!--      <el-table-column align="center" width="auto" label="静态的链接式文章" prop="articleStatic"/>-->
<!--      <el-table-column align="center" width="auto" label="排序" prop="indexNum"/>-->
<!--      <el-table-column label="置顶" align="center" prop="isTop">-->
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.is_delete" :value="scope.row.isTop"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
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
              v-hasPermi="['do_sku:do_sku:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['do_sku:do_sku:remove']"
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

    <!-- 添加或修改do_sku对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="55%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="删除标记" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入删除标记"/>
        </el-form-item>
        <el-form-item label="超级管理员可见" prop="isSuperuser">
          <el-input v-model="form.isSuperuser" placeholder="请输入超级管理员可见"/>
        </el-form-item>
        <el-form-item label="超级管理员" prop="isLoginView">
          <el-input v-model="form.isLoginView" placeholder="请输入超级管理员"/>
        </el-form-item>
        <el-form-item label="标题" prop="blogTitle">
          <el-input v-model="form.blogTitle" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="作者" prop="blogAuth">
          <el-input v-model="form.blogAuth" placeholder="请输入作者"/>
        </el-form-item>
        <el-form-item label="摘要" prop="blogSummary">
          <el-input v-model="form.blogSummary" placeholder="请输入摘要"/>
        </el-form-item>
        <el-form-item label="静态文章封面图片" prop="imageStaticUrl">
          <el-input v-model="form.imageStaticUrl" placeholder="请输入静态文章封面图片"/>
        </el-form-item>
        <el-form-item label="tinymce" prop="comArticleTinymce">
          <el-input v-model="form.comArticleTinymce" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="markdown" prop="comBody">
          <el-input v-model="form.comBody" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="静态的链接式文章" prop="articleStatic">
          <el-input v-model="form.articleStatic" placeholder="请输入静态的链接式文章"/>
        </el-form-item>
        <el-form-item label="排序" prop="indexNum">
          <el-input v-model="form.indexNum" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="置顶" prop="isTop">
          <el-input v-model="form.isTop" placeholder="请输入置顶"/>
        </el-form-item>
        <el-form-item label="文章浏览量" prop="seeCount">
          <el-input v-model="form.seeCount" placeholder="请输入文章浏览量"/>
        </el-form-item>
        <el-form-item label="点赞数" prop="likeCount">
          <el-input v-model="form.likeCount" placeholder="请输入点赞数"/>
        </el-form-item>
        <el-form-item label="文章SPU分类" prop="forCategoryId">
          <el-input v-model="form.forCategoryId" placeholder="请输入文章SPU分类"/>
        </el-form-item>
        <el-form-item label="父Id" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入父Id"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="编辑器模式,1富文本,2md" prop="modifyModel">
          <el-input v-model="form.modifyModel" placeholder="请输入编辑器模式,1富文本,2md"/>
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
import { listDo_sku, getDo_sku, delDo_sku, addDo_sku, updateDo_sku } from '@/api/platform/zblog/do_sku/do_sku'

export default {
  dicts: ['is_delete'],
  name: 'Do_sku',
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
      // do_sku表格数据
      do_skuList: [],
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
        isDelete: null,
        isSuperuser: null,
        isLoginView: null,
        blogTitle: null,
        blogAuth: null,
        blogSummary: null,
        imageStaticUrl: null,
        comArticleTinymce: null,
        comBody: null,
        articleStatic: null,
        indexNum: null,
        isTop: null,
        seeCount: null,
        likeCount: null,
        forCategoryId: null,
        pid: null,
        sort: null,
        modifyModel: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '更新时间不能为空', trigger: 'blur' }
        ],
        isDelete: [
          { required: true, message: '删除标记不能为空', trigger: 'blur' }
        ],
        isSuperuser: [
          { required: true, message: '超级管理员可见不能为空', trigger: 'blur' }
        ],
        forCategoryId: [
          { required: true, message: '文章SPU分类不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询do_sku列表 */
    getList() {
      this.loading = true
      listDo_sku(this.queryParams).then(response => {
        this.do_skuList = response.rows
        this.total = response.total
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
        createTime: null,
        updateTime: null,
        isDelete: null,
        isSuperuser: null,
        isLoginView: null,
        blogTitle: null,
        blogAuth: null,
        blogSummary: null,
        imageStaticUrl: null,
        comArticleTinymce: null,
        comBody: null,
        articleStatic: null,
        indexNum: null,
        isTop: null,
        seeCount: null,
        likeCount: null,
        forCategoryId: null,
        pid: null,
        sort: null,
        modifyModel: null
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
      this.title = '添加do_sku'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getDo_sku(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改do_sku'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDo_sku(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDo_sku(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除do_sku编号为"' + ids + '"的数据项？').then(function() {
        return delDo_sku(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('do_sku/do_sku/export', {
        ...this.queryParams
      }, `do_sku_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
