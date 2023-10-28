<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="创建用户id" prop="userId">
        <el-input
            v-model="queryParams.userId"
            placeholder="请输入创建用户id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文集名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入文集名称"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限代号" prop="authorityCode">
        <el-input
            v-model="queryParams.authorityCode"
            placeholder="请输入权限代号"
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
            v-hasPermi="['blog_project:blog_project:add']"
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
            v-hasPermi="['blog_project:blog_project:edit']"
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
            v-hasPermi="['blog_project:blog_project:remove']"
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
            v-hasPermi="['blog_project:blog_project:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border
              stripe
              :data="blog_projectList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="添加文章" align="center" width="260">
        <template slot-scope="scope">
          <el-button icon="el-icon-plus"
                     type="success" plain
                     size="small"
                     @click="addArticle_by_markdown(scope.row.id)"
                     v-hasPermi="['blog_project:blog_project:add']"
          >Markdown
          </el-button>
          <el-button icon="el-icon-plus"
                     type="primary" plain
                     size="small"
                     @click="addArticle_by_tinymce(scope.row.id)"
                     v-hasPermi="['blog_project:blog_project:add']"
          >富文本
          </el-button>
        </template>
      </el-table-column>
      <!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <!--      <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>-->
<!--      <el-table-column align="center" width="auto" label="文集类型" prop="blogType"/>-->
      <el-table-column align="center" width="auto" label="封面图" prop="coverImg">
        <template slot-scope="scope">
          <el-image style="width: 80%"
                    fit="contain"
                    lazy
                    :src="scope.row.coverImg"
                    :preview-src-list="[scope.row.coverImg]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="文集名称" prop="name">
        <template slot-scope="scope">
          <el-popover placement="top-start"
                      title="介绍"
                      width="200"
                      trigger="hover"
                      :content="scope.row.intro">
            <span slot="reference" style="margin: 0;padding:0;font-size: 16px;font-weight: bold">{{ scope.row.name }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" width="100" label="文章数" prop="countSum"/>
      <!--      <el-table-column align="center" width="auto" label="介绍" prop="intro"/>-->
      <!--      <el-table-column align="center" width="auto" label="图标" prop="icon"/>-->
      <el-table-column align="center" width="90" label="权限代号" prop="authorityCode"/>
      <!--      <el-table-column align="center" width="auto" label="权限具体限定内容" prop="authorityValue"/>-->
      <!--      <el-table-column align="center" width="auto" label="水印" prop="isWatermark"/>-->
      <!--      <el-table-column align="center" width="auto" label="水印类型" prop="watermarkType"/>-->
      <!--      <el-table-column align="center" width="auto" label="水印值" prop="watermarkValue"/>-->
<!--      <el-table-column align="center" width="90" label="是否置顶" prop="isTop"/>-->
      <el-table-column align="center" width="90" label="浏览数" prop="visitor"/>
      <!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
      <!--      <el-table-column align="center" width="auto" label="排序方式(sql字段)" prop="sortField"/>-->
      <el-table-column align="center" width="90" label="逻辑删除" prop="isDelete">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1"
                  @click="switchDeleteState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger"
          >是
          </el-tag>
          <el-tag v-else-if="scope.row.isDelete == 0"
                  @click="switchDeleteState(scope.row.id, 1)"
                  type="info"
                  style="cursor:pointer;"
          >否
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['blog_project:blog_project:edit']"
          >修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['blog_project:blog_project:remove']"
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

    <!-- 添加或修改博客文集对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" style="width: 300px"
                    disabled
                    placeholder="请输入创建用户id"
          />
        </el-form-item>
        <el-form-item label="文集名称" prop="name">
          <el-input v-model="form.name" style="width: 300px" placeholder="请输入文集名称"/>
        </el-form-item>
        <el-form-item label="介绍">
          <editor v-model="form.intro" :min-height="192"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" style="width: 300px" placeholder="请输入图标"/>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImg">
          <el-input v-model="form.coverImg" style="width: 300px" placeholder="请输入封面图"/>
        </el-form-item>
        <el-form-item label="权限代号" prop="authorityCode">
          <el-input v-model="form.authorityCode" style="width: 300px" placeholder="请输入权限代号"/>
        </el-form-item>
        <el-form-item label="权限具体限定内容" prop="authorityValue">
          <el-input v-model="form.authorityValue"
                    style="width: 300px"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea" placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="水印" prop="isWatermark">
          <el-input v-model="form.isWatermark" style="width: 300px" placeholder="请输入水印"/>
        </el-form-item>
        <el-form-item label="水印值" prop="watermarkValue">
          <el-input v-model="form.watermarkValue" style="width: 300px" placeholder="请输入水印值"/>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-input v-model="form.isTop" style="width: 300px" placeholder="请输入是否置顶"/>
        </el-form-item>
        <el-form-item label="项目浏览次数" prop="visitor">
          <el-input v-model="form.visitor" style="width: 300px" placeholder="请输入项目浏览次数"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 300px" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="排序方式(sql字段)" prop="sortField">
          <el-input v-model="form.sortField" style="width: 300px" placeholder="请输入排序方式(sql字段)"/>
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
  listBlog_project,
  getBlog_project,
  delBlog_project,
  addBlog_project,
  updateBlog_project
} from '@/api/platform/zblog/blog/blog_project'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'

