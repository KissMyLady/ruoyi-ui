<template>
  <div class="app-container home">

    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <p>富文本组件测试</p>
        <el-button type="primary" plain
                   @click="uploadFiles"
                   class="el-icon-plus">上传组件</el-button>
<!--        <el-button type="primary"-->
<!--                   @click="saveTinymceData"-->
<!--                   plain class="el-icon-plus">保存内容</el-button>-->
<!--        <tinymce-local ref="getTinymceData"/>-->
      </el-col>
    </el-row>

    <el-divider/>

    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <blockquote class="text-warning" style="font-size: 14px">
          领取阿里云通用云产品1888优惠券
          <br/>
          <el-link
              href="https://www.aliyun.com/minisite/goods?userCode=brki8iof"
              type="primary"
              target="_blank"
          >https://www.aliyun.com/minisite/goods?userCode=brki8iof
          </el-link
          >
          <br/>
          领取腾讯云通用云产品2860优惠券
          <br/>
          <el-link
              href="https://cloud.tencent.com/redirect.php?redirect=1025&cps_key=198c8df2ed259157187173bc7f4f32fd&from=console"
              type="primary"
              target="_blank"
          >https://cloud.tencent.com/redirect.php?redirect=1025&cps_key=198c8df2ed259157187173bc7f4f32fd&from=console
          </el-link
          >
          <br/>
          阿里云服务器折扣区
          <el-link href="http://aly.ruoyi.vip" type="primary" target="_blank"
          >>☛☛点我进入☚☚
          </el-link
          >
          &nbsp;&nbsp;&nbsp; 腾讯云服务器秒杀区
          <el-link href="http://txy.ruoyi.vip" type="primary" target="_blank"
          >>☛☛点我进入☚☚
          </el-link
          >
          <br/>
          <h4 class="text-danger">
            云产品通用红包，可叠加官网常规优惠使用。(仅限新用户)
          </h4>
        </blockquote>

        <hr/>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>若依后台管理框架</h2>
        <p>
          一直想做一款后台管理系统，看了很多优秀的开源项目但是发现没有合适自己的。于是利用空闲休息时间开始自己写一套后台系统。如此有了若依管理系统，她可以用于所有的Web应用程序，如网站管理后台，网站会员中心，CMS，CRM，OA等等，当然，您也可以对她进行深度定制，以做出更强系统。所有前端后台代码封装过后十分精简易上手，出错概率低。同时支持移动客户端访问。系统会陆续更新一些实用功能。
        </p>
        <p>
          <b>当前版本:</b> <span>v{{ version }}</span>
        </p>
        <p>
          <el-tag type="danger">&yen;免费开源</el-tag>
        </p>
        <p>
          <el-button
              type="primary"
              size="mini"
              icon="el-icon-cloudy"
              plain
              @click="goTarget('https://gitee.com/y_project/RuoYi-Vue')"
          >访问码云
          </el-button
          >
          <el-button
              size="mini"
              icon="el-icon-s-home"
              plain
              @click="goTarget('http://ruoyi.vip')"
          >访问主页
          </el-button>
          <el-button @click="test_button_v2">点击测试</el-button>
        </p>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>技术选型</h2>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <h4>后端技术</h4>
            <ul>
              <li>SpringBoot</li>
              <li>Spring Security</li>
              <li>JWT</li>
              <li>MyBatis</li>
              <li>Druid</li>
              <li>Fastjson</li>
              <li>...</li>
            </ul>
          </el-col>
          <el-col :span="6">
            <h4>前端技术</h4>
            <ul>
              <li>Vue</li>
              <li>Vuex</li>
              <li>Element-ui</li>
              <li>Axios</li>
              <li>Sass</li>
              <li>Quill</li>
              <li>...</li>
            </ul>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider/>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>联系信息</span>
          </div>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 官网：
              <el-link
                  href="http://www.ruoyi.vip"
                  target="_blank"
              >http://www.ruoyi.vip
              </el-link
              >
            </p>
            <p>
              <i class="el-icon-user-solid"></i> QQ群：<s> 满937441 </s> <s> 满887144332 </s>
              <s> 满180251782 </s> <s> 满104180207 </s> <s> 满186866453 </s> <s> 满201396349 </s>
              <s> 满101456076 </s> <s> 满101539465 </s> <s> 满264312783 </s> <s> 满167385320 </s>
              <s> 满104748341 </s> <s> 满160110482 </s> <s> 满170801498 </s> <s> 满108482800 </s>
              <s> 满101046199 </s> <s> 满136919097 </s> <a
                href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=0vBbSb0ztbBgVtn3kJS-Q4HUNYwip89G&authKey=8irq5PhutrZmWIvsUsklBxhj57l%2F1nOZqjzigkXZVoZE451GG4JHPOqW7AW6cf0T&noverify=0&group_code=143961921"
                target="_blank"
            >143961921</a>
            </p>
            <p>
              <i class="el-icon-chat-dot-round"></i> 微信：<a
                href="javascript:;"
            >/ *若依</a
            >
            </p>
            <p>
              <i class="el-icon-money"></i> 支付宝：<a
                href="javascript:;"
                class="支付宝信息"
            >/ *若依</a
            >
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>更新日志</span>
          </div>
          <el-collapse accordion>
            <el-collapse-item title="v3.8.6 - 2023-06-30">
              <ol>
                <li>支持登录IP黑名单限制</li>
                <li>新增监控页面图标显示</li>
                <li>操作日志新增消耗时间属性</li>
                <li>屏蔽定时任务bean违规的字符</li>
                <li>日志管理使用索引提升查询性能</li>
                <li>日志注解支持排除指定的请求参数</li>
                <li>支持自定义隐藏属性列过滤子对象</li>
                <li>升级oshi到最新版本6.4.3</li>
                <li>升级druid到最新版本1.2.16</li>
                <li>升级fastjson到最新版2.0.34</li>
                <li>升级spring-boot到最新版本2.5.15</li>
                <li>升级element-ui到最新版本2.15.13</li>
                <li>移除apache/commons-fileupload依赖</li>
                <li>修复页面切换时布局错乱的问题</li>
                <li>修复匿名注解Anonymous空指针问题</li>
                <li>修复路由跳转被阻止时内部产生报错信息问题</li>
                <li>修复isMatchedIp的参数判断产生空指针的问题</li>
                <li>修复用户多角色数据权限可能出现权限抬升的情况</li>
                <li>修复开启TopNav后一级菜单路由参数设置无效问题</li>
                <li>修复DictTag组件value没有匹配的值时则展示value</li>
                <li>优化文件下载出现的异常</li>
                <li>优化选择图标组件高亮回显</li>
                <li>优化弹窗后导航栏偏移的问题</li>
                <li>优化修改密码日志存储明文问题</li>
                <li>优化页签栏关闭其他出现的异常问题</li>
                <li>优化页签关闭左侧选项排除首页选项</li>
                <li>优化关闭当前tab页跳转最右侧tab页</li>
                <li>优化缓存列表清除操作提示不变的问题</li>
                <li>优化字符未使用下划线不进行驼峰式处理</li>
                <li>优化用户导入更新时需获取用户编号问题</li>
                <li>优化侧边栏的平台标题与VUE_APP_TITLE保持同步</li>
                <li>优化导出Excel时设置dictType属性重复查缓存问题</li>
                <li>连接池Druid支持新的配置connectTimeout和socketTimeout</li>
                <li>其他细节优化</li>
              </ol>
            </el-collapse-item>
            <el-collapse-item title="v3.8.5 - 2023-01-01">
              <ol>
                <li>定时任务违规的字符</li>
                <li>重置时取消部门选中</li>
                <li>新增返回警告消息提示</li>
                <li>忽略不必要的属性数据返回</li>
                <li>修改参数键名时移除前缓存配置</li>
                <li>导入更新用户数据前校验数据权限</li>
                <li>兼容Excel下拉框内容过多无法显示的问题</li>
                <li>升级echarts到最新版本5.4.0</li>
                <li>升级core-js到最新版本3.25.3</li>
                <li>升级oshi到最新版本6.4.0</li>
                <li>升级kaptcha到最新版2.3.3</li>
                <li>升级druid到最新版本1.2.15</li>
                <li>升级fastjson到最新版2.0.20</li>
                <li>升级pagehelper到最新版1.4.6</li>
                <li>优化弹窗内容过多展示不全问题</li>
                <li>优化swagger-ui静态资源使用缓存</li>
                <li>开启TopNav没有子菜单隐藏侧边栏</li>
                <li>删除fuse无效选项maxPatternLength</li>
                <li>优化导出对象的子列表为空会出现[]问题</li>
                <li>优化编辑头像时透明部分会变成黑色问题</li>
                <li>优化小屏幕上修改头像界面布局错位的问题</li>
                <li>修复代码生成勾选属性无效问题</li>
                <li>修复文件上传组件格式验证问题</li>
                <li>修复回显数据字典数组异常问题</li>
                <li>修复sheet超出最大行数异常问题</li>
                <li>修复Log注解GET请求记录不到参数问题</li>
                <li>修复调度日志点击多次数据不变化的问题</li>
                <li>修复主题颜色在Drawer组件不会加载问题</li>
                <li>修复文件名包含特殊字符的文件无法下载问题</li>
                <li>修复table中更多按钮切换主题色未生效修复问题</li>
                <li>修复某些特性的环境生成代码变乱码TXT文件问题</li>
                <li>修复代码生成图片/文件/单选时选择必填无法校验问题</li>
                <li>修复某些特性的情况用户编辑对话框中角色和部门无法修改问题</li>
                <li>其他细节优化</li>
              </ol>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>捐赠支持</span>
          </div>
          <div class="body">
            <img
                src="@/assets/images/pay.png"
                alt="donate"
                width="100%"
            />
            <span style="display: inline-block; height: 30px; line-height: 30px"
            >你可以请作者喝杯咖啡表示鼓励</span
            >
          </div>
        </el-card>
      </el-col>
    </el-row>


    <upload-dialog ref="uploadDialog"></upload-dialog>

  </div>
