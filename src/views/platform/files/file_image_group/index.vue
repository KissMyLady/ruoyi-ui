<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="创建用户id" prop="userId">
        <el-input
            v-model="queryParams.userId"
            placeholder="请输入创建用户id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分组id" prop="groupId">
        <el-input
            v-model="queryParams.groupId"
            placeholder="请输入分组id"
            clearable
            @change="handleQuery"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="图片组名" prop="groupName">
        <el-input
            v-model="queryParams.groupName"
            placeholder="请输入图片组名"
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
            v-hasPermi="['file_image_group:file_image_group:add']"
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
            v-hasPermi="['file_image_group:file_image_group:edit']"
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
            v-hasPermi="['file_image_group:file_image_group:remove']"
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
            v-hasPermi="['file_image_group:file_image_group:export']"
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
              :data="file_image_groupList"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="主键" align="center" prop="id" width="100"/>
      <el-table-column align="center" width="auto" label="创建用户id" prop="userId"/>
      <el-table-column align="center" width="auto" label="分组id" prop="groupId"/>
      <el-table-column align="center" width="auto" label="图片组名" prop="groupName"/>
      <el-table-column align="center" width="auto" label="备注" prop="note"/>
      <el-table-column align="center" width="auto" label="逻辑删除" prop="isDelete"/>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['file_image_group:file_image_group:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['file_image_group:file_image_group:remove']"
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

    <!-- 添加或修改图片分组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="60%" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="分组id" prop="groupId">
          <el-input v-model="form.groupId" placeholder="请输入分组id"/>
        </el-form-item>
        <el-form-item label="图片组名" prop="groupName">
          <el-input v-model="form.groupName" placeholder="请输入图片组名"/>
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
  listFile_image_group,
  getFile_image_group,
  delFile_image_group,
  addFile_image_group,
  updateFile_image_group
} from "@/api/platform/files/file_image_group";
import TipMessage from '@/utils/myUtils/TipMessage'
import {changeDictToString} from '@/utils/myUtils/changeSomething'
import {aesEncrypt, aesDecrypt, aesDecrypt2Json} from '@/utils/encrypt/encryption'

export default {
  //dicts: ['is_delete'],
  name: "File_image_group",
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
      // 图片分组表格数据
      file_image_groupList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        orderByColumn: 'create_time',
        isAsc: "desc",  //desc, acs
        //sortStr: "-create_time",  //sql排序字段
        pageNum: 1,
        pageSize: 10,
        userId: null,
        groupId: null,
        groupName: null,
        note: null,
        isDelete: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //表格行
      columns: [
        {key: 'id', align: 'center', width: 'auth', label: `主键`, prop: 'id', visible: true},
        {key: 'user_id', align: 'center', width: 'auth', label: `创建用户id`, prop: 'user_id', visible: true},
        {key: 'group_id', align: 'center', width: 'auth', label: `分组id`, prop: 'group_id', visible: true},
        {key: 'group_name', align: 'center', width: 'auth', label: `图片组名`, prop: 'group_name', visible: true},
        {key: 'note', align: 'center', width: 'auth', label: `备注`, prop: 'note', visible: true},
        {key: 'is_delete', align: 'center', width: 'auth', label: `逻辑删除`, prop: 'is_delete', visible: true},
        {key: 'create_time', align: 'center', width: 'auth', label: `创建时间`, prop: 'create_time', visible: true},
        {key: 'update_time', align: 'center', width: 'auth', label: `更新时间`, prop: 'update_time', visible: true},
      ]
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询图片分组列表 */
    getList() {
      this.loading = true;
      listFile_image_group(this.queryParams).then(response => {
        let privateObj = response.text;
        //let publicObj = aesDecrypt(privateObj);
        //let jsonData = JSON.parse(publicObj);
        let jsonData = aesDecrypt2Json(privateObj)
        console.log("list数据查询结果", jsonData)
        this.file_image_groupList = jsonData;
        //this.file_image_groupList = response.rows;
        this.total = response.total;
        this.loading = false;
      }).catch((err) => {
        this.loading = false
        //Message({ message: ""+err, type: 'error' })
        console.log("请求错误: ", err);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        groupId: null,
        groupName: null,
        note: null,
        isDelete: null,
        createTime: null,
        updateTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加图片分组";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getFile_image_group(id).then(response => {
        let privateObj = response.text;
        let jsonData = aesDecrypt2Json(privateObj);
        console.log("修改按钮操作.查询结果打印: ", jsonData);
        this.form = jsonData;
        //this.form = response.data;
        this.open = true;
        this.title = "修改图片分组";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          //对表单加密
          let dict2String = changeDictToString(this.form);
          let sendData = {
            "a": aesEncrypt("1024"),
            "b": aesEncrypt(dict2String),
            "c": aesEncrypt("Hello World !")
          }

          //发送内容加密
          if (this.form.id != null) {
            updateFile_image_group(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFile_image_group(sendData).then(response => {
              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除图片分组编号为"' + ids + '"的数据项？').then(function () {
        return delFile_image_group(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('file_image_group/file_image_group/export', {
        ...this.queryParams
      }, `file_image_group_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
