<template lang='pug'>
div.pure-form.pure-form-stacked
  fieldset
    legend {{$config.title.login}}
    input(type='text' placeholder='用户名' v-model='credential.username')
    input(type='password' placeholder='密码' v-model='credential.password')
    div.text-alert(v-if='error')
      p {{error}}
    button.pure-button.pure-button-primary(type='submit' v-on:click='login') 登录
</template>

<script>
import axios from 'axios'
import router from '../router'

export default {
  data () {
    return {
      credential: {
        username: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    login () {
      axios.post('/api/login', {
        username: this.credential.username,
        password: this.credential.password
      })
      .then((res) => {
        if (res.data.status) {
          this.error = '登陆失败'
        } else {
          window.sessionStorage.token = res.data.token
          router.replace('/')
        }
      })
    }
  },
  beforeCreate () {
    if (sessionStorage.token) {
      router.push('/')
    }
  }
}
</script>

<style lang='stylus' scoped>
.login-form
  margin 0 auto 0 auto

.text-alert
  color #ee3366
</style>