</template>

<script>
import TipMessage from '@/utils/myUtils/TipMessage'
import { aesEncrypt, aesDecrypt } from '@/utils/encrypt/encryption'
import {get_hello_api_v2, get_hello_api_v3} from "@/api/platform/test_api_v2";
import { changeDictToString } from '@/utils/myUtils/changeSomething'
//import tinymceLocal from '@/components/tinymce/tinymceLocal'
import uploadDialog from '@/components/FileUploadDialog'
export default {
  components: {
    //tinymceLocal: tinymceLocal,
    uploadDialog: uploadDialog
  },
  name: 'Index',
  data() {
    return {
      // 版本号
      version: '3.8.6'
    }
  },
  methods: {
    goTarget(href) {
      window.open(href, '_blank')
    },
    test_button_v2() {
      let formData = {
        'id': 1,
        'name': '张三',
        'content': '捕鱼'
      }
      let dict2String = changeDictToString(formData)
      //发起请求, 获取请求
      let sendData = {
        'a': aesEncrypt('1024'),
        'b': aesEncrypt(dict2String),
        'c': aesEncrypt('Hello World !')
      }
      //console.log('sendData: ', sendData)
      get_hello_api_v2(sendData).then((res) => {
        if (res.code !== 200) {
          TipMessage.Warning(res.msg)
          return null
        }
        let privateObj = res.content
        let publicObj = aesDecrypt(privateObj)
        let jsonData = JSON.parse(publicObj)
        TipMessage.isOK(jsonData)
      }).catch((err) => {
        //TipMessage.Error("错误"+ err);
      })
    },
    saveTinymceData(){
      // let tinymceData = this.$refs['getTinymceData'].getData();
      // console.log("输入内容是: ", tinymceData);
    },
    //上传弹出框
    uploadFiles(){
      this.$refs['uploadDialog'].showDialog();
    },
    ///==========================================底部结束==========================================
  }
}
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }

  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }

  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

