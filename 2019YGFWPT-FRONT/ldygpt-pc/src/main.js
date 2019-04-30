// The  build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import ElementUI from 'element-ui';
// import axios from 'axios'


import App from './App'
import router from './router'

import 'babel-polyfill'
import util from './common/util'
import has from './common/btnPermissions'
import Vuex from 'vuex'
import store from './store'
import api from './service/api'
import '../static/ueditor/ueditor.config.js'
import '../static/ueditor/ueditor.all.min.js'
import '../static/ueditor/lang/zh-cn/zh-cn.js'
import '../static/ueditor/ueditor.parse.min.js'
import glbConfig from './plugins/glbConfig'
Vue.use(glbConfig)

window.moment = require('moment')


// import 'element-ui/lib/theme-chalk/index.css';
// import '../static/css/theme-blue/index.css';

Vue.prototype.$api = api
Vue.prototype.$ajax = axios
Vue.config.productionTip = false

// Vue.use(ElementUI);
Vue.use(util);
Vue.use(Vuex);
// Vue.use(CKEditor);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})

