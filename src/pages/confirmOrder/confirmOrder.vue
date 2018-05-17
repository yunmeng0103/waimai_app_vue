<template>
  <div class="confirmOrderContainer">
    <section v-if="!showLoading">
      <head-top head-title="确认订单" goBack="true"></head-top>
      <router-link :to='{path: "/confirmOrder/chooseAddress", query: {id: "", sig: ""}}' class="address_container">
        <div class="address_empty_left">
          <svg class="location_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <div class="add_address" v-if="!choosedAddress">请添加一个收货地址</div>
          <div v-else class="address_detail_container">
            <header>
              <span>{{choosedAddress.name}}</span>
              <span>{{choosedAddress.sex == 0? '先生':'女士'}}</span>
              <span>{{choosedAddress.phone}}</span>
            </header>
            <div class="address_detail">
              <span v-if="choosedAddress.target" :style="{backgroundColor: iconColor(choosedAddress.target)}">{{tagSwitch(choosedAddress.target)}}</span>
              <p>{{choosedAddress.adressDetail}}</p>
            </div>
          </div>
        </div>
        <svg class="address_empty_right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
      <section class="delivery_model container_style">
        <p class="deliver_text">送达时间</p>
        <section class="deliver_time">
          <p>尽快送达 | 预计{{timeout}} </p>
          <p>蜂鸟专送</p>
        </section>
      </section>
      <section class="pay_way container_style">
        <header class="header_style">
          <span>支付方式</span>
          <div class="more_type" @click="showPayWayFun">
            <span>在线支付</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </header>
        <section class="hongbo">
          <span>红包</span>
          <span>暂时只在大众点餐 APP 中支持</span>
        </section>
      </section>
      <section class="food_list">
        <header>
          <img :src="imgBaseUrl + shopInfo.shopLogoImg">
          <span>{{shopInfo.name}}</span>
        </header>
        <ul class="food_list_ul" v-if="checkoutData">
          <li class="food_item_style" v-for="item in checkoutData">
            <div class="food_icon"><img :src="item.icon" /></div>
            <p class="food_name ellipsis">{{item.name}}</p>
            <div class="num_price">
              <span>x {{item.quantity}}</span>
              <span>¥{{item.price}}</span>
            </div>
          </li>
        </ul>
        <div class="food_item_style">
          <p class="food_name ellipsis">包装费</p>
          <div class="num_price">
            <span></span>
            <span>¥ {{packing_fee}}</span>
          </div>
        </div>
        <div class="food_item_style">
          <p class="food_name ellipsis">配送费</p>
          <div class="num_price">
            <span></span>
            <span>¥ {{shopInfo.piecewiseAgentFee || 0}}</span>
          </div>
        </div>
        <div class="food_item_style total_price">
          <p class="food_name ellipsis"></p>
          <div class="num_price">
            <span>小计 ¥{{total}}</span>
          </div>
        </div>
      </section>
      <section class="pay_way container_style">
        <router-link :to='{path: "/confirmOrder", query: {id: "", sig: ""}}' class="header_style">
          <span>订单备注</span>
          <div class="more_type">
            <span class="ellipsis">口味、偏好等</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </router-link>
      </section>
      <section class="confrim_order">
        <p>待支付 ¥{{total}}</p>
        <p @click="confirmOrder">确认下单</p>
      </section>
      <transition name="fade">
        <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
      </transition>
      <transition name="slid_up">
        <div class="choose_type_Container" v-if="showPayWay">
          <header>支付方式</header>
          <ul>
            <li @click="payWay = 1" :class="{choose: payWay == 1}">
              <span>在线支付<span>（商家仅支持在线支付）</span></span>
              <svg class="address_empty_right">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li>
            <!-- <li @click="payWay = 2" :class="{choose: payWay == 2}">
              <span>货到付款</span>
              <svg class="address_empty_right">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li> -->
          </ul>
        </div>
      </transition>
    </section>
    <loading v-if="showLoading"></loading>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></alert-tip>
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import headTop from '../../components/header/head.vue'
import alertTip from '../../components/common/alertTip'
import loading from '../../components/common/loading'
import { sellerDetail, createOrder } from '../../service/myData.js'
import { imgBaseUrl } from '../../config/env.js'
import { formatDate } from '../../config/mUtils.js'

