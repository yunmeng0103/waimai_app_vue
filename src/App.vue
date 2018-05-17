<template>
  <div>
    <transition name="router-fade">
      <router-view/>
    </transition>
    <v-svgIcon></v-svgIcon>
  </div>
</template>
<script>
import svgIcon from './components/common/svg.vue';
import { mapActions } from 'vuex'
import { getStore } from './config/mUtils.js'
export default {
  data() {
    return {

    }
  },
  components: {
    'v-svgIcon': svgIcon,
  },
  computed: {},
  created() {
    if (getStore('userid')) {
      //获取用户信息
      this.saveUserInfo();
    }
  },
  methods: {
    ...mapActions([
      'saveUserInfo'
    ]),
  },
}

</script>
<style>
@import './style/common';
.router-fade-enter-active,
.router-fade-leave-active {
  transition: opacity .5s;
}

.router-fade-enter,
.router-fade-leave-active {
  opacity: 0;
}

</style>
