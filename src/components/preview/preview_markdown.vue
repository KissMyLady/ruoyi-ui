<template>
  <!--任务描述对话框-->
  <el-dialog :title="name"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>
      <el-button type="primary"
                 @click="copyData(markdown_text, $event)"
                 plain
                 class="el-icon-document-copy">复制内容</el-button>
      <template>
        <v-md-preview :text="markdown_text"></v-md-preview>
      </template>
    </div>
    <!--确定按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="close">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import clip from '@/components/vab/clipboardVab'
export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '60%',
      form: {},
      name: '',
      markdown_text: '',
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
    showDialog(history_data) {
      //console.log("传递过来的history_data: ", history_data);
      this.name = history_data.name;
      this.markdown_text = history_data.preContent;
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    copyData(data, event) {
      clip(data, event)
    },
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
