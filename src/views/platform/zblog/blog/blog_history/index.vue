<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="128px"
    >
      <el-form-item label="文档名称筛选" prop="blogId">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入文档id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建用户" prop="userId">
        <el-input
            v-model="queryParams.userId"
            placeholder="请输入创建用户"
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
            v-hasPermi="['blog_history:blog_history:add']"
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
            v-hasPermi="['blog_history:blog_history:edit']"
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
            v-hasPermi="['blog_history:blog_history:remove']"
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
            v-hasPermi="['blog_history:blog_history:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              border
              stripe
              :data="blog_historyList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
<!--      <el-table-column align="center" width="auto" label="文档id" prop="blogId"/>-->
      <el-table-column align="left" width="auto" label="文档名称" prop="name">
        <template slot-scope="scope">
          <el-button type="primary"
                     style="float: left;margin-left: 0;"
                     size="mini"
                     @click="showHistoryContent(scope.row.id)"
                     plain
                     class="el-icon-view"
          ></el-button>
          <span style="margin-left: 6px;">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" width="auto" label="文档历史编辑内容" prop="preContent"/>-->
<!--      <el-table-column align="center" width="auto" label="创建用户" prop="userId"/>-->
      <el-table-column align="center" width="100" label="逻辑删除" prop="isDelete"/>
      <el-table-column align="center" width="140" label="记录时间" prop="createTime">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      :content="scope.row.createTime"
                      placement="top">
            <span>{{ formatTime(scope.row.createTime) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['blog_history:blog_history:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['blog_history:blog_history:remove']"
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

    <!-- 添加或修改博客文档历史记录对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="60%"
               append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="文档id" prop="blogId">
          <el-input v-model="form.blogId"
                    disabled
                    style="width: 300px" placeholder="请输入文档id"/>
        </el-form-item>
        <el-form-item label="创建用户" prop="userId">
          <el-input v-model="form.userId" style="width: 300px"
                    disabled
                    placeholder="请输入创建用户"/>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="isDelete">
          <el-input v-model="form.isDelete" style="width: 300px" placeholder="请输入逻辑删除"/>
        </el-form-item>
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" style="width: 500px"
                    placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="文档历史内容">
<!--          <editor v-model="form.preContent" :min-height="192"/>-->
          <el-input type="textarea"
                    :autosize="{ minRows: 5, maxRows: 15}"
                    placeholder="请输入内容"
                    v-model="form.preContent">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 预览-->
    <preview_markdown ref="preview_markdown"
                      @preview_markdown="preview_markdown"/>

  </div>
</template>

<script>
import {
  listBlog_history,
  getBlog_history,
  delBlog_history,
  addBlog_history,
  updateBlog_history
} from '@/api/platform/zblog/blog/blog_history'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'
import preview_markdown from '@/components/preview/preview_markdown.vue'

export default {
  //dicts: ['is_delete'],
  name: 'Blog_history',
  components: {
    preview_markdown: preview_markdown
  },
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
      // 博客文档历史记录表格数据
      blog_historyList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        //orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        sortStr: 'create_time',  //sql排序字段
        pageNum: 1,
        pageSize: 10,
        blogId: null,
        userId: null,
        isDelete: null,
        name: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        blogId: [
          { required: true, message: '文档id不能为空', trigger: 'blur' }
        ]
      },
      //表格行
      columns: [
        { key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true },
        { key: 'blog_id', align: 'center', width: 'auth', label: `文档id`, prop: 'blog_id', visible: true },
        {
          key: 'pre_content',
          align: 'center',
          width: 'auth',
          label: `文档历史编辑内容`,
          prop: 'pre_content',
          visible: true
        },
        { key: 'user_id', align: 'center', width: 'auth', label: `创建用户`, prop: 'user_id', visible: true },
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
    /** 查询博客文档历史记录列表 */
    getList() {
      //this.total = 0;
      //this.blog_historyList = [];
      this.loading = true
      listBlog_history(this.queryParams).then(response => {
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        this.blog_historyList = []
        console.log('list数据查询结果', jsonData)
        this.blog_historyList = jsonData
        //this.blog_historyList = response.rows;
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
        blogId: null,
        preContent: null,
        userId: null,
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
      this.title = '添加博客文档历史记录'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBlog_history(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改博客文档历史记录'
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
            updateBlog_history(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBlog_history(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除博客文档历史记录编号为"' + ids + '"的数据项？').then(function() {
        return delBlog_history(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('blog_history/blog_history/export', {
        ...this.queryParams
      }, `blog_history_${new Date().getTime()}.xlsx`)
    },
    //删除切换
    switchDeleteState(rowId, isD, switchRow = 'isDelete') {
      //console.log("删除切换row: ", rowId);
      let sendForm = {
        'id': rowId
        // 'isDelete': isD
      }
      sendForm[`${switchRow}`] = isD
      let dict2String = changeDictToString(sendForm)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      updateBlog_history(sendData).then((res) => {
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
    copyPath(url, event) {
      clip(url, event)
    },
    //展示弹出框, 查询
    showHistoryContent(history_id){
      getBlog_history(history_id).then((res)=>{
        if (res.code !== 200){
          TipMessage.Warning(res.msg);
          return null;
        }
        let privateObj = res.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log("jsonData: ", jsonData);
        this.$refs["preview_markdown"].showDialog(jsonData)
      }).catch((err)=>{
        //TipMessage.Error("错误"+ err);
      })
    },
    preview_markdown(){
      //子组件回调
    },
    //==========================底部结束==================================
  }
}
</script>
