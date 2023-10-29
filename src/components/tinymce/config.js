// Import plugins that you want to use
// Detail plugins list see: https://www.tiny.cloud/apps/#core-plugins
// Custom builds see: https://www.tiny.cloud/get-tiny/custom-builds/ emoticons

//autoresize不要加入, 否则会缩减高度
export const tinymcePlugins = [
  'advlist anchor autolink ' +
  'autosave charmap code codesample ' +
  'directionality fullpage ' +
  'fullscreen help hr image imagetools ' +
  'insertdatetime link lists media ' +
  'nonbreaking noneditable pagebreak ' +
  'paste preview print save searchreplace ' +
  'spellchecker tabfocus table template ' +
  'textpattern visualblocks visualchars wordcount',
]
// export const tinymcePlugins = [
//   'fullscreen hr link image imagetools autolink ',
// ]
// Here is the list of toolbar control components
// Details see: https://www.tinymce.com/docs/advanced/editor-control-identifiers/#toolbarcontrols
/*
* help
* fontselect styleselect
* media
* */
//我的账户登录:
//toolbar 参考: https://www.tiny.cloud/blog/tinymce-toolbar/
export const tinymceToolbar = [
  'image bold undo redo link italic underline strikethrough link alignleft alignright outdent indent removeformat code searchreplace fullscreen',

  'blockquote codesample  forecolor backcolor formatselect fontsizeselect ',
]
