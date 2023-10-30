<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="书籍名称" prop="bookName">
        <el-input
            v-model="queryParams.bookName"
            placeholder="请输入书籍名称"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
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
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   size="mini"
                   @click="handleAdd"
                   v-hasPermi="['book_book:book_book:add']"
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
                   v-hasPermi="['book_book:book_book:edit']"
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
                   v-hasPermi="['book_book:book_book:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['book_book:book_book:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary"
                   size="mini"
                   @click="uploadFiles"
                   plain
                   class="el-icon-plus">上传图片</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              border
              stripe
              :data="book_bookList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <!--      <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>-->
      <el-table-column align="left" width="auto" label="书籍类型" prop="bookType"/>
      <el-table-column align="left" width="auto" label="书籍名称" prop="bookName">
        <template slot-scope="scope">
          <el-popover placement="right-start"
                      style="font-size: 14px"
                      title="书籍介绍"
                      width="350"
                      trigger="hover"
                      :content="scope.row.intro">
            <span slot="reference" style="font-size: 16px;font-weight: bold;margin:0;padding:0">{{ scope.row.bookName }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column align="center" width="auto" label="封面" prop="bookCover">
        <template slot-scope="scope">
          <image-preview :src="getImageSrc(scope.row.bookCover)" width="100"/>
        </template>
      </el-table-column>
      <el-table-column align="left" width="120" label="作者" prop="bAuthor"/>
      <!--      <el-table-column align="center" width="auto" label="出版社" prop="bPublisher"/>-->
      <el-table-column label="出版时间" width="100" align="center" prop="bPublicData">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.bPublicData, '{y}-{m}') }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="翻译" prop="bTranslate"/>-->
      <!--      <el-table-column label="开始阅读时间" align="center" prop="bReadStartTime" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ formatTime(scope.row.bReadStartTime) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column label="阅读完毕时间" align="center" prop="bReadEndTime" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--            <span>{{ formatTime(scope.row.bReadEndTime) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" width="85" label="是否读完" prop="bIsOver">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bIsOver == 1"
                  @click="switchDeleteState(scope.row.id, 0, 'bIsOver')"
                  style="cursor:pointer;"
                  type="success"
          >是
          </el-tag>
          <el-tag v-else-if="scope.row.bIsOver == 0"
                  @click="switchDeleteState(scope.row.id, 1, 'bIsOver')"
                  type="info"
                  style="cursor:pointer;"
          >否
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="文章数" width="85" align="center" prop="countSum">
        <template slot-scope="scope">
          <el-popover placement="top-start"
                      title="最近文章"
                      width="200"
                      trigger="hover"
                      :content="scope.row.countSum">
            <span slot="reference">{{ scope.row.countSum }}</span>
          </el-popover>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="书籍市面价格" prop="bPrice"/>-->
      <!--      <el-table-column align="center" width="auto" label="简要介绍" prop="intro"/>-->
      <!--      <el-table-column align="center" width="auto" label="编辑器模式.1md,2富文本" prop="editorMode"/>-->
      <!--      <el-table-column align="center" width="auto" label="介绍内容_含html格式" prop="content"/>-->
      <!--      <el-table-column align="center" width="auto" label="介绍内容_预览_纯文本" prop="preContent"/>-->
      <el-table-column label="权限代号" width="100" align="center" prop="authorityCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.authority_code" :value="scope.row.authorityCode"/>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="权限具体限定内容" prop="authorityValue"/>-->
      <!--      <el-table-column align="center" width="auto" label="子类的排序字段" prop="sortField"/>-->
      <!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
      <!--      <el-table-column align="center" width="auto" label="当前分类是否允许评论" prop="isAllowComment"/>-->
      <!--      <el-table-column align="center" width="auto" label="置顶" prop="isTop"/>-->
      <!--      <el-table-column align="center" width="auto" label="浏览次数" prop="visitor"/>-->
      <el-table-column label="逻辑删除" width="85" align="center" prop="isDelete">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isDelete == 1"
                  @click="switchDeleteState(scope.row.id, 0, 'isDelete')"
                  style="cursor:pointer;"
                  type="danger"
          >是
          </el-tag>
          <el-tag v-else-if="scope.row.isDelete == 0"
                  @click="switchDeleteState(scope.row.id, 1, 'isDelete')"
                  type="info"
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
              v-hasPermi="['book_book:book_book:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['book_book:book_book:remove']"
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

    <!-- 添加或修改书籍对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" style="width: 300px" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="书籍名称" prop="bookName">
          <el-input v-model="form.bookName" style="width: 300px" placeholder="请输入书籍名称"/>
        </el-form-item>
        <el-form-item label="书籍封面图" prop="bookCover">
          <el-input v-model="form.bookCover" style="width: 300px" placeholder="请输入书籍封面图"/>
        </el-form-item>
        <el-form-item label="作者" prop="bAuthor">
          <el-input v-model="form.bAuthor" style="width: 300px" placeholder="请输入作者"/>
        </el-form-item>
        <el-form-item label="出版社" prop="bPublisher">
          <el-input v-model="form.bPublisher" style="width: 300px" placeholder="请输入出版社"/>
        </el-form-item>
        <el-form-item label="出版时间" prop="bPublicData">
          <el-date-picker clearable
                          v-model="form.bPublicData"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择出版时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="翻译" prop="bTranslate">
          <el-input v-model="form.bTranslate" style="width: 300px" placeholder="请输入翻译"/>
        </el-form-item>
        <el-form-item label="开始阅读时间" prop="bReadStartTime">
          <el-date-picker clearable
                          v-model="form.bReadStartTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择开始阅读时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="阅读完毕时间" prop="bReadEndTime">
          <el-date-picker clearable
                          v-model="form.bReadEndTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择阅读完毕时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="是否读完" prop="bIsOver">
          <el-input v-model="form.bIsOver" style="width: 300px" placeholder="请输入是否读完"/>
        </el-form-item>
        <el-form-item label="书籍市面价格" prop="bPrice">
          <el-input v-model="form.bPrice" style="width: 300px" placeholder="请输入书籍市面价格"/>
        </el-form-item>
        <el-form-item label="简要介绍" prop="intro">
          <el-input v-model="form.intro" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
          <el-input v-model="form.editorMode" style="width: 300px" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="介绍内容_含html格式">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="介绍内容_预览_纯文本">
          <editor v-model="form.preContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="权限代号" prop="authorityCode">
          <el-input v-model="form.authorityCode" style="width: 300px" placeholder="请输入权限代号"/>
        </el-form-item>
        <el-form-item label="权限具体限定内容" prop="authorityValue">
          <el-input v-model="form.authorityValue" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="子类的排序字段" prop="sortField">
          <el-input v-model="form.sortField" style="width: 300px" placeholder="请输入子类的排序字段"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 300px" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="当前分类是否允许评论" prop="isAllowComment">
          <el-input v-model="form.isAllowComment" style="width: 300px" placeholder="请输入当前分类是否允许评论"/>
        </el-form-item>
        <el-form-item label="置顶" prop="isTop">
          <el-input v-model="form.isTop" style="width: 300px" placeholder="请输入置顶"/>
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

    <!-- 上传文件-->
    <upload-dialog ref="uploadDialog"></upload-dialog>
  </div>
</template>

<script>
import {
  listBook_book,
  getBook_book,
  delBook_book,
  addBook_book,
  updateBook_book
} from '@/api/platform/zblog/book/book_book'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'
import dict from '@/utils/dict'
import uploadDialog from '@/components/FileUploadDialog'
export default {
  dicts: ['is_delete', 'authority_code'],
  name: 'Book_book',
  components: {
    uploadDialog: uploadDialog,
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
      // 书籍表格数据
      book_bookList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        //orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        sortStr: 'create_time',  //sql排序字段 countSum desc, create_time
        pageNum: 1,
        pageSize: 10,
        bookType: null,
        bookName: null,
        isDelete: 0
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
    dict,
    /** 查询书籍列表 */
    getList() {
      //this.total = 0;
      //this.book_bookList = [];
      //this.loading = true
      listBook_book(this.queryParams).then(response => {
        let privateObj = response.text
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        this.book_bookList = []
        // console.log('list数据查询结果', jsonData)
        this.book_bookList = jsonData
        //this.book_bookList = response.rows;
        this.total = response.total
        //this.loading = false
      }).catch((err) => {
        //this.loading = false
        //Message({ message: ""+err, type: 'error' })
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
        bookType: null,
        bookName: null,
        bookCover: null,
        bAuthor: null,
        bPublisher: null,
        bPublicData: null,
        bTranslate: null,
        bReadStartTime: null,
        bReadEndTime: null,
        bIsOver: null,
        bPrice: null,
        intro: null,
        editorMode: null,
        content: null,
        preContent: null,
        authorityCode: null,
        authorityValue: null,
        sortField: null,
        sort: null,
        isAllowComment: null,
        isTop: null,
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
      this.title = '添加书籍'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBook_book(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改书籍'
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
            updateBook_book(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBook_book(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除书籍编号为"' + ids + '"的数据项？').then(function() {
        return delBook_book(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('book_book/book_book/export', {
        ...this.queryParams
      }, `book_book_${new Date().getTime()}.xlsx`)
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
      updateBook_book(sendData).then((res) => {
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
    getImageSrc(item) {
      if (item.indexOf('/media/') === -1) {
        //不包含媒体 /media/ 路径. 为老旧的django上传
        return process.env.VUE_APP_media_url + '/' + item
      } else {
        return item
      }
    },
    uploadFiles() {
      this.$refs['uploadDialog'].showDialog()
    }
    //==========================底部结束==================================
  }
}
</script>
