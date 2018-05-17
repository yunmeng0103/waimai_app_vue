<template>
  <div class="rating_page">
    <v-headTop head-title="选择地址" go-back='true'></v-headTop>
    <section id="scroll_section" class="scroll_container">
      <section class="list_cotainer">
        <ul class="deliverable_address">
          <li v-for="(item,index) in deliverable" @click.prevent.stop="chooseAddress(item, index)">
            <svg class="choosed_address" :class="{default_address: defaultIndex == index}">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
            </svg>
            <div>
              <header>
                <span>{{item.name}}</span>
                <span>{{item.sex == 0? '先生' : '女士'}}</span>
                <span>{{item.phone}}</span>
              </header>
              <div class="address_detail ellipsis">
                <span v-if="item.target" :style="{backgroundColor: iconColor(tagSwitch(item.target))}">{{tagSwitch(item.target)}}</span>
                <p>{{item.adressDetail}}</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </section>
    <router-link to="/addAddress" class="add_icon_footer">
      <img src="../../../images/add_address.png" height="24" width="24">
      <span>新增收货地址</span>
    </router-link>
    <v-alertTip v-if="showAlert" @closeTip="showAlert = false" :alertText="alertText"></v-alertTip>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getAddress, getAddressList } from '../../../service/myData.js'
import BScroll from 'better-scroll'
import headTop from '../../../components/header/head.vue'
import alertTip from '../../../components/common/alertTip.vue'

export default {
  data() {
    return {
      addressList: [], //地址列表
      deliverable: [], //有效地址列表
      id: null, //ID
      sig: null,
      showAlert: false,
      alertText: null,
    }
  },
  created() {
    this.id = this.$route.query.id;
    this.sig = this.$route.query.sig;
    this.initData();
  },
  components: {
    'v-headTop': headTop,
    'v-alertTip': alertTip,
  },
  props: [],
  computed: {
    ...mapState([
      'userInfo', 'addressIndex', 'newAddress'
    ]),
    //选择地址
    defaultIndex: function() {
      if (this.addressIndex) {
        return this.addressIndex;
      } else {
        return 0;
      }
    },

  },
  methods: {
    ...mapMutations([
      'CHOOSE_ADDRESS'
    ]),
    //初始化信息
    async initData() {
      if (this.userInfo && this.userInfo.id) {
        let addressData = await getAddressList(this.userInfo.id);
        this.addressList = addressData.data;
        this.addressList.forEach(item => {
          this.deliverable.push(item);
        })
        this.$nextTick(() => {
          new BScroll('#scroll_section', {
            click: true,
            deceleration: 0.003,
            bounce: true,
            swipeTime: 1800,
          });
        })
      }
    },
    tagSwitch(tag) {
      switch (tag) {
        case 0:
          return '';
        case 1:
          return '家';
        case 2:
          return '学校';
        case 3:
          return '公司';
      }
    },
    iconColor(name) {
      switch (name) {
        case '学校':
          return '#3190e8';
        case '公司':
          return '#4cd964';
      }
    },
    //选择地址
    chooseAddress(address, index) {
      this.CHOOSE_ADDRESS({ address, index });
      this.$router.go(-1);
    },
  },
  watch: {
    userInfo: function(value) {
      if (value && value.id) {
        this.initData();
      }
    },
    newAddress: function(value) {
      this.initData();
    },
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
  background-color: #fff;
  z-index: 202;
  padding-top: 2.0rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.scroll_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  padding-top: 1.95rem;
  overflow-y: auto;
}

.list_cotainer {
  padding-bottom: 5rem;
}

.add_icon_footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2.5rem;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 204;
  span {
    font-size: .7rem;
    color: #3190e8;
    margin-left: .3rem;
  }
}

.deliverable_address {
  background-color: #fff;
  li {
    display: flex;
    align-items: center;
    border-bottom: 0.025rem solid #f5f5f5;
    padding: .7rem;
    line-height: 1rem;
    .choosed_address {
      width: .8rem;
      height: .8rem;
      fill: #4cd964;
      margin-right: .4rem;
      opacity: 0;
    }
    .default_address {
      opacity: 1;
    }
    header {
      font-size: .7rem;
      color: #333;
      span:nth-of-type(1) {
        font-size: .8rem;
        font-weight: bold;
      }
    }
    .address_detail {
      width: 100%;
      display: flex;
      align-items: center;
      span {
        font-size: .5rem;
        color: #fff;
        border-radius: .15rem;
        background-color: #ff5722;
        height: .6rem;
        line-height: .6rem;
        padding: 0 .2rem;
        margin-right: .3rem;
      }
      p {
        font-size: .6rem;
        color: #777;
      }
    }
  }
}

#out_delivery {
  .out_header {
    font-size: .6rem;
    color: #666;
    line-height: 1.5rem;
    padding-left: .5rem;
    background-color: #f5f5f5;
  }
  * {
    color: #ccc;
  }
}

</style>
