// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//引入重置样式表
import "./assets/css/reset.css"

//引入公共组件
import Components from "./components"
for(let i in Components){
  Vue.component(i,Components[i])
}

//引入过滤器
import Filters from "./filters"
for(let i in Filters){
  Vue.filter(i,Filters[i])
}

//引入仓库
import store from "./store"

//引入element-ui 
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI)


//设置图片地址
Vue.prototype.$preImg="http://localhost:3000"

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
