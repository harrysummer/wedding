<template lang='pug'>
div.timeline(
    v-if='posts && posts.length'
    v-bind:style='{\
      visibility: visible ? "visible" : "hidden",\
      height: totalHeight + "px"\
    }')
  div.timeline-header(
      ref='timelineHeader'
      v-bind:style='{\
        position: scrollAmount >= -heartPosition ? "fixed" : "absolute",\
        top: scrollAmount >= -heartPosition ? heartPosition + "px" : "0"\
      }'): icon(name='heart' scale='3')
  div.timeline-line(
      ref='timelineLine'
      v-bind:style='{\
        top: scrollAmount >= -heartPosition ? scrollAmount + heartPosition + 24 + "px" : "24px"\
      }')
  div.timeline-mask(
      v-bind:style='{visibility: scrollAmount >= -heartPosition ? "visible" : "hidden" }')
    div.timeline-mask-header: icon(name='heart' scale='3')
    div.timeline-mask-line
  div.timeline-icon(
    v-for='post of posts'
    v-if='post.icon'
    v-bind:style='{top: (itemPositions[post._id] || 0) - 9 + "px"}'): icon(:name='post.icon' scale='2')

  div.timeline-item(
      v-for='post of posts'
      v-if='post.type !== "icon"'
      :ref='post._id'
      v-bind:class='{\
        "timeline-item-bride": post.type === "bride",\
        "timeline-item-bridegroom": post.type === "bridegroom",\
        "timeline-item-shared": post.type === "shared"\
      }'
      v-bind:style='{top: (itemPositions[post._id] || 0) + "px"}')
    div.timeline-type {{ {
      |   bride: $config.bride_short,
      |   bridegroom: $config.bridegroom_short,
      |   shared: $config.bridegroom_short + '&' + $config.bride_short
      | }[post.type] }}
    div.timeline-title(v-if='post.title') {{ post.title }}
    div.timeline-date(v-if='post.date') {{ post.date }}
    img.timeline-image(v-if='post.photos && post.photos.length == 1' v-lazy='"/api/photo/" + post.photos[0]')
    div.timeline-content(v-if='post.content' v-html='marked(post.content)')
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import $ from 'jquery'
import Han from 'han-css'

export default {
  name: 'timeline',
  data () {
    return {
      marked,
      posts: [],
      errors: [],
      visible: false,
      itemMinGap: 40,
      itemMinOffset: 48,
      heartPosition: 20,
      marginTop: 148,
      marginBottom: 50,
      scrollAmount: -51,
      itemPositions: {},
      totalHeight: 0
    }
  },
  methods: {
    handleScroll () {
      this.scrollAmount = window.scrollY - $(this.$el).offset().top
    },
    layout () {
      var smallScreen = $(window).width() < 768

      // Get the height of every item
      var heights = {}
      var i, post, postDOM
      for (i = 0; i < this.posts.length; i++) {
        post = this.posts[i]
        if (post.type === 'icon') continue
        postDOM = this.$refs[post._id][0]
        heights[post._id] = $(postDOM).outerHeight()
      }

      // Calculate the layout
      var leftPos = this.marginTop
      var rightPos = leftPos
      var lastLeftPos = 0
      var lastRightPos = 0
      var maxPos
      var alignPrevious = false
      for (i = 0; i < this.posts.length; i++) {
        post = this.posts[i]
        alignPrevious = i > 0 && this.posts[i - 1].key - this.posts[i].key <= 10
        if (post.type === 'bridegroom') {
          leftPos = Math.max(leftPos, lastRightPos + (alignPrevious ? 0 : this.itemMinOffset))
          this.itemPositions[post._id] = leftPos
          lastLeftPos = leftPos
          leftPos += heights[post._id] + this.itemMinGap
          if (smallScreen) rightPos = leftPos
        } else if (post.type === 'bride') {
          rightPos = Math.max(rightPos, lastLeftPos + (alignPrevious ? 0 : this.itemMinOffset))
          this.itemPositions[post._id] = rightPos
          lastRightPos = rightPos
          rightPos += heights[post._id] + this.itemMinGap
          if (smallScreen) leftPos = rightPos
        } else if (post.type === 'shared') {
          maxPos = Math.max(leftPos, rightPos)
          this.itemPositions[post._id] = maxPos
          leftPos = rightPos = maxPos + heights[post._id] + this.itemMinGap
        } else if (post.type === 'icon') {
          maxPos = Math.max(leftPos, rightPos) + 50
          this.itemPositions[post._id] = maxPos
          leftPos = rightPos = maxPos + this.itemMinGap + 50
        }
      }
      this.totalHeight = Math.max(leftPos, rightPos) + this.marginBottom
    }
  },
  created () {
    axios.get('/api/posts')
      .then(response => {
        if (response.data && response.data.error) {
          this.errors.push(response.data.error.message)
        } else {
          this.posts = response.data
        }
        this.$Lazyload.$on('loaded', this.layout)
      })
      .catch(e => {
        this.errors.push(e.message)
      })
      .then(() => this.$nextTick())
      .then(() => Han(document.querySelector('.timeline-content')).render())
      .then(() => this.$nextTick())
      .then(() => {
        if (this.posts) {
          this.layout()
        }
        this.visible = true
      })
      .then(() => this.$nextTick())
      .then(() => {
        if (this.posts) {
          window.addEventListener('scroll', this.handleScroll)
          window.addEventListener('resize', this.layout)
        }
      })
  },

  destroyed () {
    if (this.posts) {
      window.removeEventListener('scroll', this.handleScroll)
      window.removeEventListener('resize', this.layout)
      this.$Lazyload.$off('loaded', this.layout)
    }
  }
}
</script>

