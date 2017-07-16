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
  ul.pure-menu-list(v-if='!isLogin' style='position: absolute; right: 0; top: 0')
    li.pure-menu-item
      router-link.pure-menu-link(to='/login') {{$config.pageShort.login}}
  ul.pure-menu-list(v-else style='position: absolute; right: 0; top: 0')
    li.pure-menu-item.pure-menu-has-children.pure-menu-allow-hover
      a.pure-menu-link(href='#') {{username}}
      ul.pure-menu-children
        li.pure-menu-item(v-if='permissions.includes("post:create") || \
                                permissions.includes("post:edit") || \
                                permissions.includes("post:remove")')
          router-link.pure-menu-link(to='/admin/posts') {{$config.pageShort.adminPosts}}
        li.pure-menu-item(v-if='permissions.includes("photo:create") || \
                                permissions.includes("photo:remove")')
          router-link.pure-menu-link(to='/admin/photos') {{$config.pageShort.adminPhotos}}
        li.pure-menu-item(v-if='permissions.includes("attendee:create") || \
                                permissions.includes("attendee:edit") || \
                                permissions.includes("attendee:remove")')
          router-link.pure-menu-link(to='/admin/attendee') {{$config.pageShort.adminAttendee}}
        li.pure-menu-item(v-if='permissions.includes("guestbook:reply") || \
                                permissions.includes("guestbook:remove")')
          router-link.pure-menu-link(to='/admin/guestbook') {{$config.pageShort.adminGuestbook}}
        li.pure-menu-item(v-if='permissions.includes("user:create") || \
                                permissions.includes("user:edit") || \
                                permissions.includes("user:remove")')
          router-link.pure-menu-link(to='/admin/users') {{$config.pageShort.adminUsers}}
        li.pure-menu-item
          a.pure-menu-link(v-on:click='logout' style='cursor: pointer') {{$config.pageShort.logout}}
</template>

<script>
import jwtDecode from 'jwt-decode'
import router from '../router'

export default {
  name: 'navigation-bar',
  data () {
    return {
      isLogin: false,
      username: '',
      permissions: []
    }
  },
  created () {
    this.isLogin = sessionStorage.token !== undefined
    if (this.isLogin) {
      var key = jwtDecode(sessionStorage.token)
      this.username = key.username
      this.permissions = key.permissions
    }
  },
  updated () {
    var isLoginNew = sessionStorage.token !== undefined
    if (this.isLogin !== isLoginNew) {
      this.isLogin = isLoginNew
      var key = jwtDecode(sessionStorage.token)
      this.username = key.username
      this.permissions = key.permissions
    }
  },
  methods: {
    logout () {
      delete sessionStorage.token
      this.isLogin = false
      router.push('/')
    }
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
