<template lang='pug'>
div#app
  navigation-bar
  baidu-map#header-map(
      v-if='$route.path === "/wedding"'
      v-bind:style='{\
        position: scrollAmount <= 40 ? "absolute" : "fixed",\
        top: scrollAmount <= 40 ? "40px" : "0",\
      }'
      :ak='$config.map.key'
      :center='$config.map.marker'
      :zoom='$config.map.zoom'
      :theme='$config.map.theme'
      :dragging='false')
    bm-marker(:position='$config.map.marker')
  div.full-width
    div.main-content
      router-view
  div.footer(v-if='$config.beian')
    a(href='http://www.miitbeian.gov.cn/') {{$config.beian}}
</template>

<script>
import NavigationBar from './components/NavigationBar'
import {BaiduMap, BmMarker} from 'vue-baidu-map'

export default {
  name: 'app',
  data () {
    return {
      scrollAmount: 0
    }
  },
  components: {
    NavigationBar,
    BaiduMap,
    BmMarker
  },
  methods: {
    handleScroll () {
      this.scrollAmount = window.pageYOffset
    }
  },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang='stylus'>
@import './styles/variables.styl'

body
  background-color $bgcolor
  font-family "Noto Sans CJK SC", "Noto Sans CJK", "Source Han Sans SC", "Source Han Sans", "Hiragino Sans GB", "Microsoft YaHei", sans-serif

.full-width
  width 100%
  background-color $bgcolor

.main-content
  max-width $max-width
  margin 0 auto 0 auto

#header-map
  z-index -10
  width 100%
  height 300px

.footer
  margin 20px 0 20px
  text-align center
  font-size 10pt
  a:link, a:hover, a:visited, a:active
    color #333
    text-decoration none
</style>
