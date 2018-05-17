<template>
  <div class="mine">
    <v-headTop head-title="我的"></v-headTop>
    <div class="profile-number">
      <router-link :to="userInfo&&userInfo.id? '' : '/login'" class="profile-link">
        <img :src="imgBaseUrl + userInfo.avatar" class="privateImage" v-if="userInfo&&userInfo.user_id">
        <span class="privateImage" v-else>
                        <svg class="privateImage-svg">
                            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
                        </svg>
                    </span>
        <div class="user-info">
          <p>{{username}}</p>
          <p>
            <span class="user-icon">
                                <svg class="icon-mobile" fill="#fff">
                                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
                                </svg>
                            </span>
            <span class="icon-mobile-number">{{mobile}}</span>
          </p>
        </div>
        <span class="arrow" v-if="!userInfo">
                <svg class="arrow-svg" fill="#fff">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
          </span>
      </router-link>
    </div>
    <div class="info-data">
      <ul class="clear">
        <router-link :to="{path:'/mine/balance',query:{balance}}" tag="li" class="info-data-link">
          <span class="info-data-top"><b>{{parseInt(balance).toFixed(2)}}</b>元</span>
          <span class="info-data-bottom">我的余额</span>
        </router-link>
        <router-link to="/mine/benefit" tag="li" class="info-data-link">
          <span class="info-data-top"><b>{{count}}</b>个</span>
          <span class="info-data-bottom">我的优惠</span>
        </router-link>
        <router-link :to="{path:'/mine/points',query:{pointNumber}}" tag="li" class="info-data-link">
          <span class="info-data-top"><b>{{pointNumber}}</b>分</span>
          <span class="info-data-bottom">我的积分</span>
        </router-link>
      </ul>
    </div>
    <div class="profile-1reTe" v-if="userInfo">
      <!-- 我的订单 -->
      <router-link to='/order' class="myorder">
        <aside>
          <svg fill="#ccc">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
          </svg>
        </aside>
        <div class="myorder-div">
          <span>我的订单</span>
          <span class="myorder-divsvg">
                <svg fill="#bbb">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </span>
        </div>
      </router-link>
      <!-- 收货地址 -->
      <router-link to='/mine/myAddress' class="myorder">
        <aside>
          <svg fill="#4aa5f0">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
        </aside>
        <div class="myorder-div">
          <span>收货地址</span>
          <span class="myorder-divsvg">
                <svg fill="#bbb">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </span>
        </div>
      </router-link>
    </div>
    <div class="profile-1reTe" v-if="userInfo">
      <div class="exitlogin" @click="exitlogin">退出登录</div>
    </div>
    <v-footGuide></v-footGuide>
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { MessageBox } from 'mint-ui';
import { mapState, mapMutations } from 'vuex'
import headTop from '../../components/header/head'
import footGuide from '../../components/footer/footGuide.vue'
import { signout } from '../../service/getData.js'
import { removeStore } from '../../config/mUtils'
import { imgBaseUrl } from '../../config/env.js'
import { getImgPath } from '../../components/common/mixin.js'

export default {
  data() {
    return {
      username: '登录/注册', //用户名
      resetname: '',
      mobile: '暂无绑定手机号', //电话号码
      balance: 0, //我的余额
      count: 0, //优惠券个数
      pointNumber: 0, //积分数
      avatar: '', //头像地址
      imgBaseUrl,
    }
  },
  mounted() {
    this.initData();
  },
  mixins: [getImgPath],
  components: {
    'v-headTop': headTop,
    'v-footGuide': footGuide,
  },
  computed: {
    ...mapState([
      'userInfo',
    ]),
    //后台会返回两种头像地址格式，分别处理
    imgpath: function() {
      let path;
      if (this.avatar.indexOf('/') !== -1) {
        path = imgBaseUrl + 　this.avatar;
      } else {
        path = this.getImgPath(this.avatar)
      }
      // this.SAVE_AVANDER(path);
      return path;
    }
  },
  methods: {
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    initData() {
      if (this.userInfo && this.userInfo.id) {
        this.avatar = this.userInfo.image;
        this.username = this.userInfo.username;
        this.mobile = this.userInfo.phone || '暂无绑定手机号';
        this.balance = this.userInfo.balance;
        this.count = this.userInfo.couponCount;
        this.pointNumber = this.userInfo.point;
      } else {
        this.username = '登录/注册';
        this.mobile = '暂无绑定手机号';
      }
    },
    //退出登录
    async exitlogin() {
      MessageBox.confirm('确认退出？', '提示').then(() => {
        this.OUT_LOGIN();
        this.reload();
        removeStore('userid');
      }, () => {});
    },
    reload() {
      window.location.reload();
    },
  },
  watch: {
    userInfo: function(value) {
      if (value && value.id) {
        this.initData();
      }
    }
  }
}

