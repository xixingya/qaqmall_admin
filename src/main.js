import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router/index.js'
import './assets/css/globel.css'
import axios from 'axios'
import { Message } from 'element-ui'
Vue.config.productionTip = false

// axios.defaults.baseURL = 'http://2ka2774089.iok.la/'

// axios.defaults.baseURL = 'http://39.97.127.228:8081'
axios.defaults.baseURL = 'http://jxs17.com/api'
axios.interceptors.request.use(config => {
 
  // 在最后必须return config
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.prototype.$message = Message
new Vue({
	router,
  render: h => h(App),
}).$mount('#app')
