import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import { download } from '@/utils/request'

import './assets/icons' // icon
import './permission' // permission control
import { getDicts } from "@/api/system/dict/data";
import { getConfigKey } from "@/api/system/config";
import { parseTime, resetForm, addDateRange, selectDictLabel, selectDictLabels, handleTree } from "@/utils/ruoyi";
import { formatTime, LimitStringShow } from '@/utils';

import VMdEditor from '@kangc/v-md-editor/lib/codemirror-editor';

//v-md-editor
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
// 引入使用主题的样式
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

// codemirror 编辑器的相关资源
import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';

// 按需引入语言包
// import json from 'highlight.js/lib/languages/json'
// import python from 'highlight.js/lib/languages/python'
// import javascript from 'highlight.js/lib/languages/javascript'
// import java from 'highlight.js/lib/languages/java'
// import cpp from 'highlight.js/lib/languages/cpp'
// import bash from 'highlight.js/lib/languages/bash'
// import sql from 'highlight.js/lib/languages/sql'
// import htmlbars from 'highlight.js/lib/languages/htmlbars'

// highlightjs 核心代码
// import hljs from 'highlight.js/lib/core'

// 引入所有语言包
import hljs from 'highlight.js/lib/index';

// hljs.registerLanguage('json', json)
// hljs.registerLanguage('python', python)
// hljs.registerLanguage('javascript', javascript)
// hljs.registerLanguage('java', java)
// hljs.registerLanguage('cpp', cpp)
// hljs.registerLanguage('bash', bash)
// hljs.registerLanguage('sql', sql)
// hljs.registerLanguage('html', htmlbars)

//预览组件
VMdPreview.use(githubTheme, {
  Hljs: hljs,
});
//编辑组件
VMdEditor.Codemirror = Codemirror;
VMdEditor.use(githubTheme, {
  Hljs: hljs,
});

Vue.use(VMdEditor);
Vue.use(VMdPreview); //markdown预览
Vue.use(VMdPreviewHtml);  //html预览

// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreview from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'
import JsonViewer from 'vue-json-viewer';

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.formatTime = formatTime
Vue.prototype.LimitStringShow = LimitStringShow

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreview', ImagePreview)

Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)
Vue.use(JsonViewer);

DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
