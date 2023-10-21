<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
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
        <el-button type="primary" icon="el-icon-search" size="mini"
                   @click="handleQuery">搜索</el-button>
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
            v-hasPermi="['request_api_key:request_api_key:add']"
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
            v-hasPermi="['request_api_key:request_api_key:edit']"
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
            v-hasPermi="['request_api_key:request_api_key:remove']"
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
            v-hasPermi="['request_api_key:request_api_key:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              border
              stripe
              :data="request_api_keyList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
<!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <el-table-column align="center" width="auto" label="用户ID" prop="userId"/>
      <el-table-column align="center" width="auto" label="分配的key" prop="respKey"/>
      <el-table-column align="center" width="auto" label="请求参数" prop="reqParams"/>
      <el-table-column label="key过期时间" align="center" prop="keyOverdue" width="180">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.keyOverdue" placement="top">
            <span>{{ parseTime(scope.row.keyOverdue, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="总数量限制" prop="keySmsCount"/>
      <el-table-column align="center" width="auto" label="已经发送数" prop="sendCount"/>
      <el-table-column align="center" width="auto" label="允许ip地址" prop="ipAllowList"/>
      <el-table-column align="center" width="auto" label="逻辑删除" prop="isDelete">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1"
                  @click="switchDeleteState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger">是
          </el-tag>
          <el-tag v-else-if="scope.row.isDelete == 0"
                  @click="switchDeleteState(scope.row.id, 1)"
                  style="cursor:pointer;">否
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['request_api_key:request_api_key:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['request_api_key:request_api_key:remove']"
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

    <!-- 添加或修改api请求-key对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="关联用户表" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入关联用户表"/>
        </el-form-item>
        <el-form-item label="分配的key" prop="respKey">
          <el-input v-model="form.respKey"
                    disabled
                    placeholder="请输入分配的key"/>
        </el-form-item>
        <el-form-item label="请求参数" prop="reqParams">
          <el-input v-model="form.reqParams" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="key过期时间" prop="keyOverdue">
          <el-date-picker clearable
                          v-model="form.keyOverdue"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择key过期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发送总数量限制" prop="keySmsCount">
          <el-input v-model="form.keySmsCount" placeholder="请输入发送总数量限制"/>
        </el-form-item>
        <el-form-item label="当前key已经发送数" prop="sendCount">
          <el-input v-model="form.sendCount" placeholder="请输入当前key已经发送数"/>
        </el-form-item>
        <el-form-item label="允许的ip地址" prop="ipAllowList">
          <el-input v-model="form.ipAllowList" autosize type="textarea" placeholder="请输入内容"/>
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
  listRequest_api_key,
  getRequest_api_key,
  delRequest_api_key,
  addRequest_api_key,
  updateRequest_api_key
} from '@/api/platform/openApi/request_api_key'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'

export default {
  //dicts: ['is_delete'],
  name: 'Request_api_key',
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
      // api请求-key表格数据
      request_api_keyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        //sortStr: "-create_time",  //sql排序字段
        pageNum: 1,
        pageSize: 10,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        { key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true },
        { key: 'user_id', align: 'center', width: 'auth', label: `关联用户表`, prop: 'user_id', visible: true },
        { key: 'resp_key', align: 'center', width: 'auth', label: `分配的key`, prop: 'resp_key', visible: true },
        { key: 'req_params', align: 'center', width: 'auth', label: `请求参数`, prop: 'req_params', visible: true },
        {
          key: 'key_overdue',
          align: 'center',
          width: 'auth',
          label: `key过期时间`,
          prop: 'key_overdue',
          visible: true
        },
        {
          key: 'key_sms_count',
          align: 'center',
          width: 'auth',
          label: `发送总数量限制`,
          prop: 'key_sms_count',
          visible: true
        },
        {
          key: 'send_count',
          align: 'center',
          width: 'auth',
          label: `当前key已经发送数`,
          prop: 'send_count',
          visible: true
        },
        {
          key: 'ip_allow_list',
          align: 'center',
          width: 'auth',
          label: `允许的ip地址`,
          prop: 'ip_allow_list',
          visible: true
        },
        { key: 'is_delete', align: 'center', width: 'auth', label: `逻辑删除`, prop: 'is_delete', visible: true },
        { key: 'create_time', align: 'center', width: 'auth', label: `创建时间`, prop: 'create_time', visible: true },
        { key: 'update_time', align: 'center', width: 'auth', label: `更新时间`, prop: 'update_time', visible: true }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询api请求-key列表 */
    getList() {
      this.total = 0
      this.request_api_keyList = []
      this.loading = true
      listRequest_api_key(this.queryParams).then(response => {
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('list数据查询结果', jsonData)
        this.request_api_keyList = jsonData
        //this.request_api_keyList = response.rows;
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
        userId: null,
        respKey: null,
        reqParams: null,
        keyOverdue: null,
        keySmsCount: null,
        sendCount: null,
        ipAllowList: null,
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
      this.title = '添加api请求-key'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getRequest_api_key(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改api请求-key'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          //对表单加密
          let dict2String = changeDictToString(this.form)
          let sendData = {
            'a': aesEncrypt('1024'),
            'b': aesEncrypt(dict2String),
            'c': aesEncrypt('Hello World !')
          }

          //发送内容加密
          if (this.form.id != null) {
            updateRequest_api_key(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRequest_api_key(sendData).then(response => {
              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

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
      this.$modal.confirm('是否确认删除api请求-key编号为"' + ids + '"的数据项？').then(function() {
        return delRequest_api_key(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('request_api_key/request_api_key/export', {
        ...this.queryParams
      }, `request_api_key_${new Date().getTime()}.xlsx`)
    },
    switchDeleteState(rowId, isD) {
      //console.log("删除切换row: ", rowId);
      let sendForm = {
        'id': rowId,
        'isDelete': isD
      }
      let dict2String = changeDictToString(sendForm);
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      updateRequest_api_key(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        if (isD == 1) {
          TipMessage.Warning('删除成功')
        } else {
          TipMessage.isOK('取消删除成功')
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    }
    //==========================底部结束==================================
  }
}
</script>
