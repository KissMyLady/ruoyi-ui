<template>
  <!--aPlayer 播放器-->
  <div>
    <!--music：当前播放的音乐。 list：播放列表 ：showlrc：是否显示歌词-->
    <aplayer v-if="showPlay"
             style="width: 80%"
             :music="nowPlay"
             :list="audio"
             repeat="repeat-all"
             :listFolded="true"
             :show-lrc="false"
    />
    <div v-else style="height: 67px">
    </div>
  </div>
</template>
<script>
import aplayer from 'vue-aplayer'
import TipMessage from '@/utils/myUtils/TipMessage'
export default {
  //组件
  components: {
    aplayer: aplayer
  },
  data() {
    return {
      dialogFormVisible: false,
      playIndex: 0,
      isAutoplay: false,
      // 音频列表
      audio: [],
      nowPlay: [],
      //是否展示播放器
      showPlay: false
    }
  },
  created() {
    this.init()
  },
  //函数
  methods: {
    init() {
      this.showPlay = false
    },
    playClick(index) {
      this.playIndex = index
      this.nowPlay = this.audio[index]
    },
    //设置播放列表
    reSetMusicList(musicData) {
      this.showPlay = false
      this.audio = []
      this.playIndex = 0
      this.nowPlay = []
      let timer
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        this.audio = musicData
        this.nowPlay = musicData[0]
        this.showPlay = true
      }, 500)
    }
  },
  //==========================底部结束==================================
}
</script>
