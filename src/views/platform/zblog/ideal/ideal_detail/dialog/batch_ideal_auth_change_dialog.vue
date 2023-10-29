<template>
  <!--任务描述对话框-->
  <el-dialog title="文档权限修改"
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
            <el-form-item label="文集权限选择">
              <el-radio-group v-model="form.authorityCode">
                <el-radio label="0" border>0 公 开</el-radio>
                <el-radio label="1" border>1 私 密</el-radio>
                <el-radio label="2" border>2 指定用户可见</el-radio>
                <el-radio label="3" border>3 访问码可见</el-radio>
                <el-radio label="9" border>9 超级管理员可见</el-radio>
              </el-radio-group>
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
import { ideal_batchChangeAuth } from '@/api/platform/zblog/ideal/ideal_authority'
import { changeDictToString } from '@/utils/myUtils/changeSomething'
import { aesEncrypt } from '@/utils/encrypt/encryption'

export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '37%',
      form: {
        blogIds: [],
        authorityCode: ''
      },
      idStr: ''
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
        'ids': this.form.blogIds,
        'code': this.form.authorityCode
      }
      ideal_batchChangeAuth(sendData).then((res) => {
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
    showDialog(blog_ids) {
      var ids = []
      var idStr = ''
      for (let i = 0; i < blog_ids.length; i++) {
        ids.push(blog_ids[i])
        idStr += ', ' + blog_ids[i]
      }
      // console.log('传递过来的 blog_id 印: ', rowData)
      this.form.blogIds = ids
      this.idStr = idStr
      console.log('this.form.blog_ids: ', this.form.blogIds)
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    }
  },
  beforeDestroy() {
  }

}
</script>
