<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch" label-width="68px"
    >
      <el-form-item label="聊天用户" prop="user">
        <el-input v-model="queryParams.user"
                  placeholder="请输入聊天用户"
                  clearable
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="ip地址" prop="userIp">-->
<!--        <el-input v-model="queryParams.userIp"-->
<!--                  placeholder="请输入ip地址"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="聊天用户地址" prop="userAddress">-->
<!--        <el-input v-model="queryParams.userAddress"-->
<!--                  placeholder="请输入聊天用户地址"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="浏览器" prop="userBrowser">-->
<!--        <el-input v-model="queryParams.userBrowser"-->
<!--                  placeholder="请输入浏览器"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="操作系统" prop="userSystem">-->
<!--        <el-input v-model="queryParams.userSystem"-->
<!--                  placeholder="请输入操作系统"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="queryParams.roleName"
                  placeholder="请输入角色名称"
                  clearable
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="当前聊天角色" prop="currentRoleName">-->
<!--        <el-input v-model="queryParams.currentRoleName"-->
<!--                  placeholder="请输入当前聊天角色"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="语言模型" prop="llm">
        <el-input v-model="queryParams.llm"
                  placeholder="请输入当前聊天语言模型"
                  clearable
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="计算耗时" prop="consumeTime">-->
<!--        <el-input v-model="queryParams.consumeTime"-->
<!--                  placeholder="请输入计算耗时"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="历史记录" prop="isDelete">-->
<!--        <el-input v-model="queryParams.isDelete"-->
<!--                  placeholder="请输入历史记录"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['llm_chat_log:llm_chat_log:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   :disabled="single"
                   @click="handleUpdate"
                   v-hasPermi="['llm_chat_log:llm_chat_log:edit']"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['llm_chat_log:llm_chat_log:remove']"
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
            v-hasPermi="['llm_chat_log:llm_chat_log:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="llm_chat_logList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column label="聊天用户" align="center" prop="user" width="auto"/>
      <el-table-column label="角色名称" align="center" prop="roleName" width="auto"/>
      <el-table-column label="当前聊天角色" align="center" prop="currentRoleName" width="auto"/>
      <el-table-column label="当前聊天语言模型" align="center" prop="llm" width="auto"/>
      <el-table-column label="输入内容" align="center" prop="prompt" width="200"/>
      <el-table-column label="输出内容" align="center" prop="response" width="200"/>
      <el-table-column label="计算耗时" align="center" prop="consumeTime" width="auto"/>
      <!--      <el-table-column label="当前聊天的历史内容" align="center" prop="history" width="auto"/>-->
      <!--      <el-table-column label="操作提交的数据" align="center" prop="reqParams" width="auto"/>-->
      <el-table-column label="删除标记" align="center" prop="isDelete" width="auto"/>
      <el-table-column label="设备" align="center" prop="userDeviceType" width="auto"/>
      <el-table-column label="ip地址" align="center" prop="userIp" width="auto"/>
      <el-table-column label="聊天用户地址" align="center" prop="userAddress" width="auto"/>
      <el-table-column label="请求头" align="center" prop="userAgent" width="auto"/>
      <el-table-column label="浏览器" align="center" prop="userBrowser" width="auto"/>
      <el-table-column label="操作系统" align="center" prop="userSystem" width="auto"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['llm_chat_log:llm_chat_log:edit']"
          >修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['llm_chat_log:llm_chat_log:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0"
                :total="total"
                :page.sync="queryParams.pageNum"
                :limit.sync="queryParams.pageSize"
                @pagination="getList"
    />

    <!-- 添加或修改语言模型聊天记录对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="聊天用户" prop="user">
          <el-input v-model="form.user" placeholder="请输入聊天用户"/>
        </el-form-item>
        <el-form-item label="ip地址" prop="userIp">
          <el-input v-model="form.userIp" placeholder="请输入ip地址"/>
        </el-form-item>
        <el-form-item label="聊天用户地址" prop="userAddress">
          <el-input v-model="form.userAddress" placeholder="请输入聊天用户地址"/>
        </el-form-item>
        <el-form-item label="请求头" prop="userAgent">
          <el-input v-model="form.userAgent" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="浏览器" prop="userBrowser">
          <el-input v-model="form.userBrowser" placeholder="请输入浏览器"/>
        </el-form-item>
        <el-form-item label="操作系统" prop="userSystem">
          <el-input v-model="form.userSystem" placeholder="请输入操作系统"/>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"/>
        </el-form-item>
        <el-form-item label="当前聊天角色" prop="currentRoleName">
          <el-input v-model="form.currentRoleName" placeholder="请输入当前聊天角色"/>
        </el-form-item>
        <el-form-item label="当前聊天语言模型" prop="llm">
          <el-input v-model="form.llm" placeholder="请输入当前聊天语言模型"/>
        </el-form-item>
        <el-form-item label="输入内容" prop="prompt">
          <el-input v-model="form.prompt"
                    autosize
                    type="textarea"
                    placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="输出内容" prop="response">
          <el-input v-model="form.response"
                    autosize
                    type="textarea"
                    placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="计算耗时" prop="consumeTime">
          <el-input v-model="form.consumeTime" placeholder="请输入计算耗时"/>
        </el-form-item>
        <el-form-item label="当前聊天的历史内容" prop="history">
          <el-input v-model="form.history" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="操作提交的数据" prop="reqParams">
          <el-input v-model="form.reqParams"
                    autosize
                    type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="删除标记" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="0或者1"/>
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
  listLlm_chat_log,
  getLlm_chat_log,
  delLlm_chat_log,
  addLlm_chat_log,
  updateLlm_chat_log
} from '@/api/platform/llm/llm_chat_log'

export default {
  name: 'Llm_chat_log',
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
      // 语言模型聊天记录表格数据
      llm_chat_logList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        user: null,
        userDeviceType: null,
        userIp: null,
        userAddress: null,
        userAgent: null,
        userBrowser: null,
        userSystem: null,
        roleName: null,
        currentRoleName: null,
        llm: null,
        prompt: null,
        response: null,
        consumeTime: null,
        history: null,
        reqParams: null,
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
    /** 查询语言模型聊天记录列表 */
    getList() {
      this.loading = true
      listLlm_chat_log(this.queryParams).then(response => {
        this.llm_chat_logList = response.rows
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
        user: null,
        userDeviceType: null,
        userIp: null,
        userAddress: null,
        userAgent: null,
        userBrowser: null,
        userSystem: null,
        roleName: null,
        currentRoleName: null,
        llm: null,
        prompt: null,
        response: null,
        consumeTime: null,
        history: null,
        reqParams: null,
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
      this.title = '添加语言模型聊天记录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getLlm_chat_log(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改语言模型聊天记录'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLlm_chat_log(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addLlm_chat_log(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除语言模型聊天记录编号为"' + ids + '"的数据项？').then(function() {
        return delLlm_chat_log(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('llm_chat_log/llm_chat_log/export', {
        ...this.queryParams
      }, `llm_chat_log_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
