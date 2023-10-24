<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="操作地点" prop="operLocation">
        <el-input
            v-model="queryParams.operLocation"
            placeholder="请输入操作地点"
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
            v-hasPermi="['blog_common:blog_common:add']"
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
            v-hasPermi="['blog_common:blog_common:edit']"
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
            v-hasPermi="['blog_common:blog_common:remove']"
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
            v-hasPermi="['blog_common:blog_common:export']"
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
              :data="blog_commonList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
<!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <el-table-column align="center" width="auto" label="关联到具体内容" prop="blogIt"/>
<!--      <el-table-column align="center" width="auto" label="父评论id" prop="parentId"/>-->
      <el-table-column align="center" width="auto" label="评论人id" prop="author"/>
      <el-table-column align="center" width="auto" label="评论内容" prop="content"/>
<!--      <el-table-column align="center" width="auto" label="主机地址" prop="operIp"/>-->
      <el-table-column align="center" width="auto" label="操作地点" prop="operLocation"/>
<!--      <el-table-column align="center" width="auto" label="请求头" prop="reqAgent"/>-->
<!--      <el-table-column align="center" width="auto" label="浏览器" prop="reqBrowser"/>-->
      <el-table-column align="center" width="auto" label="操作系统" prop="reqSystem"/>
      <el-table-column align="center" width="auto" label="点赞数" prop="likeNum"/>
      <el-table-column align="center" width="auto" label="逻辑删除" prop="isDelete"/>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['blog_common:blog_common:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['blog_common:blog_common:remove']"
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

    <!-- 添加或修改博客评论对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="关联到具体内容" prop="blogIt">
          <el-input v-model="form.blogIt" style="width: 300px" placeholder="请输入关联到具体内容"/>
        </el-form-item>
        <el-form-item label="父评论id" prop="parentId">
          <el-input v-model="form.parentId" style="width: 300px" placeholder="请输入父评论id"/>
        </el-form-item>
        <el-form-item label="评论人id" prop="author">
          <el-input v-model="form.author" style="width: 300px" placeholder="请输入评论人id"/>
        </el-form-item>
        <el-form-item label="评论内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="主机地址" prop="operIp">
          <el-input v-model="form.operIp" style="width: 300px" placeholder="请输入主机地址"/>
        </el-form-item>
        <el-form-item label="操作地点" prop="operLocation">
          <el-input v-model="form.operLocation" style="width: 300px" placeholder="请输入操作地点"/>
        </el-form-item>
        <el-form-item label="请求头" prop="reqAgent">
          <el-input v-model="form.reqAgent" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="浏览器" prop="reqBrowser">
          <el-input v-model="form.reqBrowser" style="width: 300px" placeholder="请输入浏览器"/>
        </el-form-item>
        <el-form-item label="操作系统" prop="reqSystem">
          <el-input v-model="form.reqSystem" style="width: 300px" placeholder="请输入操作系统"/>
        </el-form-item>
        <el-form-item label="点赞数" prop="likeNum">
          <el-input v-model="form.likeNum" style="width: 300px" placeholder="请输入点赞数"/>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="isDelete">
          <el-input v-model="form.isDelete" style="width: 300px" placeholder="请输入逻辑删除"/>
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
  listBlog_common,
  getBlog_common,
  delBlog_common,
  addBlog_common,
  updateBlog_common
} from '@/api/platform/zblog/blog/blog_common'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'

export default {
  //dicts: ['is_delete'],
  name: 'Blog_common',
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
      // 博客评论表格数据
      blog_commonList: [],
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
        operLocation: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        { key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true },
        { key: 'blog_it', align: 'center', width: 'auth', label: `关联到具体内容`, prop: 'blog_it', visible: true },
        { key: 'parent_id', align: 'center', width: 'auth', label: `父评论id`, prop: 'parent_id', visible: true },
        { key: 'author', align: 'center', width: 'auth', label: `评论人id`, prop: 'author', visible: true },
        { key: 'content', align: 'center', width: 'auth', label: `评论内容`, prop: 'content', visible: true },
        { key: 'oper_ip', align: 'center', width: 'auth', label: `主机地址`, prop: 'oper_ip', visible: true },
        {
          key: 'oper_location',
          align: 'center',
          width: 'auth',
          label: `操作地点`,
          prop: 'oper_location',
          visible: true
        },
        { key: 'req_agent', align: 'center', width: 'auth', label: `请求头`, prop: 'req_agent', visible: true },
        { key: 'req_browser', align: 'center', width: 'auth', label: `浏览器`, prop: 'req_browser', visible: true },
        { key: 'req_system', align: 'center', width: 'auth', label: `操作系统`, prop: 'req_system', visible: true },
        { key: 'like_num', align: 'center', width: 'auth', label: `点赞数`, prop: 'like_num', visible: true },
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
    /** 查询博客评论列表 */
    getList() {
      //this.total = 0;
      //this.blog_commonList = [];
      this.loading = true
      listBlog_common(this.queryParams).then(response => {
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        this.blog_commonList = []
        console.log('list数据查询结果', jsonData)
        this.blog_commonList = jsonData
        //this.blog_commonList = response.rows;
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
        blogIt: null,
        parentId: null,
        author: null,
        content: null,
        operIp: null,
        operLocation: null,
        reqAgent: null,
        reqBrowser: null,
        reqSystem: null,
        likeNum: null,
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
      this.title = '添加博客评论'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBlog_common(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改博客评论'
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
            updateBlog_common(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBlog_common(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除博客评论编号为"' + ids + '"的数据项？').then(function() {
        return delBlog_common(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('blog_common/blog_common/export', {
        ...this.queryParams
      }, `blog_common_${new Date().getTime()}.xlsx`)
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
      updateBlog_common(sendData).then((res) => {
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
    }
    //==========================底部结束==================================
  }
}
</script>
