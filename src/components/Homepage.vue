<template lang='pug'>
div
  div.couple-names
    div.bridegroom {{$config.bridegroom}}
    div &
    div.bride {{$config.bride}}
  timeline
</template>

<script>
import Timeline from './Timeline'

export default {
  components: {
    Timeline
  },
  create () {
    this.title = this.$config.website
  }
}
</script>

<style lang='stylus' scoped>
@import '../styles/variables.styl'

.couple-names
  margin 0.5em 0 1em
  font-size 48pt
  font-weight lighter
  text-align center

  color $golden
  .bride, .bridegroom
    color $blue
</style>
