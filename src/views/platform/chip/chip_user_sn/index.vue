<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="68px"
    >
      <el-form-item label="关联用户" prop="userId">
        <el-input v-model="queryParams.userId"
                  placeholder="请输入关联用户"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="queryParams.phone"
                  placeholder="请输入手机"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="queryParams.nickname"
                  placeholder="请输入昵称"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="sn序列号" prop="sn">
        <el-input
            v-model="queryParams.sn"
            placeholder="请输入sn序列号"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品缩略图" prop="thumbnail">
        <el-input
            v-model="queryParams.thumbnail"
            placeholder="请输入产品缩略图"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="到期时间" prop="expiredTime">
        <el-date-picker clearable
                        v-model="queryParams.expiredTime"
                        type="date"
                        @change="handleQuery"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择到期时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="删除标记" prop="isDelete">
        <el-input
            v-model="queryParams.isDelete"
            placeholder="请输入删除标记"
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
            v-hasPermi="['chip_user_sn:chip_user_sn:add']"
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
            v-hasPermi="['chip_user_sn:chip_user_sn:edit']"
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
            v-hasPermi="['chip_user_sn:chip_user_sn:remove']"
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
            v-hasPermi="['chip_user_sn:chip_user_sn:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="chip_user_snList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="100" label="关联用户ID" prop="userId"/>
      <el-table-column align="center" width="auto" label="手机" prop="phone"/>
      <el-table-column align="center" width="auto" label="昵称" prop="nickname"/>
      <el-table-column align="center" width="auto" label="sn序列号" prop="sn"/>
      <el-table-column align="center" width="auto" label="产品缩略图" prop="thumbnail"/>
      <el-table-column align="center" width="auto" label="状态" prop="status"/>
      <el-table-column label="到期时间" align="center" prop="expiredTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.expiredTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="删除标记" prop="isDelete"/>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['chip_user_sn:chip_user_sn:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['chip_user_sn:chip_user_sn:remove']"
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

    <!-- 添加或修改用户芯片-序列号对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="关联用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联用户ID"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"/>
        </el-form-item>
        <el-form-item label="sn序列号" prop="sn">
          <el-input v-model="form.sn" placeholder="请输入sn序列号"/>
        </el-form-item>
        <el-form-item label="产品缩略图" prop="thumbnail">
          <el-input v-model="form.thumbnail" placeholder="请输入产品缩略图"/>
        </el-form-item>
        <el-form-item label="到期时间" prop="expiredTime">
          <el-date-picker clearable
                          v-model="form.expiredTime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择到期时间"
          >
          </el-date-picker>
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
  listChip_user_sn, getChip_user_sn, delChip_user_sn,
  addChip_user_sn, updateChip_user_sn
} from '@/api/platform/chip/chip_user_sn/chip_user_sn'

export default {
  name: 'Chip_user_sn',
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
      // 用户芯片-序列号表格数据
      chip_user_snList: [],
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
        userId: null,
        phone: null,
        nickname: null,
        sn: null,
        thumbnail: null,
        status: null,
        expiredTime: null,
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
    /** 查询用户芯片-序列号列表 */
    getList() {
      this.loading = true
      listChip_user_sn(this.queryParams).then(response => {
        this.chip_user_snList = response.rows
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
        userId: null,
        phone: null,
        nickname: null,
        sn: null,
        thumbnail: null,
        status: null,
        expiredTime: null,
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
      this.title = '添加用户芯片-序列号'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getChip_user_sn(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户芯片-序列号'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateChip_user_sn(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addChip_user_sn(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户芯片-序列号编号为"' + ids + '"的数据项？').then(function() {
        return delChip_user_sn(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('chip_user_sn/chip_user_sn/export', {
        ...this.queryParams
      }, `chip_user_sn_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
