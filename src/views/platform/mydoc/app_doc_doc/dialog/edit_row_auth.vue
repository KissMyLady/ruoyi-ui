<template>
  <!--任务描述对话框-->
  <el-dialog title="修噶数据权限"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>

      <el-form ref="form"
               :model="form"
               label-width="100px"
      >
        <el-form-item label="数据权限">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选
          </el-checkbox>
          <el-tree class="tree-border"
                   :data="deptList"
                   show-checkbox
                   default-expand-all
                   ref="dept"
                   node-key="id"
                   :check-strictly="true"
                   empty-text="加载中，请稍候"
                   :props="defaultProps"
          ></el-tree>
        </el-form-item>

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
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '@/api/system/dept'

import { get_dept_tree } from '@/api/platform/common/dept/CommonUserDeptRoleCtrl'
import { batchSaveOrUpdate_api } from '@/api/platform/userAuth/sys_table_authority_row/SysTableAuthCtrl'

export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '47%',
      form: {},
      rowIds: [],

      //选中的权限id

      //部门列表
      deptList: [],
      deptExpand: true,
      deptNodeAll: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },

  created() {
    //  this.init()
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
    //加载数据权限岗位表
    loadAuthDept() {
      this.loading = true
      get_dept_tree(this.queryParams).then(response => {
        //let treeData = this.handleTree(response.data, 'deptId');
        // console.log("打印treeData: ", treeData);
        this.deptList = response.rows
        this.loading = false
      }).catch((error) => {
        this.loading = false
        console.log('加载数据权限岗位表失败 ' + error)
      })
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
    list2String(listInt){
      var strV1 = "";
      for (let i=0; i<listInt.length; i++){
        strV1 = strV1 + listInt[i] + ",";
      }
      return strV1;
    },
    //确认点击
    addButtonClick() {
      let rowIds = this.$refs.dept.getCheckedKeys()
      //发送数据 batchSaveOrUpdate_api
      let sendData = {
        'tableName': 'app_doc_doc',
        'dbIdName': 'id',
        'needDeptId': rowIds.join(","),
        'ids': this.rowIds
      }
      batchSaveOrUpdate_api(sendData).then(response => {
        console.log('返回结果: ', response)
        this.loading = false
        this.close()
      }).catch((error) => {
        this.loading = false
        console.log('加载数据权限岗位表失败 ' + error);
      })
    },
    showDialog(row) {
      this.rowIds = row;
      console.log('传递过来的row打印: ', row)
      //加载当前数据行, 有哪些岗位

      //加载岗位数据
      this.loadAuthDept()
      //展示弹出框
      this.dialogFormVisible = true
    },

    close() {
      this.dialogFormVisible = false

      this.$emit('editRowAuth')
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      let treeList = this.deptOptions
      for (let i = 0; i < treeList.length; i++) {
        this.$refs.dept.nodesMap[treeList[i].id].expanded = value
      }
    },
    handleCheckedTreeExpand_v2(value) {
      console.log('展开按钮点击', this.$refs)
      console.log('value', value)
      this.deptExpand = false
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      console.log('this.$refs.打印: ', this.$refs)
      this.$refs.dept.setCheckedNodes(value ? this.deptOptions : [])
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
