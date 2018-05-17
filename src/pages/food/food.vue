<template>
  <div class="food_container">
    <head-top :head-title="headTitle" goBack="true"></head-top>
    <section class="shop_list_container">
      <shop-list :geohash="geohash" :restaurantCategoryId="getRestaurant_category_id" v-if="geohash"></shop-list>
    </section>
  </div>
</template>
<script>
import headTop from '../../components/header/head.vue'
import shopList from '../../components/common/shoplist.vue'

export default {
  data() {
    return {
      geohash: '', // city页面传递过来的地址geohash
      headTitle: '', // msiet页面头部标题
      foodTitle: '', // 排序左侧头部标题
    }
  },
  created() {
    this.initData();
  },
  components: {
    headTop,
    shopList
  },
  computed: {
    getRestaurant_category_id() {
      return this.$route.query.restaurant_category_id;
    }
  },
  methods: {
    //初始化获取数据
    initData() {
      //获取从msite页面传递过来的参数
      this.geohash = this.$route.query.geohash;
      this.headTitle = this.$route.query.title;
    },
  },
}

</script>
<style lang="scss" scoped>
.food_container {
  padding-top: 2.0rem;
}

.sort_container {
  background-color: #fff;
  border-bottom: 0.025rem solid #f1f1f1;
  position: fixed;
  top: 2.0rem;
  right: 0;
  width: 100%;
  display: flex;
  z-index: 13;
  box-sizing: border-box;
  .sort_item {
    font-size: .55rem;
    color: #444;
    width: 33.3%;
    height: 1.6rem;
    width: 33.3%;
    height: 1.6rem;
    text-align: center;
    line-height: 1rem;
    .sort_item_container {
      width: 100%;
      height: 100%;
      position: relative;
      z-index: 14;
      background-color: #fff;
      box-sizing: border-box;
      padding-top: .3rem;
      .sort_item_border {
        height: 1rem;
        border-right: 0.025rem solid #e4e4e4;
      }
    }
    .sort_icon {
      vertical-align: middle;
      transition: all .3s;
      fill: #666;
    }
  }
  .choose_type {
    .sort_item_container {

      .category_title {
        color: #3190e8;
      }
      .sort_icon {
        transform: rotate(180deg);
        fill: #3190e8;
      }
    }
  }
  .showlist-enter-active,
  .showlist-leave-active {
    transition: all .3s;
    transform: translateY(0);
  }
  .showlist-enter,
  .showlist-leave-active {
    opacity: 0;
    transform: translateY(-100%);
  }
  .sort_detail_type {
    width: 100%;
    position: absolute;
    display: flex;
    top: 1.6rem;
    left: 0;
    z-index: 11;
    border-top: 0.025rem solid #e4e4e4;
    background-color: #fff;
  }
  .category_container {
    .category_left {
      flex: 1;
      background-color: #f1f1f1;
      height: 16rem;
      overflow-y: auto;
      span {
        font-size: .5rem;
        color: #666;
        line-height: 1.8rem;
      }
      .category_left_li {
        display: flex;
        justify-content: space-between;
        padding: 0 0.5rem;
        .category_icon {
          width: .8rem;
          height: .8rem;
          vertical-align: middle;
          margin-right: .2rem;
        }
        .category_count {
          background-color: #ccc;
          font-size: .4rem;
          color: #fff;
          padding: 0 .1rem;
          border: 0.025rem solid #ccc;
          border-radius: 0.8rem;
          vertical-align: middle;
          margin-right: 0.25rem;
        }
        .category_arrow {
          vertical-align: middle;
        }
      }
      .category_active {
        background-color: #fff;
      }
    }
    .category_right {
      flex: 1;
      background-color: #fff;
      padding-left: 0.5rem;
      height: 16rem;
      overflow-y: auto;
      .category_right_li {
        display: flex;
        justify-content: space-between;
        height: 1.8rem;
        line-height: 1.8rem;
        padding-right: 0.5rem;
        border-bottom: 0.025rem solid #e4e4e4;
        span {
          color: #666;
        }
      }
      .category_right_choosed {
        span {
          color: #3190e8;
        }
      }
    }
  }
  .sort_list_container {
    width: 100%;
    .sort_list_li {
      height: 2.5rem;
      display: flex;
      align-items: center;
      svg {
        width: .7rem;
        height: .7rem;
        margin: 0 .3rem 0 .8rem;
      }
      p {
        line-height: 2.5rem;
        flex: auto;
        text-align: left;
        text-indent: 0.25rem;
        border-bottom: 0.025rem solid #e4e4e4;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          color: #666;
        }
      }
      .sort_select {
        span {
          color: #3190e8;
        }
      }
    }
  }
  .filter_container {
    flex-direction: column;
    align-items: flex-start;
    min-height: 10.6rem;
    background-color: #f1f1f1;
    .filter_header_style {
      font-size: .4rem;
      color: #333;
      line-height: 1.5rem;
      height: 1.5rem;
      text-align: left;
      padding-left: .5rem;
      background-color: #fff;
    }
    .filter_ul {
      display: flex;
      flex-wrap: wrap;
      padding: 0 0.5rem;
      background-color: #fff;
      .filter_li {
        display: flex;
        align-items: center;
        border: 0.025rem solid #eee;
        width: 4.7rem;
        height: 1.4rem;
        margin-right: 0.25rem;
        border-radius: 0.125rem;
        padding: 0 0.25rem;
        margin-bottom: 0.25rem;
        svg {
          width: .8rem;
          height: .8rem;
          margin-right: 0.125rem;
        }
        span {
          font-size: .4rem;
          color: #333;
        }
        .filter_icon {
          width: .8rem;
          height: .8rem;
          font-size: 0.5rem;
          border: 0.025rem solid #e4e4e4;
          border-radius: 0.15rem;
          margin-right: 0.25rem;
          line-height: .8rem;
          text-align: center;
        }
        .activity_svg {
          margin-right: .25rem;
        }
        .selected_filter {
          color: #3190e8;
        }
      }
    }
    .confirm_filter {
      display: flex;
      background-color: #f1f1f1;
      width: 100%;
      padding: .3rem .2rem;
      .filter_button_style {
        width: 50%;
        height: 1.8rem;
        font-size: 0.8rem;
        line-height: 1.8rem;
        border-radius: 0.2rem;
      }
      .clear_all {
        background-color: #fff;
        margin-right: .5rem;
        border: 0.025rem solid #fff;
      }
      .confirm_select {
        background-color: #56d176;
        color: #fff;
        border: 0.025rem solid #56d176;
        span {
          color: #fff;
        }
      }
    }
  }
}

.showcover-enter-active,
.showcover-leave-active {
  transition: opacity .3s
}

.showcover-enter,
.showcover-leave-active {
  opacity: 0
}

.back_cover {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.7);
}

</style>
