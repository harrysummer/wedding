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
      div.content-subtitle 交通方式
      ul.content-text
        li
          icon(name='train')
          | 火车：外地前来参加婚礼首选交通方式，可乘坐至合肥或合肥南站，再任意换乘一班最近的火车，几十分钟内即可抵达巢湖站或巢湖东站。如提前购买车票，请确认中转站是合肥站还是合肥南站，再购买相应车票，购买合肥至巢湖车票时，最好买安徽省内发车的班次，以防火车晚点；
        li
          icon(name='car')
          | 自驾：距离巢湖市区最近的出口，位于芜合高速公路(G5011)的半汤出口，下高速后10分钟车程即可抵达市区。如从您合肥市区出发，可沿巢湖北岸滨湖观光大道直抵巢湖市区，全程约1.5小时；
        li
          icon(name='plane')
          | 飞机：距离巢湖市区最近的机场是合肥新桥国际机场，其次是南京禄口国际机场。

      div.content-subtitle 住宿信息
      div.content-text
        p 由于大多数参加婚礼的嘉宾均为本地人，因此没有承包酒店客房。如果需要住宿，请与我们联系，我们将安排预定。

    div.pure-u-1-1: div.wedding-block
      div.block-title {{$config.title.notes}}
      ul.content-text
        li
          icon.heart(name='heart')
          | 由于近期事务繁忙，难免有疏漏之处，请见谅。如果您准备参加婚礼却没有收到请柬，请与我们联系；
        li
          icon.heart(name='heart')
          | 由于北京的同学朋友众多，会在今年9-10月左右在北京再举行一场宴席，欢迎北京的亲们届时光临！
</template>

<script>
import Han from 'han-css'

export default {
  updated () {
    Han(document.querySelector('.content-text p, .content-text li')).render()
  }
}
</script>
<style lang='stylus' scoped>
@import '../styles/variables.styl'

#wedding-overlay
  background $bgcolor
  margin-top 300px

.wedding-block
  font-size 28pt
  color darkgray
  margin 0.5em 0 0.5em

  .block-title
    font-size 24pt
  .block-title, .block-note
    color gray
  .block-main
    color $blue
  .block-title, .block-note, .block-main
    text-align center
  .block-note
    margin-top 0.5em
    font-size 22pt

  .wedding-schedule
    text-align center
    font-size 20pt
    background white
    border solid 1px gray
    margin 0.5em
    padding 0.5em
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

  .content-subtitle
    padding 0.2em 0.5em
    font-size 18pt
    color gray
  .content-text
    padding  0 0.5em
    font-size 14pt
    color black
    p
      text-indent 2em
      line-height 1.4em
  ul.content-text
    margin-left 2em
    list-style none
    li
      .fa-icon
        color $blue
        margin-right 0.5em
      .fa-icon.heart
        color $golden
      text-indent -1.5em
      line-height 1.4em
      margin-bottom 0.4em
</style>
