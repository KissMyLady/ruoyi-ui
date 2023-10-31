<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="queryParams.name"
                  placeholder="请输入分类名称"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限代号" prop="authorityCode">
        <el-select v-model="queryParams.authorityCode"
                   clearable
                   @change="handleQuery"
                   style="width: 120px"
                   placeholder="请选择">
          <el-option v-for="item in authority_options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="逻辑删除" prop="isDelete">
        <el-select v-model="queryParams.isDelete"
                   style="width: 80px"
                   clearable
                   @change="handleQuery"
                   placeholder="请选择">
          <el-option v-for="item in isDelete_options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
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
                   v-hasPermi="['ideal_project:ideal_project:add']"
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
                   v-hasPermi="['ideal_project:ideal_project:edit']"
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
                   v-hasPermi="['ideal_project:ideal_project:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['ideal_project:ideal_project:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table border
              stripe
              :data="ideal_projectList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
<!--      <el-table-column align="center" width="auto" label="类别代号" prop="typeCode"/>-->
<!--      <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>-->
      <el-table-column label="封面图" align="center" prop="coverImage" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.coverImage" width="100"/>
        </template>
      </el-table-column>
      <el-table-column align="left" width="auto" label="分类名称" prop="name">
        <template slot-scope="scope">
          <el-popover placement="top-start"
                      title="介绍"
                      width="200"
                      trigger="hover"
                      :content="scope.row.preContent">
            <span style="margin:0;padding:0;font-size: 16px;font-weight: bold"
                  slot="reference">{{ scope.row.name }}</span>
          </el-popover>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" width="auto" label="编辑器模式.1md,2富文本" prop="editorMode"/>-->
<!--      <el-table-column align="center" width="auto" label="文档内容_含html格式" prop="content"/>-->
<!--      <el-table-column align="center" width="auto" label="文档内容_预览_纯文本" prop="preContent"/>-->
      <el-table-column align="center" width="100" label="权限代号" prop="authorityCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.authority_code" :value="scope.row.authorityCode"/>
        </template>
      </el-table-column>
<!--      <el-table-column align="center" width="auto" label="权限具体限定内容" prop="authorityValue"/>-->
<!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
<!--      <el-table-column align="center" width="auto" label="子类的排序字段" prop="sortField"/>-->
<!--      <el-table-column align="center" width="auto" label="当前分类是否允许评论" prop="isAllowComment"/>-->
<!--      <el-table-column align="center" width="auto" label="置顶" prop="isTop"/>-->
<!--      <el-table-column align="center" width="auto" label="项目浏览次数" prop="visitor"/>-->
      <el-table-column align="center" width="100" label="内容数量" prop="countSum"/>
      <el-table-column align="center" width="100" label="逻辑删除" prop="isDelete"/>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="text"
                     icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['ideal_project:ideal_project:edit']"
          >修改
          </el-button>
          <el-button size="mini"
                     type="text"
                     icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['ideal_project:ideal_project:remove']"
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

    <!-- 添加或修改分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="50%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="类别代号" prop="typeCode">
          <el-input v-model="form.typeCode" style="width: 300px" placeholder="请输入类别代号"/>
        </el-form-item>
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" style="width: 300px" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" style="width: 300px" placeholder="请输入分类名称"/>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImage">
          <el-input v-model="form.coverImage"
                    style="width: 300px" placeholder="请输入封面图地址"/>
        </el-form-item>
        <el-form-item label="编辑器模式.1md,2富文本" prop="editorMode">
          <el-input v-model="form.editorMode" style="width: 300px" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="文档内容_含html格式">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="文档内容_预览_纯文本">
          <editor v-model="form.preContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="权限代号" prop="authorityCode">
          <el-input v-model="form.authorityCode" style="width: 300px" placeholder="请输入权限代号"/>
        </el-form-item>
        <el-form-item label="权限具体限定内容" prop="authorityValue">
          <el-input v-model="form.authorityValue" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 300px" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="子类的排序字段" prop="sortField">
          <el-input v-model="form.sortField" style="width: 300px" placeholder="请输入子类的排序字段"/>
        </el-form-item>
        <el-form-item label="当前分类是否允许评论" prop="isAllowComment">
          <el-input v-model="form.isAllowComment" style="width: 300px" placeholder="请输入当前分类是否允许评论"/>
        </el-form-item>
        <el-form-item label="置顶" prop="isTop">
          <el-input v-model="form.isTop" style="width: 300px" placeholder="请输入置顶"/>
        </el-form-item>
        <el-form-item label="项目浏览次数" prop="visitor">
          <el-input v-model="form.visitor" style="width: 300px" placeholder="请输入项目浏览次数"/>
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
  listIdeal_project,
  getIdeal_project,
  delIdeal_project,
  addIdeal_project,
  updateIdeal_project
} from '@/api/platform/zblog/ideal/ideal_project'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'

export default {
  dicts: ['is_delete', 'authority_code'],
  name: 'Ideal_project',
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
      // 分类表格数据
      ideal_projectList: [],
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
        name: null,
        authorityCode: null,
        isDelete: 0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      isDelete_options: [
        { value: '1', label: '是'},
        { value: '0', label: '否'},
      ],
      authority_options: [
        { value: '0', label: '0 公开'},
        { value: '1', label: '1 私密'},
        { value: '2', label: '2 指定用户可见'},
        { value: '3', label: '3 访问码可见'},
        { value: '9', label: '9 超管可见'},
      ],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询分类列表 */
    getList() {
      //this.total = 0;
      //this.ideal_projectList = [];
      listIdeal_project(this.queryParams).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        this.ideal_projectList = []
        //console.log('list数据查询结果', jsonData)
        this.ideal_projectList = jsonData
        //this.ideal_projectList = response.rows;
        this.total = response.total
      }).catch((err) => {
        //Message({ message: ""+err, type: 'error' })
        console.log('请求错误: ', err)
        TipMessage.Info("未查询到数据")
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
        typeCode: null,
        userId: null,
        name: null,
        coverImage: null,
        editorMode: null,
        content: null,
        preContent: null,
        authorityCode: null,
        authorityValue: null,
        sort: null,
        sortField: null,
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
      this.title = '添加分类'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getIdeal_project(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改分类'
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
            updateIdeal_project(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addIdeal_project(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除分类编号为"' + ids + '"的数据项？').then(function() {
        return delIdeal_project(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ideal_project/ideal_project/export', {
        ...this.queryParams
      }, `ideal_project_${new Date().getTime()}.xlsx`)
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
      updateIdeal_project(sendData).then((res) => {
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
