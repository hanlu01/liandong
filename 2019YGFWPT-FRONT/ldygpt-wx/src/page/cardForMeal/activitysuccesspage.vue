<template>
  <div class="rechargesuccess">
    <div class="rechargesuccessBox">
      <div class="recharContent">
        <img v-if="successInfor.paymentStatus == 1" src="@/assets/images/img_success@2x.png" alt="">
        <img v-if="successInfor.paymentStatus != 1" src="@/assets/images/img_fail@2x.png" alt="">
        <p v-if="successInfor.paymentStatus == 1">支付成功！</p>
        <p v-if="successInfor.paymentStatus == 4">支付失败！</p>
        <div class="recharContentLi">
          <div class="recharContentSpan">
            <p>订单编码：</p><span>{{successInfor.orderNo}}</span>
          </div>
          <div class="recharContentSpan">
            <p>费用名称：</p><span>{{successInfor.feeName}}</span>
          </div>
          <div class="recharContentSpan">
            <p>支付金额：</p><span>{{successInfor.payMoney}}元</span>
          </div>
          <div class="recharContentSpan">
            <p>支付时间：</p><span>{{successInfor.payTime}}</span>
          </div>
        </div>
        <div class="btnFooter" @click="jumpActivity()">
          <van-button type="danger" style="color:#fff">查看报名活动</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      successInfor: {}
    }
  },
  mounted () {
    this.interceptUrl()
  },
  methods: {
    jumpActivity () {
      this.$router.push({path: '/activityMy'})
    },
    interceptUrl () {
      let params = {
        orderNo: this.$route.query.orderNo
      }
      this.$api.getapplybyorderno(params).then(res => {
        if (res.code === 0) {
          this.successInfor = res.data
          console.log('11111', res)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.rechargesuccess {
  padding: 10px;
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    .rechargesuccessBox{
      // background: #fff;
      // box-shadow: 0px 0px 5px 0px rgba(174, 179, 196, 0.5);
      // border-radius: 5px;
      // padding-bottom: 1px;
      margin-top: 59px;
      .recharContent{
        text-align: center;
        font-size:15px;
        font-weight:400;
        color:rgba(67,77,93,1);
        line-height:21px;
        background: url(../../assets/images/f8f76f0897f3a038748ca6c928c911c.png) no-repeat;
        background-size: cover;
          img{
            width:87px;
            margin-top: -38px;
          }
          .recharContentLi{
            text-align: left;
            padding-left: 25px;
            font-size:13px;
            font-weight:400;
            color:rgba(116,128,149,1);
            display: flex;
            flex-direction: column;
            padding: 10px;
            margin: 0 10px;
            // border-bottom: 2px dashed #E7E8EC;
              .recharContentSpan{
                display: flex;
                line-height: 29px;
                  p{
                    width: 78px;
                    padding-left: 5px;
                  }
              }
             .recharContentSpan:nth-child(4){
               span{
                 color:rgba(244,64,61,1);
               }
             }
          }
          .btnFooter{
            padding-top: 15px;
          }
      }
    }
}
</style>
