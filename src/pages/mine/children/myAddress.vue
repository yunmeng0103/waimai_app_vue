<template>
  <div class="editAddress">
    <v-headTop head-title="收货地址" go-back='true'></v-headTop>
    <section class="address">
      <ul class="addresslist">
        <li v-for="(item,index) in removeAddress">
          <div>
            <p>
              <span>{{item.name}}</span>
              <span>{{item.sex == 0? '先生' : '女士'}}</span>
              <span>{{item.phone}}</span>
            </p>
            <div class="address_detail ellipsis">
              <span v-if="item.target" :style="{backgroundColor: iconColor(tagSwitch(item.target))}">{{tagSwitch(item.target)}}</span>
              <p>{{item.adressDetail}}</p>
            </div>
          </div>
          <div class="deletesite">
            <span @click="deleteSite(index, item)">
              <svg>
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
              </svg>
            </span>
          </div>
        </li>
      </ul>
      <router-link to="/addAddress" class="addsite">
        <img src="../../../images/add_address.png" height="24" width="24">
        <span>新增收货地址</span>
      </router-link>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { MessageBox } from 'mint-ui';
import headTop from '../../../components/header/head.vue'
import { getAddressList, deleteAddress } from '../../../service/getData.js'

export default {
  data() {
    return {
      deletesite: false, //是否编辑状态
      editText: '编辑',
      adressList: [], //地址列表
    }
  },
  mounted() {
    this.initData();
  },
  components: {
    'v-headTop': headTop,
  },
  computed: {
    ...mapState([
      'userInfo', 'removeAddress'
    ]),

  },
  props: [],
  methods: {
    ...mapActions([
      'saveAddress'
    ]),
    // //初始化信息
    initData() {
      if (this.userInfo && this.userInfo.id) {
        //调用action获取用户地址信息并保存到vuex仓库
        this.saveAddress();
      }
    },

    // //删除地址
    async deleteSite(index, item) {
      if (this.userInfo && this.userInfo.id) {
        MessageBox.confirm('确认删除？', '提示').then(() => {
          // await deleteAddress(this.userInfo.id, item.id);
          this.removeAddress.splice(index, 1);
        }, () => {});

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
<style lang="scss" scoped>
.editAddress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f2f2;
  z-index: 202;
  padding-top: 2.0rem;
  p,
  span {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.address {
  width: 100%;
  margin-top: .4rem;
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  .addresslist {
    background: #fff;
    li {
      border-bottom: 1px solid #d9d9d9;
      padding: .4rem;
      display: flex;
      justify-content: space-between;
      p {
        line-height: .9rem;
        font-size: .6rem;
        color: #333;
        span {
          display: inline-block;
          font-size: .6rem;
          color: #333;
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
      .deletesite {
        display: flex;
        align-items: center;
        span {
          display: block;
          font-size: .8rem;
          color: #999;
          svg {
            width: .6rem;
            height: .6rem;
            vertical-align: middle;
          }
        }
      }
    }
    li:nth-of-type(1) {
      // background: #FFF8C3;
    }
  }
  .addsite {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2.0rem;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 204;
    span {
      font-size: .6rem;
      color: #3190e8;
      margin-left: .3rem;
    }
  }
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
