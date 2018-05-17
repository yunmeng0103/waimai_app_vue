import Vue from 'vue'
import Router from 'vue-router'
const city = r => require.ensure([], () => r(require('../pages/city/city.vue')), 'city')
const city_list = r => require.ensure([], () => r(require('../pages/city/city_list.vue')), 'city_list')
const address = r => require.ensure([], () => r(require('../pages/address/address.vue')), 'address')
const home = r => require.ensure([], () => r(require('../pages/home/home.vue')), 'home')
const food = r => require.ensure([], () => r(require('../pages/food/food.vue')), 'food')
const shopDetail = r => require.ensure([], () => r(require('../pages/shopDetail/shopDetail.vue')), 'shopDetail')
const goods = r => require.ensure([], () => r(require('../pages/shopDetail/children/goods.vue')), 'goods')
// const goodsDetail = r => require.ensure([], () => r(require('../pages/shopDetail/children/children/goodsDetail.vue')), 'goodsDetail')
const ratings = r => require.ensure([], () => r(require('../pages/shopDetail/children/ratings.vue')), 'ratings')
const addAddress = r => require.ensure([], () => r(require('../pages/addAddress/addAddress.vue')), 'addAddress')
const searchAddress = r => require.ensure([], () => r(require('../pages/addAddress/children/searchAddress.vue')), 'searchAddress')
const confirmOrder = r => require.ensure([], () => r(require('../pages/confirmOrder/confirmOrder.vue')), 'confirmOrder')
const chooseAddress = r => require.ensure([], () => r(require('../pages/confirmOrder/children/chooseAddress.vue')), 'chooseAddress')
const payment = r => require.ensure([], () => r(require('../pages/payment/payment.vue')), 'payment')
const order = r => require.ensure([], () => r(require('../pages/order/order.vue')), 'order')
const orderDetail = r => require.ensure([], () => r(require('../pages/order/children/orderDetail.vue')), 'orderDetail')
const mine = r => require.ensure([], () => r(require('../pages/mine/mine.vue')), 'mine')
const balance = r => require.ensure([], () => r(require('../pages/mine/children/balance.vue')), 'balance')
const benefit = r => require.ensure([], () => r(require('../pages/mine/children/benefit.vue')), 'benefit')
const points = r => require.ensure([], () => r(require('../pages/mine/children/points.vue')), 'points')
const myAddress = r => require.ensure([], () => r(require('../pages/mine/children/myAddress.vue')), 'myAddress')
const login = r => require.ensure([], () => r(require('../pages/login/login.vue')), 'login')

Vue.use(Router)

export default new Router({
  routes: [{
      path: '',
      redirect: '/home'
    },
    //当前选择城市页
    {
      path: '/city',
      component: city
    },
    //当前选择城市页
    {
      path: '/city_list',
      component: city_list
    },
    //选择详细地址
    { //路由方式传参
      // path: '/address/:cityid',
      path: '/address',
      component: address
    },
    //主页
    {
      path: '/home',
      component: home
    },
    //主页头部详情
    {
      path: '/food',
      component: food
    },
    //详情
    {
      path: '/shopDetail',
      component: shopDetail,
      children: [{
        path: '/', //默认商品列表
        component: goods,
      }, {
        path: 'goods', //商品列表
        component: goods,
        // children: [{
        //   path: 'goodsDetail', //商品详情
        //   component: goodsDetail,
        // }]
      }, {
        path: 'ratings', //商品评价
        component: ratings,
      }, ]
    },
    //新增收货地址
    {
      path: '/addAddress',
      component: addAddress,
      children: [{
        path: 'searchAddress', //搜索地址
        component: searchAddress,
      }]
    },
    //确认订单
    {
      path: '/confirmOrder',
      component: confirmOrder,
      children: [{
        path: 'chooseAddress', //选择地址
        component: chooseAddress,
      }]
    },
    //等待支付
    {
      path: '/payment',
      component: payment,
    },
    //订单
    {
      path: '/order',
      component: order,
      children: [{
        path: 'orderDetail', //订单详情
        component: orderDetail,
      }]
    },
    //我的
    {
      path: '/mine',
      component: mine,
      children: [{
        path: 'balance', //余额
        component: balance,
      }, {
        path: 'benefit', //优惠
        component: benefit,
      }, {
        path: 'points', //积分
        component: points,
      }, {
        path: 'myAddress', //收货地址
        component: myAddress,
      }]
    },
    //登录
    {
      path: '/login',
      component: login
    },

  ]
})
