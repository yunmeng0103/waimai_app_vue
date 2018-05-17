<template>
  <div>
    <v-headTop :head-title="choosecity" goBack='home'>
    </v-headTop>
    <nav class="city_nav">
      <div class="city_tip">
        <span>当前定位城市：</span>
        <span>定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="'/address/' + guessCityid" class="guess_city">
        <span>{{guessCity}}</span>
        <i class="icon-keyboard_arrow_right arrow_right"></i>
      </router-link>
    </nav>
    <section id="hot_city_container">
      <h4 class="city_title">热门城市</h4>
      <ul class="citylistul clear">
        <router-link tag="li" v-for="item in hotcity" :to="'/address/' + item.id" :key="item.id">
          {{item.name}}
        </router-link>
      </ul>
    </section>
    <section class="group_city_container">
      <ul class="letter_classify">
        <li v-for="(value, key, index) in sortgroupcity" :key="key" class="letter_classify_li">
          <h4 class="city_title">{{key}}<span v-if="index == 0">（按字母排序）</span></h4>
          <ul class="groupcity_name_container citylistul clear">
            <router-link tag="li" v-for="item in value" :to="'/address/' + item.id" :key="item.id" class="ellipsis">
              {{item.name}}
            </router-link>
          </ul>
        </li>
      </ul>
    </section>
    <v-toTop :shop-list="false"></v-toTop>
    <transition name="loading-fade">
      <v-loading class="loading" v-if="showLoading" type="spin" color="rgba(49,144,232,.8)" :size="{ width: '50px', height: '50px' }"></v-loading>
    </transition>
  </div>
</template>
<script>
import loading from 'vue-loading-template'
import headTop from '../../components/header/head'
import toTop from '../../components/common/toTop'
import { cityGuess, hotcity, groupcity } from '../../service/getData'
export default {
  data() {
    return {
      choosecity: '选择城市',
      guessCity: '', //当前城市
      guessCityid: '', //当前城市id
      hotcity: [], //热门城市列表
      groupcity: {}, //所有城市列表
      showLoading: true, //loading显示
    }
  },
  mounted() {
    this.initData();
  },
  components: {
    'v-headTop': headTop,
    'v-toTop': toTop,
    'v-loading': loading,
  },
  computed: {
    //将获取的数据按照A-Z字母开头排序
    sortgroupcity() {
      let sortobj = {};
      // String.fromCharCode(65,66,67) 对应 ABC
      for (let i = 65; i <= 90; i++) {
        if (this.groupcity[String.fromCharCode(i)]) {
          sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
        }
      }
      return sortobj
    }
  },
  methods: {
    async initData() {
      // 获取当前城市
      await cityGuess().then(res => {
        this.guessCity = res.name;
        this.guessCityid = res.id;
      });
      let cityArr = [];
      //获取热门城市
      this.hotcity = await hotcity();
      //获取所有城市
      this.groupcity = await groupcity();
      this.showLoading = false;
    }
  }
}

</script>
<style scoped>
.city_nav {
  margin-top: 2.0rem;
  border-top: 1px solid #e4e4e4;
  background-color: #fff;
  margin-bottom: 0.4rem;
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
  border-bottom: 2px solid #e4e4e4;
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
