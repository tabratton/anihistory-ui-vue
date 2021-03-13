import Axios from 'axios'
import { createApp } from 'vue'

import App from './App.vue'
import i18n from './i18n'
import router from './router'
import './assets/tailwind.css'

const app = createApp(App)

Axios.defaults.baseURL = 'https://rust.swigglemeister.com'
Axios.defaults.headers.post['Content-Type'] = 'application/json'

app.config.globalProperties.http = Axios
app.use(router)
app.use(i18n)

app.mount('#app')
