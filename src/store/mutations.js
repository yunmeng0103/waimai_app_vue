import { setStore, getStore } from '../config/mUtils'
import {
  SET_POSITON,
  CHOOSE_CITY_NAME,
  CHOOSER_ADDRESS,

  RECORD_ADDRESS,
  SAVE_GEOHASH,
  RECORD_USERINFO,
  OUT_LOGIN,
  CHOOSE_ADDRESS,
  CHOOSE_SEARCH_ADDRESS,
  SAVE_SHOP_INFO,
  CONFIRM_ADDRESS,
  SAVE_USERINFO,
  ADD_CART,
  REDUCE_CART,
  CLEAR_CART,
  GET_CART_LIST,
  SAVE_ADDRESS,
  ADD_ADDRESS,
  ORDER_SUCCESS
} from './mutation-types.js'
export default {
  // 保存当前位置
  [SET_POSITON](state, result) {
    let position = {
      province: result.addressComponent.province,
      city: result.addressComponent.city,
      address: result.aois[0].name,
    }
    state.position = { ...position }
    state.geohash = result.position.lat + ',' + result.position.lng
  },
  // 选择城市
  [CHOOSE_CITY_NAME](state, cityItem) {
    state.position.city = cityItem;
  },
  // 选址
  [CHOOSER_ADDRESS](state, address) {
    state.position.address = address
  },
  //保存geohash
  [SAVE_GEOHASH](state, geohash) {
    state.geohash = geohash;
  },
  // 记录用户信息
  [RECORD_USERINFO](state, info) {
    state.userInfo = info;
    state.login = true;
    //永久储存localStorage
    setStore('userid', info.id);
  },
  //获取用户信息存入vuex
  [SAVE_USERINFO](state, info) {
    if (state.userInfo && (state.userInfo.username !== info.username)) {
      //用户不一致不进行记录
      return;
    };
    if (!state.login) {
      //用户未登录不记录
      return;
    }
    if (!state.userInfo) {
      state.userInfo = { ...info };
    }
  },
  //退出登录
  [OUT_LOGIN](state) {
    state.userInfo = {};
    state.login = false;
  },
  //选择的地址（chooseAddress页）
  [CHOOSE_ADDRESS](state, {
    address,
    index
  }) {
    state.choosedAddress = address;
    state.addressIndex = index;
  },
  //保存选择搜索的地址（搜索地址页）
  [CHOOSE_SEARCH_ADDRESS](state, place) {
    state.searchAddress = place;
  },
  //保存商铺信息
  [SAVE_SHOP_INFO](state, shopinfo) {
    state.shopInfo = { ...shopinfo };
  },
  //确认订单页添加新的的地址
  [CONFIRM_ADDRESS](state, newAddress) {
    state.newAddress.push(newAddress);
  },
  //添加到购物车
  [ADD_CART](state, {
    shopid,
    category_id,
    item_id,
    item_icon,
    name,
    price,
    num,
    packing_fee
  }) {
    let cart = state.cartList;
    let shop = cart[shopid] = (cart[shopid] || {});
    let category = shop[category_id] = (shop[category_id] || {});
    if (category[item_id]) {
      category[item_id]['num']++;
      category[item_id]['packing_fee']++;
    } else {
      category[item_id] = {
        "category_id": category_id,
        "id": item_id,
        "icon": item_icon,
        "name": name,
        "price": price,
        "num": 1,
        "packing_fee": 1,
      };
    }
    state.cartList = { ...cart };
    //存入localStorage
    setStore('cartList', state.cartList);
  },
  // 移出购物车
  [REDUCE_CART](state, {
    shopid,
    category_id,
    item_id,
    item_icon,
    name,
    price,
    num,
    packing_fee
  }) {
    let cart = state.cartList;
    let shop = cart[shopid] = (cart[shopid] || {});
    let category = shop[category_id] = (shop[category_id] || {});
    if (category && category[item_id]) {
      if (category[item_id]['num'] > 0) {
        category[item_id]['num']--;
        category[item_id]['packing_fee']--;
        state.cartList = { ...cart };
        //存入localStorage
        setStore('cartList', state.cartList);
      } else {
        //商品数量为0，则清空当前商品的信息
        category[item_id] = null;
      }
    }
  },
  //网页初始化时从本地缓存获取购物车数据
  [GET_CART_LIST](state) {
    let initCart = getStore('cartList');
    if (initCart) {
      state.cartList = JSON.parse(initCart);
    }
  },
  //清空当前商品的购物车信息
  [CLEAR_CART](state, shopid) {
    state.cartList[shopid] = null;
    state.cartList = { ...state.cartList };
    setStore('cartList', state.cartList);
  },
  //保存地址列表
  [SAVE_ADDRESS](state, newAdress) {
    state.removeAddress = newAdress
  },
  //增加地址
  [ADD_ADDRESS](state, obj) {
    state.removeAddress = [obj, ...state.removeAddress];
  },
  //下单成功，保存订单返回信息
  [ORDER_SUCCESS](state, order) {
    state.orderMessage = order;
  },
}
