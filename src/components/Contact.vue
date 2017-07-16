<template lang='pug'>
div.contact-main
  div.page-title {{$config.page.contact}}
  div.contact-item(v-for='item in $config.contact')
    icon.icon(v-bind:name='item.icon' scale='1.33') 
    | {{item.text}}
</template>

<style lang='stylus' scoped>
.page-title
  margin 0.2em 0 0.2em 0.2em
  font-size 24pt
  color gray

.contact-item
  font-size 14pt
  .icon
    margin 0 0.5em
</style>
