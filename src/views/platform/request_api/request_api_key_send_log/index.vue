<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="68px">
      <el-form-item label="记录标题" prop="logTitle">
        <el-input
            v-model="queryParams.logTitle"
            placeholder="请输入记录标题"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="操作IP" prop="reqIp">-->
<!--        <el-input-->
<!--            v-model="queryParams.reqIp"-->
<!--            placeholder="请输入操作IP"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="IP地址" prop="reqAddress">
        <el-input
            v-model="queryParams.reqAddress"
            placeholder="请输入IP地址"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="浏览器" prop="reqBrowser">-->
<!--        <el-input-->
<!--            v-model="queryParams.reqBrowser"-->
<!--            placeholder="请输入浏览器"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="操作系统" prop="reqSystem">-->
<!--        <el-input-->
<!--            v-model="queryParams.reqSystem"-->
<!--            placeholder="请输入操作系统"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="请求URI" prop="reqUrl">-->
<!--        <el-input-->
<!--            v-model="queryParams.reqUrl"-->
<!--            placeholder="请输入请求URI"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="操作方式" prop="reqMethod">-->
<!--        <el-input-->
<!--            v-model="queryParams.reqMethod"-->
<!--            placeholder="请输入操作方式"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="key" prop="reqKey">
        <el-input
            v-model="queryParams.reqKey"
            placeholder="请输入请求的key"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否成功" prop="isSuccess">
        <el-input
            v-model="queryParams.isSuccess"
            placeholder="请输入是否成功"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="影响行数" prop="effectRows">-->
<!--        <el-input-->
<!--            v-model="queryParams.effectRows"-->
<!--            placeholder="请输入影响行数"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="执行时间" prop="timeOut">-->
<!--        <el-input-->
<!--            v-model="queryParams.timeOut"-->
<!--            placeholder="请输入执行时间"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="逻辑删除" prop="isDelete">-->
<!--        <el-input-->
<!--            v-model="queryParams.isDelete"-->
<!--            placeholder="请输入逻辑删除"-->
<!--            clearable-->
<!--            @change="handleQuery"-->
<!--            @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
            v-hasPermi="['request_api_key_send_log:request_api_key_send_log:add']"
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
            v-hasPermi="['request_api_key_send_log:request_api_key_send_log:edit']"
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
            v-hasPermi="['request_api_key_send_log:request_api_key_send_log:remove']"
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
            v-hasPermi="['request_api_key_send_log:request_api_key_send_log:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="request_api_key_send_logList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="记录标题" prop="logTitle"/>
      <el-table-column align="center" width="110" label="操作IP" prop="reqIp"/>
      <el-table-column align="center" width="160" label="IP地址" prop="reqAddress"/>
<!--      <el-table-column align="center" width="auto" label="请求头" prop="reqAgent"/>-->
<!--      <el-table-column align="center" width="auto" label="浏览器" prop="reqBrowser"/>-->
<!--      <el-table-column align="center" width="auto" label="操作系统" prop="reqSystem"/>-->
<!--      <el-table-column align="center" width="auto" label="请求URI" prop="reqUrl"/>-->
      <el-table-column align="center" width="100" label="操作方式" prop="reqMethod"/>
      <el-table-column align="center" width="auto" label="请求的key" prop="reqKey"/>
<!--      <el-table-column align="center" width="auto" label="操作提交的数据" prop="reqParams"/>-->
      <el-table-column align="center" width="100" label="是否成功" prop="isSuccess"/>
<!--      <el-table-column align="center" width="auto" label="影响行数" prop="effectRows"/>-->
<!--      <el-table-column align="center" width="auto" label="执行时间" prop="timeOut"/>-->
      <el-table-column align="center" width="auto" label="返回信息" prop="exception"/>