export default {
  //dicts: ['is_delete'],
  name: 'Blog_project',
  data() {
    return {
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
      // 博客文集表格数据
      blog_projectList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        //orderByColumn: 'create_time',
        // isAsc: 'desc',  //desc, acs
        // sortStr: 'create_time',  //sql排序字段
        "isAsc": 'desc',  //desc, acs
        "sortStr": 'countSum',  //按数量排序
        pageNum: 1,
        pageSize: 10,
        userId: null,
        blogType: null,
        name: null,
        authorityCode: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        { key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true },
        { key: 'user_id', align: 'center', width: 'auth', label: `创建用户id`, prop: 'user_id', visible: true },
        {
          key: 'blog_type',
          align: 'center',
          width: 'auth',
          label: `文集类型(博客,文档,等)/实验字段`,
          prop: 'blog_type',
          visible: true
        },
        { key: 'name', align: 'center', width: 'auth', label: `文集名称`, prop: 'name', visible: true },
        { key: 'intro', align: 'center', width: 'auth', label: `介绍`, prop: 'intro', visible: true },
        { key: 'icon', align: 'center', width: 'auth', label: `图标`, prop: 'icon', visible: true },
        { key: 'cover_img', align: 'center', width: 'auth', label: `封面图`, prop: 'cover_img', visible: true },
        {
          key: 'authority_code',
          align: 'center',
          width: 'auth',
          label: `权限代号`,
          prop: 'authority_code',
          visible: true
        },
        {
          key: 'authority_value',
          align: 'center',
          width: 'auth',
          label: `权限具体限定内容`,
          prop: 'authority_value',
          visible: true
        },
        { key: 'is_watermark', align: 'center', width: 'auth', label: `水印`, prop: 'is_watermark', visible: true },
        {
          key: 'watermark_type',
          align: 'center',
          width: 'auth',
          label: `水印类型`,
          prop: 'watermark_type',
          visible: true
        },
        {
          key: 'watermark_value',
          align: 'center',
          width: 'auth',
          label: `水印值`,
          prop: 'watermark_value',
          visible: true
        },
        { key: 'is_top', align: 'center', width: 'auth', label: `是否置顶`, prop: 'is_top', visible: true },
        { key: 'visitor', align: 'center', width: 'auth', label: `项目浏览次数`, prop: 'visitor', visible: true },
        { key: 'sort', align: 'center', width: 'auth', label: `排序`, prop: 'sort', visible: true },
        {
          key: 'sort_field',
          align: 'center',
          width: 'auth',
          label: `排序方式(sql字段)`,
          prop: 'sort_field',
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
    /** 查询博客文集列表 */
    getList() {
      //this.total = 0;
      //this.blog_projectList = [];
      listBlog_project(this.queryParams).then(response => {
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        this.blog_projectList = []
        console.log('list数据查询结果', jsonData)
        this.blog_projectList = jsonData
        //this.blog_projectList = response.rows;
        this.total = response.total
      }).catch((err) => {
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
        blogType: null,
        name: null,
        intro: null,
        icon: null,
        coverImg: null,
        authorityCode: null,
        authorityValue: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        isTop: null,
        visitor: null,
        sort: null,
        sortField: null,
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
      this.title = '添加博客文集'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBlog_project(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改博客文集'
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
            updateBlog_project(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBlog_project(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除博客文集编号为"' + ids + '"的数据项？').then(function() {
        return delBlog_project(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('blog_project/blog_project/export', {
        ...this.queryParams
      }, `blog_project_${new Date().getTime()}.xlsx`)
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
      updateBlog_project(sendData).then((res) => {
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
    //添加文章弹出框
    addArticle_by_markdown(project_id) {
      //跳转到markdown文章添加页面
      //md文档修改
      let jumpUrl = '/blog_project/blog_add_markdown?project_id=' + project_id
      this.$router.push(jumpUrl)
    },
    addArticle_by_tinymce(project_id) {
      //跳转到markdown文章添加页面
      let jumpUrl = '/blog_project/blog_add_tinymce?project_id=' + project_id
      this.$router.push(jumpUrl)
    },
    getImageUrl(filePath){
      return process.env.VUE_APP_target_url + filePath;
    },
    //==========================底部结束==================================
  }
}
</script>
