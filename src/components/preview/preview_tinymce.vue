<template>
  <!--任务描述对话框-->
  <el-dialog :title="title"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>
      <template>
        <v-md-preview-html :html="tinymce_text"
                           preview-class="vuepress-markdown-body"></v-md-preview-html>
      </template>
    </div>
    <!--确定按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '47%',
      form: {},
      title: '',
      tinymce_text: '',
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
      this.dialogFormVisible = false;
    },
    showDialog(row) {
      //console.log('传递过来的row打印: ', row)
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
