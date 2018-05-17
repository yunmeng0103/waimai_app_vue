<template>
  <div class="order">
    <v-headTop head-title="订单列表" go-back='true'></v-headTop>
    <div class="order_container" v-if="orderList.length">
      <ul class="order_list_ul" v-load-more="loaderMore">
        <li class="order_list_li" v-for="item in orderList">
          <img :src="imgBaseUrl + item.seller.shopLogoImg" class="restaurant_image">
          <div class="order_item_right">
            <header class="order_item_right_header">
              <div class="order_header">
                <router-link :to='{path: "/order/orderDetail", query: {orderId:item.id }}'>
                  <h4>
                    <span class="ellipsis">{{item.seller.name}}</span>
                    <svg fill="#333" class="arrow_right">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                    </svg>
                  </h4>
                </router-link>
                <p class="order_time">{{item.createDate | formatDate}}</p>
              </div>
              <p class="order_status">
                {{item.status | payStatus}}
              </p>
            </header>
            <div class="order_basket">
              <!-- <p class="order_name ellipsis">{{item.basket.group[0][0].name}}{{item.basket.group[0].length > 1 ? ' 等' + item.basket.group[0].length + '件商品' : ''}}</p> -->
              <p class="order_amount">¥{{item.amount.toFixed(2)}}</p>
            </div>
            <div class="order_again">
              <v-computeTime v-if="item.status == 0" :orderId='item.id' :time="item.createDate | timePass"></v-computeTime>
              <router-link :to="{path: '/shopDetail', query: {geohash, shopId: item.seller.id}}" tag="span" class="buy_again" v-else>再来一单
              </router-link>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="touchend" class="empty_data">没有更多了</div>
    </div>
    <div class="no_orderList" v-else>
      <img src="../../images/no-log.png" height="170" width="300">
      <p>暂无订单记录</p>
    </div>
    <v-footGuide></v-footGuide>
    <transition name="loading">
      <v-loading v-show="showLoading"></v-loading>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import adata from '../../../order-list.json'

import { mapState, mapMutations } from 'vuex'
import headTop from '../../components/header/head.vue'
import computeTime from '../../components/common/computeTime.vue'
import loading from '../../components/common/loading.vue'
import footGuide from '../../components/footer/footGuide.vue'
import { loadMore, getImgPath } from '../../components/common/mixin.js'
import { getOrderList } from '../../service/myData.js'
import { imgBaseUrl } from '../../config/env.js'
import { formatDate } from '../../config/mUtils.js'


export default {
  data() {
    return {
      orderList: '', //订单列表
      offset: 0,
      preventRepeat: false, //防止重复获取
      showLoading: true, //显示加载动画
      touchend: false, //没有更多数据
      imgBaseUrl
    }
  },
  created() {
    this.$nextTick(() => {
      this.initData();
    })
  },
  mixins: [loadMore],
  components: {
    'v-headTop': headTop,
    'v-footGuide': footGuide,
    'v-loading': loading,
    'v-computeTime': computeTime,
  },
  computed: {
    ...mapState([
      'userInfo', 'geohash'
    ]),
  },
  methods: {
    ...mapMutations([
      // 'SAVE_ORDER'
    ]),
    //初始化获取信息
    async initData() {
      if (this.userInfo && this.userInfo.id) {
        let res = await getOrderList(this.offset, this.userInfo.id);
        this.orderList = [...res.data.list];
        if (res.data.list.length < 10) {
          this.touchend = true;
          this.preventRepeat = true;
        }
      }
      this.hideLoading();
    },
    //加载更多
    async loaderMore() {
      if (this.preventRepeat) {
        return
      }
      this.preventRepeat = false;
      this.showLoading = true;
      this.offset += 1;
      //获取信息
      let res = await getOrderList(this.offset, this.userInfo.id);
      setTimeout(() => {
        this.orderList = [...this.orderList, ...res.data.list];
        this.hideLoading();
      }, 500)
      if (res.data.list.length < 10) {
        this.touchend = true;
        this.preventRepeat = true;
      }
    },
    //显示详情页
    showDetail(item) {
      // this.SAVE_ORDER(item);
      this.preventRepeat = false;
      this.$router.push('/order/orderDetail');
    },
    //生产环境与发布环境隐藏loading方式不同
    hideLoading() {
      this.showLoading = false;
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
      if (value && value.id && !this.orderList) {
        this.initData();
      }
    }
  }
}

</script>
<style scoped>
.order {
  background-color: #f1f1f1 !important;
  padding-bottom: .5rem;
  height: 100%;
}

.order p,
.order span,
.order h4 {
  font-family: Helvetica Neue, Tahoma, Arial;
}

.order_container {
  padding-top: 2.0rem;
  padding-bottom: 2.0rem;
}

.order_list_ul .order_list_li {
  background-color: #fff;
  display: flex;
  margin-bottom: 0.5rem;
  padding: .6rem .6rem 0;
}

.order_list_ul .order_list_li .restaurant_image {
  width: 2rem;
  height: 2rem;
  margin-right: 0.4rem;
}

.order_list_ul .order_list_li .order_item_right {
  flex: 1;
}

.order_list_ul .order_list_li .order_item_right .order_item_right_header {
  border-bottom: 0.025rem solid #f5f5f5;
  padding-bottom: .3rem;
  display: flex;
  justify-content: space-between;
}

.order_list_ul .order_list_li .order_item_right .order_item_right_header .order_header h4 {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: .6rem;
  color: #333;
  line-height: 1rem;
  width: 5rem;
}

.order_list_ul .order_list_li .order_item_right .order_item_right_header .order_header h4 .arrow_right {
  width: .4rem;
  height: .4rem;
  fill: #ccc;
  margin-right: .2rem;
}

.order_list_ul .order_list_li .order_item_right .order_item_right_header .order_header .order_time {
  font-size: .55rem;
  color: #999;
  line-height: .8rem;
}

.order_list_ul .order_list_li .order_item_right .order_item_right_header .order_status {
  font-size: .6rem;
  color: #333;
}

.order_list_ul .order_list_li .order_item_right .order_basket {
  display: flex;
  justify-content: space-between;
  line-height: 2rem;
  border-bottom: 0.025rem solid #f5f5f5;
}

.order_list_ul .order_list_li .order_item_right .order_basket .order_name {
  font-size: .6rem;
  color: #666;
}

.order_list_ul .order_list_li .order_item_right .order_basket .order_amount {
  font-size: .6rem;
  color: #f60;
  font-weight: bold;
}

.order_list_ul .order_list_li .order_item_right .order_again {
  text-align: right;
  line-height: 1.6rem;
}

.order_list_ul .order_list_li .order_item_right .order_again .buy_again {
  font-size: .55rem;
  color: #3190e8;
  border: 0.025rem solid #3190e8;
  padding: .1rem .2rem;
  border-radius: .15rem;
}

.empty_data {
  font-size: .5rem;
  color: #666;
  text-align: center;
  line-height: 1.2rem;
}

.no_orderList {
  text-align: center;
  margin-top: 1rem;
}

.no_orderList img {
  width: 8rem;
  height: 5rem;
}

.no_orderList p {
  margin-top: .5rem;
  font-size: .7rem;
  color: #666;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity .7s
}

.loading-enter,
.loading-leave-active {
  opacity: 0
}

.router-slid-enter-active,
.router-slid-leave-active {
  transition: all .3s linear;
  transform: translate3d(0, 0, 0);
}

.router-slid-enter,
.router-slid-leave-active {
  transform: translate3d(100%, 0, 0);
}

</style>
