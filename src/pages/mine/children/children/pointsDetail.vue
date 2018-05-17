<template>
  <div>
    <transition name="move">
      <div class="page" v-show="flag" ref="detail">
        <header id='head_top'>
          <section class="head_goback" @click="hide">
            <i class="icon-arrow_lift"></i>
          </section>
          <section class="title_head ellipsis">
            <span class="title_text">关于积分</span>
          </section>
        </header>
        <div class="markdown">
          <h3 id="q1-">Q1: 怎么获得积分？</h3>
          <p>在线支付的订单将获得订单积分奖励：</p>
          <ul>
            <li>积分将在用户完成评价后获得。</li>
            <li>可获得积分=订单金额×10（即1元=10点积分）。</li>
            <li>订单金额指实际付款金额，不包含活动优惠金额。</li>
            <li>每位用户每天最多可以获得2000积分，体验商家的订单和评价不会增加积分。</li>
          </ul>
          <h3 id="q2-">Q2: 积分用来做什么？</h3>
          <p>可以在积分商城兑换各种礼品。</p>
          <h3 id="q3-">Q3: 礼品兑换很多天了还没有收到，该怎么办？</h3>
          <p>礼品从兑换日起，3个工作日（周末不算）内处理发货，发货后，通常会在3个工作日左右送达。</p>
          <h3 id="q4-">Q4: 礼品兑换中的手机充值卡兑换，怎么样进行充值，充值之前会和我电话确认嘛？</h3>
          <p>不会，手机充值卡兑换，是直接充值到您填写的手机号上，充值之前不会和您电话确认，所以您在填写电话的时候，请确认电话是否正确。</p>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: false,
    }
  },
  components: {},
  methods: {
    show() {
      this.flag = true
    },
    hide() {
      this.flag = false
    },
  }
}

</script>
<style lang="scss" scoped>
.move-enter-active,
.move-leave-active {
  transition: all .2s linear;
  transform: translate3d(0, 0, 0);
}

.move-enter,
.move-leave-active {
  transform: translate3d(100%, 0, 0);
}

.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 1.95rem;
  z-index: 203;
  background-color: #fff;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

#head_top {
  background-color: #3190e8;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 2.0rem;
}

.head_goback {
  width: 0.6rem;
  line-height: 2.2rem;
  margin-left: .4rem;
  color: #fff;
}

.title_head {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  color: #fff;
  text-align: center;
}

.title_head .title_text {
  font-size: 0.8rem;
  color: #fff;
  text-align: center;
  font-weight: bold;
}

.markdown {
  font-size: .6rem;
  color: #666;
  padding: 0.5rem 0.5rem;
  h3 {
    line-height: 1rem;
    font-weight: bold;
  }
  p,
  li {
    font-size: .6rem;
    color: #666;
    line-height: 1rem;
    text-indent:.5rem;
  }
}

</style>
