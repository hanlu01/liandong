<template>
<div>
  <router-view></router-view>
  <!-- <van-tabbar v-model="active" active-color="rgba(245,72,68,1)" v-if="activeState"> -->
  <van-tabbar v-model="active" active-color="rgba(245,72,68,1)">
  <van-tabbar-item v-for="(item,index) in tabData" :key="index" :to="item.url">
    <span>{{item.title}}</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? item.icon.active : item.icon.normal"
    >
  </van-tabbar-item>
</van-tabbar>
<!-- <van-tabbar v-model="$active" active-color="rgba(245,72,68,1)" v-else>
<van-tabbar-item v-for="(item,index) in tabData" :key="index" :to="item.url">
    <span>{{item.title}}</span>
    <img
      slot="icon"
      slot-scope="props"
      :src="props.active ? item.icon.active : item.icon.normal"
    >
  </van-tabbar-item>
</van-tabbar> -->
</div>
</template>
<script>
export default {
  data () {
    return {
      active: 0,
      activeState: true,
      tabData: [
        {
          title: '首页',
          index: 0,
          url: '/indexhome',
          icon: {
            normal: require('../assets/images/menu_home_normal@2x.png'),
            active: require('../assets/images/menu_home_selected@2x.png')
          }
        },
        {
          title: '就餐',
          index: 1,
          url: '/topUp',
          icon: {
            normal: require('../assets/images/menu_food_normal@2x.png'),
            active: require('../assets/images/menu_food_selected@2x.png')
          }
        },
        {
          title: '活动',
          index: 2,
          url: '/activity',
          icon: {
            normal: require('../assets/images/menu_activity_normal@2x.png'),
            active: require('../assets/images/menu_activity_selected@2x.png')
          }
        },
        {
          title: '我的',
          index: 3,
          url: '/personal',
          icon: {
            normal: require('../assets/images/menu_user_normal@2x.png'),
            active: require('../assets/images/menu_user_selected02@2x.png')
          }
        }
      ]

    }
  },
  watch: {
    $route (to, from) {
      this.tabData.forEach((item, index) => {
        if (item.url === to.path) {
          this.active = item.index
        }
      })
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less">
.van-tabbar-item__icon img {
    width: 21px;
    height: 19px;
    display: block;
}
</style>
