// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vant from 'vant'
import store from './stores'
import vuex from 'vuex'
import api from './service/api'
import moment from 'moment'
import infiniteScroll from 'vue-infinite-scroll'
import 'vant/lib/index.css'
import axios from 'axios'
import './assets/style/components.less'// 引入less
import {
  GetQueryString,
  getStore,
  setStore,
  removeStore
} from './config/util'
Vue.prototype.$api = api
Vue.prototype.$ajax = axios
Vue.prototype.$moment = moment
Vue.config.productionTip = false
Vue.use(Vant)
Vue.use(infiniteScroll)
Vue.use(vuex)
/* eslint-disable no-new */
console.log('router', router)
router.beforeEach((to, from, next) => {
  console.log('beforeEach', to)
  let wechatCode = GetQueryString('code')
  const ua = window.navigator.userAgent.toLowerCase()
  if (!wechatCode && !getStore('token') && !(ua.indexOf('micromessenger') < 0)) {
    var fromurl = location.href
    // var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36a48e7007ecae66&redirect_uri=${encodeURIComponent(fromurl)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfb4f706bc9b0ea1f&redirect_uri=${encodeURIComponent(fromurl)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
    window.location.href = url
  } else if (wechatCode && !getStore('token')) {
    let params = {
      code: wechatCode
    }
    api.getCorpUserInfo(params).then(res => {
      if (res.code === 0) {
        setStore('token', res.data.token)
        removeStore('loginerr')
        next()
      } else {
        if (!getStore('loginerr')) {
          setStore('loginerr', 'err')
          var fromurl = location.href
          // var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx36a48e7007ecae66&redirect_uri=${encodeURIComponent(fromurl)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxfb4f706bc9b0ea1f&redirect_uri=${encodeURIComponent(fromurl)}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`
          window.location.href = url
        } else {
          // Toast('微信授权失败')
        }
      }
    })
  } else {
    next()
  }
})
router.afterEach((to, from, next) => {
  /* 路由发生变化修改页面 title */
  if (to.meta.title) {
    window.document.title = to.meta.title
  }
  // if (to.name === 'topUp') {
  //   let active = 1
  //   Vue.prototype.$active = active
  // }
})
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
