<template>
  <div class="shop-detail-wrap">
    <v-headTop head-title="选择商品" back-path="/home" class="header-top" go-back='true'>
    </v-headTop>
    <div class="header">
      <!-- 内容 -->
      <div class="content-wrap">
        <!-- 头像 -->
        <div class="avatar">
          <img width="74" height="74" :src="imgBaseUrl + seller.shopLogoImg">
        </div>
        <!-- 内容区块 -->
        <div class="content">
          <!-- 标题 -->
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <!-- 描述 -->
          <div class="description">
            {{seller.description}} / {{seller.deliveryTime}}分钟送达
          </div>
          <!-- 活动 -->
          <div class="support" v-if="seller.supports">
            <span class="icon" :class="classMap[seller.supports[0].type]"></span>
            <span class="text">{{seller.supports[0].name}}</span>
          </div>
        </div>
        <!-- 活动数量 -->
        <div class="support-count" v-if="seller.supports" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icon-keyboard_arrow_right"></i>
        </div>
      </div>
      <!-- 模糊背景 -->
      <div class="background">
        <img :src="imgBaseUrl + seller.shopLogoImg" width="100%" height="100%">
      </div>
      <!-- 公告 -->
      <div class="bulletin-wrap" @click="showDetail">
        <span class="bulletin-title"></span>
        <span class="bulletin-text">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right"></i>
      </div>
      <!-- 浮层sticky footer布局 -->
      <transition name="fade">
        <div class="detail" v-show="detail" @click="hideDetail">
          <div class="detail-wrap clearfix">
            <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <!-- star组件 -->
              <div class="star-wrap">
                <!-- <v-star :size="48" :score="seller.score"></v-star> -->
              </div>
              <!-- 优惠信息标题 -->
              <div class="title">
                <div class="line"></div>
                <div class="text">优惠信息</div>
                <div class="line"></div>
              </div>
              <!-- 优惠信息列表 -->
              <ul class="support" v-if="seller.supports">
                <li class="support-item" v-for="(item,index) in seller.supports">
                  <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                  <span class="text">{{seller.supports[index].name}}</span>
                </li>
              </ul>
              <!-- 商家公告 -->
              <div class="title">
                <div class="line"></div>
                <div class="text">商家公告</div>
                <div class="line"></div>
              </div>
              <!-- 公告描述 -->
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
            </div>
          </div>
          <div class="detail-close" @click="hideDetail">
            <i class="icon-close"></i>
          </div>
        </div>
      </transition>
    </div>
    <!-- tab区域 -->
    <div class="tab">
      <div class="tab-item" v-for="(item,index) in navBar" @click="changeColor(index)">
        <router-link :to="{path: item.path, query:{geohash, shopId}}" :class="[{'active':item.type}]" replace><span>{{item.name}}</span></router-link>
      </div>
    </div>
    <!-- 路由设置 -->
    <keep-alive>
      <router-view :seller="seller" class="detail_wrap" v-if="routerShow"></router-view>
    </keep-alive>
    <!-- 加载前的背景 -->
    <section class="animation_opactiy shop_back_svg_container" v-if="showLoading">
      <img src="../../images/shop_back_svg.svg">
    </section>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import appData from '../../../data.json'; //本地测试数据
