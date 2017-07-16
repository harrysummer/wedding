<template lang='pug'>
div
  h2 {{$config.title.adminPosts}}
  button#new-post-btn.pure-button(v-on:click='createPost') 添加文章
  table.pure-table.pure-table-bordered
    thead
      tr
        th 编号
        th 标题
        th 类型
        th 操作
    tbody
      tr(v-if='error')
        td(colspan='4' style='text-align:center') {{error}}
      tr(v-for='post in posts')
        td {{post.key}}
        td {{post.title}}
        td {{post.type}}
        td
          a.operation(v-if='permissions.includes("post:edit")' v-on:click='editPost(post._id)'): icon(name='pencil' scale='1.333')
          a.operation(v-if='permissions.includes("post:remove")' v-on:click='removePost(post._id)'): icon(name='trash' scale='1.333')

  div.floating-mask(v-if='editor.visible')
  div.floating-layer.pure-form.pure-form-aligned(v-if='editor.visible')
    fieldset
      legend {{editor.create ? '添加文章' : '修改文章'}}
      div.pure-control-group
        label(for='type') 类型
        select(id='type' v-model='editor.type')
          option shared
          option bride
          option bridegroom
          option icon

      div.pure-control-group(v-show='editor.type !== "icon"')
        label(for='title') 标题
        input(type='text' id='title' v-model='editor.title')

      div.pure-control-group(v-show='editor.type !== "icon"')
        label(for='date') 日期
        input(type='text' id='date' v-model='editor.date')

      div.pure-control-group(v-show='editor.type !== "shared"')
        label(for='icon') 图标
        input(type='text' id='icon' v-model='editor.icon')
        span.pure-form-message-inline FontAwesome 图标名

      div.pure-control-group(v-show='editor.type !== "icon"')
        label(for='photos') 照片
        input(type='text' id='photos' v-model='editor.photos')
        span.pure-form-message-inline 多张照片用逗号分开

      div.pure-control-group(v-show='editor.type !== "icon"')
        label(for='content') 内容
        textarea(v-model='editor.content' rows='8' cols='40')

      div.pure-control-group(v-show='!editor.create')
        label(for='key') 编号
        input(type='number' id='key' v-model='editor.key')

      div.pure-controls
        button.pure-button.pure-button-primary(v-on:click='savePost') 保存
        button.pure-button(v-on:click='editor.visible=false') 取消

</template>

<script>
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import router from '../router'

export default {
  data: () => ({
    posts: [],
    error: '',
    permissions: [],
    editor: {
      visible: false,
      create: true,
      id: '',
      type: 'shared',
      title: '',
      date: '',
      icon: '',
      content: '',
      photos: [],
      key: 0
    }
  }),
  methods: {
    fetchPosts () {
      axios.get('/api/posts/abstract', {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      }).then(res => {
        if (res.data.status) {
          this.error = '数据获取失败'
          this.posts = []
        } else if (!res.data || !res.data.length) {
          this.error = '无数据'
          this.posts = []
        } else {
          this.error = ''
          this.posts = res.data
        }
      })
    },
    createPost () {
      this.editor = {
        visible: true,
        create: true,
        type: 'shared',
        id: '',
        title: '',
        date: '',
        icon: '',
        content: '',
        photos: [],
        key: 0
      }
    },
    editPost (id) {
      axios.get('/api/post/' + id, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      }).then(res => {
        if (res.data.status) {
          window.alert('数据获取失败')
          return
        }
        this.editor = {
          visible: true,
          create: false,
          type: res.data.type,
          id: res.data._id,
          title: res.data.title,
          date: res.data.date,
          icon: res.data.icon,
          content: res.data.content,
          photos: res.data.photos.join(','),
          key: res.data.key
        }
      })
    },
    savePost () {
      var post = {}
      if (this.editor.create) {
        post = {
          type: this.editor.type,
          title: this.editor.title,
          date: this.editor.date,
          content: this.editor.content,
          icon: this.editor.icon,
          photos: this.editor.photos ? this.editor.photos.split(',') : []
        }
        axios.post('/api/post', post, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.token,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.status) {
            window.alert('添加文章失败')
            return
          }
          this.editor.visible = false
          this.fetchPosts()
        })
      } else {
        post = {
          type: this.editor.type,
          title: this.editor.title,
          date: this.editor.date,
          content: this.editor.content,
          icon: this.editor.icon,
          photos: this.editor.photos ? this.editor.photos.split(',') : [],
          key: this.editor.key
        }
        axios.put('/api/post/' + this.editor.id, post, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.token,
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (res.data.status) {
            window.alert('修改文章失败')
            return
          }
          this.editor.visible = false
          this.fetchPosts()
        })
      }
    },
    removePost (id) {
      if (window.confirm('确定要删除该文章吗？')) {
        axios.delete('/api/post/' + id, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        }).then(res => {
          if (res.data.status) {
            window.alert('文章删除失败')
            return
          }
          this.fetchPosts()
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
    this.fetchPosts()
  }
}
</script>

<style lang='stylus' scoped>
@import '../styles/variables.styl'

.operation
  margin 0 4px 0 4px
  cursor pointer

#new-post-btn
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
</style>
