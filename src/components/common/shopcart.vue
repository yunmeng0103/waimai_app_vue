<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left" @click="toggleList">
        <div class="logo-wrap">
          <div class="logo" :class="{'highlight':totalCount > 0}">
            <span class="icon-shopping_cart" :class="{'highlight':totalCount > 0}"></span>
          </div>
          <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
        </div>
        <!-- 计算属性计算总和 -->
        <div class="price" :class="{'highlight':totalPrice > 0}">{{totalPrice}}元</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right" @click.prevent="pay">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
    </div>
    <!-- 飞行小球 -->
    <div class="ball-content">
      <div v-for="ball in balls">
        <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
      </div>
    </div>
    <!-- 购物列表 -->
    <transition name="toggle-cart">
      <div class="shopcart-list" v-show="showList">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">
            <svg>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
            </svg>
          </span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="food" v-for="food in cartInit">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <!-- 控制组件复用 -->
              <div class="cartcontrol-wrapper">
                <cartcontrol @drop="drop" :food="food"></cartcontrol>
              </div>
            </li>
            <li class="food">
              <span class="name">包装费</span>
              <div class="price">
                <span>￥{{totalCount*1}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="screen_cover" v-show="showList" @click="toggleList"></div>
    </transition>
    <alert-tip v-if="showAlert" @closeTip="closeAlert" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import BScroll from 'better-scroll';
import cartcontrol from './cartcontrol.vue';
import alertTip from './alertTip'
export default {
  props: {
    shopId: {
      type: Number
    },
    //配送费
    deliveryPrice: {
      type: Number,
      default: 0
    },
    //最低价格
    minPrice: {
      type: Number,
      default: 0
    },
    //已选择的商品
    selectFoods: {
      type: Array,
      default () {
        return [];
      }
    }
  },
  data() {
    return {
      // 每个小球当前的状态
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      // 已经下落的小球（show = true）
      dropBalls: [],
      // 购物车列表是否折叠
      flag: false,
      shopCart: null, //购物车数据
      cartInit: [], //缓存获得购物车数据
      showAlert: false, //弹出框
      alertText: null, //弹出框内容
    }
  },
  created() {
    //获取当前商铺购物车信息
    this.GET_CART_LIST();

  },
  mounted() {
    this.shopCart = this.cartList[this.shopId];
    this.initShopCart();
  },
  computed: {
    ...mapState([
      'userInfo', 'cartList'
    ]),
    // 总价格
    totalPrice() {
      let total = 0;
      this.cartInit.forEach((food) => {
        total += (food.price + 1) * food.count;
      });
      return total;
    },
    // 购买数量
    totalCount() {
      let count = 0;
      this.cartInit.forEach((food) => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `还差${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差${diff}元起送`;
      } else {
        return '去结算';
      }
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return 'not-enough';
      } else {
        return 'enough';
      }
    },
    showList() {
      // 实时计算
      if (!this.totalCount) {
        return false
      } else {
        return this.flag
      }
    }
  },
  methods: {
    ...mapMutations([
      'GET_CART_LIST', 'CLEAR_CART'
    ]),
    initShopCart() {
      if (this.shopCart) {
        //从vuex取初始值
        let newArr = new Array;
        Object.values(this.shopCart).forEach(categoryItem => {
          Object.values(categoryItem).forEach(item => {
            // console.log(item);
            newArr.push({
              goodId: item.category_id,
              id: item.id,
              icon: item.icon,
              name: item.name,
              price: item.price,
              count: item.num,
            })
          })
        });
        this.cartInit = [...newArr];
      }
    },
    // 取一个未下落的小球执行接下来的下落动作
    drop(el) {
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    // 对 show = true 的小球设置动作
    beforeDrop(el) {
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect()
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22)
          el.style.display = ''
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`

          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight // 重绘，否则小球不会消失
      this.$nextTick(() => {
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'

        let inner = el.getElementsByClassName('inner-hook')[0]
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'

        el.addEventListener('transitionend', done)
      })
    },
    // 动作做完就把该小球 show=false
    afterDrop(el) {
      let ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleList() {
      // alert(this.totalCount)
      if (!this.totalCount) {
        this.flag = false;
        return
      } else {
        this.flag = !this.flag;
        if (this.flag) {
          this.$nextTick(() => {
            if (!this.scroll) {
              // alert(this.$refs.listContent)
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      }
    },
    empty() {
      this.cartInit.forEach((food) => {
        food.count = 0
      });
      this.CLEAR_CART(this.shopId);
    },
    pay() {
      if (this.totalPrice < this.minPrice) {
        return;
      }
      if (!(this.userInfo && this.userInfo.id)) {
        this.showAlert = true;
        this.alertText = '您还没有登录，请前去登录';
        return;
      }
      this.$router.push({ path: '/confirmOrder', query: { shopId: this.shopId } })
    },
    closeAlert() {
      this.showAlert = false;
      if (!(this.userInfo && this.userInfo.id)) {
        this.$router.replace('/login');
      }
    }
  },
  components: {
    cartcontrol,
    alertTip
  },
  watch: {
    selectFoods(value) {
      let selectFoodsList = new Array;
      if (value) {
        value.forEach(item => {
          selectFoodsList.push({
            goodId: item.goodId,
            id: item.id,
            icon: item.icon,
            name: item.name,
            price: item.price,
            count: item.count,
          })
        })
      }
      for (var i = 0; i < selectFoodsList.length; i++) {
        var isFind = false;
        for (var j = 0; j < this.cartInit.length; j++) {
          if (selectFoodsList[i].id === this.cartInit[j].id && selectFoodsList[i].goodId === this.cartInit[j].goodId) {
            this.cartInit[j].count++;
            isFind = true;
            break;
          }
        }
        if (!isFind)
          this.cartInit.push(selectFoodsList[i]);
      }
    }
  }
};

</script>
<style scoped>
.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 110;
  width: 100%;
  height: 48px;
}

.shopcart .content {
  display: flex;
  justify-content: space-between;
  position: absolute;
  z-index: 13;
  background: #141d27;
  font-size: 0;
  width: 100%;
  color: rgba(255, 255, 255, 0.4);
}

.shopcart .content .content-left {
  flex: 1;
}

.shopcart .content .content-left .logo-wrap {
  display: inline-block;
  vertical-align: top;
  position: relative;
  top: -10px;
  margin: 0 12px;
  padding: 6px;
  width: 56px;
  height: 56px;
  box-sizing: border-box;
  border-radius: 50%;
  background: #141d27;
}

.shopcart .content .content-left .logo-wrap .logo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  text-align: center;
  background: #2b343c;
}

.shopcart .content .content-left .logo-wrap .logo.highlight {
  background: rgb(0, 160, 220);
}

.shopcart .content .content-left .logo-wrap .logo .icon-shopping_cart {

  line-height: 44px;
  font-size: 24px;
  color: #80858a;
}

.shopcart .content .content-left .logo-wrap .logo .icon-shopping_cart.highlight {
  color: #fff;
}

.shopcart .content .content-left .logo-wrap .num {
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  border-radius: 16px;
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: rgb(240, 20, 20);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
}

.shopcart .content .content-left .price {
  display: inline-block;
  vertical-align: top;
  margin-top: 12px;
  line-height: 24px;
  padding-right: 12px;
  box-sizing: border-box;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 16px;
  font-weight: 700;
}

.shopcart .content .content-left .price.highlight {
  color: #fff;
}

.shopcart .content .content-left .desc {
  display: inline-block;
  vertical-align: top;
  margin: 12px 0 0 12px;
  line-height: 24px;
  font-size: 10px;
}

.shopcart .content .content-right {
  flex: 0 0 105px;
  width: 105px;
}

.shopcart .content .content-right .pay {
  height: 48px;
  line-height: 48px;
  text-align: center;
  font-size: 12px;
  font-weight: 700;
}

.shopcart .content .content-right .pay.not-enough {
  background: #2b333b;
}

.shopcart .content .content-right .pay.enough {
  background: #00b43c;
  color: #fff;
}
















































/*飞行小球*/

.ball-content .ball {
  position: fixed;
  left: 32px;
  bottom: 22px;
  z-index: 200;
  transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);
}

.ball-content .inner {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: rgb(0, 160, 220);
  transition: all 0.4s linear;
}

.shopcart .shopcart-list {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 12;
  width: 100%;
  padding-bottom: 48px;
  box-shadow: 0 -2px 5px rgba(7, 17, 27, 0.3);
}

.shopcart .shopcart-list .list-header {
  height: 40px;
  line-height: 40px;
  padding: 0 18px;
  background: #f3f5f7;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}

.shopcart .shopcart-list .list-header .title {
  float: left;
  font-size: 14px;
  color: rgb(7, 17, 27);
}

.shopcart .shopcart-list .list-header .empty {
  float: right;
  font-size: 12px;
  color: rgb(0, 160, 220);
}

.shopcart .shopcart-list .list-header .empty svg {
  width: .6rem;
  height: .6rem;
  vertical-align: middle;
}

.shopcart .shopcart-list .list-content {
  padding: 0 18px;
  max-height: 217px;
  overflow: auto;
  background: #fff;
}

.shopcart .shopcart-list .list-content .food {
  position: relative;
  padding: 12px 0;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}

.shopcart .shopcart-list .list-content .food .name {
  line-height: 24px;
  font-size: 14px;
  color: rgb(7, 17, 27);
}

.shopcart .shopcart-list .list-content .food .price {
  position: absolute;
  right: 90px;
  bottom: 12px;
  line-height: 24px;
  font-size: 14px;
  font-weight: 700;
  color: rgb(240, 20, 20);
}

.shopcart .shopcart-list .list-content .food .cartcontrol-wrapper {
  position: absolute;
  right: 0;
  bottom: 6px;
}


.screen_cover {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .3);
  z-index: 11;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

.toggle-cart-enter-active,
.toggle-cart-leave-active {
  transition: all .3s ease-out;
}

.toggle-cart-enter,
.toggle-cart-leave-active {
  transform: translateY(100%);
}

</style>
