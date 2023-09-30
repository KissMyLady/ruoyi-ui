<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="文集名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入文集名称"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文集权限" prop="role">
        <el-input
            v-model="queryParams.role"
            placeholder="请输入文集权限"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="水印状态" prop="isWatermark">
        <el-input
            v-model="queryParams.isWatermark"
            placeholder="请输入水印状态"
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
            v-hasPermi="['doc_project:doc_project:add']"
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
            v-hasPermi="['doc_project:doc_project:edit']"
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
            v-hasPermi="['doc_project:doc_project:remove']"
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
            v-hasPermi="['doc_project:doc_project:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="doc_projectList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="文集名称" prop="name"/>
<!--      <el-table-column align="center" width="auto" label="介绍" prop="intro"/>-->
      <el-table-column align="center" width="auto" label="创建人" prop="createUserId"/>
      <el-table-column align="center" width="auto" label="文集权限" prop="role"/>
<!--      <el-table-column align="center" width="auto" label="文集权限值" prop="roleValue"/>-->
      <el-table-column align="center" width="auto" label="文集图标" prop="icon"/>
<!--      <el-table-column align="center" width="auto" label="水印状态" prop="isWatermark"/>-->
<!--      <el-table-column align="center" width="auto" label="水印类型" prop="watermarkType"/>-->
<!--      <el-table-column align="center" width="auto" label="水印内容" prop="watermarkValue"/>-->
<!--      <el-table-column align="center" width="auto" label="是否置顶" prop="isTop"/>-->
      <el-table-column align="center" width="auto" label="浏览次数" prop="visitor"/>
      <el-table-column align="center" width="100" label="逻辑删除" prop="isDelete"/>
      <el-table-column align="center" width="auto" label="排序方式(sql字段)" prop="sortField"/>
      <el-table-column label="修改时间" align="center" prop="modifyTime" width="180">
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
              v-hasPermi="['doc_project:doc_project:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['doc_project:doc_project:remove']"
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

    <!-- 添加或修改doc_project对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="40%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="文集名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文集名称"/>
        </el-form-item>
        <el-form-item label="介绍" prop="intro">
          <el-input v-model="form.intro" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="修改时间" prop="modifyTime">
          <el-date-picker clearable
                          v-model="form.modifyTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择修改时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="创建人" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入创建人"/>
        </el-form-item>
        <el-form-item label="文集权限" prop="role">
          <el-input v-model="form.role" placeholder="请输入文集权限"/>
        </el-form-item>
        <el-form-item label="文集权限值" prop="roleValue">
          <el-input v-model="form.roleValue" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="文集图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入文集图标"/>
        </el-form-item>
        <el-form-item label="水印状态" prop="isWatermark">
          <el-input v-model="form.isWatermark" placeholder="请输入水印状态"/>
        </el-form-item>
        <el-form-item label="水印内容" prop="watermarkValue">
          <el-input v-model="form.watermarkValue" placeholder="请输入水印内容"/>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-input v-model="form.isTop" placeholder="请输入是否置顶"/>
        </el-form-item>
        <el-form-item label="浏览次数" prop="visitor">
          <el-input v-model="form.visitor" placeholder="请输入浏览次数"/>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入逻辑删除"/>
        </el-form-item>
        <el-form-item label="排序方式(sql字段)" prop="sortField">
          <el-input v-model="form.sortField" placeholder="请输入排序方式(sql字段)"/>
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
  listDoc_project,
  getDoc_project,
  delDoc_project,
  addDoc_project,
  updateDoc_project
} from '@/api/platform/mydoc/doc_project/doc_project'

export default {
  name: 'Doc_project',
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
      // doc_project表格数据
      doc_projectList: [],
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
        intro: null,
        modifyTime: null,
        createUserId: null,
        role: null,
        roleValue: null,
        icon: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        isTop: null,
        visitor: null,
        isDelete: null,
        sortField: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '文集名称不能为空', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '介绍不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '$comment不能为空', trigger: 'blur' }
        ],
        modifyTime: [
          { required: true, message: '$comment不能为空', trigger: 'blur' }
        ],
        createUserId: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '文集权限不能为空', trigger: 'blur' }
        ],
        isWatermark: [
          { required: true, message: '水印状态不能为空', trigger: 'blur' }
        ],
        watermarkType: [
          { required: true, message: '水印类型不能为空', trigger: 'change' }
        ],
        isTop: [
          { required: true, message: '是否置顶不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询doc_project列表 */
    getList() {
      this.loading = true
      listDoc_project(this.queryParams).then(response => {
        this.doc_projectList = response.rows
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
        name: null,
        intro: null,
        createTime: null,
        modifyTime: null,
        createUserId: null,
        role: null,
        roleValue: null,
        icon: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        isTop: null,
        visitor: null,
        isDelete: null,
        sortField: null
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
      this.title = '添加doc_project'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getDoc_project(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改doc_project'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDoc_project(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDoc_project(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除doc_project编号为"' + ids + '"的数据项？').then(function() {
        return delDoc_project(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('doc_project/doc_project/export', {
        ...this.queryParams
      }, `doc_project_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
