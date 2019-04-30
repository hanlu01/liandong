<template>
  <div class="myMealCardBoxCom">
    <div class="myMealCardBoxTit">
      <div class="NameList">
        <!-- <img :src="mealInfor.headImgUrl" alt="" > -->
        <div class="NameListcon">
          <img src="@/assets/images/icon/icon_meal@2x.png">
          <div class="NameListSize">
            <p>{{myMealCardComData.data.userName}}</p>
            <p>{{myMealCardComData.data.userTel}}</p>
          </div>
        </div>
        <p v-if="myMealCardComData.data.cardStatus==='0'"><img src="@/assets/images/img_zhengchang @2x.png"></p>
        <p v-if="myMealCardComData.data.cardStatus==='1'"><img src="@/assets/images/img_dongjie@2x.png"></p>
      </div>
      <div class="moneyBox">
        <h3>{{myMealCardComData.data.cardBalance}}<span>元</span></h3>
        <p>余额</p>
      </div>
      <div class="CardMark">
        NO.{{myMealCardComData.data.cardNo}}
        <p>供应商：{{myMealCardComData.manufacturerName}}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  },
  props: {
    // mealInfor: {
    //   type: Object
    // },
    myMealCardComData: {
      type: Object
    }
  },
  mounted () {
    console.log('333', this.myMealCardComData)
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.myMealCardBoxCom {
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    .myMealCardBoxTit{
      background:linear-gradient(90deg,rgba(215,176,119,1) 0%,rgba(235,216,155,1) 100%);
      height: 190px;
      position: relative;
        .NameList{
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding:0 0 0 10px;
          font-size: 15px;
          color: #845F23;
          align-items: center;
            img{
              width:45px;
              height: 45px;
              // padding-right: 8px;
              // border-radius: 50%
            }
            p{
              line-height: 19px;
            }
            .NameListcon{
              display: flex;
              padding-top: 10px;
              box-sizing: border-box;
            }
        }
        .moneyBox{
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 8px 0;
            h3{
              font-size:32px;
              font-weight:600;
              color:rgba(132,95,35,1);
              line-height:45px;
                span{
                  font-size:15px;
                  font-weight:600;
                  color:rgba(132,95,35,1);
                  line-height:21px;
                }
            }
            p{
              font-size:13px;
              font-weight:400;
              color:rgba(132,95,35,1);
              line-height:19px;
            }
        }
        .CardMark{
          font-size:13px;
          font-weight:600;
          color:rgba(132,95,35,1);
          line-height:19px;
          padding: 0 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;

        }

    }
    .myMealCardBoxTit::after{
      content: '';
      background:url(../../assets/images/icon/img_meal@2x.png) no-repeat;
      background-size: cover;
      position: absolute;
      bottom:5px;
      width: 116px;
      height: 116px;
    }
}
</style>
