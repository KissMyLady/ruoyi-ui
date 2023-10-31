<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="书籍选择" prop="bookId">
        <el-select v-model="queryParams.bookId"
                   clearable
                   @change="handleQuery"
                   style="width: 120px"
                   placeholder="请选择">
          <el-option v-for="item in book_bookList"
                     :key="item.id"
                     :label="item.id + ' '+item.bookName + ' 数量:'+ item.countSum"
                     :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="bookId">
        <el-input v-model="queryParams.descNote"
                  placeholder="输入查询书籍"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="title">
        <el-input v-model="queryParams.title"
                  placeholder="请输入标题筛选"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限代号" prop="name">
        <el-select v-model="queryParams.authorityCode"
                   clearable
                   @change="handleQuery"
                   style="width: 120px"
                   placeholder="请选择"
        >
          <el-option v-for="item in authority_options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value"
          >
          </el-option>
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
            v-hasPermi="['book_chapter:book_chapter:add']"
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
            v-hasPermi="['book_chapter:book_chapter:edit']"
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
            v-hasPermi="['book_chapter:book_chapter:remove']"
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
            v-hasPermi="['book_chapter:book_chapter:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border
              :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              stripe
              :data="book_chapterList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <!--      <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>-->
      <el-table-column align="right" width="200" label="关联类别" prop="bookId">
        <template slot-scope="scope">
          <span>{{ scope.row.bookId }} {{ scope.row.bookName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="父级文档" prop="parentId"/>-->
      <el-table-column align="left" width="360" label="标题" prop="title">
        <template slot-scope="scope">
          <el-button type="primary"
                     style="float: left;margin-left: 0;"
                     size="mini"
                     @click="showDataContent(scope.row.id)"
                     plain
                     class="el-icon-view"
          ></el-button>
          <span style="margin-left:6px;font-weight: bold">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="简单描述" prop="descNote"/>-->
      <!--      <el-table-column align="center" width="auto" label="封面图" prop="coverImg"/>-->
      <!--      <el-table-column align="center" width="auto" label="编辑器模式" prop="editorMode"/>-->
      <!--      <el-table-column align="center" width="auto" label="文档内容_含html格式" prop="content"/>-->
      <!--      <el-table-column align="center" width="auto" label="文档内容_预览_纯文本" prop="preContent"/>-->
      <!--      <el-table-column align="center" width="auto" label="编辑状态,打开下级" prop="editOpenChildren"/>-->
      <!--      <el-table-column align="center" width="auto" label="浏览状态,打开下级" prop="showOpenChildren"/>-->
      <!--      <el-table-column align="center" width="auto" label="浏览次数" prop="visitor"/>-->
      <el-table-column align="center" width="100" label="权限代号" prop="authorityCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.authority_code" :value="scope.row.authorityCode"/>
        </template>
      </el-table-column>
      <el-table-column align="center" width="140" label="创建时间" prop="createTime">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      :content="scope.row.createTime"
                      placement="top"
          >
            <span>{{ formatTime(scope.row.createTime) }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="权限具体限定内容" prop="authorityValue"/>-->
      <!--      <el-table-column align="center" width="auto" label="当前是否允许评论" prop="allowComment"/>-->
      <el-table-column align="center" width="100" label="逻辑删除" prop="isDelete">
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
                     icon="el-icon-edit"
                     @click="editContent(scope.row)"
                     v-hasPermi="['book_chapter:book_chapter:edit']"
          >编辑
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['book_chapter:book_chapter:edit']"
          >修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['book_chapter:book_chapter:remove']"
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

    <!-- 添加或修改章节对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" style="width: 300px" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="关联类别" prop="bookId">
          <el-input v-model="form.bookId" style="width: 300px" placeholder="请输入关联类别"/>
        </el-form-item>
        <el-form-item label="父级文档" prop="parentId">
          <el-input v-model="form.parentId" style="width: 300px" placeholder="请输入父级文档"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" style="width: 300px" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="简单描述" prop="descNote">
          <el-input v-model="form.descNote" style="width: 300px" placeholder="请输入简单描述"/>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImg">
          <el-input v-model="form.coverImg" style="width: 300px" placeholder="请输入封面图"/>
        </el-form-item>
        <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
          <el-input v-model="form.editorMode" style="width: 300px" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="文档内容_含html格式">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="文档内容_预览_纯文本">
          <el-input type="textarea"
                    :autosize="{ minRows: 5, maxRows: 20}"
                    placeholder="请输入内容"
                    v-model="form.preContent"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="编辑状态,打开下级" prop="editOpenChildren">
          <el-input v-model="form.editOpenChildren" style="width: 300px" placeholder="请输入编辑状态,打开下级"/>
        </el-form-item>
        <el-form-item label="浏览状态,打开下级" prop="showOpenChildren">
          <el-input v-model="form.showOpenChildren" style="width: 300px" placeholder="请输入浏览状态,打开下级"/>
        </el-form-item>
        <el-form-item label="浏览次数" prop="visitor">
          <el-input v-model="form.visitor" style="width: 300px" placeholder="请输入浏览次数"/>
        </el-form-item>
        <el-form-item label="权限代号" prop="authorityCode">
          <el-input v-model="form.authorityCode" style="width: 300px" placeholder="请输入权限代号"/>
        </el-form-item>
        <el-form-item label="权限具体限定内容" prop="authorityValue">
          <el-input v-model="form.authorityValue" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="当前是否允许评论" prop="allowComment">
          <el-input v-model="form.allowComment" style="width: 300px" placeholder="请输入当前是否允许评论"/>
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

    <!-- 展示内容-->
    <show_tinymce_preview ref="show_tinymce_preview"
                          @show_tinymce_preview="show_tinymce_preview"
    />
  </div>
</template>

<script>
import {
  listBook_chapter,
  getBook_chapter,
  delBook_chapter,
  addBook_chapter,
  updateBook_chapter
} from '@/api/platform/zblog/book/book_chapter'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'
import show_tinymce_preview from '@/views/platform/zblog/blog/blog_blog/dialog/show_tinymce_preview.vue'
import {
  listBook_book
} from '@/api/platform/zblog/book/book_book'

export default {
  dicts: ['is_delete', 'authority_code'],
  name: 'Book_chapter',
  components: {
    show_tinymce_preview: show_tinymce_preview
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
      // 章节表格数据
      book_chapterList: [],
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
        bookId: null,
        title: null,
        isDelete: 0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      authority_options: [
        { value: '0', label: '0 公开' },
        { value: '1', label: '1 私密' },
        { value: '2', label: '2 指定用户可见' },
        { value: '3', label: '3 访问码可见' },
        { value: '9', label: '9 超管可见' }
      ],
      //书籍列表
      book_bookList: [],
      //==========================底部结束==================================
    }
  },
  created() {
    this.getList()
    this.get_book_list()
  },
  methods: {
    /** 查询章节列表 */
    getList() {
      let bookId = this.$route.query.bookId
      if (bookId !== undefined && bookId !== null && bookId !== '') {
        this.queryParams.bookId = bookId
      }
      listBook_chapter(this.queryParams).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        this.book_chapterList = []
        this.book_chapterList = jsonData
        this.total = response.total
      }).catch((err) => {
        console.log('请求错误: ', err)
        TipMessage.Info('未查询到数据!')
      })
    },
    get_book_list() {
      let queryParams = {
        isAsc: 'desc',
        sortStr: 'create_time',
        pageNum: 0,
        pageSize: 999,
        isDelete: 0
      }
      this.book_bookList = []
      listBook_book(queryParams).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        this.book_bookList = jsonData
      }).catch((err) => {
        console.log('请求错误: ', err)
        TipMessage.Info('未查询到数据!')
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
        bookId: null,
        parentId: null,
        title: null,
        descNote: null,
        coverImg: null,
        editorMode: null,
        content: null,
        preContent: null,
        editOpenChildren: null,
        showOpenChildren: null,
        visitor: null,
        authorityCode: null,
        authorityValue: null,
        allowComment: null,
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
      this.title = '添加章节'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBook_chapter(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        //console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改章节'
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
            updateBook_chapter(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBook_chapter(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除章节编号为"' + ids + '"的数据项？').then(function() {
        return delBook_chapter(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('book_chapter/book_chapter/export', {
        ...this.queryParams
      }, `book_chapter_${new Date().getTime()}.xlsx`)
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
      updateBook_chapter(sendData).then((res) => {
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
    //展示文章内容
    showDataContent(bookChapterId) {
      getBook_chapter(bookChapterId).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        let privateObj = res.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('jsonData: ', jsonData)
        let editorMode = jsonData.editorMode
        let sendData = {
          'name': jsonData.title,
          'content': jsonData.content,
          'createTime': jsonData.createTime,
          'updateTime': jsonData.updateTime
        }
        if (editorMode === '1' || editorMode === 1) {
          TipMessage.Info('当前编辑器模式为Markdown.暂时只允许富文本展示')
        } else if (editorMode === '2' || editorMode === 2) {
          this.$refs['show_tinymce_preview'].showDialog(sendData)
        } else {
          TipMessage.Warning('未知编辑器模式' + editorMode)
        }
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    show_tinymce_preview() {
      this.getList()
    },
    //内容编辑
    editContent(row) {
      let dbId = row.id
      let editorMode = row.editorMode
      if (editorMode === '1' || editorMode === 1) {
        TipMessage.Info('Markdown编辑器模式暂未开放')
        return null
      } else if (editorMode === '2' || editorMode === 2) {
        //跳转到富文本编辑器页面
        let jumpUrl = '/book/chapter_edit_tinymce?dbId=' + dbId
        this.$router.push(jumpUrl)
      } else {
        TipMessage.Warning('当前内容未指定编辑器模式, 请检查')
        return null
      }
    }
    //==========================底部结束==================================
  },
  mounted() {
    this.getList()
  }
}

</script>
