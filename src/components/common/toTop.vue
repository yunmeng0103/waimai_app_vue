<template>
  <aside class="return_top">
    <svg class="back_top_svg cart" v-if="shopList">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-hr"></use>
    </svg>
    <svg class="back_top_svg toTop" @click="backTop" v-if="showBackStatus">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
    </svg>
  </aside>
</template>
<script>
import { showBack, animate } from '../../../src/config/mUtils'
export default {
  data() {
    return {
      showBackStatus: false, //显示返回顶部按钮
    }
  },
  props: ['shopList'],
  mounted() {
    this.initData();
  },
  methods: {
    async initData() {
      //开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
      showBack(status => {
        this.showBackStatus = status;
      });
    },
    //返回顶部
    backTop() {
      animate(document.body, { scrollTop: '0' }, 400, 'ease-out');
    },
  }
}

</script>
<style>
.return_top {
  position: fixed;
  bottom: 2.5rem;
  right: 1rem;
  width: 2rem;
  height: 4.2rem;
}

.return_top .back_top_svg {
  width: 2rem;
  height: 2rem;
  position: absolute;
  left: 0;
}

.return_top .back_top_svg.cart {
  top: 0;
}

.return_top .back_top_svg.toTop {
  bottom: 0;
}

</style>
