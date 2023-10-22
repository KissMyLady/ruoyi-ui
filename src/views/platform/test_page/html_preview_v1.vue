<template>
  <div>

    <div class="box-specialist">
      <div class="box-tips">
        <span class="blue-tag"></span>
        <span>html 预览组件</span>
      </div>
    </div>

    <div class="tableArea">
      <el-form :inline="true" style="margin-bottom:10px">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="标题" style="margin-left: 6px;margin-bottom: 0;">
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-button type="primary"
                       @click="flushTableData"
                       class=""
                       plain
            >刷新
            </el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template>
      <!-- preview-class 为主题的样式类名，例如vuepress就是vuepress-markdown-body -->
      <v-md-preview-html :html="html"
                         preview-class="vuepress-markdown-body"></v-md-preview-html>
    </template>

  </div>
</template>


<script>

import TipMessage from '@/utils/myUtils/TipMessage'

export default {
  components: {},

  data() {
    return {
      tableDataLoading: false,
      //表格数据
      dataTabList: [],
      dataQuery: {
        'isShowDelete': false,
        'total': 1,
        'page': 1,
        'pageSize': 20
      },

      columns: [
        { align: 'center', label: '创建时间', width: 'auto', prop: 'createTime' }
      ],
      html: "<div class=\"markdown-body editormd-html-preview\" id=\"content\" style=\"font-size: 1.1rem;\">\n" +
          "            \n" +
          "  \n" +
          "    \n" +
          "    \n" +
          "  \n" +
          "\n" +
          "          <p>表格内容复制 案例</p>\n" +
          "<div class=\"code-toolbar\"><pre class=\"line-numbers language-html\" tabindex=\"0\"><code class=\"language-html\"><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token tag-id\">el-table-column</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">align</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>center<span class=\"token punctuation\">\"</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">width</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>auto<span class=\"token punctuation\">\"</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">label</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>文件名<span class=\"token punctuation\">\"</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">prop</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>fileName<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token tag-id\">template</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">slot-scope</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>scope<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token tag-id\">el-row</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token tag-id\">el-col</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">:span</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>4<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token tag-id\">el-button</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">tpye</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>text<span class=\"token punctuation\">\"</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token attr-name\">size</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>mini<span class=\"token punctuation\">\"</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token attr-name\">@click</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>copyPath(scope.row.filePath,<span class=\"token space\"> </span>$event)<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span>复制<span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token tag-id\">el-button</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token tag-id\">el-col</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token tag-id\">el-col</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">:span</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>20<span class=\"token punctuation\">\"</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;</span><span class=\"token tag-id\">el-link</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">@click</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>jumpToImageMedia(scope.row.filePath)<span class=\"token punctuation\">\"</span></span><span class=\"token space\"> </span><span class=\"token attr-name\">type</span><span class=\"token attr-value\"><span class=\"token punctuation attr-equals\">=</span><span class=\"token punctuation\">\"</span>primary<span class=\"token punctuation\">\"</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token punctuation\">&gt;</span></span>{{<span class=\"token space\"> </span>scope.row.filePath<span class=\"token space\"> </span>}}<span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token tag-id\">el-link</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token tag-id\">el-col</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token tag-id\">el-row</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token tag-id\">template</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span class=\"token tag\"><span class=\"token tag\"><span class=\"token punctuation\">&lt;/</span><span class=\"token tag-id\">el-table-column</span></span><span class=\"token punctuation\">&gt;</span></span><span class=\"token lf\">\n" +
          "</span><span aria-hidden=\"true\" class=\"line-numbers-rows\"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre><div class=\"toolbar\"><div class=\"toolbar-item\"><button class=\"copy-to-clipboard-button\" type=\"button\" data-copy-state=\"copy\"><span>Copy</span></button></div></div></div>\n" +
          "<p>ji 逻辑</p>\n" +
          "<div class=\"code-toolbar\"><pre class=\"line-numbers language-js\" tabindex=\"0\"><code class=\"language-js\"><span class=\"token keyword keyword-import\">import</span><span class=\"token space\"> </span>clip<span class=\"token space\"> </span><span class=\"token keyword keyword-from\">from</span><span class=\"token space\"> </span><span class=\"token string\">'@/components/vab/clipboardVab'</span><span class=\"token lf\">\n" +
          "</span><span class=\"token lf\">\n" +
          "</span><span class=\"token lf\">\n" +
          "</span><span class=\"token function\">copyPath</span><span class=\"token punctuation\">(</span><span class=\"token parameter\">url<span class=\"token punctuation\">,</span><span class=\"token space\"> </span>event</span><span class=\"token punctuation\">)</span><span class=\"token space\"> </span><span class=\"token punctuation\">{</span><span class=\"token lf\">\n" +
          "</span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token space\"> </span><span class=\"token function\">clip</span><span class=\"token punctuation\">(</span>url<span class=\"token punctuation\">,</span><span class=\"token space\"> </span>event<span class=\"token punctuation\">)</span><span class=\"token lf\">\n" +
          "</span><span class=\"token punctuation\">}</span><span class=\"token lf\">\n" +
          "</span><span aria-hidden=\"true\" class=\"line-numbers-rows\"><span></span><span></span><span></span><span></span><span></span><span></span></span></code></pre><div class=\"toolbar\"><div class=\"toolbar-item\"><button class=\"copy-to-clipboard-button\" type=\"button\" data-copy-state=\"copy\"><span>Copy</span></button></div></div></div>\n" +
          "<p><img alt=\"\" title=\"null\" src=\"/media/2023/10/2023-10-22_094302_787124.png\"></p>\n" +
          "</div>",
    }
  },

  created() {
    this.initialization()
  },

  methods: {
    initialization() {
      this.getTableData()  //初始化表格数据
    },
    //表格数据获取
    getTableData() {
      // this.tableDataLoading = false
      // this.dataTabList = res.data.data.records
      // this.dataQuery.total = res.data.total
    },
    flushTableData() {
      this.getTableData()
      TipMessage.isOK('刷新成功')
    },
    //分页组件
    handleSizeChange(val) {
      this.dataQuery.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.dataQuery.page = val
      this.getTableData()
    },
    modifyCategoryButton(row) {

    }

  }

}
</script>


<style lang="scss" scoped>
</style>
