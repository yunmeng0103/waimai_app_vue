<template>
  <div class="address_page">
    <v-headTop head-title="添加地址" go-back='true'></v-headTop>
    <div class="page_text_container">
      <div class="section_list">
        <span class="section_left">联系人</span>
        <div class="section_right">
          <input type="text" name="name" placeholder="你的名字" v-model="name" class="input_style">
          <div class="choose_sex">
            <span class="choose_option">
              <svg class="address_empty_right" @click="chooseSex(0)" :class="{choosed: sex == 0}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>先生</span>
            </span>
            <span class="choose_option">
              <svg class="address_empty_right" @click="chooseSex(1)" :class="{choosed: sex == 1}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>女士</span>
            </span>
          </div>
        </div>
      </div>
      <div class="section_list">
        <span class="section_left">联系电话</span>
        <div class="section_right">
          <div class="phone_add">
            <input type="text" name="phone" placeholder="你的手机号" v-model="phone" class="input_style" maxlength="11">
          </div>
        </div>
      </div>
      <div class="section_list">
        <span class="section_left">送餐地址</span>
        <div class="section_right">
          <router-link to="/addAddress/searchAddress" tag="div" :class="[searchAddress ? 'has_address' : 'no_address','choose_address']">{{searchAddress? searchAddress.name : '小区/写字楼/学校等'}}</router-link>
          <input type="text" name="address_detail" placeholder="详细地址（如门牌号等）" v-model="address_detail" class="input_style">
        </div>
      </div>
      <div class="section_list">
        <span class="section_left">标签</span>
        <div class="section_right">
          <input type="text" name="tag" placeholder="无/家/学校/公司" v-model="tag" class="input_style">
        </div>
      </div>
    </div>
    <div class="determine" @click="addAddress">确定</div>
    <v-alertTip v-if="showAlert" @closeTip="closeAlert" :alertText="alertText"></v-alertTip>
    <transition name="move" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { getAddress, postAddAddress } from '../../service/myData.js'
import headTop from '../../components/header/head.vue'
import alertTip from '../../components/common/alertTip'

export default {
  data() {
    return {
      name: null, //姓名
      sex: 0, //性别
      phone: null, //电话
      address_detail: null, //详细地址
      tag: '', //备注
      tag_type: 0, //备注类型
      showAlert: false, //弹出框
      alertText: null, //弹出框信息
      poi_type: 0, //地址类型
    }
  },
  created() {

  },
  components: {
    'v-headTop': headTop,
    'v-alertTip': alertTip,
  },
  computed: {
    ...mapState([
      'searchAddress', 'geohash', 'userInfo',
    ]),
    //判断手机号码
    rightPhoneNumber: function() {
      return /^1\d{10}$/gi.test(this.phone)
    }
  },
  methods: {
    ...mapMutations([
      'CONFIRM_ADDRESS'
    ]),
    //选择性别
    chooseSex(sex) {
      this.sex = sex;
    },
    //保存地址信息
    async addAddress() {
      if (!(this.userInfo && this.userInfo.id)) {
        this.showAlert = true;
        this.alertText = '请登录';
        return;
      } else if (!this.name) {
        this.showAlert = true;
        this.alertText = '请输入姓名';
        return;
      } else if (!this.phone) {
        this.showAlert = true;
        this.alertText = '请输入手机号码';
        return;
      } else if (!this.rightPhoneNumber) {
        this.showAlert = true;
        this.alertText = '手机号码不正确';
        return;
      } else if (!this.searchAddress) {
        this.showAlert = true;
        this.alertText = '请选择地址';
        return;
      } else if (!this.address_detail) {
        this.showAlert = true;
        this.alertText = '请输入详细地址';
        return;
      }
      if (this.tag == '家') {
        this.tag_type = 1;
      } else if (this.tag == '学校') {
        this.tag_type = 2;
      } else if (this.tag == '公司') {
        this.tag_type = 3;
      }
      let res = await postAddAddress(this.userInfo.id, this.name, this.sex, this.phone, this.searchAddress.name, this.address_detail, this.tag_type);
      // //保存成功后返回上一页，否则弹出提示框
      if (res.code == 100 || res.code == '100') {
        //保存成功，返回上一页
        this.CONFIRM_ADDRESS(1);
        this.$router.go(-1);
      } else {
        //保存失败
        this.showAlert = true;
        this.alertText = res.msg;
      }
    },
    closeAlert() {
      this.showAlert = false;
      if (!(this.userInfo && this.userInfo.id)) {
        this.$router.replace('/mine');
      }
    }
  }
}

</script>
<style lang="scss" scoped>
.address_page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f5f5f5;
  z-index: 204;
  padding-top: 1.95rem;
  p,
  span,
  input {
    font-family: Helvetica Neue, Tahoma, Arial;
  }
}

.address_page {
  input {
    underline: none;
  }
}

.page_text_container {
  background-color: #fff;
  padding: 0 .7rem;
}

.section_list {
  display: flex;
  border-bottom: 0.025rem solid #f5f5f5;
  .section_left {
    font-size: .7rem;
    color: #333;
    flex: 2;
    line-height: 2.5rem;
  }
  .section_right {
    flex: 5;
    .input_style {
      width: 100%;
      height: 2.5rem;
      font-size: .7rem;
      color: #999;
    }
    .phone_bk {
      border-top: 0.025rem solid #f5f5f5;
    }
    .phone_add {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .choose_sex {
      display: flex;
      line-height: 2.5rem;
      border-top: 0.025rem solid #f5f5f5;
      .choose_option {
        font-size: .7rem;
        color: #333;
        display: flex;
        align-items: center;
        margin-right: .8rem;
        svg {
          margin-right: .3rem;
          width: .8rem;
          height: .8rem;
          fill: #ccc;
        }
        .choosed {
          fill: #4cd964;
        }
      }
    }
    .choose_address {
      font-size: .7rem;
      line-height: 2.5rem;
      border-bottom: 0.025rem solid #f5f5f5;
    }
    .no_address {
      color: #999;
    }
    .has_address {
      color: #000;
    }
  }
}

.determine {
  background-color: #4cd964;
  font-size: .7rem;
  color: #fff;
  text-align: center;
  margin: 0 .7rem;
  line-height: 1.8rem;
  border-radius: 0.2rem;
  margin-top: .6rem;
}

.move-enter-active,
.move-leave-active {
  transition: all .2s linear;
  transform: translate3d(0, 0, 0);
}

.move-enter,
.move-leave-active {
  transform: translate3d(100%, 0, 0);
}

</style>
