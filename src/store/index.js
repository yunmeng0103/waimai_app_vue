import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
import createPersistedState from 'vuex-persistedstate'
import { cityList } from './city-data.js'

Vue.use(Vuex)

const state = {
  cityList: cityList,
  position: {}, //当前位置信息
  geohash: '', //选中位置geohash值（默认当前位置）
  autocompleteList: '', //地址输入提示
  shopInfo: {}, //商铺信息
  userInfo: null, //用户信息
  login: true, //是否登录
  newAddress: [], //确认订单页新的地址
  searchAddress: null, //搜索并选择的地址
  choosedAddress: null, //选择地址
  addressIndex: null, //选择地址的索引值
  cartList: {}, // 加入购物车的商品列表
  removeAddress: [], //移除地址
  orderMessage: null, //订单返回的信息
}

const vuexPersisted = new createPersistedState({
  key: 'myVuex',
  storage: window.sessionStorage, //默认window.localStorage
  reducer: state => ({
    // 将状态减少到只需要保存的值。默认情况下，保存整个状态。
    position: state.position,
    geohash: state.geohash,
    shopInfo: state.shopInfo,
  }),
});

export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  plugins: [vuexPersisted]
})