export default {
  data() {
    return {
      geohash: '', //geohash位置信息
      shopId: null, //商店id值
      showLoading: false, //显示加载动画
      checkoutData: null, //数据返回值
      shopCart: null, //购物车数据
      packing_fee: null,
      total: null,
      imgBaseUrl, //图片域名
      showPayWay: false, //显示付款方式
      payWay: 1, //付款方式
      showAlert: false, //弹出框
      alertText: null, //弹出框内容
    }
  },
  created() {
    //获取上个页面传递过来的geohash值
    this.geohash = this.$route.query.geohash;
    //获取上个页面传递过来的shopid值
    this.shopId = this.$route.query.shopId;

    //获取当前订单购物车信息
    this.GET_CART_LIST();
    //获取当前商铺购物车信息
    this.shopCart = this.cartList[this.shopId];
  },
  mounted() {
    // if (this.geohash) {
    this.initData();
    // this.SAVE_GEOHASH(this.geohash);
    // }
    
  },
  components: {
    headTop,
    alertTip,
    loading,
  },
  computed: {
    ...mapState([
      'userInfo', 'choosedAddress', 'cartList', 'shopInfo','orderMessage'
    ]),
    timeout() {
      var time = new Date();
      var b = this.shopInfo.deliveryTime; //分钟数
      time.setMinutes(time.getMinutes() + b, time.getSeconds(), 0);
      return formatDate(time, 'hh:mm');
    }
  },
  methods: {
    ...mapMutations([
      'GET_CART_LIST', 'SAVE_SHOP_INFO', 'ORDER_SUCCESS'
    ]),
    //初始化数据
    async initData() {
      let seller = await sellerDetail(this.shopId);
      //保存商铺信息,防止用户刷新
      this.SAVE_SHOP_INFO(seller.data);
      let newArr = new Array;
      Object.values(this.shopCart).forEach(categoryItem => {
        Object.values(categoryItem).forEach(item => {
          newArr.push({
            id: item.id,
            icon: item.icon,
            name: item.name,
            packing_fee: item.packing_fee,
            price: item.price,
            quantity: item.num,
          })
        })
      })
      this.checkoutData = [...newArr];
      this.packingFee(); //包装费
      this.totalPrice(); //总价
      this.showLoading = false;
    },
    //显示付款方式
    showPayWayFun() {
      this.showPayWay = !this.showPayWay;
    },
    // 包装费
    packingFee() {
      let packing_fee = 0;
      this.checkoutData.forEach((item) => {
        packing_fee += item.packing_fee * 1;
      });
      this.packing_fee = packing_fee;
    },
    // 总价格
    totalPrice() {
      let total = 0;
      this.checkoutData.forEach((food) => {
        total += (food.price + 1) * food.quantity;
      });
      total += this.shopInfo.piecewiseAgentFee;
      this.total = total;
    },
    tagSwitch(tag) {
      switch (tag) {
        case 0:
          return '';
        case 1:
          return '家';
        case 2:
          return '学校';
        case 3:
          return '公司';
      }
    },
    //地址备注颜色
    iconColor(name) {
      switch (name) {
        case '公司':
          return '#4cd964';
        case '学校':
          return '#3190e8';
      }
    },
    //确认订单
    async confirmOrder() {
      //用户未登录时弹出提示框
      if (!(this.userInfo && this.userInfo.id)) {
        this.showAlert = true;
        this.alertText = '请登录';
        return
        //未选择地址则提示
      } else if (!this.choosedAddress) {
        this.showAlert = true;
        this.alertText = '请添加一个收货地址';
        return
      }
      // //保存订单
      // this.SAVE_ORDER_PARAM({
      //   user_id: this.userInfo.user_id, //用户id
      //   cart_id: this.checkoutData.cart.id, //购物车id
      //   address_id: this.choosedAddress.id, //选择地址id
      //   description: this.remarklist, //备注
      //   entities: this.checkoutData.cart.groups, //购物车商品
      //   geohash: this.geohash, //地址
      //   sig: this.checkoutData.sig,
      // });
      //发送订单信息

      let foodList = new Array;
      this.checkoutData.forEach(item => {
        foodList.push({
          foodId: item.id,
          foodNum: item.quantity,
          amount: item.price,
        })
      })
      let orderRes = await createOrder(this.userInfo.id, this.shopInfo.id, this.choosedAddress.id, this.total, this.packing_fee, foodList);
      if (orderRes.code == 100 || orderRes.code == '100') {
        this.ORDER_SUCCESS(orderRes.data);
        this.$router.push({ path: '/payment', query: { orderId: orderRes.data.id } })
      }
    },
  },
  watch: {}
}

</script>
<style lang="scss" scoped>
.confirmOrderContainer {
  padding-top: 2.0rem;
  padding-bottom: 3rem;
  background-color: #F5F5F5;
}

.confirmOrderContainer p {
  font-family: Helvetica Neue, Tahoma, Arial;
}

.confirmOrderContainer span {
  font-family: Helvetica Neue, Tahoma, Arial;
}

.container_style {
  background-color: #fff;
  margin-top: .4rem;
  padding: 0 .7rem;
}

