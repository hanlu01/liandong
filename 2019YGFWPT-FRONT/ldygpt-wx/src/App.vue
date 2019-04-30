<template>
  <div id="app">
    <van-loading color="black" type="spinner"  v-show="isLoading"/>
    <router-view/>
    <router-link to="/">
       <img v-if="$route.meta.homeShow" src="./assets/images/icon_home@2x.png" class="go-home">
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'App',
  data () {
    return {}
  },
  computed: {
    ...mapGetters(['isLoading'])
  }
}
</script>

<style lang="less">
#app {
  font-family: '微软雅黑','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #434D5D;
  background: #F6F5F5;
  .go-home{
    width: 44px;
    position: fixed;
    bottom: 8%;
    right: 7%;
  }
  .van-loading{
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 999;
    width: 100%!important;
    height: 100%!important;
    background: rgba(0,0,0,0.2);
    .van-loading__spinner{
      width: 30px;
      height: 30px;
      position: absolute;
      left: 50%;
      margin-left: -15px;
      margin-top: -12px;
      top: 50%;
      z-index: 9999;
      }
    }
    .van-loading--black .van-loading__spinner--spinner{
      color:#000;
    }
}
</style>
