// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router' //引入路由
import store from './store/' //引入vuex
import './config/rem'
Vue.config.productionTip = false


// 图片懒加载
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  loading: '../static/loading-bars.svg'
})

//引入elm-MintUI框架
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(MintUI)

//引入高德地图
import AMap from 'vue-amap';
Vue.use(AMap);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router, //注册路由
  store, //注册vuex仓
  components: { App },
  template: '<App/>'
})
