<template>
  <div class="payment">
    <v-headTop head-title="在线支付" go-back='true'></v-headTop>
    <section class="show_time_amount">
      <section>
        <header class="time_last">支付剩余时间</header>
        <p class="time">{{remaining}}</p>
      </section>
    </section>
    <div class="pay_way">选择支付方式</div>
    <section class="pay_way_list">
      <section class="pay_item">
        <div class="pay_icon_contaienr">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#coin_yen"></use>
          </svg>
          <span>余额</span>
        </div>
        <svg class="choose_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
    </section>
    <p class="determine" @click="confrimPay">确认支付</p>
    <p class="wallet_balance">
      <svg>
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#wallet"></use>
      </svg>
      <span>余额¥{{balance}}</span>
    </p>
    <v-alertTip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></v-alertTip>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import headTop from '../../components/header/head.vue'
import alertTip from '../../components/common/alertTip.vue'
import { confirmPay } from '../../service/myData.js'

export default {
  data() {
    return {
      balance: 0, //余额
      showAlert: false,
      alertText: null,
      payWay: 1, //付款方式
      countNum: 900, //倒计时15分钟
      gotoOrders: false, //去付款
    }
  },
  components: {
    'v-headTop': headTop,
    'v-alertTip': alertTip,
  },
  created() {
    this.initData();
    //清除购物车中当前商铺的信息
    if (this.shopid) {
      this.CLEAR_CART(this.shopid);
    }
    if (this.$route.query.time) {
      this.countNum = this.$route.query.time;
    }
  },
  mounted() {
    this.remainingTime();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  props: [],
  computed: {
    ...mapState([
      'userInfo', 'shopid'
    ]),
    //时间转换
    remaining: function() {
      let minute = parseInt(this.countNum / 60);
      if (minute < 10) {
        minute = '0' + minute;
      }
      let second = parseInt(this.countNum % 60);
      if (second < 10) {
        second = '0' + second;
      }
      return '00 : ' + minute + ' : ' + second;
    }
  },
  methods: {
    ...mapMutations([
      'CLEAR_CART'
    ]),
    //初始化信息
    async initData() {
      this.balance = parseInt(this.userInfo.balance).toFixed(2);
    },
    //倒计时
    remainingTime() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.countNum--;
        if (this.countNum == 0) {
          clearInterval(this.timer);
          this.showAlert = true;
          this.alertText = '支付超时';
        }
      }, 1000);
    },
    //确认付款
    async confrimPay() {
      let orderId = this.$route.query.orderId;
      let confirmRes = await confirmPay(this.userInfo.id, orderId);
      if (confirmRes.code == 100 || confirmRes.code == '100') {
        this.showAlert = true;
        this.alertText = '支付成功';
        this.gotoOrders = true;
      } else {
        this.showAlert = true;
        this.alertText = confirmRes.msg;
      }
    },
    //关闭提示框，跳转到订单列表页
    closeTipFun() {
      this.showAlert = false;
      if (this.gotoOrders) {
        this.$router.push('/order');
      }
    },
  }
}

</script>
<style lang="scss" scoped>
.payment {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 204;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.show_time_amount {
  background-color: #fff;
  padding: .7rem;
  text-align: center;
  .time_last {
    font-size: .6rem;
    color: #666;
    margin-top: 1rem;
  }
  .time {
    font-size: 1.5rem;
    color: #333;
    margin: .3rem 0 1rem;
  }
  .order_detail {
    display: flex;
    justify-content: space-between;
    span {
      font-size: .65rem;
      color: #666;
    }
    span:nth-of-type(2) {
      color: #ff6000;
      font-weight: bold;
    }
  }
}

.pay_way {
  background-color: #f1f1f1;
  padding: 0 .7rem;
  font-size: .7rem;
  color: #666;
  line-height: 1.8rem;
}

.pay_way_list {
  background-color: #fff;
  .pay_item {
    padding: .4rem .7rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 2.6rem;
    border-bottom: 0.025rem solid #f5f5f5;
    .pay_icon_contaienr {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .zhifubao {
        width: 2rem;
        height: 2rem;
        background: url(../../images/zhifubao.png) no-repeat;
        background-size: 100% 100%;
        margin-right: .2rem;
      }
      svg {
        width: 2rem;
        height: 2rem;
        margin-right: .3rem;
      }
      span {
        font-size: .7rem;
        color: #666;
      }
    }
    .choose_icon {
      width: 1rem;
      height: 1rem;
      fill: #4cd964;
    }
  }
}

.determine {
  background-color: #4cd964;
  font-size: .7rem;
  color: #fff;
  text-align: center;
  margin: 0 .7rem;
  line-height: 1.8rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
  font-weight: bold;
}

.wallet_balance {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: .5rem;
  font-size: .6rem;
  color: #153B71;
}

.wallet_balance svg {
  width: 1rem;
  height: 1rem;
  margin-right: .2rem;
  fill: #153B71;
}

</style>
