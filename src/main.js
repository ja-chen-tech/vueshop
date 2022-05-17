import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
//注册element-ui组件
import ElementUI from 'element-ui'
Vue.use(ElementUI)
//导入字体图标
import './assets/fonts/iconfont.css'
import axios from 'axios'
//配置请求路径
axios.defaults.baseURL ='http://127.0.0.1:8888/api/private/v1/'
//设置拦截器
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
//将富文本编辑器注册为全局可用组件
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.component('tree-table',TreeTable)
Vue.filter('dateFormat',function(originVal){
 const dt= new Date(originVal)
 const y=dt.getFullYear()
 const m=(dt.getMonth()+1+'').padStart(2,'0')
 const d=(dt.getDate()+'').padStart(2,'0')
 const hh=(dt.getHours()+'').padStart(2,'0')
 const mm=(dt.getMinutes()+'').padStart(2,'0')
 const ss=(dt.getSeconds()+'').padStart(2,'0')
 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
