import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  state: {
    show: true,
    profilPicture: '',
    isAdmin: ''
  },
  guetters: {

  },
  mutations: {
    SHOW_OFF(state) {
      state.show = false

    },
    SHOW_ON(state) {
      state.show = true
    },
  },
  actions: {
    showOff(context) {
      let pathArray = ['/','/sign', '/login']

      if(pathArray.includes(window.location.pathname)) {
        context.commit('SHOW_ON')

      } else {
        context.commit('SHOW_OFF')
      }
    }
  },
  modules: {
  }
})
