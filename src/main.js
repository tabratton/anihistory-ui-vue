import Axios from 'axios'
import Vue from 'vue'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import store from './store'
import './assets/tailwind.css'

Vue.config.productionTip = false

Vue.prototype.$http = Axios
Vue.prototype.$http.defaults.baseURL = 'https://rust.swigglemeister.com'
Vue.prototype.$http.defaults.headers.post['Content-Type'] = 'application/json'

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
