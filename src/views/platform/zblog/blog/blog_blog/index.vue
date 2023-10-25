<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="所属文集" prop="projectId">
        <el-input
            v-model="queryParams.projectId"
            placeholder="筛选所属文集"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="筛选用户" prop="userId">
        <el-input
            v-model="queryParams.userId"
            placeholder="用户id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="筛选标题" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入标题"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限筛选" prop="authorityCode">
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
            v-hasPermi="['blog_blog:blog_blog:add']"
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
            v-hasPermi="['blog_blog:blog_blog:edit']"
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
            v-hasPermi="['blog_blog:blog_blog:remove']"
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
            v-hasPermi="['blog_blog:blog_blog:export']"
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
              :data="blog_blogList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <el-table-column align="center" width="100" label="所属文集" prop="projectId"/>
      <!--      <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>-->
      <!--      <el-table-column align="center" width="auto" label="父级文档" prop="parentBlog"/>-->
      <el-table-column align="center" width="90" label="编辑器" prop="editorMode">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.editorMode == 1"
                  style="cursor:pointer;"
          >Md
          </el-tag>
          <el-tag v-else-if="scope.row.editorMode == 2"
                  style="cursor:pointer;">Tiny
          </el-tag>
          <el-tag v-else
                  style="cursor:pointer;">未知
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="标题" prop="name">
        <template slot-scope="scope">
          <el-button type="primary"
                     style="float: left;margin-left: 0;"
                     size="mini"
                     @click="showBlogContent(scope.row.id)"
                     plain
                     class="el-icon-view"></el-button>
<!--          <span>{{ scope.row.name }}</span>-->
          <el-input placeholder="文章标题"
                    class="edit-input"
                    size="small"
                    style="padding-left:0;margin-left:2px;width: 70%;border: 0;font-size: 14px"
                    v-model="scope.row.name">
          </el-input>
          <el-button type="primary"
                     style="float: right"
                     size="mini"
                     @click="editBlogTitle(scope.row)"
                     plain
                     class="el-icon-finished"></el-button>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="文档内容" prop="content"/>-->
      <!--      <el-table-column align="center" width="auto" label="文档内容_预览_纯文本" prop="preContent"/>-->
