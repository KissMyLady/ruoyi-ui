<template>
  <div>

    <div class="box-specialist">
      <div class="box-tips">
        <span class="blue-tag"></span>
        <span>富文本页面 v1</span>
      </div>
    </div>

    <div class="tableArea">
      <el-row :gutter="20">
        <el-col :sm="24" :lg="24">
          <el-button type="primary" plain
                     @click="uploadFiles"
                     class="el-icon-upload">上传文件
          </el-button>
          <el-button type="primary"
                     @click="saveTinymceData"
                     plain>保存内容
          </el-button>
          <el-button type="primary"
                     @click="setTinymceData"
                     plain>设置内容
          </el-button>
          <tinymce-local ref="getTinymceData"/>
        </el-col>
      </el-row>

      <el-divider/>
    </div>

    <upload-dialog ref="uploadDialog"></upload-dialog>

  </div>
</template>


<script>

import TipMessage from '@/utils/myUtils/TipMessage'
import tinymceLocal from '@/components/tinymce/tinymceLocal'
import uploadDialog from '@/components/FileUploadDialog'

export default {
  components: {
    tinymceLocal: tinymceLocal,
    uploadDialog: uploadDialog
  },
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
      ]
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
    saveTinymceData() {
      let tinymceData = this.$refs['getTinymceData'].getData()
      TipMessage.isOK("保存内容: "+ tinymceData)
    },
    setTinymceData(){
      this.$refs["getTinymceData"].setData("<p>短短的</p>")
    },
    //上传弹出框
    uploadFiles() {
      this.$refs['uploadDialog'].showDialog()
    }
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
