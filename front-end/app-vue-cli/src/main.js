import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import linkify from 'vue-linkify'

Vue.directive('linkified', linkify)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
