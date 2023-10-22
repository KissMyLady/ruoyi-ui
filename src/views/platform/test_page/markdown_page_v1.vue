<template>
  <div>

    <div class="box-specialist">
      <div class="box-tips">
        <span class="blue-tag"></span>
        <span>测试模块 markdown v1</span>
      </div>
    </div>

    <div class="tableArea">
      <el-form :inline="true" style="margin-bottom:10px">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-form-item label="标题" style="margin-left: 6px;margin-bottom: 0;"></el-form-item>
            <el-button type="primary" plain
                       @click="getMdData">获取文本</el-button>
            <el-button type="primary" plain
                       @click="setMdData">设置内容</el-button>
          </el-col>
          <el-col :span="12">
            <el-button type="primary"
                       @click="flushTableData"
                       class=""
                       plain>刷新
            </el-button>
          </el-col>
        </el-row>
      </el-form>

      <div>
        <template>
          <v-md-editor v-model="text"
                       @copy-code-success="handleCopyCodeSuccess"
                       height="550px"
          ></v-md-editor>
        </template>
      </div>

      <!-- 分页组件 -->
      <div class="block" style="margin-top: 10px">
        <el-pagination style="text-align: center"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page.sync="dataQuery.page"
                       :page-sizes="[5, 10, 20, 30]"
                       :pager-count="7"
                       :page-size="dataQuery.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       background
                       :total="dataQuery.total"
        >
        </el-pagination>
      </div>

    </div>

  </div>
</template>


<script>

import TipMessage from '@/utils/myUtils/TipMessage'
import clip from '@/components/vab/clipboardVab'
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
      text: '',
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

    },
    handleCopyCodeSuccess(code) {
      clip(code, event)
    },
    copyPath(url, event) {
      clip(url, event)
    },
    getMdData(){
      TipMessage.isOK("获取markdown内容"+this.text);
      console.log("获取markdown内容: ", this.text);
    },
    setMdData(){
      this.text = "Hello World !";
    },
    //==========================底部结束==================================

  }

}
</script>


<style lang="scss" scoped>
.tableArea {
  padding: 10px;
  background: #fff;
  border-radius: 10px;

  .btn-blue {
    background: #1890ff;
    color: #fff;
  }

  .btn-orange {
    background: #f27d49;
    color: #fff;
  }
}

.box-specialist {
  padding: 10px;
  background: #fff;
  border-radius: 10px;
}

.box-tips {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: 600;

  .blue-tag {
    border-radius: 2px;
    margin-right: 8px;
    width: 4px;
    height: 16px;
    background: #1890ff;
  }
}

.box-content {
  ul {
    display: flex;
    width: 100%;
    list-style: none;

    li {
      width: 25%;
    }
  }
}

.list-btn {
  button {
    margin-right: 12px;
  }
}
</style>