<!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
      <el-table-column align="center" width="90" label="状态码" prop="status"/>
      <!--      <el-table-column align="center" width="auto" label="编辑状态,打开下级" prop="editOpenChildren"/>-->
      <!--      <el-table-column align="center" width="auto" label="浏览状态,打开下级" prop="showOpenChildren"/>-->
      <el-table-column align="center" width="90" label="权限代号" prop="authorityCode"/>
      <!--      <el-table-column align="center" width="auto" label="权限具体限定内容" prop="authorityValue"/>-->
      <!--      <el-table-column align="center" width="auto" label="水印状态" prop="isWatermark"/>-->
      <!--      <el-table-column align="center" width="auto" label="水印类型 1表示文字水印 2表示图片水印" prop="watermarkType"/>-->
      <!--      <el-table-column align="center" width="auto" label="水印内容" prop="watermarkValue"/>-->
      <el-table-column align="center" width="90" label="浏览次数" prop="visitor"/>
      <el-table-column align="center" width="90" label="逻辑删除" prop="isDelete"/>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="editContent(scope.row)"
              v-hasPermi="['blog_blog:blog_blog:edit']"
          >编辑
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['blog_blog:blog_blog:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['blog_blog:blog_blog:remove']"
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

    <!-- 添加或修改博客文档对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="所属文集" prop="projectId">
          <el-input v-model="form.projectId" style="width: 300px" placeholder="请输入所属文集"/>
        </el-form-item>
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId"
                    disabled
                    style="width: 300px"
                    placeholder="请输入创建用户id"
          />
        </el-form-item>
        <el-form-item label="父级文档" prop="parentBlog">
          <el-input v-model="form.parentBlog" style="width: 300px" placeholder="请输入父级文档"/>
        </el-form-item>
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" style="width: 300px" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
          <el-input v-model="form.editorMode" style="width: 300px" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="文档内容">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="文档内容_预览_纯文本">
          <editor v-model="form.preContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 300px" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="编辑状态,打开下级" prop="editOpenChildren">
          <el-input v-model="form.editOpenChildren" style="width: 300px" placeholder="请输入编辑状态,打开下级"/>
        </el-form-item>
        <el-form-item label="浏览状态,打开下级" prop="showOpenChildren">
          <el-input v-model="form.showOpenChildren" style="width: 300px" placeholder="请输入浏览状态,打开下级"/>
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
        <el-form-item label="水印状态" prop="isWatermark">
          <el-input v-model="form.isWatermark" style="width: 300px" placeholder="请输入水印状态"/>
        </el-form-item>
        <el-form-item label="水印内容" prop="watermarkValue">
          <el-input v-model="form.watermarkValue" style="width: 300px" placeholder="请输入水印内容"/>
        </el-form-item>
        <el-form-item label="浏览次数" prop="visitor">
          <el-input v-model="form.visitor" style="width: 300px" placeholder="请输入浏览次数"/>
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

    <!--富文本预览弹出框-->

    <!--markdown预览弹出框-->

  </div>
</template>

<script>
import {
  listBlog_blog,
  getBlog_blog,
  delBlog_blog,
  addBlog_blog,
  updateBlog_blog
} from '@/api/platform/zblog/blog/blog_blog'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'

export default {
  //dicts: ['is_delete'],
  name: 'Blog_blog',
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
      // 博客文档表格数据
      blog_blogList: [],
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
        projectId: null,
        userId: null,
        name: null,
        sort: null,
        status: null,
        authorityCode: null,
        isDelete: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询博客文档列表 */
    getList() {
      //this.total = 0;
      //this.blog_blogList = [];
      this.loading = true
      listBlog_blog(this.queryParams).then(response => {
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        this.blog_blogList = []
        console.log('list数据查询结果', jsonData)
        this.blog_blogList = jsonData
        //this.blog_blogList = response.rows;
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
        projectId: null,
        userId: null,
        parentBlog: null,
        name: null,
        editorMode: null,
        content: null,
        preContent: null,
        sort: null,
        status: null,
        editOpenChildren: null,
        showOpenChildren: null,
        authorityCode: null,
        authorityValue: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        visitor: null,
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
      this.title = '添加博客文档'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBlog_blog(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改博客文档'
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
            updateBlog_blog(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBlog_blog(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除博客文档编号为"' + ids + '"的数据项？').then(function() {
        return delBlog_blog(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('blog_blog/blog_blog/export', {
        ...this.queryParams
      }, `blog_blog_${new Date().getTime()}.xlsx`)
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
      updateBlog_blog(sendData).then((res) => {
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
    //内容编辑
    editContent(row) {
      let editorMode = row.editorMode
      if (editorMode === '1' || editorMode === 1) {
        //跳转到markdown编辑器页面
        let jumpUrl = '/blog_project/blog_add_markdown' //+ row.id
        this.$router.push(jumpUrl)
      } else if (editorMode === '2' || editorMode === 2) {
        //跳转到富文本编辑器页面
        let jumpUrl = '/blog_project/blog_add_tinymce' //+ row.id
        this.$router.push(jumpUrl)
      } else {
        TipMessage.Warning('当前内容未指定编辑器模式, 请检查')
        return null
      }
    },
    //修改文章的标题
    editBlogTitle(row){
      let sendForm = {
        "id": row.id,
        "name": row.name,
      }
      let dict2String = changeDictToString(sendForm)
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      updateBlog_blog(sendData).then((res)=>{
        if (res.code !== 200){
          TipMessage.Warning(res.msg);
          return null;
        }
        TipMessage.isOK(res.msg);
        this.getList();
      }).catch((err)=>{
        //TipMessage.Error("错误"+ err);
      })
    },
    showBlogContent(blog_id){
      //查询文章的内容展示, 打开弹出框
      TipMessage.isOK("查询"+ blog_id);
    },
    //==========================底部结束==================================
  }
}
</script>
