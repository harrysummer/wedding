import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/Homepage'
import Wedding from '@/components/Wedding'
import Guestbook from '@/components/Guestbook'
import Contact from '@/components/Contact'
import config from '@/config'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Homepage',
      component: Homepage,
      meta: {
        title: config.page.homepage
      }
    },
    {
      path: '/wedding',
      name: 'Wedding',
      component: Wedding,
      meta: {
        title: config.page.wedding
      }
    },
    {
      path: '/guestbook',
      name: 'Guestbook',
      component: Guestbook,
      meta: {
        title: config.page.guestbook
      }
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact,
      meta: {
        title: config.page.contact
      }
    }
  ]
})
