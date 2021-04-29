import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/sign',
    name: 'Sign',
    component: () => import('../views/Sign.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/mur',
    name: 'Mur',
    component: () => import('../components/Mur.vue')
  },
  {
    path: '/edit-message',
    name: 'EditMessage',
    component: () => import('../components/EditMessage.vue')
  },
  {
    path: '/modify-message',
    name: 'ModifyMessage',
    component: () => import('../components/ModifyMessage.vue')
  },
  {
    path: '/edit-profil',
    name: 'EditProfil',
    component: () => import('../components/EditProfil.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
