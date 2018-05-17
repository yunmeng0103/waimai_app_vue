<template>
  <!-- 主页(包含左右两部分) -->
  <div class="goods">
    <div class="menu-wrap" ref="menuWrap">
      <ul>
        <li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index, $event)">
          <span class="text">
            <span class="icon" :class="classMap[item.type]" v-show="item.type>0"></span> {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrap" ref="foodsWrap">
      <ul>
        <li v-for="item in goods" class="food-list food-list-hook">
          <!-- 商品标题 -->
          <h1 class="title">{{item.name}}</h1>
          <!-- 商品列表 -->
          <ul>
            <li @click="findDetail(food, $event)" v-for="food in item.foods" class="food-item">
              <!-- 图片 -->
              <div class="icon"><img width="57" height="57" v-lazy="food.icon"></div>
              <!-- 内容 -->
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span>
                  <span>好评率{{food.rating}}%</span>
                </div>
                <!-- 商品价格 -->
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                </div>
                <!-- 控制按钮 -->
                <div class="cartcontrol-wrap">
                  <!-- 传递数据给子组件 -->
                  <v-cartcontrol @drop="drop" :food="food"></v-cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 底部购物车 -->
    <v-shopcart ref="shopcartRef" :shop-id="seller.id" :select-foods="selectFoods" :delivery-price="seller.piecewiseAgentFee" :min-price="seller.floatMinimumOrderAmount"></v-shopcart>
    <!-- 详情页数据 -->
    <v-goodsDetail @drop="drop" :food-detail="foodDetail" ref="food"></v-goodsDetail>
  </div>
</template>
<script>
import BScroll from 'better-scroll';
import { mapState, mapMutations } from 'vuex'
import appData from '../../../../data.json';
import cartcontrol from '../../../components/common/cartcontrol.vue';
import shopcart from '../../../components/common/shopcart.vue';
import goodsDetail from './goodsDetail.vue';
import { goodList } from '../../../service/myData.js'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      classMap: ['decrease', 'discount', 'special', 'invoice', 'guarantee'],
      scrollY: 0,
      listHeight: [],
      foodDetail: {}
    };
  },
  computed: {
    // 根据scrollY的变化获取索引
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foods = [];
      this.goods.forEach((item) => {
        item.foods.forEach((food) => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    },
  },
  created() {
    // 获取左侧食物分类
    goodList(this.seller.id).then(res => {
      this.goods = res.data;
      // this.goods = appData.goods;
      this.$nextTick(() => {
        this._initScroll();
        this._calcHeight();
      });
    });

  },
  mouted() {},
  components: {
    'v-cartcontrol': cartcontrol,
    'v-shopcart': shopcart,
    'v-goodsDetail': goodsDetail
  },
  methods: {
    // ...mapMutations([
    //    'INIT_BUYCART'
    // ]),
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrap, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrap, {
        click: true,
        probeType: 3
      });
      // 滚动事件
      this.foodsScroll.on('scroll', (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    // 计算每个列表总高度
    _calcHeight() {
      let foodsList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
      let height = 0;
      this.listHeight.push(height);
      for (var i = 0; i < foodsList.length; i++) {
        height += foodsList[i].clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodsList = this.$refs.foodsWrap.getElementsByClassName('food-list-hook');
      let el = foodsList[index];
      // 滚动到指定元素位置
      this.foodsScroll.scrollToElement(el, 300);
    },
    // foodDetail 数据传递给子组件
    findDetail(food, event) {
      // 点击了购物车按钮就return掉
      if (!event._constructed) {
        return;
      }
      this.foodDetail = food;
      // 调用food组件的show方法
      this.$refs.food.show();
    },
    drop(target) {
      // 性能优化，异步异步执行下落动画,调用shopcartRef组件方法
      this.$nextTick(() => {
        this.$refs.shopcartRef.drop(target);
      })
    },
  }
};

</script>
<style scoped>
/*主体部分*/

.goods {
  display: flex;
  bottom: 46px;
}

.goods .menu-wrap {
  flex: 0 0 80px;
  width: 80px;
  background: #f3f5f7;
}

.goods .menu-wrap .menu-item {
  display: table;
  height: 54px;
  width: 56px;
  padding: 0 12px;
  border-left: 3px solid #f8f8f8;
  line-height: 14px;
}

.goods .menu-wrap .current {
  position: relative;
  z-index: 10;
  margin-top: -1px;
  border-left: 3px solid #3190e8;
  background: #fff;
  font-weight: 700;
}

.goods .menu-wrap .menu-item .text {
  border: none;
  display: table-cell;
  width: 56px;
  vertical-align: middle;
  position: relative;
  font-size: 12px;
}

.goods .menu-wrap .menu-item .text:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  content: ' '
}

.goods .menu-wrap .menu-item .text .icon {
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 12px;
  margin-right: 2px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}

.goods .menu-wrap .menu-item .text .decrease {
  background-image: url("../../../images/decrease_3@2x.png");
}

.goods .menu-wrap .menu-item .text .discount {
  background-image: url("../../../images/discount_3@2x.png");
}

.goods .menu-wrap .menu-item .text .guarantee {
  background-image: url("../../../images/guarantee_3@2x.png");
}

.goods .menu-wrap .menu-item .text .invoice {
  background-image: url("../../../images/invoice_3@2x.png");
}

.goods .menu-wrap .menu-item .text .special {
  background-image: url("../../../images/special_3@2x.png");
}

@media (-webkit-min-device-pixel-ratio: 3) and (min-device-pixel-ratio: 3) {
  .goods .menu-wrap .menu-item .text .decrease {
    background-image: url("../../../images/decrease_3@3x.png");
  }
  .goods .menu-wrap .menu-item .text .discount {
    background-image: url("../../../images/discount_3@3x.png");
  }
  .goods .menu-wrap .menu-item .text .guarantee {
    background-image: url("../../../images/guarantee_3@3x.png");
  }
  .goods .menu-wrap .menu-item .text .invoice {
    background-image: url("../../../images/invoice_3@3x.png");
  }
  .goods .menu-wrap .menu-item .text .special {
    background-image: url("../../../images/special_3@3x.png");
  }
}

.foods-wrap {
  flex: 1;
}

.foods-wrap .title {
  padding-left: 14px;
  height: 26px;
  line-height: 26px;
  border-left: 2px solid #d9dde1;
  font-size: 12px;
  color: rgb(147, 153, 159);
  background: #f3f5f7;
}

.foods-wrap .food-item {
  display: flex;
  margin: 18px;
  padding-bottom: 18px;
  position: relative;
}

.foods-wrap .food-item:after {
  display: block;
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid rgba(7, 17, 27, 0.1);
  content: ' '
}

.foods-wrap .food-item:last-child {
  border: none;
  margin-bottom: 0;
}

.foods-wrap .food-item .icon {
  flex: 0 0 57px;
  margin-right: 10px;
}

.foods-wrap .food-item .content {
  flex: 1
}

.foods-wrap .food-item .content .name {
  margin: 2px 0 8px 0;
  height: 14px;
  line-height: 14px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}

.desc,
.extra {
  line-height: 10px;
  font-size: 10px;
  color: rgb(147, 153, 159);
}

.desc {
  line-height: 12px;
  margin-bottom: 8px;
}

.extra .count {
  margin-right: 12px
}

.price {
  font-weight: 700;
  line-height: 24px;
}

.price .now {
  margin-right: 8px;
  font-size: 14px;
  color: rgb(240, 20, 20);
}

.old {
  text-decoration: line-through;
  font-size: 12px;
  color: rgb(147, 153, 159);
}

.cartcontrol-wrap {
  position: absolute;
  right: 0;
  bottom: 10px;
}

</style>
