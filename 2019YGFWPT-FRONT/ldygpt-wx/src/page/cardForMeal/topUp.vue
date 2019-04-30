<template>
  <div class="topUp" v-if="personalInfo.empInfo.haveMealCard === 0">
    <!-- 餐卡充值 -->
    <div class="topUpBox" >
      <img src="@/assets/images/icon/icon_meal card@2x.png" alt="">
      <div class="btnSize">
        <p>你现在还没有绑定的餐卡哦～</p>
        <van-button slot="button" size="small" type="primary" @click="topUpClick">去绑定</van-button>
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
    this.myInfoFun()
  },
  mounted () {
    // this.state = this.$route.query.ifStart
  },
  methods: {
    topUpClick () {
      this.$router.push({path: './mealCard'})
    },
    myInfoFun () {
      this.$api.myInfo().then(res => {
        if (res.code === 0) {
          this.personalInfo = res.data
          if (this.personalInfo.empInfo.haveMealCard === 0) {
            this.$router.push({path: './topUp'})
          } else {
            this.$router.push({path: './myMealCard'})
          }
        }
      })
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
