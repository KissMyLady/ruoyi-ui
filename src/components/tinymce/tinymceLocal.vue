<template>

  <div class="tinymce-container">
    <!--富文本,本地渲染,不需要网络加载-->
    <editor api-key="0gxtokd1ebq1qi7h5h0qivrsh6sk0re38i0ym6onoa954l33"
            v-model="tinymceDatabase"
            :init="tinymceData"/>
  </div>

</template>


<script>
// vue参考文档: https://www.tiny.cloud/docs/integrations/vue/
import {tinymcePlugins, tinymceToolbar} from "./config";
import Editor from '@tinymce/tinymce-vue';

import "/public/tinymce/tinymce";
// Default icons are required for TinyMCE 5.3 or above
import "/public/tinymce/icons/default";
// Import themes
import "/public/tinymce/themes/silver";
import "/public/tinymce/themes/mobile";
// Any plugins you want to use has to be imported
import "/public/tinymce/plugins/advlist";
import "/public/tinymce/plugins/anchor";
import "/public/tinymce/plugins/autoresize";
import "/public/tinymce/plugins/autolink";
import "/public/tinymce/plugins/autosave";
import "/public/tinymce/plugins/charmap";
import "/public/tinymce/plugins/code";
import "/public/tinymce/plugins/codesample";
import "/public/tinymce/plugins/directionality";
import "/public/tinymce/plugins/emoticons";
import "/public/tinymce/plugins/fullpage";
import "/public/tinymce/plugins/fullscreen";
import "/public/tinymce/plugins/help";
import "/public/tinymce/plugins/hr";
import "/public/tinymce/plugins/image";
import "/public/tinymce/plugins/imagetools";
import "/public/tinymce/plugins/insertdatetime";
import "/public/tinymce/plugins/link";
import "/public/tinymce/plugins/lists";
import "/public/tinymce/plugins/media";
import "/public/tinymce/plugins/nonbreaking";
import "/public/tinymce/plugins/noneditable";
import "/public/tinymce/plugins/pagebreak";
import "/public/tinymce/plugins/paste";
import "/public/tinymce/plugins/preview";
import "/public/tinymce/plugins/print";
import "/public/tinymce/plugins/save";
import "/public/tinymce/plugins/searchreplace";
import "/public/tinymce/plugins/spellchecker";
import "/public/tinymce/plugins/tabfocus";
import "/public/tinymce/plugins/table";
import "/public/tinymce/plugins/template";
import "/public/tinymce/plugins/textpattern";
import "/public/tinymce/plugins/visualblocks";
import "/public/tinymce/plugins/visualchars";
import "/public/tinymce/plugins/wordcount";


export default {
  name: "Tinymce22",
  components: {
    'editor': Editor
  },

  data() {
    return {
      tinymceDatabase: "",  //富文本数据
      tinymcePlugins: tinymcePlugins,
      tinymceToolbar: tinymceToolbar,

      //本地引入参考文档: https://segmentfault.com/a/1190000018358304
      tinymceData : {
        language:'zh_CN',
        height: 570,
        code_dialog_height: 450,
        code_dialog_width: 1000,
        skin_url: '/tinymce/skins/ui/oxide',
        language_url: '/tinymce/langs/zh_CN.js',
        menubar: false,  //顶部菜单栏, 一定要打开的
        plugins: tinymcePlugins,  //插件
        toolbar: tinymceToolbar,  //顶部栏
        advlist_bullet_styles: 'squar',
        advlist_number_styles: 'default',
        default_link_target: '_blank',
        link_title: true,
        nonbreaking_force_tab: false,
        convert_urls: true,
      },
    }
  },

  methods: {
    //子组件调用父组件, 返回创建的数据
    getTinymceData(){
      return this.tinymceDatabase;
    },
    setTinymceData(data){
      //富组件调用, 回写数据到富文本
      console.log("富组件调用, 回写数据到富文本: ", data);
      this.tinymceDatabase = data;
    },
    //子组件调用父组件, 返回创建的数据
    getData(){
      return this.tinymceDatabase;
    },
    setData(data){
      //富组件调用, 回写数据到富文本
      this.tinymceDatabase = data;
    },
  }
}
</script>


<style lang="scss" scoped>

.tinymce-container {
  position: relative;
  line-height: normal;
  margin: 6px;

  .mce-fullscreen {
    z-index: 10000;
  }
}

.editor-custom-btn-container {
  position: absolute;
  right: 6px;
  top: 6px;
  z-index: 1002;
}

.fullscreen .editor-custom-btn-container {
  z-index: 10000;
  position: fixed;
}

.editor-upload-btn {
  display: inline-block;
}

textarea {
  visibility: hidden;
  z-index: -1;
}
</style>