<!--      <el-table-column align="center" width="auto" label="逻辑删除" prop="isDelete"/>-->
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
              v-hasPermi="['request_api_key_send_log:request_api_key_send_log:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['request_api_key_send_log:request_api_key_send_log:remove']"
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

    <!-- 添加或修改api请求记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="记录标题" prop="logTitle">
          <el-input v-model="form.logTitle" placeholder="请输入记录标题"/>
        </el-form-item>
        <el-form-item label="操作IP" prop="reqIp">
          <el-input v-model="form.reqIp" placeholder="请输入操作IP"/>
        </el-form-item>
        <el-form-item label="IP地址" prop="reqAddress">
          <el-input v-model="form.reqAddress" placeholder="请输入IP地址"/>
        </el-form-item>
        <el-form-item label="请求头" prop="reqAgent">
          <el-input v-model="form.reqAgent" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="浏览器" prop="reqBrowser">
          <el-input v-model="form.reqBrowser" placeholder="请输入浏览器"/>
        </el-form-item>
        <el-form-item label="操作系统" prop="reqSystem">
          <el-input v-model="form.reqSystem" placeholder="请输入操作系统"/>
        </el-form-item>
        <el-form-item label="请求URI" prop="reqUrl">
          <el-input v-model="form.reqUrl" placeholder="请输入请求URI"/>
        </el-form-item>
        <el-form-item label="操作方式" prop="reqMethod">
          <el-input v-model="form.reqMethod" placeholder="请输入操作方式"/>
        </el-form-item>
        <el-form-item label="请求的key" prop="reqKey">
          <el-input v-model="form.reqKey" placeholder="请输入请求的key"/>
        </el-form-item>
        <el-form-item label="操作提交的数据" prop="reqParams">
          <el-input v-model="form.reqParams" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="是否成功" prop="isSuccess">
          <el-input v-model="form.isSuccess" placeholder="请输入是否成功"/>
        </el-form-item>
        <el-form-item label="影响行数" prop="effectRows">
          <el-input v-model="form.effectRows" placeholder="请输入影响行数"/>
        </el-form-item>
        <el-form-item label="执行时间" prop="timeOut">
          <el-input v-model="form.timeOut" placeholder="请输入执行时间"/>
        </el-form-item>
        <el-form-item label="异常信息" prop="exception">
          <el-input v-model="form.exception" autosize type="textarea" placeholder="请输入内容"/>
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
  listRequest_api_key_send_log,
  getRequest_api_key_send_log,
  delRequest_api_key_send_log,
  addRequest_api_key_send_log,
  updateRequest_api_key_send_log
} from '@/api/platform/request_api/request_api_key_send_log/request_api_key_send_log'

export default {
  name: 'Request_api_key_send_log',
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
      // api请求记录表格数据
      request_api_key_send_logList: [],
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
        logTitle: null,
        reqIp: null,
        reqAddress: null,
        reqAgent: null,
        reqBrowser: null,
        reqSystem: null,
        reqUrl: null,
        reqMethod: null,
        reqKey: null,
        reqParams: null,
        isSuccess: null,
        effectRows: null,
        timeOut: null,
        exception: null,
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
    /** 查询api请求记录列表 */
    getList() {
      this.loading = true
      listRequest_api_key_send_log(this.queryParams).then(response => {
        this.request_api_key_send_logList = response.rows
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
        logTitle: null,
        reqIp: null,
        reqAddress: null,
        reqAgent: null,
        reqBrowser: null,
        reqSystem: null,
        reqUrl: null,
        reqMethod: null,
        reqKey: null,
        reqParams: null,
        isSuccess: null,
        effectRows: null,
        timeOut: null,
        exception: null,
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
      this.title = '添加api请求记录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getRequest_api_key_send_log(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改api请求记录'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateRequest_api_key_send_log(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRequest_api_key_send_log(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除api请求记录编号为"' + ids + '"的数据项？').then(function() {
        return delRequest_api_key_send_log(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('request_api_key_send_log/request_api_key_send_log/export', {
        ...this.queryParams
      }, `request_api_key_send_log_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