</script>
<style scoped>
.mine {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;
}

.mine p,
.mine span {
  font-family: Helvetica Neue, Tahoma, Arial;
}


.profile-number {
  padding-top: 2.0rem;
  border-top: .05rem solid #F5F5F5;
}

.profile-number .profile-link {
  display: block;
  display: flex;
  box-align: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  background: #3190e8;
  padding: .67rem .5rem;
}

.profile-number .profile-link .privateImage {
  display: inline-block;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  vertical-align: middle;
}

.profile-number .profile-link .privateImage .privateImage-svg {
  background: #fff;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
}

.profile-number .profile-link .user-info {
  margin-left: .48rem;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  flex-grow: 1;
}

.profile-number .profile-link .user-info p {
  font-weight: 700;
  font-size: .8rem;
  color: #fff;
}

.profile-number .profile-link .user-info p .user-icon {
  width: .5rem;
  height: .75rem;
  display: inline-block;
  vertical-align: middle;
  line-height: 0.75rem;
}

.profile-number .profile-link .user-info p .user-icon .icon-mobile {
  width: 100%;
  height: 100%;
}

.profile-number .profile-link .user-info p .icon-mobile-number {
  display: inline-block;
  font-size: .6rem;
  color: #fff;
}

.profile-number .profile-link .arrow {
  width: .47rem;
  height: .98rem;
  display: inline-block;
}

.profile-number .profile-link .arrow svg {
  width: 100%;
  height: 100%;
}

.info-data {
  width: 100%;
  background: #fff;
  box-sizing: border-box;
}

.info-data ul {
  display: flex;
}

.info-data ul .info-data-link {
  width: calc(100%/3);
  display: inline-block;
}

.info-data ul .info-data-link:nth-of-type(2) {
  border-left: 1px solid #f1f1f1;
  border-right: 1px solid #f1f1f1;
}

.info-data ul .info-data-link span {
  display: block;
  width: 100%;
  text-align: center;
}

.info-data ul .info-data-link .info-data-top {
  font-size: .55rem;
  color: #333;
  padding: .85rem 0 .45rem;
  margin: 0 auto;
}

.info-data ul .info-data-link .info-data-bottom {
  font-size: .57rem;
  color: #666;
  font-weight: 400;
  padding-bottom: .45rem;
}

.info-data ul .info-data-link .info-data-top b {
  display: inline-block;
  font-size: 1.2rem;
  color: #f90;
  font-weight: 700;
  line-height: 1rem;
  font-family: Helvetica Neue, Tahoma;
}

.info-data ul .info-data-link:nth-of-type(2) .info-data-top b {
  color: #ff5f3e;
}

.info-data ul .info-data-link:nth-of-type(3) {
  border: 0;
}

.info-data ul .info-data-link:nth-of-type(3) .info-data-top b {
  color: #6ac20b;
}

.profile-1reTe {
  margin-top: .4rem;
  background: #fff;
}

.profile-1reTe .myorder {
  padding: .5rem .5rem 0 1.6rem;
  display: flex;
  align-items: center;
}

.profile-1reTe .myorder aside {
  width: .8rem;
  height: .8rem;
  margin-left: -.87rem;
  margin-right: .27rem;
  display: flex;
  align-items: center;
}

.profile-1reTe .myorder aside svg {
  width: .8rem;
  height: .8rem;
}

.profile-1reTe .myorder .myorder-div {
  width: 100%;
  border-bottom: .01rem solid #f1f1f1;
  padding: .43rem .26rem .43rem 0;
  font-size: .7rem;
  color: #333;
  display: flex;
  justify-content: space-between;
}

.profile-1reTe .myorder .myorder-div span {
  display: block;
}

.profile-1reTe .myorder .myorder-div .myorder-divsvg {
  width: .47rem;
  height: .47rem;
}

.profile-1reTe .myorder .myorder-div .myorder-divsvg svg {
  width: 100%;
  height: 100%;
}

.profile-1reTe .exitlogin {
  width: 100%;
  height: 100%;
  display: block;
  text-align: center;
  padding: .5rem 0;
  font-size: .7rem;
  color: #f00;
}

.move-enter-active,
.move-leave-active {
  transition: all .2s linear;
  transform: translate3D(0, 0, 0);
}

.move-enter,
.move-leave-active {
  transform: translate3D(100%, 0, 0);
}

</style>
