<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="记录标题" prop="logTitle">
        <el-input
            v-model="queryParams.logTitle"
            placeholder="请输入记录标题"
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
            v-hasPermi="['request_api_key_log:request_api_key_log:add']"
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
            v-hasPermi="['request_api_key_log:request_api_key_log:edit']"
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
            v-hasPermi="['request_api_key_log:request_api_key_log:remove']"
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
            v-hasPermi="['request_api_key_log:request_api_key_log:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading"
              :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              border
              stripe
              :data="request_api_key_logList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <el-table-column align="center" width="auto" label="记录标题" prop="logTitle"/>
      <el-table-column align="center" width="auto" label="操作IP" prop="reqIp">
        <template slot-scope="scope">
          <p style="margin: 0;padding: 0">{{ scope.row.reqIp }}</p>
          <p style="margin: 0;padding: 0">{{ scope.row.reqAddress }}</p>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="IP地址" prop="reqAddress"/>-->
      <!--      <el-table-column align="center" width="auto" label="请求头" prop="reqAgent"/>-->
      <!--      <el-table-column align="center" width="auto" label="浏览器" prop="reqBrowser"/>-->
      <el-table-column align="center" width="auto" label="操作系统" prop="reqSystem"/>
      <!--      <el-table-column align="center" width="auto" label="请求URI" prop="reqUrl"/>-->
      <!--      <el-table-column align="center" width="auto" label="操作方式" prop="reqMethod"/>-->
      <!--      <el-table-column align="center" width="auto" label="请求的key" prop="reqKey"/>-->
      <!--      <el-table-column align="center" width="auto" label="操作提交的数据" prop="reqParams"/>-->
      <el-table-column align="center" width="85" label="是否成功" prop="isSuccess">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isSuccess == 1">是</el-tag>
          <el-tag v-else-if="scope.row.isSuccess == 0" type="warning">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="异常信息" prop="exception">
        <template slot-scope="scope">
          <el-popover placement="top-start"
                      title="异常信息"
                      width="200"
                      trigger="hover"
                      :content="scope.row.exception"
          >
            <span slot="reference">{{ LimitStringShow(scope.row.exception) }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" width="85" label="影响行数" prop="effectRows"/>
      <el-table-column align="center" width="110" label="执行时间(毫秒)" prop="timeOut"/>
      <el-table-column align="center" width="120" label="请求时间" prop="createTime">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      :content="scope.row.createTime"
                      placement="top">
            <span>{{ formatTime(scope.row.createTime) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="85" label="逻辑删除" prop="isDelete">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1"
                  @click="switchDeleteState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger"
          >是
          </el-tag>
          <el-tag v-else-if="scope.row.isDelete == 0"
                  @click="switchDeleteState(scope.row.id, 1)"
                  style="cursor:pointer;"
          >否
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
              v-hasPermi="['request_api_key_log:request_api_key_log:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['request_api_key_log:request_api_key_log:remove']"
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
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
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
          <!--          <el-input v-model="form.reqParams" -->
          <!--                    autosize -->
          <!--                    type="textarea" -->
          <!--                    placeholder="请输入内容"/>-->
          <JsonViewer :expand-depth=5
                      copyable
                      boxed
                      sort
                      :value="toJson(form.reqParams)"
          />
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
  listRequest_api_key_log,
  getRequest_api_key_log,
  delRequest_api_key_log,
  addRequest_api_key_log,
  updateRequest_api_key_log
} from '@/api/platform/openApi/request_api_key_log'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'

export default {
  dicts: ['is_delete'],
  name: 'Request_api_key_log',
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
      request_api_key_logList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        //orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        sortStr: "create_time",  //sql排序字段
        pageNum: 1,
        pageSize: 10,
        logTitle: null,
        isSuccess: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        { key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true },
        { key: 'log_title', align: 'center', width: 'auth', label: `记录标题`, prop: 'log_title', visible: true },
        { key: 'req_ip', align: 'center', width: 'auth', label: `操作IP`, prop: 'req_ip', visible: true },
        { key: 'req_address', align: 'center', width: 'auth', label: `IP地址`, prop: 'req_address', visible: true },
        { key: 'req_agent', align: 'center', width: 'auth', label: `请求头`, prop: 'req_agent', visible: true },
        { key: 'req_browser', align: 'center', width: 'auth', label: `浏览器`, prop: 'req_browser', visible: true },
        { key: 'req_system', align: 'center', width: 'auth', label: `操作系统`, prop: 'req_system', visible: true },
        { key: 'req_url', align: 'center', width: 'auth', label: `请求URI`, prop: 'req_url', visible: true },
        { key: 'req_method', align: 'center', width: 'auth', label: `操作方式`, prop: 'req_method', visible: true },
        { key: 'req_key', align: 'center', width: 'auth', label: `请求的key`, prop: 'req_key', visible: true },
        {
          key: 'req_params',
          align: 'center',
          width: 'auth',
          label: `操作提交的数据`,
          prop: 'req_params',
          visible: true
        },
        { key: 'is_success', align: 'center', width: 'auth', label: `是否成功`, prop: 'is_success', visible: true },
        { key: 'effect_rows', align: 'center', width: 'auth', label: `影响行数`, prop: 'effect_rows', visible: true },
        { key: 'time_out', align: 'center', width: 'auth', label: `执行时间`, prop: 'time_out', visible: true },
        { key: 'exception', align: 'center', width: 'auth', label: `异常信息`, prop: 'exception', visible: true },
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
    /** 查询api请求记录列表 */
    getList() {
      this.total = 0
      this.request_api_key_logList = []
      this.loading = true
      listRequest_api_key_log(this.queryParams).then(response => {
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('list数据查询结果', jsonData)
        this.request_api_key_logList = jsonData
        //this.request_api_key_logList = response.rows;
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
      getRequest_api_key_log(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改api请求记录'
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
            updateRequest_api_key_log(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addRequest_api_key_log(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除api请求记录编号为"' + ids + '"的数据项？').then(function() {
        return delRequest_api_key_log(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('request_api_key_log/request_api_key_log/export', {
        ...this.queryParams
      }, `request_api_key_log_${new Date().getTime()}.xlsx`)
    },
    //删除切换
    switchDeleteState(rowId, isD) {
      //console.log("删除切换row: ", rowId);
      let sendForm = {
        'id': rowId,
        'isDelete': isD
      }
      let dict2String = changeDictToString(sendForm)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      updateRequest_api_key_log(sendData).then((res) => {
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
    },
    //转json格式
    toJson(jsonData) {
      try {
        if (jsonData !== undefined && jsonData !== null && jsonData !== '{}') {
          let jData = JSON.parse(jsonData)
          // console.log("转换后的json: ", jData);
          return jData
        }
        return {}
      } catch (error) {
        console.log('转换json失败: ', error)
        return jsonData
      }
    }
    //==========================底部结束==================================
  }
}
</script>
