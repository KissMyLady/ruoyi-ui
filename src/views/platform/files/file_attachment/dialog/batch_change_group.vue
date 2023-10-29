<template>
  <!--任务描述对话框-->
  <el-dialog title="批量修改文件组"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>
      <div>
        <p>当前选中的id有: {{ idStr }}</p>
      </div>
      <el-form ref="form"
               :model="form"
               label-width="120px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="请选择文件分组">
              <el-select v-model="form.group_id"
                         clearable
                         style="width: 260px"
                         placeholder="请选择分组">
                <el-option v-for="item in file_attachment_group"
                           :key="item.groupId"
                           :label="'数量:' +item.fileCount  + ' '+  item.groupName"
                           :value="item.groupId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!--确定按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible=false">取 消</el-button>
      <el-button type="success" @click="addButtonClick">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import TipMessage from '@/utils/myUtils/TipMessage'
import {
  listFile_attachment_group,
  list_sqlFile_attachment_group,
} from "@/api/platform/files/file_attachment_group";
import { file_batch_change_group } from '@/api/platform/files/file_batch_change'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesDecrypt2Json, aesEncrypt } from '@/utils/encrypt/encryption'
import { listFile_attachment } from '@/api/platform/files/file_attachment'

export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '37%',
      form: {
        fileIds: [],
        group_id: ''
      },
      idStr: '',
      //分组
      file_attachment_group: [],
    }
  },

  created() {
    this.init()
  },

  mounted() {
    //修改宽度
    window.onresize = () => {
      return (() => {
        this.setDialogWidth()
      })()
    }
  },

  updated() {
  },

  //函数
  methods: {
    init() {
    },
    setDialogWidth() {
      var val = document.body.clientWidth
      const def = 650 // 默认宽度
      if (val < def) {
        this.dialogWidth = '60%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    addButtonClick() {
      let sendData = {
        'ids': this.form.fileIds,
        'group_id': this.form.group_id
      }
      file_batch_change_group(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        TipMessage.isOK(res.msg)
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
      this.$emit('batch_ideal_auth_change_dialog')
      this.close()
    },
    showDialog(file_ids) {
      //查询分组
      this.get_group_list();
      var ids = []
      var idStr = ''
      for (let i = 0; i < file_ids.length; i++) {
        ids.push(file_ids[i])
        idStr += ', ' + file_ids[i]
      }
      // console.log('传递过来的 blog_id 印: ', rowData)
      this.form.fileIds = ids
      this.idStr = idStr
      //console.log('this.form.blog_ids: ', this.form.fileIds)
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    get_group_list() {
      let sendData = {
        isAsc: 'desc',  //desc, acs
        sortStr: 'create_time',  //sql排序字段
        pageNum: 1,
        pageSize: 100,
        isDelete: 0
      }
      list_sqlFile_attachment_group(sendData).then(response => {
        let privateObj = response.text
        let jsonData = aesDecrypt2Json(privateObj)
        //console.log('查询结果jsonData', jsonData)
        this.file_attachment_group = jsonData
      }).catch((err) => {
        //Message({ message: ""+err, type: 'error' })
        console.log('请求错误: ', err)
      })
    },
    //==========================底部结束==================================
  },
  beforeDestroy() {
  }

}
</script>
