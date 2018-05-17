<template>
  <div class="shoplist_container">
    <ul v-load-more="loaderMore" v-if="shopListArr.length" type="1">
      <router-link :to="{path: '/shopDetail', query:{ shopId: item.id}}" v-for="item in shopListArr" tag='li' :key="item.id" class="shop_li">
        <section>
          <img v-lazy="imgBaseUrl + item.shopLogoImg" class="shop_img">
        </section>
        <hgroup class="shop_right">
          <header class="shop_detail_header">
            <h4 :class="item.isPremiun? 'premium': ''" class="shop_title ellipsis">{{item.name}}</h4>
            <ul class="shop_detail_ul">
              <li class="supports">保</li>
              <li class="supports">准</li>
              <li class="supports">票</li>
            </ul>
          </header>
          <h5 class="rating_order_num">
            <section class="rating_order_num_left">
              <section class="rating_section">
                <v-ratingStar :rating='item.score'></v-ratingStar>
                <span class="rating_num">{{item.score}}</span>
              </section>
              <section class="order_section">
                月售{{item.recentOrderNum}}单
              </section>
            </section>
            <section class="rating_order_num_right">
              <span class="delivery_style delivery_left" v-if="item.deliveryMode">{{item.deliveryMode}}</span>
              <span class="delivery_style delivery_right">准时达</span>
            </section>
          </h5>
          <h5 class="fee_distance">
            <p class="fee">
              ¥{{item.floatMinimumOrderAmount}}起送 
              <span class="segmentation">/</span>
              配送费约¥{{item.piecewiseAgentFee}}
            </p>
            <p class="distance_time">
              <span v-if="Number(item.distance)">{{item.distance > 1000? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
              </span>
              <span v-else>{{item.distance}}</span>
              <span class="segmentation">/</span>
              <span class="order_time">{{item.deliveryTime}}分钟</span>
            </p>
          </h5>
        </hgroup>
      </router-link>
    </ul>
    <p v-if="touchend&&shopListArr.length!=0" class="empty_data">没有更多了</p>
    <ul v-else class="animation_opactiy">
      <li class="list_back_li" v-for="item in 10" :key="item">
        <img src="../../images/shopback.svg" class="list_back_svg">
      </li>
    </ul>
    <v-toTop :shop-list="false"></v-toTop>
    <div ref="abc" style="background-color: red;"></div>
    <transition name="loading">
      <v-loading v-show="showLoading"></v-loading>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { shopList } from '../../service/getData.js'
import { sellerList } from '../../service/myData.js'
import { imgBaseUrl } from '../../config/env.js'
import { loadMore, getImgPath } from './mixin.js'
import toTop from './toTop.vue'
import loading from './loading.vue'
import ratingStar from './ratingStar.vue'

export default {
  data() {
    return {
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
      shopListArr: [], // 店铺列表数据
      preventRepeatReuqest: false, //到达底部加载数据，防止重复加载
      showLoading: false, //显示加载动画
      touchend: false, //没有更多数据
      imgBaseUrl,
    }
  },
  mounted() {
    this.initData();
  },
  components: {
    'v-loading': loading,
    'v-toTop': toTop,
    'v-ratingStar': ratingStar,
  },
  props: ['restaurantCategoryId'],
  mixins: [loadMore, getImgPath], //mixins就是定义一部分公共的方法或者计算属性,然后混入到各个组件中使用,方便管理与统一修改
  computed: {},
  methods: {
    async initData() {
      //获取数据
      let res = await sellerList(this.offset, this.restaurantCategoryId);
      let shopList = res.data.list;
      this.shopListArr = [...shopList];
      if (shopList.length < 10) {
        this.touchend = true;
      }
    },
    //到达底部加载更多数据
    async loaderMore() {
      if (this.touchend) {
        //小于20条，没有更多数据
        return
      }
      //防止重复请求
      if (this.preventRepeatReuqest) {
        return
      }
      this.showLoading = true;
      this.preventRepeatReuqest = true;

      //数据的定位加10位
      this.offset += 1;
      let res = await sellerList(this.offset, this.restaurantCategoryId);
      let shopList = res.data.list;
      this.hideLoading();
      this.shopListArr = [...this.shopListArr, ...shopList];
      //当获取数据小于10，说明没有更多数据，不需要再次请求数据
      if (shopList.length < 10) {
        this.touchend = true;
        return
      }

      this.preventRepeatReuqest = false;
    },
    //监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
    async listenPropChange() {
      this.showLoading = true;
      this.offset = 0;
      let res = await sellerList(this.offset, this.restaurantCategoryId);
      let shopList = res.data.list;
      this.hideLoading();
      //考虑到本地模拟数据是引用类型，所以返回一个新的数组
      this.shopListArr = [...shopList];
    },
    //开发环境与编译环境loading隐藏方式不同
    hideLoading() {
      this.showLoading = false;
    },
  },
  watch: {
    //监听父级传来的restaurantCategoryId，当值发生变化的时候重新获取餐馆数据
    restaurantCategoryId(value) {
      if (value) {
        this.listenPropChange();
      }
    },
  }
}

</script>
<style scoped>
.shoplist_container {
  background-color: #fff;
  margin-bottom: 2rem;
}

.shop_li {
  display: flex;
  border-bottom: 0.025rem solid #f1f1f1;
  padding: 0.7rem 0.4rem;
}

.shop_img {
  width: 2.7rem;
  height: 2.7rem;
  display: block;
  margin-right: 0.4rem;
}

.list_back_li {
  height: 4.85rem;
}

.list_back_li .list_back_svg {
  width: 100%;
  height: 100%;
}

.shop_right {
  flex: auto;
}

.shop_right .shop_detail_header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.shop_right .rating_order_num {
  display: flex;
  justify-content: space-between;
  height: 0.6rem;
  margin-top: 0.52rem;
}

.shop_right .rating_order_num .rating_order_num_left {
  display: flex;
  justify-content: flex-start;
}

.shop_right .rating_order_num .rating_order_num_left .rating_section {
  display: flex;
}

.shop_right .rating_order_num .rating_order_num_left .rating_section .rating_num {
  font-size: 0.4rem;
  color: #ff6000;
  margin: 0 0.2rem;
}

.shop_right .rating_order_num .rating_order_num_left .order_section {
  transform: scale(.8);
  margin-left: -0.2rem;
  font-size: 0.4rem;
  color: #666;
}

.shop_right .rating_order_num .rating_order_num_right {
  display: flex;
  align-items: center;
  transform: scale(.7);
  min-width: 5rem;
  justify-content: flex-end;
  margin-right: -0.8rem;
}

.shop_right .rating_order_num .rating_order_num_right .delivery_style {
  font-size: 0.4rem;
  padding: 0.04rem 0.08rem 0;
  border-radius: 0.08rem;
  margin-left: 0.08rem;
  border: 1px;
}

.shop_right .rating_order_num .rating_order_num_right .delivery_left {
  color: #fff;
  background-color: #3190e8;
  border: 0.025rem solid #3190e8;
}

.shop_right .rating_order_num .rating_order_num_right .delivery_right {
  color: #3190e8;
  border: 0.025rem solid #3190e8;
}

.shop_right .shop_detail_header .shop_title {
  width: 8.5rem;
  color: #333;
  padding-top: .01rem;
  font: .65rem/.65rem 'PingFangSC-Regular';
  font-weight: 700;
}

.shop_right .shop_detail_header .premium::before {
  content: '品牌';
  display: inline-block;
  font-size: 0.5rem;
  line-height: .6rem;
  color: #333;
  background-color: #ffd930;
  padding: 0 0.1rem;
  border-radius: 0.1rem;
  margin-right: 0.2rem;
}

.shop_right .shop_detail_header .shop_detail_ul {
  display: flex;
  transform: scale(.8);
  margin-right: -0.3rem;
}

.shop_right .shop_detail_header .shop_detail_ul .supports {
  font-size: 0.5rem;
  color: #999;
  border: 0.025rem solid #f1f1f1;
  padding: 0 0.04rem;
  border-radius: 0.08rem;
  margin-left: 0.05rem;
}

.shop_right .fee_distance {
  margin-top: 0.52rem;
  display: flex;
  justify-content: space-between;
  font-size: 0.5rem;
  color: #333;
}

.shop_right .fee_distance .fee {
  transform: scale(.9);
  font-size: 0.5rem;
  color: #666;
}

.shop_right .fee_distance .distance_time {
  transform: scale(.9);
}

.shop_right .fee_distance .distance_time span {
  color: #999;
}

.shop_right .fee_distance .distance_time .order_time {
  color: #3190e8;
}

.shop_right .fee_distance .distance_time .segmentation {
  color: #ccc;
}

.loader_more {
  text-align: center;
  color: #999;
  font: .2rem 'Microsoft YaHei';
}

.empty_data {
  font-size: .5rem;
  color: #666;
  text-align: center;
  line-height: 2rem;
}

.loading-enter-active,
.loading-leave-active {
  transition: opacity 1s
}

.loading-enter,
.loading-leave-active {
  opacity: 0
}

</style>