.address_container {
  min-height: 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 0.6rem;
  background: url(../../images/address_bottom.png) left bottom repeat-x;
  background-color: #fff;
  background-size: auto .12rem;
  .address_empty_left {
    display: flex;
    align-items: center;
    .location_icon {
      width: .8rem;
      height: .8rem;
      fill: #3190e8;
      margin-right: .2rem;
    }
    .add_address {
      font-size: .7rem;
      color: #333;
    }
    .address_detail_container {
      margin-left: .2rem;
      header {
        font-size: .65rem;
        color: #333;
        span:nth-of-type(1) {
          font-size: .8rem;
          font-weight: bold;
        }
      }
      .address_detail {
        width: 100%;
        display: flex;
        align-items: center;
        span {
          font-size: .5rem;
          color: #fff;
          border-radius: .15rem;
          background-color: #ff5722;
          height: .6rem;
          line-height: .6rem;
          padding: 0 .2rem;
          margin-right: .3rem;
        }
        p {
          font-size: .55rem;
          color: #777;
        }
      }
    }
  }
}

.address_empty_right {
  width: .6rem;
  height: .6rem;
  fill: #999;
}

.delivery_model {
  border-left: .2rem solid #3190e8;
  min-height: 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .deliver_text {
    font-size: .8rem;
    color: #333;
    font-weight: bold;
    padding-left: .3rem;
  }
  .deliver_time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: .7rem;
    color: #3190e8;
  }
  p:nth-of-type(2) {
    font-size: .5rem;
    color: #fff;
    background-color: #3190e8;
    width: 2.4rem;
    margin-top: .5rem;
    text-align: center;
    border-radius: 0.12rem;
    padding: .1rem;
  }
}

.pay_way {
  .header_style {
    display: flex;
    justify-content: space-between;
    line-height: 2rem;
    span:nth-of-type(1) {
      font-size: .7rem;
      color: #666;
    }
    .more_type {
      span:nth-of-type(1) {
        font-size: .6rem;
        color: #aaa;
        width: 10rem;
        display: inline-block;
        text-align: right;
        vertical-align: middle;
      }
      svg {
        width: .5rem;
        height: .5rem;
        fill: #ccc;
      }
    }
  }

  .hongbo {
    display: flex;
    justify-content: space-between;
    border-top: 0.025rem solid #f5f5f5;
    span {
      font-size: .6rem;
      color: #aaa;
      line-height: 2rem;
      svg {
        width: .5rem;
        height: .5rem;
        vertical-align: middle;
        fill: #ccc;
      }
    }
    span:nth-of-type(2) {
      color: #aaa;
    }
  }

  .support_is_available {
    span {
      color: #666;
    }
  }
}

.food_list {
  background-color: #fff;
  margin-top: .4rem;
  header {
    padding: .7rem;
    border-bottom: 0.025rem solid #f5f5f5;
    img {
      width: 1.2rem;
      height: 1.2rem;
      vertical-align: middle;
    }
    span {
      font-size: .8rem;
      color: #333;
    }
  }

  .food_list_ul {
    padding-top: .5rem;
    .food_item_style {
      background-color: #f1f1f1;
    }
    .food_item_style:nth-of-type(2n) {
      margin: .2rem 0;
    }
  }

  .food_item_style {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1.8rem;
    padding: 0 .7rem;
    span,
    p {
      font-size: .65rem;
      color: #666;
    }
    .food_name {
      flex: 1;
    }
    .food_icon {
      margin-right: 1rem;
    }
    .food_icon img {
      width: 1rem;
      vertical-align: middle;
    }
    .num_price {
      width: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span:nth-of-type(1) {
        color: #f60;
      }
    }
  }

  .total_price {
    border-top: 0.025rem solid #f5f5f5;
  }
}

.confrim_order {
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 2rem;
  p {
    line-height: 2rem;
    font-size: .75rem;
    color: #fff;
  }

  p:nth-of-type(1) {
    background-color: #3c3c3c;
    flex: 5;
    padding-left: .7rem;
  }

  p:nth-of-type(2) {
    flex: 2;
    background-color: #56d176;
    text-align: center;
  }
}

.cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .3);
  z-index: 203;
}

.choose_type_Container {
  min-height: 10rem;
  background-color: #fff;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 204;
  header {
    background-color: #fafafa;
    font-size: .7rem;
    color: #333;
    text-align: center;
    line-height: 2rem;
  }

  ul {
    li {
      display: flex;
      justify-content: space-between;
      padding: 0 .7rem;
      line-height: 2.5rem;
      align-items: center;
      span {
        font-size: .7rem;
        color: #ccc;
      }
      svg {
        width: .8rem;
        height: .8rem;
        fill: #eee;
      }
    }
    .choose {
      span {
        color: #333;
      }
      svg {
        fill: #4cd964;
      }
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.slid_up-enter-active,
.slid_up-leave-active {
  transition: all .3s;
}

.slid_up-enter,
.slid_up-leave-active {
  transform: translate3d(0, 10rem, 0)
}

.move-enter-active,
.move-leave-active {
  transition: all .2s linear;
  transform: translate3d(0, 0, 0);
}

.move-enter,
.move-leave-active {
  transform: translate3d(100%, 0, 0);
}

</style>
