<template>
  <header id='head_top'>
    <slot name='logo'></slot>
    <section class="head_goback" v-if="goBack" @click="go">
      <i class="icon-arrow_lift"></i>
    </section>
    <section class="title_head ellipsis" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </section>
    <slot name="msite-title"></slot>
    <slot name="changecity"></slot>
  </header>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {

    }
  },
  mounted() {
    //获取用户信息
  },
  props: ['signinUp', 'headTitle', 'goBack', 'backPath'],
  computed: {
    ...mapState([
      'geohash'
    ]),
  },
  methods: {
    go() {
      let geohash = this.geohash;
      this.backPath ? this.$router.push({ path: this.backPath, query: { geohash } }) : this.$router.go(-1);
    }
  },

}

</script>
<style scoped>
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
  font-size: .7rem;
  line-height: 2.2rem;
  margin-left: .4rem;
  color: #fff;
}

.head_login {
  right: 0.55rem;
  font-size: 0.65rem;
  color: #fff;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.head_login .login_span {
  color: #fff;
}

.head_login .user_avatar {
  fill: #fff;
  width: .8rem;
  height: .8rem;
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
  font-size: 0.7rem;
  color: #fff;
  text-align: center;
  font-weight: bold;
}

</style>