import headTop from '../../../src/components/header/head';
import { imgBaseUrl } from '../../config/env.js'
import { sellerDetail } from '../../../src/service/myData.js'
export default {
  // 返回一个对象
  data() {
    return {
      showLoading: true, //显示加载动画
      routerShow: false,
      detail: false,
      shopId: '',
      seller: '',
      imgBaseUrl,
      navBar: [{
          name: "商品",
          path: "/shopDetail/goods",
          type: true
        },
        {
          name: "评论",
          path: "/shopDetail/ratings",
          type: false
        }
      ]
    };
  },
  mounted() {
    this.initData();
  },
  computed: {
    ...mapState([
      'geohash',
    ]),
  },
  // 点击元素调用方法，动态设置显示隐藏
  methods: {
    ...mapMutations([
      'SAVE_SHOP_INFO'
    ]),
    async initData() {
      this.showLoading = false;
      this.shopId = this.$route.query.shopId;
      await sellerDetail(this.shopId).then(res => {
        this.seller = res.data;
        this.routerShow = true;
      });
      this.SAVE_SHOP_INFO(this.seller);
    },
    showDetail() {
      this.detail = true;
    },
    hideDetail() {
      this.detail = false;
    },
    changeColor(index) {
      //所有选项颜色复原
      for (var i = 0; i < this.navBar.length; i++) {
        this.navBar[i].type = false;
      }
      //当前点击对象变换新色
      this.navBar[index].type = true;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  // 注册star组件
  components: {
    'v-headTop': headTop,
  }
};

</script>
<style scoped>
.header-top {
  background-color: rgba(7, 17, 27, 0.2) !important;
}

.header {
  position: relative;
  overflow: hidden;
  padding-top: 40px;
  color: #fff;
  background: rgba(7, 17, 27, 0.5);
}

.header .content-wrap {
  position: relative;
  padding: 24px 12px 18px 24px;
  font-size: 0;
}





















/* 头像 */

.header .content-wrap .avatar {
  display: inline-block;
  vertical-align: top;
}

.header .content-wrap .avatar img {
  border-radius: 2px;
}

.header .content-wrap .content {
  display: inline-block;
  margin-left: 16px;
}





















/*// 商品标题*/

.header .content-wrap .content .title {
  margin: 2px 0 8px 0;
}

.header .content-wrap .content .title .brand {
  display: inline-block;
  vertical-align: top;
  width: 30px;
  height: 18px;
  background-image: url("../../images/brand@2x.png");
  background-size: 30px 18px;
  background-repeat: no-repeat;
}

@media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
  .header .content-wrap .content .title .brand {
    background-image: url("../../images/brand@3x.png")
  }
}

.header .content-wrap .content .title .name {
  margin-left: 6px;
  font-size: 16px;
  line-height: 18px;
  font-weight: bold;
}


/*// 商品描述*/

.header .content-wrap .content .description {
  margin-bottom: 10px;
  line-height: 12px;
  font-size: 12px;
}

.header .content-wrap .content .support .icon {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}

.header .content-wrap .content .support .decrease {
  background-image: url("../../images/decrease_1@2x.png");
}

.header .content-wrap .content .support .discount {
  background-image: url("../../images/discount_1@2x.png");
}

.header .content-wrap .content .support .guarantee {
  background-image: url("../../images/guarantee_1@2x.png");
}

.header .content-wrap .content .support .invoice {
  background-image: url("../../images/invoice_1@2x.png");
}

.header .content-wrap .content .support .special {
  background-image: url("../../images/special_1@2x.png");
}

@media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
  .header .content-wrap .content .support .decrease {
    background-image: url("../../images/decrease_1@3x.png");
  }
  .header .content-wrap .content .support .discount {
    background-image: url("../../images/discount_1@3x.png");
  }
  .header .content-wrap .content .support .guarantee {
    background-image: url("../../images/guarantee_1@3x.png");
  }
  .header .content-wrap .content .support .invoice {
    background-image: url("../../images/invoice_1@3x.png");
  }
  .header .content-wrap .content .support .special {
    background-image: url("../../images/special_1@3x.png");
  }
}

.header .content-wrap .content .support .text {
  line-height: 12px;
  font-size: 10px;
}





















/*// 活动数量*/

.header .content-wrap .support-count {
  position: absolute;
  right: 12px;
  bottom: 14px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.2);
  text-align: center;
}

.header .content-wrap .support-count .count {
  vertical-align: top;
  font-size: 10px;
}

.header .content-wrap .support-count .icon-keyboard_arrow_right {
  margin-left: 2px;
  line-height: 24px;
  font-size: 10px;
}





















/*// 模糊背景*/

.header .background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  filter: blur(10px);
  z-index: -1;
}





















/*// 公告*/

.header .bulletin-wrap {
  position: relative;
  height: 28px;
  line-height: 28px;
  padding: 0 22px 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background: rgba(7, 17, 27, 0.2);
}

.header .bulletin-wrap .bulletin-title {
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
  width: 22px;
  height: 12px;
  background-image: url("../../images/bulletin@2x.png");
  background-size: 22px 12px;
  background-repeat: no-repeat;
}

@media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
  .header .bulletin-wrap .bulletin-title {
    background-image: url("../../images/bulletin@3x.png");
  }
}

.header .bulletin-wrap .bulletin-text {
  vertical-align: top;
  margin: 0 4px;
  font-size: 10px;
}

