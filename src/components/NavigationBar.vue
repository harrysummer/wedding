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
</template>

<script>
export default {
  name: 'navigation-bar'
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

.pure-menu-link
  color $blue
</style>
