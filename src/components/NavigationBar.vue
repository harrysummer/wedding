<template lang="pug">
div.pure-menu.pure-menu-horizontal
  router-link.pure-menu-heading(to='/') {{$config.pageShort.homepage}}
  ul.pure-menu-list
    li.pure-menu-item(v-bind:class='{"pure-menu-selected": $route.path === "/wedding"}')
      router-link.font-blue.pure-menu-link(to='/wedding') {{$config.pageShort.wedding}}
    li.pure-menu-item(v-bind:class='{"pure-menu-selected": $route.path === "/guestbook"}')
      router-link.font-blue.pure-menu-link(to='/guestbook') {{$config.pageShort.guestbook}}
    li.pure-menu-item(v-bind:class='{"pure-menu-selected": $route.path === "/contact"}')
      router-link.font-blue.pure-menu-link(to='/contact') {{$config.pageShort.contact}}
  ul.pure-menu-list(style='float: right')
    li.pure-menu-item
      router-link.pure-menu-link(v-if='!isLogin' to='/login') {{$config.page.login}}
      a.pure-menu-link(v-else v-on:click='logout' style='cursor: pointer') 注销
</template>

<script>
import router from '../router'

export default {
  name: 'navigation-bar',
  data () {
    return {
      isLogin: sessionStorage.token !== undefined
    }
  },
  methods: {
    logout () {
      delete sessionStorage.token
      this.isLogin = false
      router.push('/')
    }
  },
  updated () {
    this.isLogin = sessionStorage.token !== undefined
  }
}
</script>

<style lang='stylus' scoped>
@import '../styles/variables.styl'

.pure-menu
  position relative
  background white
  height 40px
  box-shadow 0 0 0.5em gray
  z-index 100

.font-blue
  color $blue
</style>
