<template>
  <div class="markdown">
    <v-md-preview :text="text"></v-md-preview>/>
  </div>
</template>


<script>
//http://ckang1229.gitee.io/vue-markdown-editor/zh/examples/codemirror-editor.html
import VMdPreview from '@kangc/v-md-editor/lib/preview'


export default {
  name: 'ok-v-md-editor',
  components: {
    VMdPreview: VMdPreview
  },

  data() {
    return {
      text: '',
      height: '550px'

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
      return this.content
    },

    setThisMarkdown(data) {
      this.content = data
    }

  }

}
</script>


<style lang="scss" scoped>

</style>
