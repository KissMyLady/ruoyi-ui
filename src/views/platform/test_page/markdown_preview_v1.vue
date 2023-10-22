<template>
  <div>

    <div class="box-specialist">
      <div class="box-tips">
        <span class="blue-tag"></span>
        <span>markdown 预览组件</span>
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
      <v-md-preview :text="text"></v-md-preview>
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
      text: "```html\n" +
          "<el-table-column align=\"center\" width=\"auto\" label=\"文件名\" prop=\"fileName\">\n" +
          "  <template slot-scope=\"scope\">\n" +
          "    <el-row>\n" +
          "      <el-col :span=\"4\">\n" +
          "        <el-button tpye=\"text\"\n" +
          "                   size=\"mini\"\n" +
          "                   @click=\"copyPath(scope.row.filePath, $event)\">复制\n" +
          "        </el-button>\n" +
          "      </el-col>\n" +
          "      <el-col :span=\"20\">\n" +
          "        <el-link @click=\"jumpToImageMedia(scope.row.filePath)\" type=\"primary\"\n" +
          "        >{{ scope.row.filePath }}\n" +
          "        </el-link>\n" +
          "      </el-col>\n" +
          "    </el-row>\n" +
          "  </template>\n" +
          "</el-table-column>\n" +
          "```",
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
