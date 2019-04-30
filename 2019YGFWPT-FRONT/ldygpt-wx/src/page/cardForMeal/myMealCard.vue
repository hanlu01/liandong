<template>
  <div class="myMealCardBox">
    <myMealCardCom :myMealCardComData="myMealCardComData"></myMealCardCom>
      <div class="MealCardBoxListBox">
        <router-link to='/topUpMoney' class="CardBoxListMark">
          <img src="@/assets/images/icon/meal card_icon_recharge@2x.png" alt="">
          <p>去充值</p>
        </router-link>
        <!-- <div class="CardBoxListMark" @click="changeDiningCardStatus" v-if="cardFreeze">
          <img src="@/assets/images/icon/icon_guashi@2x.png" alt="">
          <p>餐卡冻结</p>
        </div> -->
        <div class="CardBoxListMark" @click="unBiDingCard">
          <img src="@/assets/images/icon/icon_jiebang@2x.png" alt="">
          <p>餐卡解绑</p>
        </div>
        <div class="CardBoxListMark" @click="myDiningCardInfoFun">
          <img src="@/assets/images/icon/icon_guashi@2x.png" >
          <p>{{datasize}}</p>
          <!-- 餐卡冻结 -->
        </div>
      </div>
  </div>
</template>

<script>
import myMealCardCom from '@/components/cardForMealCom/myMealCardCom'
export default {
  components: {
    myMealCardCom
  },
  data () {
    return {
      cardFreeze: '',
      datasize: '餐卡冻结',
      myMealCardComData: {},
      cardFreezeSize: '餐卡冻结之后无法充值与消费，确认冻结吗?',
      show: false
    }
  },
  mounted () {
    this.myDiningCardInfo()
  },
  methods: {
    myDiningCardInfo () {
      this.$api.myDiningCardInfo().then(res => {
        if (res.code === 0) {
          this.myMealCardComData = res.data
          console.log(this.myMealCardComData, '9999')
          if (this.myMealCardComData.data.cardStatus === '0') {
            this.datasize = '餐卡冻结'
          } else if (this.myMealCardComData.data.cardStatus === '1') {
            this.datasize = '餐卡解冻'
            // console.log(this.datasize, '111')
          }
        }
      })
    },
    // 冻结餐卡/解冻餐卡
    myDiningCardInfoFun () {
      if (this.myMealCardComData.data.cardStatus === '0') {
        this.cardFreezeSize = '餐卡冻结之后无法充值与消费，确认冻结吗?'
      } else {
        this.cardFreezeSize = '餐卡解冻后将可继续充值与消费,确认解冻吗?'
      }
      this.$dialog.confirm({
        title: '提示',
        message: this.cardFreezeSize,
        overlay: true
      }).then(() => {
        if (this.myMealCardComData.data.cardStatus === '0') {
          let params = {
            cardStatus: '0',
            reason: ''
          }
          this.$api.changeDiningCardStatus(params).then((res) => {
            if (res.code === 0) {
            }
          })
        } else if (this.myMealCardComData.data.cardStatus === '1') {
          let params = {
            cardStatus: '1',
            reason: ''
          }
          this.$api.changeDiningCardStatus(params).then((res) => {
            if (res.code === 0) {
            }
          })
        }
      }).catch(() => {
        // on cancel
      })
    },
    // 餐卡解绑
    unBiDingCard () {
      this.$api.unBiDingCard().then((res) => {
        if (res.code === 0) {
          this.$toast(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.myMealCardBox {
  .MealCardBoxListBox{
      background: #fff;
      margin: 0 10px;
      border-radius: 35px;
      padding: 10px 0;
      display: flex;
      align-items: center;
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      position: absolute;
      width: 95%;
      top: 163px;
        .CardBoxListMark{
          display: flex;
          flex-direction: column;
          flex: 1;
          align-items: center;
          img{
            width:30px;
            height: 30px;
          }
          p{
            font-size:13px;
            font-weight:400;
            color:rgba(67,77,93,1);
            line-height:19px;
          }
        }
      }
}
</style>
