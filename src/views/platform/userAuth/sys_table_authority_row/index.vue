<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="表名称" prop="tableName">
        <el-input
            v-model="queryParams.tableName"
            placeholder="请输入表名称"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主键id名称" prop="dbIdName">
        <el-input
            v-model="queryParams.dbIdName"
            placeholder="请输入主键id名称"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="主键id号" prop="dbId">
        <el-input
            v-model="queryParams.dbId"
            placeholder="请输入主键id号"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="部门id" prop="needDeptId">
        <el-input
            v-model="queryParams.needDeptId"
            placeholder="请输入部门id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="仅自己可见" prop="isPrivate">
        <el-input
            v-model="queryParams.isPrivate"
            placeholder="请输入仅自己可见"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开放" prop="isPublic">
        <el-input
            v-model="queryParams.isPublic"
            placeholder="请输入开放"
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
            v-hasPermi="['sys_table_authority_row:sys_table_authority_row:add']"
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
            v-hasPermi="['sys_table_authority_row:sys_table_authority_row:edit']"
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
            v-hasPermi="['sys_table_authority_row:sys_table_authority_row:remove']"
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
            v-hasPermi="['sys_table_authority_row:sys_table_authority_row:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="sys_table_authority_rowList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="表名称" prop="tableName"/>
      <el-table-column align="center" width="auto" label="主键id名称" prop="dbIdName"/>
      <el-table-column align="center" width="auto" label="主键id号" prop="dbId"/>
      <el-table-column align="center" width="auto" label="部门id" prop="needDeptId"/>
      <el-table-column align="center" width="auto" label="仅自己可见" prop="isPrivate"/>
      <el-table-column align="center" width="auto" label="开放" prop="isPublic"/>
      <el-table-column align="center" width="auto" label="逻辑删除" prop="isDelete"/>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['sys_table_authority_row:sys_table_authority_row:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['sys_table_authority_row:sys_table_authority_row:remove']"
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

    <!-- 添加或修改数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="表名称" prop="tableName">
          <el-input v-model="form.tableName" placeholder="请输入表名称"/>
        </el-form-item>
        <el-form-item label="主键id名称" prop="dbIdName">
          <el-input v-model="form.dbIdName" placeholder="请输入主键id名称"/>
        </el-form-item>
        <el-form-item label="主键id号" prop="dbId">
          <el-input v-model="form.dbId" placeholder="请输入主键id号"/>
        </el-form-item>
        <el-form-item label="部门id" prop="needDeptId">
          <el-input v-model="form.needDeptId" placeholder="请输入部门id"/>
        </el-form-item>
        <el-form-item label="仅自己可见" prop="isPrivate">
          <el-input v-model="form.isPrivate" placeholder="请输入仅自己可见"/>
        </el-form-item>
        <el-form-item label="开放" prop="isPublic">
          <el-input v-model="form.isPublic" placeholder="请输入开放"/>
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
  listSys_table_authority_row,
  getSys_table_authority_row,
  delSys_table_authority_row,
  addSys_table_authority_row,
  updateSys_table_authority_row
} from '@/api/platform/userAuth/sys_table_authority_row/sys_table_authority_row'

export default {
  //dicts: ['is_delete'],
  name: 'Sys_table_authority_row',
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
      // 数据权限表格数据
      sys_table_authority_rowList: [],
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
        tableName: null,
        dbIdName: null,
        dbId: null,
        needDeptId: null,
        isPrivate: null,
        isPublic: null,
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
    /** 查询数据权限列表 */
    getList() {
      this.loading = true
      listSys_table_authority_row(this.queryParams).then(response => {
        this.sys_table_authority_rowList = response.rows
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
        tableName: null,
        dbIdName: null,
        dbId: null,
        needDeptId: null,
        isPrivate: null,
        isPublic: null,
        createBy: null,
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
      this.title = '添加数据权限'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getSys_table_authority_row(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改数据权限'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateSys_table_authority_row(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addSys_table_authority_row(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除数据权限编号为"' + ids + '"的数据项？').then(function() {
        return delSys_table_authority_row(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('sys_table_authority_row/sys_table_authority_row/export', {
        ...this.queryParams
      }, `sys_table_authority_row_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
