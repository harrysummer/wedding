<template lang='pug'>
div
  h2 {{$config.title.adminPhotos}}
  button#new-photo-btn.pure-button(v-on:click='createPhoto') 添加照片
  table.pure-table.pure-table-bordered
    thead
      tr
        th 名称
        th 类型
        th 操作
    tbody
      tr(v-if='error')
        td(colspan='3' style='text-align:center') {{error}}
      tr(v-for='photo in photos')
        td {{photo.name}}
        td {{photo.mime}}
        td
          a.operation(v-on:click='viewPhoto(photo._id)'): icon(name='eye' scale='1.333')
          a.operation(v-if='permissions.includes("photo:remove")' v-on:click='removePhoto(photo._id)'): icon(name='trash' scale='1.333')

  div.floating-mask(v-if='viewer.visible || editor.visible')
  div.floating-layer.pure-form.pure-form-aligned(v-show='viewer.visible')
    img#image-viewer
    div: button.pure-button(v-on:click='viewer.visible=false') 关闭
  div.floating-layer.pure-form.pure-form-aligned(v-if='editor.visible')
    fieldset
      legend 添加照片

      div.pure-control-group
        label(for='name') 名称
        input(type='text' id='name' v-model='editor.name')

      div.pure-control-group
        label(for='image') 文件
        input(type='file' id='image' ref='file' v-on:change='previewPhoto')

      img(v-if='editor.file' id='preview' :src='editor.file')

      div.pure-controls
        button.pure-button.pure-button-primary(v-on:click='uploadPhoto') 保存
        button.pure-button(v-on:click='editor.visible=false') 取消
</template>

<script>
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import router from '../router'

export default {
  data: () => ({
    permissions: [],
    photos: [],
    error: '',
    viewer: {
      visible: false
    },
    editor: {
      visible: false,
      name: '',
      file: ''
    }
  }),
  methods: {
    fetchPhotos () {
      axios.get('/api/photos/abstract', {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.token
        }
      }).then(res => {
        if (res.data.status) {
          this.error = '数据获取失败'
          this.photos = []
        } else if (!res.data) {
          this.error = '无数据'
          this.photos = []
        } else {
          this.error = ''
          this.photos = res.data
        }
      })
    },
    viewPhoto (id) {
      axios.get('/api/photo/id/' + id, {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.token
        },
        responseType: 'arraybuffer'
      }).then(res => {
        var reader = new FileReader()
        reader.onload = function (e) {
          document.getElementById('image-viewer').src = e.target.result
        }
        var buffer = new Buffer(res.data, 'binary')
        var blob = new Blob([buffer], { type: res.headers['content-type'] })
        reader.readAsDataURL(blob)
        this.viewer.visible = true
      })
    },
    previewPhoto () {
      var files = this.$refs.file.files
      var reader = new FileReader()
      var thiz = this
      reader.onload = function (e) {
        thiz.editor.file = e.target.result
      }
      var blob = new Blob(files)
      reader.readAsDataURL(blob)
      this.editor.name = files[0].name.replace(/\..+$/, '')
    },
    createPhoto () {
      this.editor = {
        visible: true,
        name: '',
        file: ''
      }
    },
    uploadPhoto () {
      console.log(this.$refs.file.files)
      axios.post('/api/photo', new Blob(this.$refs.file.files), {
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.token,
          name: this.editor.name,
          'Content-Type': this.$refs.file.files[0].type
        }
      }).then(res => {
        if (res.data.status) {
          window.alert('照片上传失败')
          return
        }
        this.editor.visible = false
        this.fetchPhotos()
      })
    },
    removePhoto (id) {
      if (window.confirm('确定要删除该照片吗？')) {
        axios.delete('/api/photo/id/' + id, {
          headers: {
            'Authorization': 'Bearer ' + sessionStorage.token
          }
        }).then(res => {
          if (res.data.status) {
            window.alert('照片删除失败')
            return
          }
          this.fetchPhotos()
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
    this.fetchPhotos()
  }
}
</script>

<style lang='stylus' scoped>
@import '../styles/variables.styl'

.operation
  margin 0 4px 0 4px
  cursor pointer

#new-photo-btn
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

#image-viewer
  width 100%

#preview
  width 100%
</style>
