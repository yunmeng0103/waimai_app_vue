<template>
  <div class="loginContainer">
    <v-headTop head-title="登录" goBack="true">
    </v-headTop>
    <form class="loginForm">
      <section class="input_container phone_number">
        <input type="text" placeholder="手机号" autofocus name="phone" maxlength="11" v-model="phoneNumber">
      </section>
      <section class="input_container">
        <input type="text" placeholder="验证码" name="mobileCode" maxlength="6" v-model="mobileCode">
        <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}" v-show="!computedTime">获取验证码</button>
        <button @click.prevent v-show="computedTime">已发送({{computedTime}}s)</button>
      </section>
    </form>
    <p class="login_tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <p class="login_tips">
      注册过的用户可凭账号密码登录
    </p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/forget" class="to_forget">重置密码？</router-link>
  </div>
</template>
<script>
import headTop from '../../components/header/head.vue'
import { Toast } from 'mint-ui'
import { mapState, mapMutations } from 'vuex'
import { localapi, proapi, imgBaseUrl } from '../../config/env.js'
import { mobileCode, sendLogin } from '../../service/myData.js'

export default {
  data() {
    return {
      phoneNumber: null, //电话号码
      mobileCode: null, //短信验证码
      validate_token: null, //获取短信时返回的验证值，登录时需要
      computedTime: 0, //倒数记时
      userInfo: null, //获取到的用户信息
    }
  },
  created() {},
  components: {
    'v-headTop': headTop,
  },
  computed: {
    //判断手机号码
    rightPhoneNumber: function() {
      return /^1\d{10}$/gi.test(this.phoneNumber)
    }
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO',
    ]),
    //获取短信验证码
    async getVerifyCode() {
      if (this.rightPhoneNumber) {
        this.computedTime = 60;
        this.timer = setInterval(() => {
          this.computedTime--;
          if (this.computedTime == 0) {
            clearInterval(this.timer);
          }
        }, 1000)
        // 发送短信验证码
        let res = await mobileCode(this.phoneNumber);
        if (res.code == 100 || res.code == '100') {
          // mint UI
          this.toast(res.msg);
        }
      } else {
        this.toast('请输入手机号');
      }
    },
    async mobileLogin() {
      if (!this.phoneNumber) {
        this.toast('请输入手机号');
        return
      } else if (!this.mobileCode) {
        this.toast('请输入验证码');
        return
      } else if (!this.rightPhoneNumber) {
        this.toast('手机号码不正确');
        return
      } else if (!(/^\d{6}$/gi.test(this.mobileCode))) {
        this.toast('短信验证码不正确');
        return
      }
      //手机号登录
      this.userInfo = await sendLogin(this.phoneNumber, this.mobileCode);
      //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
      if (!this.userInfo.data.id) {
        this.toast(this.userInfo.msg);
      } else {
        this.toast(this.userInfo.msg);
        setTimeout(() => {
          this.RECORD_USERINFO(this.userInfo.data);
          this.$router.go(-1);
        }, 800);
      }
    },
    toast(text) {
      Toast({
        message: text,
        position: 'bottom',
        duration: 2000
      });
    }
  }
}

</script>
<style scoped>
.loginContainer {
  padding-top: 2.0rem;
}

.loginContainer p,
.loginContainer span,
.loginContainer input {
  font-family: Helvetica Neue, Tahoma, Arial;
}

.change_login {
  position: absolute;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.75rem;
  font-size: .7rem;
  color: #fff;
}

.loginForm {
  background-color: #fff;
  margin-top: .6rem;
}

.loginForm .input_container {
  display: flex;
  justify-content: space-between;
  padding: .4rem .8rem;
  border-bottom: 0.025rem solid #f1f1f1;
  box-sizing: border-box;
}

.loginForm .input_container input {
  font-size: .6rem;
  color: #666;
  outline: none;
}

.loginForm .input_container button {
  font-size: .6rem;
  color: #fff;
  background-color: #999;
  font-family: Helvetica Neue, Tahoma, Arial;
  padding: .28rem .4rem;
  border: none;
  outline: none;
  border-radius: 0.15rem;
}

.loginForm .input_container .right_phone_number {
  background-color: #4cd964;
}


.loginForm .captcha_code_container {
  height: 2.2rem;
  box-sizing: border-box;
}

.loginForm .captcha_code_container .img_change_img {
  display: flex;
  align-items: center;
  text-decoration: underline;
}

.loginForm .captcha_code_container .img_change_img img {
  width: 3.5rem;
  height: 1.0rem;
  margin-right: .2rem;
}


.loginForm .captcha_code_container .img_change_img .change_img {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
}

.loginForm .captcha_code_container .img_change_img .change_img p {
  font-size: .55rem;
  color: #666;
}

.loginForm .captcha_code_container .img_change_img .change_im p:nth-of-type(2) {
  color: #3b95e9;
  margin-top: .2rem;
}

.login_tips {
  font-size: .5rem;
  color: #f00;
  padding: .4rem .6rem;
  line-height: .5rem;
}

.login_tips a {
  color: #3b95e9;
}

.login_container {
  margin: 0 .5rem 1rem;
  font-size: .7rem;
  color: #fff;
  background-color: #4cd964;
  padding: .5rem 0;
  border: 1px;
  border-radius: 0.15rem;
  text-align: center;
}

.button_switch {
  background-color: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.0rem;
  height: .8rem;
  padding: 0 .2rem;
  border: 1px;
  border-radius: 0.5rem;
  position: relative;
}

.button_switch .circle_button {
  transition: all .3s;
  position: absolute;
  top: -0.2rem;
  z-index: 1;
  left: -0.3rem;
  width: 1.2rem;
  height: 1.2rem;
  box-shadow: 0 0.027rem 0.05rem 0 rgba(0, 0, 0, .1);
  background-color: #f1f1f1;
  border-radius: 50%;
}

.button_switch .trans_to_right {
  transform: translateX(1.6rem);
}

.button_switch span {
  font-size: .45rem;
  color: #fff;
  transform: translateY(.03rem);
  line-height: .8rem;
}

.button_switch span:nth-of-type(2) {
  transform: translateY(-.08rem);
}

.change_to_text {
  background-color: #4cd964;
}

.to_forget {
  float: right;
  font-size: .6rem;
  color: #3b95e9;
  margin-right: .3rem;
}

</style>
