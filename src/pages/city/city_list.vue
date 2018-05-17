<template>
  <div>
    <v-headTop head-title="选择城市" goBack='home'>
    </v-headTop>
    <nav class="city_nav">
      <div class="city_tip">
        <span>当前定位城市：</span>
        <span>定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="{path: '/address', query: {city: toCompileStr}}" class="guess_city">
        <span>{{currentCity}}</span>
        <i class="icon-keyboard_arrow_right arrow_right"></i>
      </router-link>
    </nav>
    <div class="list-wrapper">
      <mt-index-list>
        <template v-for="(item,i) in cityList">
          <mt-index-section :index="item.name">
            <template v-for="(city,j) in item.cityName">
              <mt-cell :title="city" @click.native="choose_city(i,j)"></mt-cell>
            </template>
          </mt-index-section>
        </template>
      </mt-index-list>
    </div>
    <transition name="loading-fade">
      <v-loading class="loading" v-if="showLoading" type="spin" color="rgba(49,144,232,.8)" :size="{ width: '50px', height: '50px' }"></v-loading>
    </transition>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import loading from 'vue-loading-template'
import { Indicator } from 'mint-ui';
import headTop from '../../components/header/head'
import { compileStr } from '../../config/mUtils.js'
export default {
  data() {
    return {
      currentCity: '', //当前城市
      showLoading: false, //loading显示
    }
  },
  mounted() {
    this.getCurrentPosition();
    this.openLoading();
  },
  components: {
    'v-headTop': headTop,
    'v-loading': loading,
  },
  computed: {
    ...mapState(['cityList', 'position']),
    ...mapGetters(['getPosition']),
    toCompileStr() {
      return compileStr(this.currentCity);
    }
  },
  methods: {
    ...mapActions([
      'getCurrentPosition'
    ]),
    choose_city(i, j) {
      let cityItem = this.cityList[i].cityName[j];
      this.$router.push({ path: '/address', query: { city: compileStr(cityItem) } })
    },
    openLoading() {
      Indicator.open({
        text: '加载中...',
        spinnerType: 'snake'
      });
    },
    closeLoading() {
      Indicator.close();
    }
  },
  filters: {
    // 过滤器现在只能用在两个地方：mustache 插值({{}})和 v-bind (:) 表达式
  },
  watch: {
    position(value) {
      if (value.city == '') {
        this.currentCity = value.province;
      } else {
        this.currentCity = value.city;
      }
      // this.showLoading = false;
      this.closeLoading();
    }
  },
}

</script>
<style scoped>
.city_nav {
  position: fixed;
  top: 2.0rem;
  left: 0;
  z-index: 100;
  width: 100%;
  border-top: 1px solid #e4e4e4;
  background-color: #fff;
}

.city_nav .city_tip {
  display: flex;
  justify-content: space-between;
  line-height: 1.45rem;
  padding: 0 0.45rem;
}

.city_nav .city_tip span:nth-of-type(1) {
  font-size: 0.55rem;
  color: #666;
}

.city_nav .city_tip span:nth-of-type(2) {
  font-weight: 900;
  font-size: 0.475rem;
  color: #9f9f9f;
}

.city_nav .guess_city {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.8rem;
  padding: 0 0.45rem;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  font: 0.75rem/1.8rem 'Microsoft YaHei';
}

.city_nav .guess_city span:nth-of-type(1) {
  color: #3190e8;
}

.city_nav .guess_city .arrow_right {
  width: .6rem;
  height: .6rem;
  fill: #999;
}

.list-wrapper {
  position: fixed;
  top: 5.75rem;
  left: 0;
  width: 100%;
  height: 100%;
  color: #6f6f6f;
  background-color: #fff;
  border-top: 1px solid #e4e4e4;
}

#hot_city_container {
  background-color: #fff;
  margin-bottom: 0.4rem;
}

.citylistul li {
  float: left;
  text-align: center;
  color: #3190e8;
  border-bottom: 0.025rem solid #e4e4e4;
  border-right: 0.025rem solid #e4e4e4;
  width: 25%;
  height: 1.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 .5rem;
  box-sizing: border-box;
  font: 0.5rem/1.75rem 'Microsoft YaHei';
}

.citylistul li:nth-of-type(4n) {
  border-right: none;
}

.city_title {
  color: #666;
  font-weight: 400;
  text-indent: 0.45rem;
  border-top: 2px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  font: 0.55rem/1.45rem 'Helvetica Neue';
}

.city_title span {
  font-size: 0.475rem;
  color: #999;
}

.letter_classify_li {
  margin-bottom: 0.4rem;
  background-color: #fff;
  border-bottom: 1px solid #e4e4e4;
}

.letter_classify_li .groupcity_name_container li {
  color: #666;
}

.loading {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
}

.loading-fade-enter-active,
.loading-fade-leave-active {
  opacity: 1;
  transition: .5s;
}

.loading-fade-enter,
.loading-fade-leave-active {
  opacity: 0;
}

</style>
