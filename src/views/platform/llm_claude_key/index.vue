<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="备注信息" prop="info">
        <el-input v-model="queryParams.info"
                  placeholder="请输入备注信息"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="apiType" prop="orgUuid">
        <el-input v-model="queryParams.apiType"
                  placeholder="请输入api类别名称"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="sessionKey" prop="sessionKey">-->
<!--        <el-input v-model="queryParams.sessionKey"-->
<!--                  placeholder="请输入sessionKey"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="conversation_uuid" prop="conversationUuid">-->
<!--        <el-input v-model="queryParams.conversationUuid"-->
<!--                  placeholder="请输入conversation_uuid"-->
<!--                  clearable-->
<!--                  @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="创建人" prop="createUser">
        <el-input v-model="queryParams.createUser"
                  placeholder="请输入创建人"
                  clearable
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="删除标记" prop="isDelete">-->
<!--        <el-input v-model="queryParams.isDelete"-->
<!--                  placeholder="请输入删除标记"-->
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
                   v-hasPermi="['llm_claude_key:llm_claude_key:add']"
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
                   v-hasPermi="['llm_claude_key:llm_claude_key:edit']"
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
            v-hasPermi="['llm_claude_key:llm_claude_key:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['llm_claude_key:llm_claude_key:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="llm_claude_keyList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column label="类别名称" align="center" prop="apiType"/>
      <el-table-column label="备注信息" align="center" prop="info"/>
      <el-table-column label="org_uuid" align="center" prop="orgUuid"/>
      <el-table-column label="sessionKey" align="center" prop="sessionKey"/>
      <el-table-column label="conversation_uuid" align="center" prop="conversationUuid"/>
      <el-table-column label="创建人" align="center" prop="createUser"/>
      <el-table-column label="删除" align="center" prop="isDelete" width="60">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1" type="danger">是</el-tag>
          <el-tag v-else>否</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['llm_claude_key:llm_claude_key:edit']"
          >修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['llm_claude_key:llm_claude_key:remove']"
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

    <!-- 添加或修改语言模型,api,claude连接池对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="备注信息" prop="info">
          <el-input v-model="form.info" placeholder="请输入备注信息"/>
        </el-form-item>
        <el-form-item label="api_type" prop="apiType">
          <el-input v-model="form.apiType" placeholder="请输入api类别"/>
        </el-form-item>
        <el-form-item label="org_uuid" prop="orgUuid">
          <el-input v-model="form.orgUuid" placeholder="请输入org_uuid"/>
        </el-form-item>
        <el-form-item label="sessionKey" prop="sessionKey">
          <el-input v-model="form.sessionKey" placeholder="请输入sessionKey"/>
        </el-form-item>
        <el-form-item label="conversation_uuid" prop="conversationUuid">
          <el-input v-model="form.conversationUuid" placeholder="请输入conversation_uuid"/>
        </el-form-item>
        <el-form-item label="创建人" prop="createUser">
          <el-input v-model="form.createUser" placeholder="请输入创建人"/>
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
  listLlm_claude_key, getLlm_claude_key, delLlm_claude_key,
  addLlm_claude_key, updateLlm_claude_key
} from '@/api/platform/llm/llm_claude_key'

export default {
  name: 'Llm_claude_key',
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
      // 语言模型,api,claude连接池表格数据
      llm_claude_keyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        apiType: null,
        info: null,
        orgUuid: null,
        sessionKey: null,
        conversationUuid: null,
        createUser: null,
        isDelete: null,
        orderByColumn: 'create_time',
        isAsc: "desc",  //desc, acs
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
    /** 查询语言模型,api,claude连接池列表 */
    getList() {
      this.loading = true
      listLlm_claude_key(this.queryParams).then(response => {
        this.llm_claude_keyList = response.rows
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
        apiType: null,
        info: null,
        orgUuid: null,
        sessionKey: null,
        conversationUuid: null,
        createUser: null,
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
      this.title = '添加语言模型,api,claude连接池'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getLlm_claude_key(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改语言模型,api,claude连接池'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateLlm_claude_key(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addLlm_claude_key(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除语言模型,api,claude连接池编号为"' + ids + '"的数据项？').then(function() {
        return delLlm_claude_key(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('llm_claude_key/llm_claude_key/export', {
        ...this.queryParams
      }, `llm_claude_key_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
