<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <v-ratingStar :rating='seller.score'></v-ratingStar>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankrate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <v-ratingStar class="star" :rating='seller.serviceScore'></v-ratingStar>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <v-ratingStar class="star" :rating='seller.foodScore'></v-ratingStar>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <div class="split"></div>
      <!-- 评价列表 -->
      <div class="rating-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item">
            <div class="avatar">
              <img width="28" height="28" :src="rating.image">
            </div>
            <div class="content">
              <h1 class="name">{{rating.userName}}</h1>
              <div class="star-wrapper">
                <v-ratingStar :rating='seller.score'></v-ratingStar>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.content}}</p>
              <div class="recommend" v-show="rating.foodNames && rating.foodNames.length">
                <span class="icon-thumb_up"></span>
                <span class="item" v-for="item in rating.foodNames">{{item}}</span>
              </div>
              <div class="time">
                {{rating.createTime | formatDate}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import appData from '../../../../data.json';
import ratingStar from '../../../components/common/ratingStar.vue'
import BScroll from 'better-scroll';
import { formatDate } from '../../../config/mUtils.js';
import { sellerRating } from '../../../service/myData.js'
const ALL = 2;
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      desc: {
        all: '全部',
        positive: '满意',
        negative: '不满意'
      },
      // 子组件将来要修改父组件数据，必须传入对象
      selectType: ALL,
      onlyContent: false,
      ratings: []
    }
  },
  components: {
    'v-ratingStar': ratingStar,
  },
  created() {
    // this.ratings = appData.ratings;
    sellerRating(this.seller.id).then(res => {
      this.ratings = res.data;
      // this.goods = appData.goods;
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.ratings, {
          click: true
        })
      });
    });
  },
  methods: {
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  }
};

</script>
<style scoped>
.ratings {
  bottom: 0;
  left: 0;
}

.ratings .overview {
  display: flex;
  padding: 18px 0;
}

.ratings .overview .overview-left {
  flex: 0 0 137px;
  padding: 6px 0;
  width: 137px;
  border-right: 1px solid rgba(7, 17, 27, 0.1);
  text-align: center;
}

@media only screen and (max-width: 320px) {
  .ratings .overview .overview-left {
    flex: 0 0 120px;
    width: 120px;
  }
}

.ratings .overview .overview-left .score {
  line-height: 28px;
  font-size: 24px;
  color: rgb(255, 153, 0);
}

.ratings .overview .overview-left .title {
  margin-bottom: 8px;
  line-height: 12px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}

.ratings .overview .overview-left .rank {
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}

.ratings .overview .overview-right {
  flex: 1;
  padding: 6px 0 6px 24px;
}

@media only screen and (max-width: 320px) {
  .ratings .overview .overview-right {
    padding-left: 6px;
  }
}

.ratings .overview .overview-right .score-wrapper {
  margin-bottom: 8px;
  font-size: 0;
}

.ratings .overview .overview-right .score-wrapper .title {
  display: inline-block;
  line-height: 18px;
  vertical-align: top;
  font-size: 12px;
  color: rgb(7, 17, 27);
}

.ratings .overview .overview-right .score-wrapper .star {
  display: inline-block;
  margin: 0 12px;
  vertical-align: top;
}

.ratings .overview .overview-right .score-wrapper .score {
  display: inline-block;
  line-height: 18px;
  vertical-align: top;
  font-size: 12px;
  color: rgb(255, 153, 0);
}

.ratings .overview .overview-right .delivery-wrapper {
  font-size: 0;
}

.ratings .overview .overview-right .delivery-wrapper .title {
  line-height: 18px;
  font-size: 12px;
  color: rgb(7, 17, 27);
}

.ratings .overview .overview-right .delivery-wrapper .delivery {
  margin-left: 12px;
  font-size: 12px;
  color: rgb(147, 153, 159);
}

.ratings .split {
  width: 100%;
  height: 16px;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  background: #f3f5f7;
}

.ratings .rating-wrapper {
  padding: 0 18px;
}

.ratings .rating-wrapper .rating-item {
  display: flex;
  padding: 18px 0;
  position: relative;
}

.ratings .rating-wrapper .rating-item:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  content: ' ';
}

.ratings .rating-wrapper .rating-item .avatar {
  flex: 0 0 28px;
  width: 28px;
  margin-right: 12px;
}

.ratings .rating-wrapper .rating-item .avatar img {
  border-radius: 50%;
}

.ratings .rating-wrapper .rating-item .content {

  position: relative;
  flex: 1;
}

.ratings .rating-wrapper .rating-item .content .name {
  margin-bottom: 4px;
  line-height: 12px;
  font-size: 10px;
  color: rgb(7, 17, 27);
}

.ratings .rating-wrapper .rating-item .content .star-wrapper {
  margin-bottom: 6px;
  font-size: 0;
}

.ratings .rating-wrapper .rating-item .content .star-wrapper .star {
  display: inline-block;
  margin-right: 6px;
  vertical-align: top;
}

.ratings .rating-wrapper .rating-item .content .star-wrapper .delivery {

  display: inline-block;
  vertical-align: top;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}

.ratings .rating-wrapper .rating-item .content .text {
  margin-bottom: 8px;
  line-height: 18px;
  color: rgb(7, 17, 27);
  font-size: 12px;
}

.ratings .rating-wrapper .rating-item .content .recommend {
  line-height: 16px;
  font-size: 0;
}

.recommend .icon-thumb_up,
.recommend .item {
  display: inline-block;
  margin: 0 8px 4px 0;
  font-size: 9px;
}

.ratings .rating-wrapper .rating-item .content .recommend .icon-thumb_up {
  color: rgb(0, 160, 220);
}

.ratings .rating-wrapper .rating-item .content .recommend .item {
  padding: 0 6px;
  border: 1px solid rgba(7, 17, 27, 0.1);
  border-radius: 1px;
  color: rgb(147, 153, 159);
  background: #fff;
}

.ratings .rating-wrapper .rating-item .content .time {
  position: absolute;
  top: 0;
  right: 0;
  line-height: 12px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}

</style>
