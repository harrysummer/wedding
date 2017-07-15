<template lang='pug'>
div
  h2 {{$config.title.adminAttendee}}
  button#new-attendee-btn.pure-button(v-on:click='createAttendee') 添加嘉宾
  div.filter
    span 过滤器
    select#side(v-model='filter.side')
      option(value='' selected) 不限阵营
      option(value='bridegroom') 男方的
      option(value='bride') 女方的
      option(value='shared') 共同的
    select#role(v-model='filter.role')
      option(value='' selected) 不限关系
      option(value='relative') 亲属
      option(value='old_friend') 父母的朋友
      option(value='classmate') 同学
    select#role(v-model='filter.confirm')
      option(value='' selected) 不限参加与否
      option(value='attend') 确定参加
      option(value='not_attend') 确定不参加
      option(value='not_sure') 不确定是否参加

  table.pure-table.pure-table-bordered(style='width:800px')
    thead
      tr
        th 姓名
        th 身份
        th 人数
        th 份子钱
        th 备注
        th 操作

    tbody
      tr(v-if='error')
        td(colspan='6' style='text-align:center') {{error}}

      tr(v-for='person in attendee' v-if='filterPass(person)')
        td {{getName(person)}}
        td {{getIdentity(person)}}
        td {{getCount(person)}}
        td {{person.money}}
        td(v-html='getNoteHtml(person.note)')
        td
          a.operation.invitation(target='_blank' :href='"/invitation/" + person._id'): icon(name='address-card-o' scale='1.333')
          a.operation(v-if='permissions.includes("attendee:edit")' v-on:click='editAttendee(person)'): icon(name='pencil' scale='1.333')
          a.operation(v-if='permissions.includes("attendee:remove")' v-on:click='removeAttendee(person._id)'): icon(name='trash' scale='1.333')

  div.floating-mask(v-if='editor.visible')
  div.floating-layer.pure-form.pure-form-aligned(v-if='editor.visible')
    fieldset
      legend {{editor.create ? '添加嘉宾' : '修改嘉宾'}}
      div.pure-control-group
        label(for='name') 姓名
        input#name(type='text' v-model='editor.name')

      div.pure-control-group
        label(for='gender') 性别
        label.pure-radio.pure-input-1-2(for='gender-male')
          input#gender-male(type='radio' name='gender' v-model='editor.gender' value='male')
          | 男
        label.pure-radio.pure-input-1-2(for='gender-female')
          input#gender-remale(type='radio' name='gender' v-model='editor.gender' value='female')
          | 女

      div.pure-control-group
        label(for='dependant') 家属
        input#dependant(type='text' v-model='editor.dependant')

      div.pure-control-group
        label(for='identity') 身份
        select#side(v-model='editor.side')
          option(value='bridegroom') 男方的
          option(value='bride') 女方的
          option(value='shared') 共同的
        select#role(v-model='editor.role')
          option(value='relative') 亲属
          option(value='old_friend') 父母的朋友
          option(value='classmate') 同学

      div.pure-control-group
        label(for='confirm') 确认
        label.pure-checkbox(for='confirm-yes')
          input#confirm-yes(type='checkbox' v-model='editor.confirm')
          | 勾上表示确认参加或确认不参加

      div.pure-control-group
        label(for='count') 人数
        input#count(type='number' v-model='editor.count')

      div.pure-control-group
        label(for='money') 份子钱
        input#count(type='text' v-model='editor.money')

      div.pure-control-group
        label(for='note') 备注
        input#count(type='text' v-model='editor.note')

      div.pure-controls
        button.pure-button.pure-button-primary(v-on:click='saveAttendee') 保存
        button.pure-button(v-on:click='editor.visible=false') 取消
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import jwtDecode from 'jwt-decode'
import router from '../router'