.header .bulletin-wrap .icon-keyboard_arrow_right {
  position: absolute;
  font-size: 10px;
  right: 12px;
  top: 8px;
}





















/* 详情页 */

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.header .detail {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(0, 0, 0, .75);
  font-size: 0;
  z-index: 200;
}

.header .detail .detail-wrap {
  width: 100%;
  min-height: 100%;
}

.header .detail .detail-wrap .detail-main {
  margin-top: 64px;
  padding-bottom: 64px;
  font-size: 14px;
}





















/*// 星级评论*/

.header .detail .detail-wrap .detail-main .name {
  line-height: 16px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
}

.header .detail .detail-wrap .detail-main .star-wrap {
  margin-top: 18px;
  padding: 2px 0;
  text-align: center;
}





















/*// 优惠标题*/

.header .detail .detail-wrap .detail-main .title {
  display: flex;
  width: 80%;
  margin: 24px auto 28px auto;
}

.header .detail .detail-wrap .detail-main .title .line {
  flex: 1;
  position: relative;
  top: -6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.header .detail .detail-wrap .detail-main .title .text {
  padding: 0 12px;
  font-weight: 700;
  font-size: 14px;
}





















/*// 优惠列表*/

.header .detail .detail-wrap .detail-main .support {
  width: 80%;
  margin: 0 auto;
}

.header .detail .detail-wrap .detail-main .support .support-item {
  padding: 0 12px;
  margin-bottom: 12px;
  font-size: 0;
}

.header .detail .detail-wrap .detail-main .support .support-item:last-child {
  margin-bottom: 0;
}

.header .detail .detail-wrap .detail-main .support .support-item .icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: top;
  margin-right: 6px;
  background-size: 16px 16px;
  background-repeat: no-repeat;
}

.header .detail .detail-wrap .detail-main .support .support-item .decrease {
  background-image: url("../../images/decrease_2@2x.png");
}

.header .detail .detail-wrap .detail-main .support .support-item .discount {
  background-image: url("../../images/discount_2@2x.png");
}

.header .detail .detail-wrap .detail-main .support .support-item .guarantee {
  background-image: url("../../images/guarantee_2@2x.png");
}

.header .detail .detail-wrap .detail-main .support .support-item .invoice {
  background-image: url("../../images/invoice_2@2x.png");
}

.header .detail .detail-wrap .detail-main .support .support-item .special {
  background-image: url("../../images/special_2@2x.png");
}

@media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
  .header .detail .detail-wrap .detail-main .support .support-item .decrease {
    background-image: url("../../images/decrease_2@3x.png");
  }
  .header .detail .detail-wrap .detail-main .support .support-item .discount {
    background-image: url("../../images/discount_2@3x.png");
  }
  .header .detail .detail-wrap .detail-main .support .support-item .guarantee {
    background-image: url("../../images/guarantee_2@3x.png");
  }
  .header .detail .detail-wrap .detail-main .support .support-item .invoice {
    background-image: url("../../images/invoice_2@3x.png");
  }
  .header .detail .detail-wrap .detail-main .support .support-item .special {
    background-image: url("../../images/special_2@3x.png");
  }
}

.header .detail .detail-wrap .detail-main .support .support-item .text {
  line-height: 16px;
  font-size: 12px;
}





















/*// 商家描述*/

.header .detail .detail-wrap .detail-main .bulletin {
  width: 80%;
  margin: 0 auto;
}

.header .detail .detail-wrap .detail-main .bulletin .content {
  padding: 0 12px;
  line-height: 24px;
  font-size: 12px;
}





















/*// 关闭按钮*/

.header .detail .detail-close {
  position: relative;
  width: 32px;
  height: 32px;
  margin: -50px auto 0 auto;
  font-size: 32px;
  clear: both;
}

.tab {
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
}

.tab:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  content: ' ';
}

.tab .tab-item {
  flex: 1;
  text-align: center;
}

.tab .tab-item>a {
  display: block;
  font-size: 14px;
  color: rgb(77, 85, 93);
}

.tab .tab-item>a.active span {
  color: #3190e8;
  padding: 3px;
  border-bottom: 2px solid;
}

.detail_wrap {
  position: absolute;
  top: 224px;
  width: 100%;
  overflow: hidden;
}

.shop_back_svg_container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.shop_back_svg_container img {
  width: 100%;
  height: 100%;
}

</style>
