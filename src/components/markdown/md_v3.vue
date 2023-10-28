<template>
	<div class="markdown-editor-box">

		<link rel="stylesheet" href="/editor.md/css/editormd.min.css">
		<link rel="stylesheet" href="/editor.md/css/editormd.preview.css">

		<div :id="editorId" style="touch-action:none"></div>
	</div>
</template>
<script>
import scriptjs from 'scriptjs'
import { defaultConfig } from '@/assets/editorMdConfig'

export default {
	props: {
		editorId: {
			'type': String,
			'default': 'markdown-editor'
		},
		onchange: { // 内容改变时回调，返回（html, markdown, text）
			type: Function
		},
		config: { // 编辑器配置
			type: Object
		},
		initData: {
			'type': String
		},
		initDataDelay: {
			'type': Number, // 延迟初始化数据时间，单位毫秒
			'default': 0
		}
	},
	data: function() {
		return {
			content: null,
			editor: null,
			timer: null,
			doc: {},
			jsLoadOver: false,
		}
	},

	created() {
		this.initEditor('')
	},

	mounted: function() {

	},

	methods: {
		initEditor: function(markdown) {
			let vm = this
			let config = vm.getConfig()
			if (markdown != '') {
				config.markdown = markdown
			}
			(async() => {
				await vm.fetchScript('/editor.md/jquery.min.js')
				await vm.fetchScript('/editor.md/editormd.min.js')
				// this.jsLoadOver = true
				vm.editor = window.editormd(vm.editorId, config)
			})()
		},

		fetchScript: function(url) {
			return new Promise((resolve) => {
				scriptjs(url, () => {
					resolve()
				})
			})
		},
		getConfig() {
			return { ...defaultConfig, ...this.config }
		},
		getEditor: function() {
			return this.editor
		},
		getDoc: function() {
			return this.doc
		},
		getHTML: function() {
			return this.editor.getHTML()
		},
		getMarkdown: function() {
			return this.editor.getMarkdown()
		},

		setMdData(data) {
			this.initEditor(data)
			return this.editor.setMarkdown(data)
		},

		setMarkdown: function(markdown) {
			let ok = this.editor.setMarkdown(markdown)
			console.log('设置md文档数据: ', ok)
			return ok
		}

	},

	destroyed: function() {
		// console.log('destroyed 执行')
	}

}
</script>
