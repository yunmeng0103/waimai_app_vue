import Vue from 'vue'
import {
  getUser,
  getAddressList
} from '../service/myData.js'
import {
  SAVE_USERINFO,
  SAVE_ADDRESS
} from './mutation-types.js'

export default {
  getCurrentPosition({ commit, state }) {
    //获取详细定位
    AMap.plugin(['AMap.Geolocation', 'AMap.Autocomplete'], function() {
      var geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, //是否使用高精度定位，默认:true
        timeout: 10000, //超过10秒后停止定位，默认：无穷大
        maximumAge: 0, //定位结果缓存0毫秒，默认：0
        convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
        showButton: true, //显示定位按钮，默认：true
        buttonPosition: 'LB', //定位按钮停靠位置，默认：'LB'，左下角
        buttonOffset: new AMap.Pixel(10, 20), //定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        showMarker: true, //定位成功后在定位到的位置显示点标记，默认：true
        showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
        panToLocation: true, //定位成功后将定位到的位置作为地图中心点，默认：true
        zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        extensions: 'all'
      });
      geolocation.getCurrentPosition(function(status, result) {
        if (result.aois && result.aois.length > 0) {
          commit('SET_POSITON', result);
          // console.log(result);
        }
      })
    })
  },
  // 选择城市，地图中心切换
  choose_city_name({ commit, state }, cityItem) {
    commit('CHOOSE_CITY_NAME', cityItem)
    // AMap.plugin('AMap.Geocoder', function() {
    //   var geocoder = new AMap.Geocoder({
    //     radius: 1000,
    //     extensions: 'all'
    //   });
    //   geocoder.getLocation(state.position.city, function(status, result) {
    //     var center = [result.geocodes[0].location.lng, result.geocodes[0].location.lat]
    //     var map = new AMap.Map('container', {
    //       resizeEnable: true,
    //       zoom: 16,
    //       center: center
    //     });
    //     map.addControl(geocoder)
    //   });
    // })
  },
  //地址输入提示
  autocomplete({ commit, state }, value) {
    AMap.plugin('AMap.Autocomplete', function() {
      var autocomplete = new AMap.Autocomplete({
        city: state.position.city,
        citylimit: true
      })
      autocomplete.search(value, function(status, result) {
        state.autocompleteList = result.tips
      })
    })
  },
  //选择地址
  choose_address({ commit, state }, index) {
    commit('CHOOSER_ADDRESS', index)
  },
  async saveUserInfo({
    commit,
    state
  }) {
    let res = await getUser();
    console.log('来自action,获取用户信息========');
    console.log(res);
    //getUser()方法获取到用户信息后利用commit同步调用vuex的GET_USERINFO方法记录state的userInfo
    commit(SAVE_USERINFO, res.data);
  },
  async saveAddress({
    commit,
    state
  }) {

    // if (state.removeAddress.length > 0) return;
    // 获取地址列表同步调用vuex的SAVE_ADDRESS方法并保存，防止数据丢失
    let address = await getAddressList(state.userInfo.id);
    console.log('来自action,获取用户收货地址信息========');
    console.log(address);
    commit(SAVE_ADDRESS, address.data);
  },
}
