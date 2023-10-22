<template>
  <div class="markdown">
    <VueMarkdownEditor v-model="content"
                       height="550px"
                       :mode="mode"
                       :tab-size="4"
                       placeholder="Md文档编辑器"/>
  </div>
</template>

<script>
//import VueMarkdownEditor from '@kangc/v-md-editor';

export default {
  name: 'v-md-editor',
  components: {
    //VueMarkdownEditor: VueMarkdownEditor
  },

  data() {
    return {
      content: "",
      height: "550px",
      mode: "edit",  //edit, editable, preview
    }
  },
  created() {
  },

  mounted() {
  },
  methods: {
    init() {
    },
    getData() {
      return this.content;
    },
    setThisMarkdown(data) {
      this.content = data;
    },
    //==========================底部结束==================================
  }
}
</script>

<style lang="scss" scoped>

</style>
