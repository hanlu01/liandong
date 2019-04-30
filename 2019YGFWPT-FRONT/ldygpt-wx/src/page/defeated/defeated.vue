<template>
  <div class="topUp">
    <!-- 餐卡充值 -->
    <div class="topUpBox" >
      <img src="@/assets/images/icon_meal card@2x.png" alt="">
      <div class="btnSize">
        <p>啊哦，页面出错了，请稍后再试吧！</p>
      </div>
    </div>
    <!-- 餐卡充值 -->
    <!-- <myMealCard ></myMealCard> -->
  </div>
</template>
<script>
import footerBox from '@/components/footerBox/footerBox'
// import myMealCard from '@/page/cardForMeal/myMealCard'
export default {
  components: {
    footerBox
    // myMealCard
  },
  data () {
    return {
      personalInfo: ''
      // state: {}
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    topUpClick () {
      this.$router.push({path: './mealCard'})
    }
  }
}
</script>
<style  lang="less" scoped>
.topUp{
  background: #fff;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    .topUpBox{
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      padding-top: 107px;
        .btnSize{
          text-align: center;
            p{
              padding: 8px 0 20px 0;
            }
        }
        img{
          width:170px;
          height: 124px;
        }

    }
}
</style>
