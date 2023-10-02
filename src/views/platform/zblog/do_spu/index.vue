<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="删除标记" prop="isDelete">
        <el-input
            v-model="queryParams.isDelete"
            placeholder="请输入删除标记"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="类别名称" prop="simpleName">
        <el-input
            v-model="queryParams.simpleName"
            placeholder="请输入类别的SPU名称"
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
            v-hasPermi="['do_spu:do_spu:add']"
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
            v-hasPermi="['do_spu:do_spu:edit']"
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
            v-hasPermi="['do_spu:do_spu:remove']"
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
            v-hasPermi="['do_spu:do_spu:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="do_spuList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="类别的SPU名称" prop="simpleName"/>
      <el-table-column align="center" width="auto" label="简单介绍" prop="simpleText"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.createTime" placement="top">
            <span>{{ formatTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="删除标记" prop="isDelete"/>
      <el-table-column align="center" width="auto" label="超级管理员" prop="isSuperuser"/>
      <el-table-column align="center" width="auto" label="登录" prop="isLoginView"/>
<!--      <el-table-column align="center" width="auto" label="类别详情" prop="detail"/>-->
      <el-table-column align="center" width="auto" label="文章log图片" prop="imgUpload"/>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['do_spu:do_spu:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['do_spu:do_spu:remove']"
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

    <!-- 添加或修改do_spu对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="删除标记" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入删除标记"/>
        </el-form-item>
        <el-form-item label="超级管理员" prop="isSuperuser">
          <el-input v-model="form.isSuperuser" placeholder="请输入超级管理员"/>
        </el-form-item>
        <el-form-item label="登录" prop="isLoginView">
          <el-input v-model="form.isLoginView" placeholder="请输入登录"/>
        </el-form-item>
        <el-form-item label="类别的SPU名称" prop="simpleName">
          <el-input v-model="form.simpleName" placeholder="请输入类别的SPU名称"/>
        </el-form-item>
        <el-form-item label="简单介绍" prop="simpleText">
          <el-input v-model="form.simpleText" placeholder="请输入简单介绍"/>
        </el-form-item>
        <el-form-item label="类别详情" prop="detail">
          <el-input v-model="form.detail" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="文章log图片" prop="imgUpload">
          <el-input v-model="form.imgUpload" placeholder="请输入文章log图片"/>
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
import { listDo_spu, getDo_spu, delDo_spu, addDo_spu, updateDo_spu } from '@/api/platform/zblog/do_spu/do_spu'

export default {
  name: 'Do_spu',
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
      // do_spu表格数据
      do_spuList: [],
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
        simpleName: null,
        simpleText: null,
        detail: null,
        imgUpload: null
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
          { required: true, message: '超级管理员不能为空', trigger: 'blur' }
        ],
        isLoginView: [
          { required: true, message: '登录不能为空', trigger: 'blur' }
        ],
        simpleName: [
          { required: true, message: '类别的SPU名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询do_spu列表 */
    getList() {
      this.loading = true
      listDo_spu(this.queryParams).then(response => {
        this.do_spuList = response.rows
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
        simpleName: null,
        simpleText: null,
        detail: null,
        imgUpload: null
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
      this.title = '添加do_spu'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getDo_spu(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改do_spu'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateDo_spu(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addDo_spu(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除do_spu编号为"' + ids + '"的数据项？').then(function() {
        return delDo_spu(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('do_spu/do_spu/export', {
        ...this.queryParams
      }, `do_spu_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
