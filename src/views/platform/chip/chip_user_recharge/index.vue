<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户" prop="userId">
        <el-input v-model="queryParams.userId"
                  placeholder="请输入用户ID"
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
      <el-form-item label="充值金额" prop="rechargeMoney">
        <el-input v-model="queryParams.rechargeMoney"
                  placeholder="请输入充值金额"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="有效时间(单位:秒)" prop="effectiveTime">-->
<!--        <el-input v-model="queryParams.effectiveTime"-->
<!--                  placeholder="请输入有效时间(单位:秒)"-->
<!--                  clearable-->
<!--                  @change="handleQuery"-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="充值时间" prop="rechargeTime">
        <el-date-picker clearable
                        v-model="queryParams.rechargeTime"
                        type="date"
                        @change="handleQuery"
                        value-format="yyyy-MM-dd"
                        placeholder="请选择充值时间"
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
            v-hasPermi="['chip_user_recharge:chip_user_recharge:add']"
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
            v-hasPermi="['chip_user_recharge:chip_user_recharge:edit']"
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
            v-hasPermi="['chip_user_recharge:chip_user_recharge:remove']"
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
            v-hasPermi="['chip_user_recharge:chip_user_recharge:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="chip_user_rechargeList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="100" label="用户ID" prop="userId"/>
      <el-table-column align="center" width="130" label="手机" prop="phone"/>
      <el-table-column align="center" width="auto" label="充值金额" prop="rechargeMoney"/>
      <el-table-column align="center" width="auto" label="有效时间(单位:秒)" prop="effectiveTime"/>
      <el-table-column label="充值时间" align="center" prop="rechargeTime" width="180">
        <template slot-scope="scope">
          <!--          <span>{{ parseTime(scope.row.rechargeTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>-->
          <span>{{ scope.row.rechargeTime }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="删除标记" prop="isDelete"/>
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
              v-hasPermi="['chip_user_recharge:chip_user_recharge:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['chip_user_recharge:chip_user_recharge:remove']"
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

    <!-- 添加或修改用户芯片-用户充值对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户"/>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机"/>
        </el-form-item>
        <el-form-item label="充值金额" prop="rechargeMoney">
          <el-input v-model="form.rechargeMoney" placeholder="请输入充值金额"/>
        </el-form-item>
        <el-form-item label="有效时间(单位:秒)" prop="effectiveTime">
          <el-input v-model="form.effectiveTime" placeholder="请输入有效时间(单位:秒)"/>
        </el-form-item>
        <el-form-item label="充值时间" prop="rechargeTime">
          <el-date-picker clearable
                          v-model="form.rechargeTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择充值时间"
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
  listChip_user_recharge,
  getChip_user_recharge,
  delChip_user_recharge,
  addChip_user_recharge,
  updateChip_user_recharge
} from '@/api/platform/chip/chip_user_recharge/chip_user_recharge'

export default {
  name: 'Chip_user_recharge',
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
      // 用户芯片-用户充值表格数据
      chip_user_rechargeList: [],
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
        rechargeMoney: null,
        effectiveTime: null,
        rechargeTime: null,
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
    /** 查询用户芯片-用户充值列表 */
    getList() {
      this.loading = true
      listChip_user_recharge(this.queryParams).then(response => {
        this.chip_user_rechargeList = response.rows
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
        rechargeMoney: null,
        effectiveTime: null,
        rechargeTime: null,
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
      this.title = '添加用户芯片-用户充值'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getChip_user_recharge(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改用户芯片-用户充值'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          //修改时间 rechargeTime

          // let rechargeTime = this.form.rechargeTime
          // var dateString = new Date(rechargeTime)
          // // 注意js里面的getMonth是从0开始的
          // let FormattedDateTime =
          //     dateString.getFullYear() + '-' +
          //     (dateString.getMonth() + 1) + '-' +
          //     dateString.getUTCDate() + ' ' +
          //     dateString.getHours() + ':' +
          //     dateString.getMinutes() + ':' +
          //     dateString.getUTCSeconds()
          // console.log("格式化后的字符串FormattedDateTime: ", FormattedDateTime)
          // // 2020-9-10 15:36:5
          // this.form.rechargeTime = FormattedDateTime;

          if (this.form.id != null) {
            updateChip_user_recharge(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addChip_user_recharge(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除用户芯片-用户充值编号为"' + ids + '"的数据项？').then(function() {
        return delChip_user_recharge(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('chip_user_recharge/chip_user_recharge/export', {
        ...this.queryParams
      }, `chip_user_recharge_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
