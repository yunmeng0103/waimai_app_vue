<template>
  <transition name="move">
    <div class="food" v-show="flag" ref="food">
      <!-- 返回按钮 -->
      <div class="goods_detail_head_top">
        <div class="head_goback" @click="hide">
          <i class="icon-arrow_lift"></i>
        </div>
        <div class="title_head">
          <span class="title_text">详情</span>
        </div>
      </div>
      <!-- 内容部分 -->
      <div>
        <div class="image-header">
          <img :src="foodDetail.icon">
        </div>
        <div class="content">
          <h1 class="title">{{foodDetail.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{foodDetail.sellCount}}份</span>
            <span class="rating">好评率{{foodDetail.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{foodDetail.price}}</span><span class="old" v-show="foodDetail.oldPrice">￥{{foodDetail.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper" v-show="foodDetail.count || foodDetail.count!==0">
            <v-cartcontrol :food="foodDetail" @drop="drop"></v-cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!foodDetail.count || foodDetail.count===0">加入购物车
            </div>
          </transition>
        </div>
        <div class="split" v-show="foodDetail.info"></div>
        <!-- 商品详情 -->
        <div class="info" v-show="foodDetail.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{foodDetail.info}}</p>
        </div>
        <div class="split"></div>
        <!-- 评价 -->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 评价列表 -->
          <div class="rating-wrapper">
            <ul v-show="foodDetail.ratings && foodDetail.ratings.length">
              <!-- 按需显示 -->
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in foodDetail.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!foodDetail.ratings || !foodDetail.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import cartcontrol from '../../../components/common/cartcontrol.vue';
import { formatDate } from '../../../config/mUtils.js';
// 默认值
const ALL = 2;
export default {
  props: {
    foodDetail: {
      type: Object
    }
  },
  data() {
    return {
      flag: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      },
      // 子组件将来要修改父组件数据，必须传入对象
      selectType: ALL,
      onlyContent: false
    }
  },
  methods: {
    show() {
      this.flag = true
      this.$nextTick(() => {
        if (!this.scroll) {
          // console.log(this.scroll)
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          // console.log(this.scroll)
          this.scroll.refresh();
        }
      });
    },
    hide() {
      this.flag = false
    },
    addFirst(event) {
      if (!event._constructed) {
        return
      }
      Vue.set(this.foodDetail, 'count', 1);
      // 将当前 dom 传递出去，用来做小球飞入效果
      this.$emit('drop', event.target);
    },
    drop(target) {
      this.$emit('drop', target)
    },
    needShow(type, text) {
      // 如果只显示内容且不存在内容
      if (this.onlyContent && !text) {
        return false
      }
      if (this.selectType === ALL) { //显示全部
        return true;
      } else {
        return this.selectType === type
      }
    },
  },
  components: {
    'v-cartcontrol': cartcontrol,
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      // console.log(time);
      // console.log(date);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  }
}

</script>
<style lang="scss" scoped>
.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  padding-bottom: 48px;
  width: 100%;
  z-index: 101;
  background: #fff;
  overflow-y: scroll;
  &.move-enter-active,
  &.move-leave-active {
    transition: all .3s linear;
    transform: translate3d(0, 0, 0);
  }

  &.move-enter,
  &.move-leave-active {
    transform: translate3d(100%, 0, 0);
  }
  .goods_detail_head_top {
    position: absolute;
    z-index: 102;
    left: 0;
    top: 0;
    width: 100%;
    height: 2.0rem;
    background-color: rgba(7, 17, 27, 0.2);
    .head_goback {
      line-height: 2.2rem;
      margin-left: .4rem;
      color: #fff;
      font-size: .7rem;
    }
    .title_head {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 50%;
      color: #fff;
      text-align: center;
      .title_text {
        font-size: 0.8rem;
        color: #fff;
        text-align: center;
        font-weight: bold;
      }
    }
  }
  .image-header {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;
    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
  .content {
    position: relative;
    padding: 18px;
    .title {
      line-height: 14px;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
    }
    .detail {
      margin-bottom: 18px;
      line-height: 10px;
      height: 10px;
      font-size: 0;
      .sell-count,
      .rating {
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
      .sell-count {
        margin-right: 12px;
      }
    }
    .price {
      font-weight: 700;
      line-height: 24px;
      .now {
        margin-right: 8px;
        font-size: 14px;
        color: rgb(240, 20, 20);
      }
      .old {
        text-decoration: line-through;
        font-size: 10px;
        color: rgb(147, 153, 159);
      }
    }
    .cartcontrol-wrapper {
      position: absolute;
      right: 12px;
      bottom: 12px;
    }
    .buy {
      position: absolute;
      right: 18px;
      bottom: 18px;
      z-index: 10;
      height: 24px;
      line-height: 24px;
      padding: 0 12px;
      box-sizing: border-box;
      border-radius: 12px;
      font-size: 10px;
      color: #fff;
      background: rgb(0, 160, 220);
      &.fade-enter-active,
      &.fade-leave-active {
        transition: all 0.4s linear;
      }
      &.fade-enter,
      &.fade-leave-to {
        opacity: 0;
      }
    }
  }
  .info {
    padding: 18px;
    .title {
      line-height: 14px;
      margin-bottom: 6px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .text {
      line-height: 24px;
      padding: 0 8px;
      font-size: 12px;
      color: rgb(77, 85, 93);
    }
  }
  .split {
    width: 100%;
    height: 8px;
    border-top: 1px solid rgba(7, 17, 27, 0.1);
    border-bottom: 1px solid rgba(7, 17, 27, 0.1);
    background: #f3f5f7;
  }
  .rating {
    padding-top: 18px;
    .title {
      line-height: 14px;
      margin-left: 18px;
      font-size: 14px;
      color: rgb(7, 17, 27);
    }
    .rating-wrapper {
      padding: 0 18px;
      .rating-item {
        position: relative;
        padding: 16px 0;
        .user {
          position: absolute;
          right: 0;
          top: 16px;
          line-height: 12px;
          font-size: 0;
          .name {
            display: inline-block;
            margin-right: 6px;
            vertical-align: top;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .avatar {
            border-radius: 50%;
          }
        }
        .time {
          margin-bottom: 6px;
          line-height: 12px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }
        .text {
          line-height: 16px;
          font-size: 12px;
          color: rgb(7, 17, 27);
          .icon-thumb_up,
          .icon-thumb_down {
            margin-right: 4px;
            line-height: 16px;
            font-size: 12px;
          }
          .icon-thumb_up {
            color: rgb(0, 160, 220);
          }
          .icon-thumb_down {
            color: rgb(147, 153, 159);
          }
        }
      }
      .no-rating {
        padding: 16px 0;
        font-size: 12px;
        color: rgb(147, 153, 159);
      }
    }
  }
}

</style>
