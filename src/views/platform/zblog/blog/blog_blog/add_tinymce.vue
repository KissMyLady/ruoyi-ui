<template>
  <div class="app-container">

    <div class="box-specialist">
      <div class="box-tips">
        <span class="blue-tag"></span>
        <span>富文本添加</span>
      </div>
    </div>

    <div>
      <tinymce-local ref="getTinymceData"/>
    </div>

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
      ],
      blog_detail: {
        'id': '',
        'projectId': '',
        'userId': '',
        'parentBlog': '',
        'name': '',
        'editorMode': '',
        'content': '',
        'preContent': '',
        'sort': '',
        'status': '',
        'editOpenChildren': '',
        'showOpenChildren': '',
        'authorityCode': '',
        'authorityValue': '',
        'isWatermark': '',
        'watermarkType': '',
        'watermarkValue': '',
        'visitor': '',
        'isDelete': ''
      }
      //==========================底部结束==================================
    }
  },

  created() {
    //获取url携带的 project_id 参数
    let detailId = this.$route.query.project_id
    TipMessage.isOK("url获取detailId: "+ detailId)
    if (detailId == null) {
      this.blog_detail.projectId = ''
    } else {
      this.blog_detail.projectId = detailId
    }

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
