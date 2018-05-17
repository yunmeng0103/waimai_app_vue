<template>
  <div class="cartcontrol">
    <transition name="showReduce">
      <div class="cart-decrease" v-show="food.count > 0" @click.stop="decreaseCart">
        <i class="icon-remove_circle_outline"></i>
      </div>
    </transition>
    <transition name="fade">
      <div class="cart-count" v-show="food.count > 0">{{food.count}}</div>
    </transition>
    <div class="cart-add" @click.stop="addCart($event)">
      <i class="icon-add_circle"></i>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {mapState, mapMutations} from 'vuex'

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        shopCart: null, //初始化购物车数据
        cartItem: {}, //缓存获得购物车数据
      }
    },
    computed: {
      ...mapState([
        'shopInfo', 'cartList'
      ]),
    },
    created() {
      this.GET_CART_LIST();
    },
    mounted() {
      console.log(this.food)
      if (this.food.count > 0) {
      }
      // if (Object.values(this.cartList).length != 0) {
      //   this.shopCart = this.cartList[this.shopInfo.id];
      //   //从vuex取初始值
      //   let foodItem = {}
      //   Object.values(this.shopCart).forEach(categoryItem => {
      //     Object.values(categoryItem).forEach(item => {
      //       foodItem = {
      //         goodId: item.category_id,
      //         id: item.id,
      //         icon: item.icon,
      //         name: item.name,
      //         price: item.price,
      //         count: item.num,
      //       }
      //       if (this.food.goodId === item.category_id && this.food.id === item.id) {
      //         //此处不能直接修改父组件的props值！！！！所以此写法有错
      //         // this.food = Object.assign({}, this.food, foodItem);
      //       }
      //     })
      //   });
      // }

    },
    methods: {
      ...mapMutations([
        'GET_CART_LIST', 'ADD_CART', 'REDUCE_CART'
      ]),
      addCart(event) {
        // 如果不是BScroll派发的点击事件就返回掉
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        this.ADD_CART({
          shopid: this.shopInfo.id,
          category_id: this.food.goodId,
          item_id: this.food.id,
          item_icon: this.food.icon,
          name: this.food.name,
          price: this.food.price,
          num: this.food.count,
          packing_fee: this.food.count
        });
        // 将当前 dom 传递出去，用来做小球飞入效果
        this.$emit('drop', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
        this.REDUCE_CART({
          shopid: this.shopInfo.id,
          category_id: this.food.goodId,
          item_id: this.food.id,
          item_icon: this.food.icon,
          name: this.food.name,
          price: this.food.price,
          num: this.food.count,
          packing_fee: this.food.count
        });
      }
    },
    watch: {
      food(value) {
        if (value) {
          // console.log(value);
        }
      }
    }
  };

</script>
<style lang="scss" scoped>
  .cartcontrol {
    font-size: 0;
    .cart-decrease,
    .cart-add {
      display: inline-block;
      padding: 6px;
      line-height: 24px;
      font-size: 24px;
      i {
        color: rgb(0, 160, 220);
        display: inline-block;
      }
    }
    .cart-count {
      display: inline-block;
      vertical-align: top;
      width: 12px;
      padding-top: 6px;
      line-height: 24px;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
    }
  }

  /*fade-enter-active：进入过渡的结束状态，元素被插入时就生效，在过渡过程完成之后移除；*/

  /*fade-leave-active：离开过渡的结束状态，元素被删除时生效，离开过渡完成之后被删除；*/

  .fade-enter-active,
  .fade-leave-active {
    transition: all .3s;
  }

  /*fade-enter：进入过渡的开始状态，元素被插入时生效，只应用一帧后立即删除；*/

  /*fade-leave：离开过渡的开始状态，元素被删除时触发，只应用一帧后立即删除；*/

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }

  .showReduce-enter-active,
  .showReduce-leave-active {
    opacity: 1;
    transform: translate3d(0, 0, 0);
    transition: all .4s;
    i {
      transform: rotate(0);
      transition: all .4s;
    }
  }

  .showReduce-enter,
  .showReduce-leave-active {
    opacity: 0;
    transform: translate3d(24px, 0, 0);
    transition: all .4s;
    i {
      transform: rotate(360deg);
      transition: all .4s;
    }
  }

</style>
