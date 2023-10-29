module.exports = {
  presets: [
    // https://github.com/vuejs/vue-cli/tree/master/packages/@vue/babel-preset-app
    '@vue/cli-plugin-babel/preset'
  ],
  'env': {
    'development': {
      // babel-plugin-dynamic-import-node plugin only does one thing by converting all import() to require().
      // This plugin can significantly increase the speed of hot updates, when you have a large number of pages.
      // 显著提高热更新的速度，特别是在有大量页面的项目中。
      'plugins': [
        'dynamic-import-node',
        ["prismjs", {
          "languages": ["javascript", "css", "markup", "python", "java", "cpp", "shell"],
          "plugins": ["line-numbers", "copy-to-clipboard"], //配置显示行号插件
          "theme": "coy", //主体名称
          "css": true
        }]
      ]
    }
  }
}
