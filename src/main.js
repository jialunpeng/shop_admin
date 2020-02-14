/*
  这是一个 Vue 实现的后台管理系统
*/

// 导入Vue
import Vue from 'vue'
// 导入App根组件，所有内容，都是在App组件中展示的
import App from './App'
// 导入路由
import router from './router'

// 使用 element-ui
import ElementUI from 'element-ui'
// 导入样式
// import 'element-ui/lib/theme-chalk/index.css'

// 导入全局样式
import './assets/index.css'

// 导入 axios
import axios from 'axios'
// 将 axios 添加到 Vue 的原型中：
// 此时，Vue的实例对象就可以使用原型对象中的 $http 对象了
// 因为组件可以看作是Vue的实例，因此，在组件中就可以使用 $http 这个对象了
Vue.prototype.$http = axios

// 配置公共的接口地址：
// 只要配置该基础地址后，axios会在每次发送请求的时候，将 baseUrl 和 当前请求的接口 合并到一起
//  比如：当前请求接口为：/login，那么axios会将 baseUrl + login 得到：http://localhost:8888/api/private/v1/login 最终的完整接口地址了
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// axios 拦截器
// 只要是 axios 发送的ajax请求，那么，就会走拦截器
// 两个拦截器：1 请求拦截器 2 响应拦截器
// 处理方式：因为每个请求都会走 请求拦截器 ，所以，只需要在 请求拦截器 中，添加header就可以了
axios.interceptors.request.use(function (config) {
  // 所有请求之前都要执行的操作
  // console.log('axios 的请求拦截器', config)

  // 如果是login，不添加header
  if (config.url.indexOf('login') <= -1) {
    // 给请求头中添加 Authorization 请求头：
    config.headers.Authorization = localStorage.getItem('token')
  }

  return config
})

/* // 响应拦截器
axios.interceptors.response.use(function (response) {
  // 所有请求完成后都要执行的操作
  console.log('axios 的响应拦截器')

  return response
}) */

// 安装插件
Vue.use(ElementUI)

// 设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false

// 注意：以下注释表示紧挨着的下一行代码不再使用ESLint进行校验
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
