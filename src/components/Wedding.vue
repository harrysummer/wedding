<template lang='pug'>
div
  div#wedding-overlay: div.pure-g
    div.pure-u-1-1: div.wedding-block
      div.block-title {{$config.title.wedding}}
      div.block-main {{$config.wedding.date}}
      div.block-main {{$config.wedding.date_lunar}}
      div.block-note {{$config.wedding.location}}

    div.pure-u-1-1: div.wedding-block
      div.block-title {{$config.title.schedule}}
      div.pure-g.wedding-schedule
        div.pure-u-1-1.pure-u-md-1-3.schedule-item(v-for='item in $config.schedule')
          div.schedule-time {{item.time}}
          div.schedule-title {{item.title}}
          div.schedule-location(v-if='typeof(item.location) === "string"')
            icon.icon(name='map-marker' scale='1.33')
            | {{item.location}}
          div.schedule-location(v-else-if='typeof(item.location) === "object"')
            icon.icon(name='map-marker' scale='1.33')
            | {{item.location.from}}
            icon(name='long-arrow-right')
            | {{item.location.to}}

    div.pure-u-1-1: div.wedding-block
      div.block-title {{$config.title.attend}}

    div.pure-u-1-1: div.wedding-block
      div.block-title {{$config.title.notes}}
</template>

<style lang='stylus' scoped>
@import '../styles/variables.styl'

#wedding-overlay
  background $bgcolor

.wedding-block
  font-size 36pt
  color darkgray
  margin 0.5em 0 0.5em

  .block-title
    font-size 28pt
  .block-title, .block-note
    color gray
  .block-main
    color $blue
  .block-title, .block-note, .block-main
    text-align center

  .wedding-schedule
    text-align center
    font-size 20pt
    background white
    border solid 1px gray
    margin 0.5em
    padding 0 0.5em 0 0.5em
    .schedule-item
      margin 0 0 1em
      @media screen and (min-width: 48em)
        margin 0 0 0
    .schedule-time
      color gray
    .schedule-title
      color black
      margin 0 0 0.2em
    .schedule-location
      color $blue
      font-size 14pt
      .icon
        margin 0 0.5em
</style>
