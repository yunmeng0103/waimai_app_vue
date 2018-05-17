<template>
  <div>
    <transition name="move">
      <div class="page" v-show="flag" ref="detail">
        <header id='head_top'>
          <section class="head_goback" @click="hide">
            <i class="icon-arrow_lift"></i>
          </section>
          <section class="title_head ellipsis">
            <span class="title_text">关于余额</span>
          </section>
        </header>
        <div class="markdown">
          <h3 id="q1-">Q1: 使用余额的条件</h3>
          <p>为了保护账户安全，使用余额前必须先绑定手机号。</p>
          <h3 id="q2-">Q2: 余额可以怎么用？</h3>
          <p>余额可以在饿了么平台上提现，当余额大于等于待支付金额时可以在支持在线支付的商家中进行消费。提现功能将于2016年12月25日00:00全面开放。</p>
          <h3 id="q3-">Q3:我要如何提现？</h3>
          <p>为了保护账户和资金安全，您在提现前需要输入真实姓名和用该姓名开通的银行卡号、选择开户行，并验证已绑定饿了么账号的手机号。每日只能提现1次，每次限额50元。若提现金额超过50元，点击【提现】时系统会提示您已超额，请您修改提现金额。</p>
          <h3 id="q4-">Q4:为什么会提现失败？</h3>
          <p>可能原因有：您的姓名、开户行、银行卡号等信息不匹配；您当日的提现次数和金额超过限制；您的账户存在异常，被风控拦截。</p>
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
  padding-top: 2.0rem;
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
    line-height: 1.5rem;
    font-weight: bold;
  }
  p,
  li {
    font-size: .6rem;
    color: #666;
    line-height: 1rem;
    text-indent: .5rem;
  }
}

</style>
