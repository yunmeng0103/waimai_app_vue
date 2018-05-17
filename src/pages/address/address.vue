<template>
  <div class="city_container">
    <head-top :head-title="cityname" go-back='true'>
      <router-link to="/city_list" slot="changecity" class="change_city">切换城市</router-link>
    </head-top>
    <form class="city_form" v-on:submit.prevent>
      <div>
        <input type="search" name="city" placeholder="输入学校、商务楼、地址" class="city_input input_style" required v-model='inputVaule' v-on:input='isInput'>
      </div>
      <div>
        <input type="submit" name="submit" class="city_submit input_style" @click='postpois' value="搜索">
      </div>
    </form>
    <header v-if="historytitle" class="pois_search_history">搜索历史</header>
    <ul class="getpois_ul">
      <li v-for="(item, index) in placelist" @click='nextpage(item,index)' :key="index">
        <h4 class="pois_name ellipsis">{{item.name}}</h4>
        <p class="pois_address ellipsis">{{item.address}}</p>
      </li>
    </ul>
    <footer v-if="historytitle&&placelist.length" class="clear_all_history" @click="clearAll">清空所有</footer>
    <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
  </div>
</template>
<script>
import headTop from '../../../src/components/header/head'
import { mapState, mapMutations, mapActions } from 'vuex'
import { currentcity, searchplace } from '../../../src/service/getData'
import { getStore, setStore, removeStore, uncompileStr } from '../../../src/config/mUtils'

export default {
  data() {
    return {
      inputVaule: '', // 搜索地址
      cityid: '', // 当前城市id
      cityname: '', // 当前城市名字
      placelist: [], // 搜索城市列表
      placeHistory: [], // 历史搜索记录
      historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
      placeNone: false, // 搜索无结果，显示提示信息
    }
  },
  created() {
    //获取当前城市名字
    this.cityname = uncompileStr(this.$route.query.city);
    this.choose_city_name(this.cityname);
  },
  mounted() {
    this.initData();
  },
  components: {
    headTop
  },
  computed: {
    ...mapState([
      'autocompleteList'
    ])
  },
  watch: {
    inputVaule(newVal, odlVal) {
      if (newVal) {
        this.historytitle = false;
        this.autocomplete(newVal);
      } else {
        this.historytitle = true;
        this.initData();
      }
    },
    autocompleteList(newVal, odlVal) {
      if (newVal) {
        this.placelist = newVal;
      }
      this.placeNone = newVal ? false : true;
    }
  },
  methods: {
    ...mapActions([
      'choose_city_name', 'autocomplete', 'choose_address'
    ]),
    initData() {
      //获取搜索历史记录
      if (getStore('placeHistory')) {
        this.placelist = JSON.parse(getStore('placeHistory'));
      } else {
        this.placelist = [];
      }
    },
    isInput() {
      // if (!this.inputVaule) {
      //   console.log(1111);
      // }
    },
    //发送搜索信息inputVaule
    postpois() {
      //输入值不为空时才发送信息
      // if (this.inputVaule) {
      //   searchplace(this.cityid, this.inputVaule).then(res => {
      //     this.historytitle = false;
      //     this.placelist = res;
      //     this.placeNone = res.length ? false : true;
      //   })
      // }
    },
    /**
     * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
     * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
     */
    nextpage(choosePlace, index) {
      let history = getStore('placeHistory');
      let geohash = `${choosePlace.location.lat},${choosePlace.location.lng}`;
      if (history) {
        let checkrepeat = false;
        this.placeHistory = JSON.parse(history);
        this.placeHistory.forEach(item => {
          let itemGeohash = `${item.location.lat},${item.location.lng}`;
          if (itemGeohash == geohash) {
            checkrepeat = true;
          }
        })
        if (!checkrepeat) {
          this.placeHistory.push(choosePlace)
        }
      } else {
        //没有历史记录时，直接储存
        this.placeHistory.push(choosePlace)
      }
      setStore('placeHistory', this.placeHistory)
      this.choose_address(choosePlace.name); //调用action异步提交mutation
      this.$router.push({ path: '/home', query: { geohash } })
    },
    clearAll() {
      removeStore('placeHistory');
      this.initData();
    }
  }
}

</script>
<style scoped>
.city_container {
  padding-top: 2.35rem;
}

.change_city {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 0.4rem;
  font-size: 0.6rem;
  color: #fff;
}

.city_form {
  background-color: #fff;
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  padding-top: 0.4rem;
}

.city_form div {
  width: 90%;
  margin: 0 auto;
  text-align: center;
}

.city_form div .input_style {
  border-radius: 0.1rem;
  margin-bottom: 0.4rem;
  width: 100%;
  height: 1.4rem;
}

.city_form div .city_input {
  border: 1px solid #e4e4e4;
  padding: 0 0.3rem;
  font-size: 0.65rem;
  color: #333;
}

.city_form div .city_submit {
  background-color: #3190e8;
  font-size: 0.65rem;
  color: #fff;
}

.pois_search_history {
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  padding-left: 0.5rem;
  font: 0.475rem/1.8rem 'Microsoft YaHei';
}

.getpois_ul {
  background-color: #fff;
  border-top: 1px solid #e4e4e4;
}

.getpois_ul li {
  margin: 0 auto;
  padding-top: 0.65rem;
  border-bottom: 1px solid #e4e4e4;
}

.getpois_ul li .pois_name {
  margin: 0 auto 0.35rem;
  width: 90%;
  font-size: 0.65rem;
  color: #333;
}

.getpois_ul li .pois_address {
  width: 90%;
  margin: 0 auto 0.55rem;
  font-size: 0.45rem;
  color: #999;
}

.search_none_place {
  margin: 0 auto;
  font: 0.65rem/1.75rem 'Microsoft YaHei';
  color: #333;
  background-color: #fff;
  text-indent: 0.5rem;
}

.clear_all_history {
  font-size: 0.7rem;
  color: #666;
  text-align: center;
  line-height: 2rem;
  background-color: #fff;
}

</style>
