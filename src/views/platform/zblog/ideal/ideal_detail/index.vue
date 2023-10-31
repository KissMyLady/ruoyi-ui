<template>
  <div class="app-container">
    <el-form :model="queryParams"
             ref="queryForm"
             size="small"
             :inline="true"
             v-show="showSearch"
             label-width="88px"
    >
      <el-form-item label="所属项目" prop="projectId">
        <el-select v-model="queryParams.projectId"
                   clearable
                   filterable
                   @change="handleQuery"
                   style="width: 180px"
                   placeholder="请选择"
        >
          <el-option v-for="item in ideal_projectList"
                     :key="item.id"
                     :label="'数量:' +item.countSum  + ' '+  item.name"
                     :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题筛选" prop="title">
        <el-input v-model="queryParams.title"
                  placeholder="请输入标题"
                  clearable
                  @change="handleQuery"
                  @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--      <el-form-item label="编辑器" prop="editorMode">-->
      <!--        <el-input-->
      <!--            v-model="queryParams.editorMode"-->
      <!--            placeholder="请输入编辑器模式.1md,2富文本"-->
      <!--            clearable-->
      <!--            @change="handleQuery"-->
      <!--            @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="权限代号" prop="authorityCode">
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
                   style="width: 80px"
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
                   v-hasPermi="['ideal_detail:ideal_detail:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <!--        <el-button type="success"-->
        <!--                   plain-->
        <!--                   icon="el-icon-edit"-->
        <!--                   size="mini"-->
        <!--                   :disabled="single"-->
        <!--                   @click="handleUpdate"-->
        <!--                   v-hasPermi="['ideal_detail:ideal_detail:edit']"-->
        <!--        >修改-->
        <!--        </el-button>-->
        <el-button type="success"
                   plain
                   icon="el-icon-edit"
                   size="mini"
                   @click="batchChangeAuthority"
                   v-hasPermi="['ideal_detail:ideal_detail:edit']"
        >批量修改权限
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger"
                   plain
                   icon="el-icon-delete"
                   size="mini"
                   :disabled="multiple"
                   @click="handleDelete"
                   v-hasPermi="['ideal_detail:ideal_detail:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning"
                   plain
                   icon="el-icon-download"
                   size="mini"
                   @click="handleExport"
                   v-hasPermi="['ideal_detail:ideal_detail:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <!--播放-->
    <aPlayer ref="aPlayer"></aPlayer>

    <el-table :row-style="{height:'32px'}"
              :header-row-style="{height:'32px'}"
              :cell-style="{padding:'1px'}"
              border
              stripe
              :data="ideal_detailList"
              @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <!--      <el-table-column label="主键" align="center" prop="id" width="100"/>-->
      <el-table-column align="left" width="220" label="所属项目" prop="projectId">
        <template slot-scope="scope">
          <span style="margin:0;padding:0;">{{ scope.row.projectId }} {{ scope.row.projectName }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="创建用户" prop="userId"/>-->
      <el-table-column align="left" width="auto" label="标题" prop="title">
        <template slot-scope="scope">
          <el-button type="primary"
                     style="float: left;margin-left: 0;"
                     size="mini"
                     @click="showContent(scope.row.id)"
                     plain
                     class="el-icon-view"
          ></el-button>
          <span style="margin-left: 6px;">{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="简单描述" prop="descNote"/>-->
      <!--      <el-table-column align="center" width="100" label="编辑器" prop="editorMode"/>-->
      <!--      <el-table-column align="center" width="auto" label="文档内容_含html格式" prop="content"/>-->
      <!--      <el-table-column align="center" width="auto" label="文档内容_预览_纯文本" prop="preContent"/>-->
      <!--      <el-table-column align="center" width="auto" label="排序" prop="sort"/>-->
      <el-table-column align="center" width="100" label="权限代号" prop="authorityCode">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.authority_code" :value="scope.row.authorityCode"/>
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" width="auto" label="权限具体限定内容" prop="authorityValue"/>-->
      <!--      <el-table-column align="center" width="auto" label="封面图" prop="indexImgStatic"/>-->
      <el-table-column align="center" width="100" label="资源类型" prop="srcType"/>
      <!--      <el-table-column align="center" width="auto" label="音频地址" prop="srcUrl"/>-->
      <!--      <el-table-column align="center" width="auto" label="浏览次数" prop="visitor"/>-->
      <!--      <el-table-column align="center" width="auto" label="当前是否允许评论" prop="isAllowComment"/>-->
      <el-table-column align="center" width="100" label="逻辑删除" prop="isDelete">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_delete" :value="scope.row.isDelete"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini"
                     type="primary"
                     plain
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
              v-hasPermi="['ideal_detail:ideal_detail:edit']"
          >修改
          </el-button>
          <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['ideal_detail:ideal_detail:remove']"
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

    <!-- 添加或修改详情对话框 -->
    <el-dialog :title="title"
               :visible.sync="open"
               width="50%"
               append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="关联类别id" prop="projectId">
          <el-input v-model="form.projectId" style="width: 300px" placeholder="请输入关联类别id"/>
        </el-form-item>
        <el-form-item label="创建用户id" prop="userId">
          <el-input v-model="form.userId" style="width: 300px" placeholder="请输入创建用户id"/>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" style="width: 300px" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="简单描述" prop="descNote">
          <el-input v-model="form.descNote" style="width: 300px" placeholder="请输入简单描述"/>
        </el-form-item>
        <el-form-item label="编辑器模式" prop="editorMode">
          <el-input v-model="form.editorMode" style="width: 300px" placeholder="请输入编辑器模式.1md,2富文本"/>
        </el-form-item>
        <el-form-item label="内容_html格式">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="内容_纯文本">
          <editor v-model="form.preContent" :min-height="192"/>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" style="width: 300px" placeholder="请输入排序"/>
        </el-form-item>
        <el-form-item label="权限代号" prop="authorityCode">
          <el-input v-model="form.authorityCode" style="width: 300px" placeholder="请输入权限代号"/>
        </el-form-item>
        <el-form-item label="权限具体内容" prop="authorityValue">
          <el-input v-model="form.authorityValue" autosize type="textarea" placeholder="请输入内容"/>
        </el-form-item>
        <el-form-item label="封面图" prop="indexImgStatic">
          <el-input v-model="form.indexImgStatic" style="width: 300px" placeholder="请输入封面图"/>
        </el-form-item>
        <el-form-item label="音频地址" prop="srcUrl">
          <el-input v-model="form.srcUrl" style="width: 300px" placeholder="请输入音频地址"/>
        </el-form-item>
        <el-form-item label="浏览次数" prop="visitor">
          <el-input v-model="form.visitor" style="width: 300px" placeholder="请输入浏览次数"/>
        </el-form-item>
        <el-form-item label="是否允许评论" prop="isAllowComment">
          <el-input v-model="form.isAllowComment" style="width: 300px" placeholder="请输入当前是否允许评论"/>
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

    <!-- 显示展示文本弹出框-->
    <show_content_dialog ref="show_content_dialog"/>

    <!-- 批量修改权限-->
    <batch_ideal_auth_change_dialog ref="batch_ideal_auth_change_dialog"
                                    @batch_ideal_auth_change_dialog="batch_ideal_auth_change_dialog"
    />
  </div>
</template>

<script>
import {
  listIdeal_project
} from '@/api/platform/zblog/ideal/ideal_project'
import {
  listIdeal_detail,
  getIdeal_detail,
  delIdeal_detail,
  addIdeal_detail,
  updateIdeal_detail
} from '@/api/platform/zblog/ideal/ideal_detail'
import TipMessage from '@/utils/myUtils/TipMessage'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt, aesDecrypt, aesDecrypt2Json } from '@/utils/encrypt/encryption'
import clip from '@/components/vab/clipboardVab'
import aPlayer from '@/components/player/aPlayer'
import show_content_dialog from '@/views/platform/zblog/ideal/ideal_detail/dialog/show_content_dialog.vue'
import batch_ideal_auth_change_dialog
  from '@/views/platform/zblog/ideal/ideal_detail/dialog/batch_ideal_auth_change_dialog.vue'

export default {
  dicts: ['is_delete', 'authority_code'],
  name: 'Ideal_detail',
  components: {
    aPlayer: aPlayer,
    show_content_dialog: show_content_dialog,
    batch_ideal_auth_change_dialog: batch_ideal_auth_change_dialog
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
      // 详情表格数据
      ideal_detailList: [],
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
        title: null,
        editorMode: null,
        authorityCode: null,
        isDelete: 0
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
      //项目列表
      ideal_projectList: [],
      dialogWidth: '56%',
      //编辑器筛选
      editorMode_options: [
        { value: '1', label: '1 Md' },
        { value: '2', label: '2 富文本' },
        { value: '9', label: '9 url静态' }
      ],
      authority_options: [
        { value: '0', label: '0 公开' },
        { value: '1', label: '1 私密' },
        { value: '2', label: '2 指定用户可见' },
        { value: '3', label: '3 访问码可见' },
        { value: '9', label: '9 超管可见' }
      ]
    }
  },
  created() {
    this.getList()
    this.getProjectList()
  },
  methods: {
    /** 查询详情列表 */
    getList() {
      listIdeal_detail(this.queryParams).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        this.ideal_detailList = []
        // console.log('list数据查询结果', jsonData)
        this.ideal_detailList = jsonData
        //每次刷新数据, 重置播放列表
        this.reSetMusicList(jsonData)
        this.total = response.total
      }).catch((err) => {
        //Message({ message: ""+err, type: 'error' })
        console.log('请求错误: ', err)
        TipMessage.Info('未查询到数据!')
      })
    },
    getProjectList() {
      let sendData = {
        'pageNum': 1,
        'pageSize': 100,
        'isDelete': 0,
        'isAsc': 'desc',  //desc, acs
        'sortStr': 'countSum'  //按数量排序
      }
      listIdeal_project(sendData).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        this.ideal_projectList = jsonData
        // console.log('项目list数据查询结果', jsonData)
      }).catch((err) => {
        console.log('项目list请求错误: ', err)
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
        title: null,
        descNote: null,
        editorMode: null,
        content: null,
        preContent: null,
        sort: null,
        authorityCode: null,
        authorityValue: null,
        indexImgStatic: null,
        srcType: null,
        srcUrl: null,
        visitor: null,
        isAllowComment: null,
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
      this.getProjectList()
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
      this.title = '添加详情'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getIdeal_detail(id).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('修改按钮操作.查询结果打印: ', jsonData)
        this.form = jsonData
        //this.form = response.data;
        this.open = true
        this.title = '修改详情'
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
            updateIdeal_detail(sendData).then(response => {

              // let privateObj = response.text;
              // let publicObj = aesDecrypt(privateObj);
              // let jsonData = JSON.parse(publicObj);
              // TipMessage.isOK(jsonData);

              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addIdeal_detail(sendData).then(response => {
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
      this.$modal.confirm('是否确认删除详情编号为"' + ids + '"的数据项？').then(function() {
        return delIdeal_detail(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('ideal_detail/ideal_detail/export', {
        ...this.queryParams
      }, `ideal_detail_${new Date().getTime()}.xlsx`)
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
      updateIdeal_detail(sendData).then((res) => {
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
    //aPlayer 重置播放列表
    reSetMusicList(items) {
      let musicData = []
      items.forEach((item) => {
        if (item.srcType === '1' || item.srcType === 1) {
          //判断路径, 兼容以前的内容
          var urlStr = ''
          if (item.srcUrl.indexOf('/media/') === -1) {
            //不包含媒体 /media/ 路径. 为老旧的django上传
            urlStr = process.env.VUE_APP_media_url + '/' + item.srcUrl
          } else {
            urlStr = item.srcUrl
          }
          let data = {
            artist: item.id,
            title: item.title,
            // domain/api/media
            src: urlStr,
            pic: process.env.VUE_APP_media_url + '/' + item.indexImgStatic,
            lrc: '' + item.title
          }
          musicData.push(data)
        }
      })
      // console.log('清洗后的musicData播放列表打印: ', musicData)
      this.$refs['aPlayer'].reSetMusicList(musicData)
    },
    showContent(ideal_id) {
      getIdeal_detail(ideal_id).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        let privateObj = res.text
        let jsonData = aesDecrypt2Json(privateObj)
        // console.log('jsonData: ', jsonData)
        this.$refs['show_content_dialog'].showDialog(jsonData)
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    //批量修改权限
    batchChangeAuthority() {
      this.$refs['batch_ideal_auth_change_dialog'].showDialog(this.ids)
    },
    batch_ideal_auth_change_dialog() {
      this.getList()
    },
    //内容编辑
    editContent(row) {
      let dbId = row.id
      let editorMode = row.editorMode
      if (editorMode === '2' || editorMode === 2) {
        //跳转到富文本编辑器页面
        let jumpUrl = '/ideal_project/add_ideal_tinymce?dbId=' + dbId
        this.$router.push(jumpUrl)
      } else {
        TipMessage.Warning('暂时只修改富文本格式,请检查!')
        return null
      }
    },
    //==========================底部结束==================================
  }
}
</script>
