import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/Homepage'
import Wedding from '@/components/Wedding'
import Guestbook from '@/components/Guestbook'
import Contact from '@/components/Contact'
import Login from '@/components/Login'
import config from '@/config'
import AdminPosts from '@/components/AdminPosts'
import AdminPhotos from '@/components/AdminPhotos'
import AdminAttendee from '@/components/AdminAttendee'
import AdminGuestbook from '@/components/AdminGuestbook'

Vue.use(Router)

const router = new Router({
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
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: config.page.login
      }
    },
    {
      path: '/admin/posts',
      component: AdminPosts,
      meta: {
        title: config.page.adminPosts
      }
    },
    {
      path: '/admin/photos',
      component: AdminPhotos,
      meta: {
        title: config.page.adminPhotos
      }
    },
    {
      path: '/admin/attendee',
      component: AdminAttendee,
      meta: {
        title: config.page.adminAttendee
      }
    },
    {
      path: '/admin/guestbook',
      component: AdminGuestbook,
      meta: {
        title: config.page.adminGuestbook
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + ' - ' + config.website
  next()
})

export default router
