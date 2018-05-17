import myFetch from '../config/myFetch'
import { getStore } from '../config/mUtils.js'

/**
 * 获取验证码
 */
export const mobileCode = phone => myFetch('/app/sendCode?phone=' + phone, {}, 'POST');
/**
 * 手机号登录
 */
export const sendLogin = (phone, password) => myFetch('/app/login?phone=' + phone + '&password=' + password, {}, 'POST');

/**
 * 获取用户信息,防止用户刷新vuex中的用户信息丢失
 */
export const getUser = () => myFetch('/app/getUser?userId=' + getStore('userid'), {}, 'POST');
/**
 * 获取首页导航列表
 */
export const loopPicList = () => myFetch('/seller/loopPicList', {}, 'POST');
/**
 * 获取首页店铺列表
 */
export const sellerList = (offset, loopPicId = '') => myFetch('/seller/sellerList', {
  pageSize: '10',
  pageNum: offset,
  loopPicId
}, 'POST');
/**
 * 获取店铺详情
 */
export const sellerDetail = (shopId) => myFetch('/seller/sellerDetail?id=' + shopId, {}, 'POST');

export const goodList = (shopId) => myFetch('/seller/goodList?id=' + shopId, {}, 'POST');

export const sellerRating = (shopId) => myFetch('/seller/sellerRating?id=' + shopId, {}, 'POST');

/**
 * 新增我的收货地址
 */
export const postAddAddress = (userId, name, sex, phone, adress, adressDetail, target) => myFetch('/app/addContact', {
  userId,
  name,
  sex,
  phone,
  adress,
  adressDetail,
  target
}, 'POST');
/**
 * 获取我的收货地址,防止用户刷新vuex中的地址信息丢失
 */
export const getAddressList = (userId) => myFetch('/seller/contactList?id=' + userId, {}, 'POST');
/**
 * 删除我的收货地址
 */
export const deleteAddress = () => myFetch('/seller/sellerList', {}, 'POST');


/**
 * 下订单
 */
export const createOrder = (userId, sellerId, contactId, amount, foodNum, foodList) => myFetch('/seller/addOrder', {
  userId,
  sellerId,
  contactId,
  amount,
  foodNum,
  relList: foodList
}, 'POST');

/**
 * 确认支付
 */
export const confirmPay = (userId, orderId) => myFetch('/seller/reduceBalance?id=' + userId + '&orderId=' + orderId, {}, 'POST');

/**
 * 订单列表
 */
export const getOrderList = (offset, userId = '') => myFetch('/seller/getOrderList', {
  pageSize: '10',
  pageNum: offset,
  userId
}, 'POST');

/**
 * 订单详情
 */
export const getOrderDetail = (orderId) => myFetch('/seller/orderDetail?id=' + orderId, {}, 'POST');

/**
 * 我的优惠
 */
export const getConpons = (userId) => myFetch('/app/getConpons?id=' + userId, {}, 'POST');
