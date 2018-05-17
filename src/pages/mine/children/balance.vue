<template>
  <div class="page">
    <v-headTop head-title="我的余额" go-back='true'></v-headTop>
    <div class="content_container">
      <div class="content">
        <header class="content_header">
          <span class="content_title_style">当前余额</span>
          <div class="contetn_description">
            <img src="../../../images/description.png" height="24" width="24">
            <div class="content_title_style" @click="toDetail">余额说明</div>
          </div>
        </header>
        <p class="content_num">
          <span>{{parseInt(balance).toFixed(2)}}</span>
          <span>元</span>
        </p>
        <div class="promit_button" :class="{'able': balance > 0}" @click="getCash">提现</div>
      </div>
    </div>
    <p class="deal_detail">交易明细</p>
    <div class="no_log">
      <img src="../../../images/no-log.png" height="170" width="300">
      <p>暂无明细记录</p>
    </div>
    <v-alertTip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></v-alertTip>
    <v-balanceDetail ref="detail"></v-balanceDetail>
  </div>
</template>
<script>
import headTop from '../../../components/header/head.vue'
import alertTip from '../../../components/common/alertTip.vue'
import balanceDetail from './children/balanceDetail.vue'

export default {
  data() {
    return {
      showAlert: false,
      alertText: null,
      balance: ''
    }
  },
  mounted() {
    this.balance = this.$route.query.balance;

  },
  components: {
    'v-headTop': headTop,
    'v-alertTip': alertTip,
    'v-balanceDetail': balanceDetail,
  },
  computed: {

  },
  methods: {
    toDetail() {
      this.$refs.detail.show();
    },
    getCash() {
      if (this.balance > 0) {
        this.showAlert = true;
        this.alertText = '当前模拟环境无法提现';
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 204;
  overflow-y: auto;
  padding-top: 2.0rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.content_container {
  padding: .3rem;
  background-color: #3190e8;
  .content {
    padding: .4rem;
    background-color: #fff;
    border-radius: .15rem;
    .content_header {
      display: flex;
      justify-content: space-between;
      font-size: .55rem;
      .contetn_description {
        display: flex;
        align-items: center;
        img {
          width: .6rem;
          height: .6rem;
          margin-right: .2rem;
        }
        .content_title_style {
          color: #3190e8;
        }
      }
      .content_title_style {
        color: #666;
      }
    }
    .content_num {
      span:nth-of-type(1) {
        font-size: 1.8rem;
        color: #333;
      }
      span:nth-of-type(2) {
        font-size: .7rem;
        color: #333;
      }
    }
    .promit_button {
      width: 100%;
      height: 2rem;
      font-size: .8rem;
      color: #fff;
      border-radius: 0.15rem;
      line-height: 2rem;
      margin-top: 1rem;
      text-align: center;
      background-color: #ccc;
    }
    .promit_button.able {
      background-color: #3190e8;
    }
  }
}

.deal_detail {
  font-size: .6rem;
  color: #999;
  line-height: 2rem;
  padding-left: .5rem;
}

.no_log {
  text-align: center;
  margin-top: 1rem;
  img {
    width: 8rem;
    height: 5rem;
  }
  p {
    margin-top: .5rem;
    font-size: .7rem;
    color: #666;
  }
}

</style>
