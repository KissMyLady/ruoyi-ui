<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px">
      <el-form-item label="标题" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="消息级别" prop="lvCode">
        <el-select v-model="queryParams.lvCode"
                   style="width: 130px"
                   @change="handleQuery"
                   placeholder="筛选删除"
                   clearable
        >
          <el-option v-for="dict in dict.type.lv_code"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否已读" prop="isRead">
        <el-select v-model="queryParams.isRead"
                   style="width: 130px"
                   @change="handleQuery"
                   placeholder="筛选删除"
                   clearable
        >
          <el-option v-for="dict in dict.type.is_delete"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="逻辑删除" prop="isDelete">
        <el-select v-model="queryParams.isDelete"
                   style="width: 130px"
                   @change="handleQuery"
                   placeholder="筛选删除"
                   clearable
        >
          <el-option v-for="dict in dict.type.is_delete"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"
          />
        </el-select>
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
            v-hasPermi="['tb_msg:tb_msg:add']"
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
            v-hasPermi="['tb_msg:tb_msg:edit']"
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
            v-hasPermi="['tb_msg:tb_msg:remove']"
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
            v-hasPermi="['tb_msg:tb_msg:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border
              stripe
              :data="tb_msgList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
<!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
<!--      <el-table-column align="center" width="auto" label="UUID" prop="msgUuid"/>-->
<!--      <el-table-column align="center" width="auto" label="用户id" prop="userId"/>-->
      <el-table-column align="center" width="auto" label="标题" prop="title"/>
      <el-table-column align="center" width="auto" label="内容" prop="content">
        <template slot-scope="scope">
          <el-popover placement="top-start"
                      title="内容"
                      width="200"
                      trigger="hover"
                      :content="scope.row.content">
            <span slot="reference">{{ LimitStringShow(scope.row.content) }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110" label="消息级别" prop="lvCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.lv_code" :value="scope.row.lvCode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110" label="消息发送人" prop="sendCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.send_code" :value="scope.row.sendCode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="110" label="消息类型" prop="typeCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.type_code" :value="scope.row.typeCode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="85" label="是否已读" prop="isRead">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isRead == 1"
                  @click="switchDeleteState(scope.row.id, 0, 'isRead')"
                  type="success"
                  style="cursor:pointer;">是
          </el-tag>
          <el-tag v-else-if="scope.row.isRead == 0"
                  @click="switchDeleteState(scope.row.id, 1, 'isRead')"
                  type="info"
                  style="cursor:pointer;">否
          </el-tag>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" width="85" label="已发送否" prop="isSend">-->
<!--        <template slot-scope="scope">-->
<!--          <el-tag v-if="scope.row.isSend == 1"-->
<!--                  @click="switchDeleteState(scope.row.id, 0, 'isSend')"-->
<!--                  type="success"-->
<!--                  style="cursor:pointer;">是-->
<!--          </el-tag>-->
<!--          <el-tag v-else-if="scope.row.isSend == 0"-->
<!--                  @click="switchDeleteState(scope.row.id, 1, 'isSend')"-->
<!--                  type="info"-->
<!--                  style="cursor:pointer;">否-->
<!--          </el-tag>-->
<!--        </template>-->
<!--      </el-table-column>-->
<!--      <el-table-column align="center" width="auto" label="备注" prop="note">-->
<!--        <template slot-scope="scope">-->
<!--          <el-popover placement="top-start"-->
<!--                      title="备注"-->
<!--                      width="200"-->
<!--                      trigger="hover"-->
<!--                      :content="scope.row.note">-->
<!--            <span slot="reference">{{ LimitStringShow(scope.row.note) }}</span>-->
<!--          </el-popover>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column align="left" width="150" label="消息时间" prop="createTime">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      :content="scope.row.createTime"
                      placement="top">
            <span>{{ formatTime_am(scope.row.createTime) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column align="center" width="85" label="逻辑删除" prop="isDelete">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1"
                  @click="switchDeleteState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger">是
          </el-tag>
          <el-tag v-else-if="scope.row.isDelete == 0"
                  @click="switchDeleteState(scope.row.id, 1)"
                  type="info"
                  style="cursor:pointer;">否
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['tb_msg:tb_msg:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['tb_msg:tb_msg:remove']"
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

    <!-- 添加或修改消息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="消息UUID" prop="msgUuid">
          <el-input v-model="form.msgUuid"
                    disabled
                    placeholder="请输入消息UUID"/>
        </el-form-item>
        <el-form-item label="用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户id"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="消息级别代号(字典)" prop="lvCode">
          <el-input v-model="form.lvCode" placeholder="请输入消息级别代号(字典)"/>
        </el-form-item>
        <el-form-item label="消息发送人代号(字典)" prop="sendCode">
          <el-input v-model="form.sendCode" placeholder="请输入消息发送人代号(字典)"/>
        </el-form-item>
        <el-form-item label="消息类型代号(字典)" prop="typeCode">
          <el-input v-model="form.typeCode" placeholder="请输入消息类型代号(字典)"/>
        </el-form-item>
        <el-form-item label="是否已读" prop="isRead">
          <el-input v-model="form.isRead" placeholder="请输入是否已读"/>
        </el-form-item>
        <el-form-item label="是否已发送" prop="isSend">
          <el-input v-model="form.isSend" placeholder="请输入是否已发送"/>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="form.note" autosize type="textarea" placeholder="请输入内容"/>
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
  listTb_msg,
  getTb_msg,
  delTb_msg,
  addTb_msg,
  updateTb_msg
} from '@/api/platform/tb_msg/tb_msg'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'

export default {
  dicts: ['is_delete', "lv_code", "send_code", "type_code"],
  name: 'Tb_msg',
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
      // 消息表格数据
      tb_msgList: [],
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
        title: null,
        lvCode: null,
        isRead: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        { key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true },
        { key: 'msg_uuid', align: 'center', width: 'auth', label: `消息UUID`, prop: 'msg_uuid', visible: true },
        { key: 'user_id', align: 'center', width: 'auth', label: `用户id`, prop: 'user_id', visible: true },
        { key: 'title', align: 'center', width: 'auth', label: `标题`, prop: 'title', visible: true },
        { key: 'content', align: 'center', width: 'auth', label: `内容`, prop: 'content', visible: true },
        { key: 'lv_code', align: 'center', width: 'auth', label: `消息级别代号(字典)`, prop: 'lv_code', visible: true },
        {
          key: 'send_code',
          align: 'center',
          width: 'auth',
          label: `消息发送人代号(字典)`,
          prop: 'send_code',
          visible: true
        },
        {
          key: 'type_code',
          align: 'center',
          width: 'auth',
          label: `消息类型代号(字典)`,
          prop: 'type_code',
          visible: true
        },
        { key: 'is_read', align: 'center', width: 'auth', label: `是否已读`, prop: 'is_read', visible: true },
        { key: 'is_send', align: 'center', width: 'auth', label: `是否已发送`, prop: 'is_send', visible: true },
        { key: 'note', align: 'center', width: 'auth', label: `备注`, prop: 'note', visible: true },
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
    /** 查询消息列表 */
    getList() {
      //this.loading = true
      listTb_msg(this.queryParams).then(response => {
        if(response.code !== 200){
          TipMessage.Info("未查询到数据!" + response.msg)
          return null;
        }
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('list数据查询结果', jsonData)
        this.tb_msgList = []
        this.tb_msgList = jsonData
        //this.tb_msgList = response.rows;
        this.total = response.total
        //this.loading = false
      }).catch((err) => {
        //this.loading = false
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
        msgUuid: null,
        userId: null,
        title: null,
        content: null,
        lvCode: null,
        sendCode: null,
        typeCode: null,
        isRead: null,
        isSend: null,
        note: null,
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
      this.title = '添加消息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getTb_msg(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改消息'
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
            updateTb_msg(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addTb_msg(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除消息编号为"' + ids + '"的数据项？').then(function() {
        return delTb_msg(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('tb_msg/tb_msg/export', {
        ...this.queryParams
      }, `tb_msg_${new Date().getTime()}.xlsx`)
    },
    switchDeleteState(rowId, isD, switchRow="isDelete") {
      //console.log("删除切换row: ", rowId);
      let sendForm = {
        'id': rowId,
      }
      sendForm[`${switchRow}`] = isD
      let dict2String = changeDictToString(sendForm);
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      updateTb_msg(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        if (isD == 1) {
          TipMessage.Warning(res.msg)
        } else {
          TipMessage.isOK(res.msg)
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    // LimitStringShow(dataStr, trLen=20){
    //   if(typeof dataStr === 'string' && dataStr.length >= trLen){
    //     let strLength = dataStr.length
    //     return dataStr.substr(strLength-trLen, strLength) + '...'+ (strLength - trLen);
    //   }
    //   return dataStr;
    // },
    //==========================底部结束==================================
  }
}
</script>
