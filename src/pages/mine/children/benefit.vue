<template>
  <div class="rating_page">
    <v-headTop head-title="我的优惠" go-back='true'></v-headTop>
    <section v-if="!showLoading">
      <section class="category_title">
        <span :class="{choosed: categoryType === 1}" @click="categoryType = 1">红包</span>
        <span :class="{choosed: categoryType === 2}" @click="categoryType = 2">商家代金券</span>
      </section>
      <transition name="router-fade">
        <section v-if="categoryType === 1">
          <section class="hongbao_container">
            <header class="hongbao_title">
              <section class="total_number">
                有 <span>{{hongbaoNum}}</span> 个红包即将到期
              </section>
              <section class="hongbao_description">
                <img src="../../../images/description.png" height="24" width="24">
                <router-link to="" class="hongbao_detail">红包说明</router-link>
              </section>
            </header>
            <ul class="hongbao_list_ul">
              <li :class="['hongbao_list_li',{'expire':isExpire}]" v-for="item in hongbaoList"
                  :key="item.id">
                <section class="list_item">
                  <div class="list_item_left">
                    <span>¥</span>
                    <span>{{String(item.benefitMoney).split('.')[0]}}</span>
                    <span>.</span>
                    <span>{{String(item.benefitMoney).split('.')[1]||0}}</span>
                    <p>满{{item.useMoney}}元可用 </p>
                  </div>
                  <div class="list_item_right">
                    <h4>{{item.name}}</h4>
                    <p>{{item.endDate | dataFormat}}到期</p>
                    <p>限收货手机号为{{item.phone}}</p>
                  </div>
                  <div class="time_left">{{item.endDate | descDate}}</div>
                </section>
                <footer class="list_item_footer" v-if="item.limit_map">
                  <!-- <p>{{item.limit_map.restaurant_flavor_ids}}</p> -->
                </footer>
              </li>
            </ul>
          </section>
          <router-link to="" class="history_hongbao">
            <span class="check_history">查看历史红包</span>
            <svg class="history_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </router-link>
          <footer class="hongbao_footer">
            <router-link to="" class="hongbao_style" style="border-right: 1px solid #f5f5f5">
              兑换红包
            </router-link>
            <router-link to="" class="hongbao_style">
              推荐有奖
            </router-link>
          </footer>
        </section>
      </transition>
      <transition name="router-fade">
        <section v-if="categoryType === 2" class="voucher_container">
          <section class="hongbao_description voucher_header">
            <img src="../../../images/description.png" height="24" width="24">
            <router-link to="" class="hongbao_detail">商家代金券说明</router-link>
          </section>
          <section class="unable_use">
            <img src="../../../images/voucher.png" height="170" width="300">
            <p>无法使用代金券</p>
            <p>非客户端或客户端版本过低</p>
            <router-link to="" class="download_app">
              下载或升级客户端
            </router-link>
          </section>
        </section>
      </transition>
    </section>
    <v-alertTip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></v-alertTip>
    <v-loading v-show="showLoading"></v-loading>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {mapState, mapMutations} from 'vuex'
  import {getConpons} from '../../../service/myData.js'
  import headTop from '../../../components/header/head.vue'
  import alertTip from '../../../components/common/alertTip.vue'
  import loading from '../../../components/common/loading.vue'
  import {formatDate} from '../../../config/mUtils.js'

  export default {
    data() {
      return {
        showAlert: false, //弹出框
        alertText: null, //弹出框文字
        showLoading: true, //加载动画
        hongbaoList: null, //红包列表
        isExpire: false,//是否过期
        hongbaoNum: 0, //红包个数
        categoryType: 1, //红包与商家代金券切换
      }
    },
    mounted() {
      this.initData();
    },
    components: {
      'v-headTop': headTop,
      'v-alertTip': alertTip,
      'v-loading': loading,
    },
    computed: {
      ...mapState([
        'userInfo',
      ]),
    },
    methods: {
      ...mapMutations([
        'CLEAR_CART'
      ]),
      async initData() {
        this.showLoading = false;
        if (this.userInfo) {
          let conponList = await getConpons(this.userInfo.id);
          this.hongbaoList = conponList.data;
          this.hongbaoNum = conponList.data.length;
        } else {
          this.showAlert = true;
          this.alertText = "请先登录";
        }
      }
    },
    filters: {
      dataFormat(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      },
      descDate(str) {
        var passTime = '';
        var date = new Date(str).getTime();
        var now = new Date().getTime();
        if (date < now) {
          return '已过期';
        } else {
          passTime = date - now;
          return `剩${Math.floor(passTime / 1000 / 60 / 60 / 24)}日`;
        }
      }
    },
    watch: {
      userInfo: function (value) {
        this.initData();
      }
    }
  }

