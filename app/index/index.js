import Vue from 'vue'
import vuex from 'vuex'
import VueRouter from "vue-router"
import routes from '../router/router'
import VueResource from 'vue-resource'
import apps from './components/app'
import Util from '../common/util'
import components from '../config/components'
import store from './store/index'
import WZPlugin from '../plugin/plu'
import * as filters from './filter/index'

//初始化全局组件
for(let i in components){
  let one = components[i];
  Vue.component(one.name, one.instance)
}

//自定义指令
// Vue.directive('showvalue',{
//   bind: function(el, binding, vnode){
//     el.innerHTML = 
//     'value:' + binding.value
//   }
// })

// Vue.directive('bg',{
//   bind: function(el, binding, vnode){
//     el.style.backgroundColor = binding.expression
//   }
// })

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 使用插件
Vue.use(WZPlugin, { someOption: true })

//注册路由
Vue.use(VueRouter);
Vue.use(VueResource);

Vue.use(vuex);

Vue.config.debug = true;

//创建路由实例
const router = new VueRouter({ routes });


//路由拦截
router.beforeEach((to, from, next) => {
  // console.log(from,from.path != '/')
  if (from.path != '/') {
    if (to.matched.some(req => req.meta.requireAuth)) {
      // let cookie = document.cookie;
      // let each = cookie.split(';');
      // let has = false;
      // for (let i in each) {
      //   if (each[i].split('=')[0].trim() == 'username') {
      //     has = true;
      //     break;
      //   }
      // }
      // if (has) {
      if (Util.getCookie('username')) {
        next()
      }
      else {
        console.log('没有登录')
        alert('身份验证失败，请重新登录')
        next({
          path: '/login',
          // query: {redirect : to.fullPath}
        })
      }
    } else {
      next()
    }
  } else {
    next()
  }
})


// new Vue({
// 	el: 'body',
//     render: h => h(Favlist)
// })

const app = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(apps)
})