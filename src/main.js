import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
//注册element-ui组件
import ElementUI from 'element-ui'
Vue.use(ElementUI)
//导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
//配置请求路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
//设置拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