</script>
<style lang="scss" scoped>
  .rating_page {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f1f1f1;
    z-index: 204;
    overflow-y: auto;
    padding-top: 2.0rem;
    p,
    span {
      font-family: Helvetica Neue, Tahoma, Arial;
    }
  }

  .category_title {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 2rem;
    background-color: #fff;
    span {
      text-align: center;
      font-size: .65rem;
      color: #333;
      padding-bottom: .2rem;
      border-bottom: 0.1rem solid #fff;
    }
    .choosed {
      border-bottom-color: #3190e8;
      color: #3190e8;
    }
  }

  .hongbao_description {
    display: flex;
    align-items: center;
    img {
      width: .6rem;
      height: .6rem;
      margin-right: .2rem;
    }
    .hongbao_detail {
      color: #3190e8;
    }
  }

  .hongbao_container {
    padding: 0 .7rem;
    .hongbao_title {
      display: flex;
      justify-content: space-between;
      font-size: .5rem;
      line-height: 2rem;
      .total_number {
        color: #666;
        span {
          color: #ff5340;
        }
      }
    }
    .hongbao_list_ul {
      .hongbao_list_li {
        background: #fff url(../../../images/hongbao.png) repeat-x;
        background-size: .5rem .2rem;
        margin-bottom: 0.5rem;
        border-radius: 0.25rem;
        .list_item {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0.5rem .8rem;
          .list_item_left {
            font-size: 0;
            border-right: 0.025rem dotted #ccc;
            flex: 1;
            span:nth-of-type(1) {
              font-size: .75rem;
              color: #ff5340;
              font-weight: bold;
            }
            span:nth-of-type(2) {
              font-size: 1.5rem;
              color: #ff5340;
            }
            span:nth-of-type(3),
            span:nth-of-type(4) {
              font-size: .8rem;
              color: #ff5340;
              font-weight: bold;
            }
            p {
              font-size: .4rem;
              color: #999;
            }
          }
          .list_item_right {
            flex: 2;
            margin-left: 1.5rem;
            h4 {
              font-size: .7rem;
              color: #666;
              margin-left: -.7rem;
            }
            p {
              list-style-type: disc;
              margin-left: -.7rem;
              font-size: .4rem;
              color: #999;
            }
          }
          .time_left {
            font-size: .75rem;
            color: #ff5340;
          }
        }
        .list_item_footer {
          background-color: #f9f9f9;
          padding: .4rem .4rem;
          border-bottom-left-radius: 0.25rem;
          border-bottom-right-radius: 0.25rem;
          p {
            list-style-type: disc;
            font-size: .4rem;
            color: #999;
            margin-left: .4rem;
          }
        }
      }
      .expire {
        background-color: #e1e1e1;
      }
    }
  }

  .history_hongbao {
    padding: .5rem 0 2.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .check_history {
      font-size: .5rem;
      color: #999;
      margin-right: .2rem;
    }
    .history_right {
      width: .4rem;
      height: .4rem;
      fill: #aaa;
    }
  }

  .hongbao_footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    display: flex;
    .hongbao_style {
      flex: 1;
      line-height: 2rem;
      text-align: center;
      font-size: .7rem;
      color: #555;
    }
  }

  .voucher_container {
    .voucher_header {
      font-size: .5rem;
      justify-content: flex-end;
      line-height: 2rem;
      margin-right: .5rem;
    }
    .unable_use {
      text-align: center;
      margin-top: 4rem;
      img {
        width: 6rem;
        height: 3.4rem;
      }
      p:nth-of-type(1) {
        font-size: .7rem;
        color: #666;
        margin-top: .4rem;
      }
      p:nth-of-type(2) {
        font-size: .5rem;
        color: #999;
        margin-top: .3rem;
        margin-bottom: .3rem;
      }
      .download_app {
        background-color: #56d176;
        font-size: .65rem;
        color: #fff;
        padding: .3rem;
        border-radius: .15rem;
      }
    }
  }

  .router-fade-enter-active,
  .router-fade-leave-active {
    transition: opacity .3s;
  }

  .router-fade-enter,
  .router-fade-leave-active {
    opacity: 0;
  }

  .router-slid-enter-active,
  .router-slid-leave-active {
    transition: all .4s;
  }

  .router-slid-enter,
  .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }

</style>
