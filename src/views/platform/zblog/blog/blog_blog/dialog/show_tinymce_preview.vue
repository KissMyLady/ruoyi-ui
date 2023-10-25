<template>
  <!--任务描述对话框-->
  <el-dialog title="添加"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>

      <el-form ref="form"
               :model="form"
               label-width="100px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="字段1">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段2">
              <el-select v-model="form.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
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

export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '47%',
      form: {}

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
        this.dialogWidth = '90%'
      } else {
        this.dialogWidth = def + 'px'
      }
    },
    addButtonClick() {
      TipMessage.isOK('未开通api')

    },
    showDialog(row) {
      console.log('传递过来的row打印: ', row)
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


<style scoped>
h1 {
  color: #000;
}
</style>