export default {
  data: () => ({
    attendee: [],
    error: '',
    permissions: [],
    editor: {
      visible: false,
      create: false,
      id: '',
      name: '',
      gender: '',
      dependant: '',
      side: '',
      role: '',
      confirm: false,
      count: 0,
      money: '',
      note: ''
    },
    filter: {
      side: '',
      role: '',
      confirm: ''
    }
  }),
  methods: {
    filterPass (person) {
      if (this.filter.side && this.filter.side !== person.side) return false
      if (this.filter.role && this.filter.role !== person.role) return false
      if (this.filter.confirm) {
        if (this.filter.confirm === 'not_sure' && person.confirm) return false
        if (this.filter.confirm === 'attend' && (!person.confirm || person.count === 0)) return false
        if (this.filter.confirm === 'not_attend' && (!person.confirm || person.count !== 0)) return false
      }
      return true
    },
    getNoteHtml (note) {
      if (!note) return ''
      var s = marked(note)
      return s.substring(3, s.length - 5)
    },
    getName (person) {
      if (person.dependant) {
        return person.name + '夫妇'
      } else {
        return person.name
      }
    },
    getIdentity (person) {
      var side = {bride: '女方', bridegroom: '男方', shared: '共同的'}
      var role = {relative: '亲戚', old_friend: '父母的朋友', classmate: '同学'}
      if (!person.side && !person.role) {
        return '未知'
      } else if (!person.side) {
        return role[person.role]
      } else if (!person.role) {
        return side[person.side]
      } else {
        return side[person.side] + role[person.role]
      }
    },
    getCount (person) {
      if (person.confirm) {
        return person.count.toString()
      } else {
        return '？'
      }
    },
    fetchAttendee () {
      axios.get('/api/attendee', {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      }).then(res => {
        if (res.data.status) {
          this.error = '数据获取失败'
          this.attendee = []
        } else if (!res.data || !res.data.length) {
          this.error = '无数据'
          this.attendee = []
        } else {
          this.error = ''
          this.attendee = res.data
        }
      })
    },
    createAttendee () {
      this.editor = {
        visible: true,
        create: true,
        name: '',
        gender: '',
        dependant: '',
        side: '',
        role: '',
        confirm: false,
        count: 0,
        money: '',
        note: ''
      }
    },
    editAttendee (person) {
      this.editor = {
        visible: true,
        create: false,
        id: person._id,
        name: person.name,
        gender: person.gender,
        dependant: person.dependant,
        side: person.side,
        role: person.role,
        confirm: person.confirm,
        count: person.count,
        money: person.money,
        note: person.note
      }
    },
    saveAttendee () {
      var attendee = {
        name: this.editor.name,
        gender: this.editor.gender
      }
      attendee.dependant = this.editor.dependant
      attendee.side = this.editor.side
      attendee.role = this.editor.role
      attendee.confirm = this.editor.confirm
      attendee.count = this.editor.count
      attendee.money = this.editor.money
      attendee.note = this.editor.note

      if (this.editor.create) {
        axios.post('/api/attendee', attendee, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.token,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.status) {
            window.alert('添加嘉宾失败')
            return
          }
          this.editor.visible = false
          this.fetchAttendee()
        })
      } else {
        axios.put('/api/attendee/' + this.editor.id, attendee, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.token,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.status) {
            window.alert('修改嘉宾失败')
            return
          }
          this.editor.visible = false
          this.fetchAttendee()
        })
      }
    },
    removeAttendee (id) {
      if (window.confirm('确定要删除该嘉宾吗？')) {
        axios.delete('/api/attendee/' + id, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        }).then(res => {
          if (res.data.status) {
            window.alert('文章嘉宾失败')
            return
          }
          this.fetchAttendee()
        })
      }
    }
  },
  beforeCreate () {
    if (!sessionStorage.token) {
      router.replace('/login')
    }
  },
  created () {
    this.permissions = sessionStorage.token ? jwtDecode(sessionStorage.token).permissions : []
    this.fetchAttendee()
  }
}
</script>

<style lang='stylus' scoped>
@import '../styles/variables.styl'

.operation
  margin 0 4px 0 4px
  cursor pointer

#new-attendee-btn
  margin 10px auto 10px

.floating-mask
  z-index 10
  position fixed
  left 0
  right 0
  top 0
  bottom 0
  background rgba(0,0,0,0.9)

.floating-layer
  z-index 20
  position absolute
  left auto
  right auto
  width 600px
  top 80px
  bottom auto
  background $bgcolor
  padding 20px

.row-male
  background #88aacc

.row-female
  background #dd88aa

.invitation:link, .invitation:hover, .invitation:visited, .invitation:active
  color black

.filter
  margin 10px
</style>
