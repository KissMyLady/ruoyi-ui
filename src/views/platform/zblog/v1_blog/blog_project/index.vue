<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="文集名称" prop="name">
        <el-input
            v-model="queryParams.name"
            placeholder="请输入文集名称"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="权限值" prop="role">
        <el-input v-model="queryParams.role"
                  placeholder="0公开，1私密,2指定用户可见,3访问码可见"
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

    <el-table v-loading="loading"
              :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              border
              stripe
              :data="blog_projectList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="80"/>
      <el-table-column align="center" width="150" label="封面图" prop="coverImg">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px"
                    fit="contain"
                    lazy
                    :src="getImageUrl(scope.row.coverImg)"
                    :preview-src-list="tableImageList">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="创建用户id" prop="createUserId"/>-->
      <el-table-column align="center" width="auto" label="文集名称" prop="name"/>
      <el-table-column align="center" width="auto" label="介绍" prop="intro">
        <template slot-scope="scope">
          <span>{{ LimitStringShow(scope.row.intro, 50) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" width="auto" label="图标" prop="icon"/>-->
      <el-table-column label="权限值" width="75" align="center" prop="role">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.role == 9"
                  @click="switchDataAuthState(scope.row.id, 0)"
                  style="cursor:pointer;"
                  type="danger">超管
          </el-tag>
          <el-tag v-else-if="scope.row.role == 0"
                  @click="switchDataAuthState(scope.row.id, 9)"
                  style="cursor:pointer;">公开
          </el-tag>
          <el-tag v-else
                  type="info"
                  @click="switchDataAuthState(scope.row.id, 9)"
                  style="cursor:pointer;">{{ scope.row.role }}
          </el-tag>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="权限值" prop="roleValue"/>-->
      <!--      <el-table-column align="center" width="auto" label="水印" prop="isWatermark"/>-->
      <!--      <el-table-column label="水印类型" align="center" prop="watermarkType">-->
      <!--        <template slot-scope="scope">-->
      <!--          <dict-tag :options="dict.type.watermark_type" :value="scope.row.watermarkType"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" width="auto" label="水印值" prop="watermarkValue"/>-->
      <!--      <el-table-column label="是否置顶" align="center" prop="isTop">-->
      <!--        <template slot-scope="scope">-->
      <!--          <dict-tag :options="dict.type.is_delete" :value="scope.row.isTop"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column align="center" width="75" label="浏览次数" prop="visitor"/>
      <!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
      <!--      <el-table-column align="center" width="auto" label="子类排序方式(sql字段)" prop="sortField"/>-->
      <el-table-column label="逻辑删除" align="center" prop="isDelete" width="75">
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
      <el-table-column label="创建时间" align="center" prop="createTime" width="120">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.createTime" placement="top">
            <span>{{ formatTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <!--      <el-table-column label="更新时间" align="center" prop="modifyTime" width="180">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-tooltip class="item" effect="dark" :content="scope.row.modifyTime" placement="top">-->
      <!--            <span>{{ formatTime(scope.row.modifyTime, '{y}-{m}-{d}') }}</span>-->
      <!--          </el-tooltip>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button icon="el-icon-edit"
                     @click="handleUpdate(scope.row)"
                     v-hasPermi="['blog_project:blog_project:edit']"
          >修改
          </el-button>
          <el-button icon="el-icon-delete"
                     @click="handleDelete(scope.row)"
                     v-hasPermi="['blog_project:blog_project:remove']"
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

    <!-- 添加或修改文章分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="文集名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入文集名称"/>
        </el-form-item>
        <el-form-item label="介绍" prop="intro">
          <el-input v-model="form.intro" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标"/>
        </el-form-item>
        <el-form-item label="封面图" prop="coverImg">
          <el-input v-model="form.coverImg" placeholder="请输入封面图"/>
        </el-form-item>
        <el-form-item label="权限代号" prop="role"
                      :rules="[
                          { required: true, message: '分组id不能为空'},
                          { type: 'number', message: 'id必须为数字'}]">
          <el-input v-model.number="form.role"
                    placeholder="0表示公开，1私密,2指定用户可见,3访问码可见"/>
        </el-form-item>
        <el-form-item label="权限具体值" prop="roleValue">
          <el-input v-model="form.roleValue"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="水印" prop="isWatermark">
          <el-input v-model="form.isWatermark" placeholder="请输入水印"/>
        </el-form-item>
        <el-form-item label="水印类型" prop="watermarkType">
          <el-select v-model="form.watermarkType" placeholder="请选择水印类型">
            <el-option v-for="dict in dict.type.watermark_type"
                       :key="dict.value"
                       :label="dict.label"
                       :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="水印值" prop="watermarkValue">
          <el-input v-model="form.watermarkValue" placeholder="请输入水印值"/>
        </el-form-item>
        <el-form-item label="是否置顶" prop="isTop">
          <el-input v-model="form.isTop" placeholder="请输入是否置顶"/>
        </el-form-item>
        <el-form-item label="浏览次数" prop="visitor">
          <el-input v-model="form.visitor" placeholder="请输入浏览次数"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="子类排序方式(sql字段)" prop="sortField">
          <el-input v-model="form.sortField" placeholder="请输入子类排序方式(sql字段)"/>
        </el-form-item>
        <el-form-item label="逻辑删除" prop="isDelete">
          <el-input v-model="form.isDelete" placeholder="请输入逻辑删除"/>
        </el-form-item>
        <el-form-item label="更新时间" prop="modifyTime">
          <el-date-picker clearable
                          v-model="form.modifyTime"
                          type="datetime"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="请选择更新时间"
          >
          </el-date-picker>
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
} from '@/api/platform/zblog/v1_blog/blog_project'
import TipMessage from '@/utils/myUtils/TipMessage'

export default {
  //dicts: ['is_delete'],
  name: 'Blog_project',
  dicts: ['watermark_type', 'is_delete', 'role'],
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
      // 文章分类表格数据
      blog_projectList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: 'create_time',
        isAsc: 'desc',  //desc, acs
        pageNum: 1,
        pageSize: 10,
        createUserId: null,
        name: null,
        intro: null,
        icon: null,
        coverImg: null,
        role: null,
        roleValue: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        isTop: null,
        visitor: null,
        sort: null,
        sortField: null,
        isDelete: null,
        modifyTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格图片
      tableImageList: [],
    }
  },
  created() {
    let is_showSearch = window.localStorage.getItem('showSearch');
    if (is_showSearch == 'false'){
        this.showSearch = false;
    }
    if (is_showSearch == 'true'){
        this.showSearch = true;
    }
    this.getList()
  },
  methods: {
    /** 查询文章分类列表 */
    getList() {
      this.loading = true
      listBlog_project(this.queryParams).then(response => {
        this.blog_projectList = response.rows
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
        createUserId: null,
        name: null,
        intro: null,
        icon: null,
        coverImg: null,
        role: null,
        roleValue: null,
        isWatermark: null,
        watermarkType: null,
        watermarkValue: null,
        isTop: null,
        visitor: null,
        sort: null,
        sortField: null,
        isDelete: null,
        createTime: null,
        modifyTime: null
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
      this.title = '添加文章分类'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getBlog_project(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = '修改文章分类'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateBlog_project(this.form).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addBlog_project(this.form).then(response => {
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
      this.$modal.confirm('是否确认删除文章分类编号为"' + ids + '"的数据项？').then(function () {
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
    switchDataAuthState(rowId, isD) {
      let sendData = {
        "id": rowId,
        "role": isD
      }
      updateBlog_project(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg);
          return null;
        }
        if (isD == 9) {
          TipMessage.Warning(rowId + " 切换为超级管理员可见");
        } else {
          TipMessage.isOK(rowId + " 切换为公开");
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    switchDeleteState(rowId, isD) {
      //console.log("删除切换row: ", rowId);
      let sendData = {
        "id": rowId,
        "isDelete": isD
      }
      updateBlog_project(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg);
          return null;
        }
        if (isD == 1) {
          TipMessage.Warning("删除成功");
        } else {
          TipMessage.isOK("取消删除成功");
        }
        this.getList()
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    getImageUrl(filePath) {
      return process.env.VUE_APP_target_url + filePath;
    },
    getImageListMethod(row) {
      var imgList = [];
      for (let i = 0; i < row.length; i++) {
        let imaUrl = this.getImageUrl(row[i].filePath)
        imgList.push(imaUrl)
      }
      this.tableImageList = imgList;
    },
    //=====================================底部结束========================================
  }
}
</script>
