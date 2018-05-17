<template>
  <div class="search_address_page">
    <div>
      <v-headTop head-title="搜索" go-back='true'></v-headTop>
      <form class="search_form">
        <input type="search" name="search" placeholder="请输入小区/写字楼/学校等" v-model="searchValue">
        <button @click.prevent="searchPlace()">搜索</button>
      </form>
      <div v-if="searchData">
        <header v-if="historytitle" class="pois_search_history">搜索历史</header>
        <ul class="address_list">
          <li v-for="(item, index) in searchData" :key="index" @click="choooedAddress(index,item)">
            <h4>{{item.name}}</h4>
            <p>{{item.address}}</p>
          </li>
        </ul>
        <footer v-if="historytitle&&searchData.length" class="clear_all_history" @click="clearAll">清空所有</footer>
      </div>
      <div v-else class="empty_tips">
        <p>找不到地址？</p>
        <p>尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号等）可稍后输入哦</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'
import headTop from '../../../components/header/head.vue'
import { searchNearby } from '../../../service/getData.js'
import { getStore, setStore, removeStore } from '../../../config/mUtils.js'

export default {
  data() {
    return {
      searchValue: null, //输入的搜索内容
      searchData: [], //搜索的结果
      historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
      searchHistory: [], // 历史搜索记录
    }
  },
  components: {
    'v-headTop': headTop,
  },
  props: [],
  mounted() {
    this.initData();
  },
  methods: {
    ...mapMutations([
      'CHOOSE_SEARCH_ADDRESS'
    ]),
    initData() {
      //获取搜索历史记录
      if (getStore('searchHistory')) {
        this.searchData = JSON.parse(getStore('searchHistory'));
      } else {
        this.searchData = [];
      }
    },
    //搜索
    async searchPlace() {
      if (this.searchValue) {
        this.historytitle = false;
        this.searchData = await searchNearby(this.searchValue);
      }
    },
    //选择搜素结果
    choooedAddress(index, item) {
      let history = getStore('searchHistory');
      let choosePlace = this.searchData[index];
      if (history) {
        let checkrepeat = false;
        this.searchHistory = JSON.parse(history);
        this.searchHistory.forEach(historyItem => {
          if (historyItem.geohash == item.geohash) {
            //重复则不加入
            checkrepeat = true;
          }
        })
        if (!checkrepeat) {
          this.searchHistory.push(choosePlace)
        }
      } else {
        this.searchHistory.push(choosePlace);
      }
      setStore('searchHistory', this.searchHistory)
      this.CHOOSE_SEARCH_ADDRESS(item);
      this.$router.go(-1);
    },
    clearAll() {
      removeStore('searchHistory');
      this.initData();
    }
  }
}

</script>
<style lang="scss" scoped>
.search_address_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 204;
  overflow-y: auto;
  padding-top: 1.95rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.search_form {
  display: flex;
  padding: .7rem;
  input {
    font-size: .65rem;
    color: #999;
    flex: 4;
    background-color: #f1f1f1;
    margin-right: .6rem;
    height: 1.5rem;
    border-radius: 0.15rem;
    padding: 0 .4rem;
  }
  button {
    flex: 1;
    font-size: .65rem;
    color: #fff;
    background-color: #3190e8;
    border-radius: 0.15rem;
    outline: none;
    border: none;
  }
}

.pois_search_history {
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  padding-left: 0.7rem;
  font: 0.6rem/1.2rem 'Microsoft YaHei';
}

.address_list {
  padding: .2rem .7rem;
  li {
    padding: .5rem 0;
    border-bottom: 0.025rem solid #f5f5f5;
    line-height: 1rem;
    h4 {
      font-size: .75rem;
      color: #555;
    }
    p {
      font-size: .65rem;
      color: #999;
    }
  }
}

.clear_all_history {
  font-size: 0.7rem;
  color: #666;
  text-align: center;
  line-height: 2rem;
  background-color: #fff;
}

.empty_tips {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  p {
    font-size: .5rem;
    color: #aaa;
    line-height: .7rem;
    text-align: center;
  }
}

</style>
