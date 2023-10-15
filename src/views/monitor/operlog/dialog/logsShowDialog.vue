<template>
  <!--任务描述对话框-->
  <el-dialog title="自动日志详情"
             :width="dialogWidth"
             :visible.sync="dialogFormVisible"
             @close="close"
  >
    <div>
      <el-descriptions class="margin-top"
                       :column="3"
                       size="small"
                       border>
<!--        <el-descriptions-item>-->
<!--          <template slot="label"><i class="el-icon-user"></i>主键ID</template>-->
<!--          {{ form.operId }}-->
<!--        </el-descriptions-item>-->
        <el-descriptions-item>
          <template slot="label"><i class="el-icon-user"></i>操作人</template>
          <el-tag  effect="dark" v-if="form.operName == 'admin'">{{ form.operName }}</el-tag>
          <el-tag v-else>{{ form.operName }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-mobile-phone"></i>创建时间</template>
          {{ parseTime(form.operTime) }} <br/>{{ formatTime(form.operTime) }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-location-outline"></i>请求头</template>
          {{ form.reqAgent }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-location-outline"></i>浏览器</template>
          {{ form.reqSystem }} {{ form.reqBrowser }}
        </el-descriptions-item>

<!--        <el-descriptions-item>-->
<!--          <template slot="label"><i class="el-icon-location-outline"></i>操作系统</template>-->
<!--        </el-descriptions-item>-->

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-location-outline"></i>Ip</template>
          {{ form.operIp }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-location-outline"></i>地址</template>
          {{ form.operLocation }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-mobile-phone"></i>请求耗时</template>
          {{ form.costTime }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-mobile-phone"></i>请求标题</template>
          {{ form.title }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label"><i class="el-icon-mobile-phone"></i>请求类型</template>
          <el-tag size="small">{{ form.requestMethod }}</el-tag>
        </el-descriptions-item>

        <el-descriptions-item :span="3">
          <template slot="label"><i class="el-icon-tickets"></i>请求方法</template>
          {{ form.method }}
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template slot="label"><i class="el-icon-office-building"></i>请求参数</template>
          <JsonViewer :expand-depth=5
                      copyable
                      boxed
                      sort
                      :value="toJson(form.operParam)"
                  />
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <template slot="label"><i class="el-icon-office-building"></i>返回参数</template>
          <JsonViewer :expand-depth=5
                      copyable
                      boxed
                      sort
                      :value="toJson(form.jsonResult)"
          />
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!--确定按钮-->
    <div slot="footer" class="dialog-footer">
      <el-button type="success" @click="dialogFormVisible=false">关闭</el-button>
    </div>
  </el-dialog>

</template>

<script>
import { formatTime } from '@/utils'
import { parseTime } from '@/utils/ruoyi'

export default {
  //组件
  components: {},
  data() {
    return {
      dialogFormVisible: false,
      dialogWidth: '47%',
      form: {
        'createTime': '',
        'updateBy': '',
        'updateTime': '',
        'timeStamp': '',
        'operId': '',
        'title': '',
        'businessType': '',
        'businessTypes': '',
        'method': '',
        'requestMethod': '',
        'operatorType': '',
        'operName': '',
        'deptName': '',
        'operUrl': '',
        'operIp': '',
        'operLocation': '',
        'operParam': '',
        'jsonResult': '',
        'status': '',
        'errorMsg': '',
        'operTime': '',
        'reqAgent': '',
        'reqBrowser': '',
        'reqSystem': '',
        'costTime': ''
      }
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
    formatTime,
    parseTime,

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
    showDialog(data) {
      this.form = data
      this.dialogFormVisible = true
    },
    close() {
      this.dialogFormVisible = false
    },
    //转json格式
    toJson(jsonData){
      try {
        if(jsonData !== undefined && jsonData !== null && jsonData !== "{}"){
          let jData = JSON.parse(jsonData);
          // console.log("转换后的json: ", jData);
          return jData;
        }
        return {}
      }catch (error){
        console.log("转换json失败: ", error);
        return jsonData;
      }

    },
  },
  beforeDestroy() {
  },

}
</script>


<style scoped>
h1 {
  color: #000;
}
</style>