<style lang='stylus' scoped>
@import '../styles/variables.styl'

.timeline
  position relative

  .timeline-header
    margin 0 0 0 0
    width 100%
    left 0
    right 0
    text-align center
    color $golden

  .timeline-line
    position absolute
    left 0
    right 0
    margin 0 auto
    bottom 0
    width 8px
    background $golden

  .timeline-icon
    position absolute
    width 32px
    height 32px
    padding 8px
    left 50%
    transform translate(-50%, 0)
    color $golden
    background $bgcolor
    text-align center
    vertical-align middle
    .fa-icon
      margin auto

  .timeline-mask
    position fixed
    top 0
    left 0
    right 0
    height 20px+48px+20px
    background linear-gradient(to bottom, $bgcolor, $bgcolor 68px, $bgcolortransparent)
    z-index 100
    .timeline-mask-header
      position absolute
      text-align center
      top 20px
      width 100%
      color $golden
    .timeline-mask-line
      position absolute
      top 20px+24px
      width 8px
      left 0
      right 0
      margin 0 auto
      bottom 0
      background linear-gradient(to bottom, $golden, $golden 24px, $goldentransparent)

  .timeline-item
    box-sizing border-box
    position absolute
    border 1px solid lightgray
    padding 20px
    background white

    .timeline-title
      font-size 18pt
      margin-left -8pt

    .timeline-type
      margin-top -8px
      float right
      color lightgray

    .timeline-date
      font-size 10pt
      color darkgray

    .timeline-image
      width 100%

    .timeline-content
      font-size 12pt

  @media screen and (min-width: 48em)
    .timeline-item-bride:before
      content ""
      position absolute
      width 0
      height 0
      top 0
      left 0
      border solid 15px transparent
      border-right-color lightgray
      margin 0 0 0 -30px
    .timeline-item-bride:after
      content ""
      position absolute
      width 0
      height 0
      top 0
      left 0
      border solid 15px transparent
      border-right-color white
      margin 0 0 0 -29px
    .timeline-item-bridegroom:before
      content ""
      position absolute
      width 0
      height 0
      top 0
      right 0%
      border solid 15px transparent
      border-left-color lightgray
      margin 0 -30px 0 0
    .timeline-item-bridegroom:after
      content ""
      position absolute
      width 0
      height 0
      top 0
      right 0%
      border solid 15px transparent
      border-left-color white
      margin 0 -29px 0 0

  .timeline-item-bridegroom

  .timeline-item-shared
    width 100%

  .timeline-item-bride, .timeline-item-bridegroom
    width 80%
    @media screen and (min-width: 48em)
      width 45%

  .timeline-item-bride
    left auto
    right 0
</style>
