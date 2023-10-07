<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
      <el-form-item label="分类名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入分类名称"
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
      <el-form-item label="排序" prop="sort">
        <el-input
            v-model="queryParams.sort"
            placeholder="请输入排序"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="子类的排序字段" prop="childSortField">
        <el-input
            v-model="queryParams.childSortField"
            placeholder="请输入子类的排序字段"
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
      <el-form-item label="当前分类是否允许评论" prop="isComment">
        <el-input
            v-model="queryParams.isComment"
            placeholder="请输入当前分类是否允许评论"
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
            v-hasPermi="['ideal_category:ideal_category:add']"
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
            v-hasPermi="['ideal_category:ideal_category:edit']"
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
            v-hasPermi="['ideal_category:ideal_category:remove']"
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
            v-hasPermi="['ideal_category:ideal_category:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="ideal_categoryList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="分类名称" prop="name"/>
      <el-table-column label="封面图" align="center" prop="coverImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.coverImage" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="编辑器模式.1md,2富文本" align="center" prop="editorMode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.doc_editor_mode" :value="scope.row.editorMode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="文档内容_含html格式" prop="content"/>
      <el-table-column align="center" width="auto" label="文档内容_预览_纯文本" prop="preContent"/>
      <el-table-column align="center" width="auto" label="浏览次数" prop="visitor"/>
      <el-table-column label="权限值0表示公开，1表示私密,2表示指定用户可见,3表示访问码可见" align="center" prop="role">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.role" :value="scope.row.role"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="权限值" prop="roleValue"/>
      <el-table-column align="center" width="auto" label="排序" prop="sort"/>
      <el-table-column align="center" width="auto" label="子类的排序字段" prop="childSortField"/>
      <el-table-column label="置顶" align="center" prop="isTop">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isTop"/>
        </template>
      </el-table-column>
      <el-table-column label="当前分类是否允许评论" align="center" prop="isComment">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isComment"/>
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
              v-hasPermi="['ideal_category:ideal_category:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ideal_category:ideal_category:remove']"
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

    <!-- 添加或修改看理想-类别对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImage">
          <image-upload v-model="form.coverImage"/>
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
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="子类的排序字段" prop="childSortField">
          <el-input v-model="form.childSortField" placeholder="请输入子类的排序字段"/>
        </el-form-item>
        <el-form-item label="置顶" prop="isTop">
          <el-input v-model="form.isTop" placeholder="请输入置顶"/>
        </el-form-item>
        <el-form-item label="当前分类是否允许评论" prop="isComment">
          <el-input v-model="form.isComment" placeholder="请输入当前分类是否允许评论"/>
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
  listIdeal_category,
  getIdeal_category,
  delIdeal_category,
  addIdeal_category,
  updateIdeal_category
} from '@/api/platform/zblog/v2_ideal/ideal_category'

export default {
  dicts: ['watermark_type', 'doc_status', 'is_delete', 'doc_editor_mode', 'role'],
  name: 'Ideal_category',
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
      // 看理想-类别表格数据
      ideal_categoryList: [],
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
        name: null,
        coverImage: null,
        editorMode: null,
        content: null,
        preContent: null,
        visitor: null,
        role: null,
        roleValue: null,
        sort: null,
        childSortField: null,
        isTop: null,
        isComment: null,
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
    /** 查询看理想-类别列表 */
    getList() {
      this.loading = true
      listIdeal_category(this.queryParams).then(response => {
        this.ideal_categoryList = response.rows
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
        name: null,
        coverImage: null,
        editorMode: null,
        content: null,
        preContent: null,
        visitor: null,
        role: null,
        roleValue: null,
        sort: null,
        childSortField: null,
        isTop: null,
        isComment: null,
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
      this.title = '添加看理想-类别'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getIdeal_category(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改看理想-类别'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateIdeal_category(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addIdeal_category(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除看理想-类别编号为"' + ids + '"的数据项？').then(function() {
        return delIdeal_category(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ideal_category/ideal_category/export', {
        ...this.queryParams
      }, `ideal_category_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
