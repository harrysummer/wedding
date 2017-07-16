// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import config from './config'
import Purecss from 'purecss/build/pure.css'
import PurecssResponsive from 'purecss/build/grids-responsive.css'
import VueLazyload from 'vue-lazyload'

import 'vue-awesome/icons/graduation-cap'
import 'vue-awesome/icons/male'
import 'vue-awesome/icons/female'
import 'vue-awesome/icons/map-marker'
import 'vue-awesome/icons/heart'
import 'vue-awesome/icons/long-arrow-right'
import 'vue-awesome/icons/envelope'
import 'vue-awesome/icons/phone'
import 'vue-awesome/icons/ellipsis-v'
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/university'
import 'vue-awesome/icons/clock-o'
import 'vue-awesome/icons/pencil'
import 'vue-awesome/icons/trash'
import 'vue-awesome/icons/eye'
import 'vue-awesome/icons/address-card-o'
import 'vue-awesome/icons/train'
import 'vue-awesome/icons/car'
import 'vue-awesome/icons/plane'
import Icon from 'vue-awesome/components/Icon'

Vue.config.productionTip = false
Vue.component('icon', Icon)
Vue.use(VueLazyload)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  config,
  template: '<App/>',
  components: { App, Purecss, PurecssResponsive },
  data: {
    title: 'test'
  }
})
