<template>
  <div class="order_detail_page">
    <v-headTop head-title="订单详情" go-back='true'></v-headTop>
    <section v-if="!showLoading" id="scroll_section" class="scroll_container">
      <section class="scroll_insert">
        <section class="order_titel">
          <img :src="imgBaseUrl + orderData.seller.shopLogoImg">
          <p class="order_status">{{orderData.status | payStatus}}</p>
          <v-computeTime v-if="orderData.status == 0" :orderId='orderData.id' :time="orderData.createDate | timePass"></v-computeTime>
          <router-link class="order_again" :to="{path: '/shopDetail', query: {geohash, shopId: orderData.seller.id}}" v-else>再来一单</router-link>
        </section>
        <section class="food_list">
          <router-link class="food_list_header" :to="{path: '/shopDetail', query: {geohash, shopId: orderData.seller.id}}">
            <div class="shop_name">
              <img :src="imgBaseUrl + orderData.seller.shopLogoImg">
              <span>{{orderData.seller.name}}</span>
            </div>
            <svg fill="#333" class="arrow_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </router-link>
          <ul class="food_list_ul">
            <li v-for="item in orderData.relList">
              <p class="food_name ellipsis">{{item.foodName}}</p>
              <div class="quantity_price">
                <span>X{{item.foodNum}}</span>
                <span>¥{{item.amount}}</span>
              </div>
            </li>
          </ul>
          <div class="deliver_fee">
            <span>包装费</span>
            <span>¥{{totalCount || 0}}</span>
          </div>
          <div class="deliver_fee">
            <span>配送费</span>
            <span>¥{{orderData.seller.piecewiseAgentFee || 0}}</span>
          </div>
          <div class="pay_ment">实付 ¥{{orderData.amount.toFixed(2)}}</div>
        </section>
        <section class="order_detail_style">
          <header>配送信息</header>
          <section class="item_style">
            <p class="item_left">送达时间：</p>
            <div class="item_right">
              <p>{{sendTime(orderData.createDate)}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">送货地址：</p>
            <div class="item_right">
              <p>{{orderData.contact.adress}}</p>
              <p>{{orderData.contact.adressDetail}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">联系电话：</p>
            <div class="item_right">
              <p>{{orderData.contact.phone}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">配送方式：</p>
            <div class="item_right">
              <p>蜂鸟专送</p>
            </div>
          </section>
        </section>
        <section class="order_detail_style">
          <header>订单信息</header>
          <section class="item_style">
            <p class="item_left">订单号：</p>
            <div class="item_right">
              <p>{{orderData.id}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">支付方式：</p>
            <div class="item_right">
              <p>在线支付</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">下单时间：</p>
            <div class="item_right">
              <p>{{orderData.createDate | formatDate}}</p>
            </div>
          </section>
        </section>
      </section>
    </section>
    <transition name="loading">
      <v-loading v-if="showLoading"></v-loading>
    </transition>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import BScroll from 'better-scroll'
import headTop from '../../../components/header/head.vue'
import loading from '../../../components/common/loading.vue'
import computeTime from '../../../components/common/computeTime.vue'
import { getImgPath } from '../../../components/common/mixin.js'
import { getOrderDetail } from '../../../service/myData.js'
import { imgBaseUrl } from '../../../config/env.js'
import { formatDate } from '../../../config/mUtils.js'


export default {

  data() {
    return {
      showLoading: true, //显示加载动画
      orderData: null,
      imgBaseUrl
    }
  },
  mounted() {
    this.initData();
  },
  mixins: [getImgPath],
  components: {
    'v-headTop': headTop,
    'v-loading': loading,
    'v-computeTime': computeTime
  },
  computed: {
    ...mapState([
      'geohash', 'userInfo', 'shopInfo'
    ]),
    // 商品数量
    totalCount() {
      let count = 0;
      this.orderData.relList.forEach((food) => {
        count += food.foodNum;
      });
      return count;
    },
  },
  methods: {
    async initData() {
      if (this.userInfo && this.userInfo.id) {
        let res = await getOrderDetail(this.$route.query.orderId);
        this.orderData = res.data;
        console.log(res.data);
        this.showLoading = false;
        this.$nextTick(() => {
          new BScroll('#scroll_section', {
            deceleration: 0.001,
            bounce: true,
            swipeTime: 1800,
            click: true,
          });
        })
      }
    },
    sendTime(send_time) {
      let time = new Date(send_time);
      // console.log(this.shopInfo);
      let b = this.shopInfo.deliveryTime; //分钟数
      time.setMinutes(time.getMinutes() + 40, time.getSeconds(), 0);
      return formatDate(time, 'yyyy-MM-dd hh:mm:ss');
    },
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
    timePass(time) {
      let nowDate = new Date().valueOf();
      let orderDate = new Date(time).valueOf();
      let passTime = (nowDate - orderDate) / 1000;
      return passTime;
    },
    payStatus(num) {
      switch (num) {
        case 0:
          return '待支付';
        case 1:
          return '支付完成';
        case 2:
          return '支付超时';
      }
    },
  },
  watch: {
    userInfo: function(value) {
      if (value && value.id) {
        this.initData();
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.order_detail_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f1f1f1;
  z-index: 202;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.scroll_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 1.95rem;
}

.scroll_insert {
  padding-bottom: 3rem;
}

.order_titel {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: .7rem;
  background-color: #fff;
  margin-bottom: 0.5rem;
  img {
    border: 0.05rem solid #3190e8;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
  }
  .order_status {
    font-size: .9rem;
    color: #333;
    font-weight: bold;
    margin: .4rem 0;
  }
  .order_again {
    font-size: .6rem;
    color: #3190e8;
    margin-top: .5rem;
    border: 0.025rem solid #3190e8;
    padding: .15rem .4rem;
    border-radius: .1rem;
  }
}

.food_list {
  background-color: #fff;
  .food_list_header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .2rem .5rem;
    border-bottom: 1px solid #f5f5f5;
    .shop_name {
      img {
        width: 1.2rem;
        height: 1.2rem;
        vertical-align: middle;
        margin-right: .2rem;
      }
      span {
        font-size: .75rem;
        color: #333;
        font-weight: bold;
      }
    }
    svg {
      width: .6rem;
      height: .6rem;
      fill: #666;
    }
  }
  .food_list_ul {
    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 .5rem;
      line-height: 2rem;
      .food_name {
        font-size: .6rem;
        color: #666;
        flex: 4;
      }
      .quantity_price {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:nth-of-type(1) {
          font-size: .6rem;
          color: #ccc;
        }
        span:nth-of-type(2) {
          font-size: .6rem;
          color: #666;
        }
      }
    }
  }
  .deliver_fee {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .5rem;
    line-height: 2rem;
    border-top: 1px solid #f5f5f5;
    span {
      font-size: .6rem;
      color: #666;
    }
  }
  .pay_ment {
    font-size: .6rem;
    color: #fb6b23;
    border-top: 1px solid #f5f5f5;
    font-weight: bold;
    line-height: 2rem;
    text-align: right;
    padding-right: .5rem;
  }
}

.order_detail_style {
  background-color: #fff;
  margin-top: 0.5rem;
  header {
    font-size: .75rem;
    color: #333;
    padding: .5rem;
    border-bottom: 1px solid #f5f5f5;
  }
  .item_style {
    display: flex;
    padding: .5rem;
    p {
      font-size: .65rem;
      color: #666;
      line-height: 1rem;
    }
  }
}

.loading-enter-active,
.loading-leave-active {
  transition: all .3s linear;
  transform: translate3d(0, 0, 0);
}

.loading-enter,
.loading-leave-active {
  transform: translate3d(100%, 0, 0);
}

</style>
