<template>
  <div class="rechargesuccess">
    <div class="rechargesuccessBox">
      <div class="recharContent" v-if="$route.query.orderInfo">
        <img v-if="successInfor.orderStatus == 1" src="@/assets/images/img_success@2x.png" alt="">
        <img v-if="successInfor.orderStatus != 1" src="@/assets/images/img_fail@2x.png" alt="">
        <p v-if="successInfor.orderStatus == 1">支付成功！</p>
        <p v-if="successInfor.orderStatus == 2">支付失败！</p>
        <div class="recharContentLi">
          <div class="recharContentSpan">
            <p>订单编码：</p><span>{{successInfor.orderNo}}</span>
          </div>
          <div class="recharContentSpan">
            <p>充值卡号：</p><span>{{successInfor.cardNo}}</span>
          </div>
          <div class="recharContentSpan">
            <p>充值手机号：</p><span>{{successInfor.userTel}}</span>
          </div>
          <div class="recharContentSpan">
            <p>充值金额：</p><span>{{successInfor.totalAmount}}</span>
          </div>
          <!-- <div class="recharContentSpan">
            <p>充值时间：</p><span>{{successInfor.paymentTime}}</span>
          </div> -->
          <div class="recharContentSpan">
            <p>充值状态：</p><span>{{chargeStatus}}</span>
          </div>
        </div>
        <div class="btnFooter">
          <p>联东U谷中区一楼餐厅</p>
          <!--<van-button type="danger">去评价</van-button>-->
        </div>
      </div>
      <div class="recharContent" v-else>
        <img src="@/assets/images/img_success@2x.png" alt="">
        <p></p>
        <div class="recharContentLi">
          <div class="recharContentSpan">
            <p>订单编码：</p><span></span>
          </div>
          <div class="recharContentSpan">
            <p>充值手机号：</p><span></span>
          </div>
          <div class="recharContentSpan">
            <p>支付金额：</p><span></span>
          </div>
          <div class="recharContentSpan">
            <p>充值时间：</p><span></span>
          </div>
        </div>
        <div class="btnFooter">
          <p>联东U谷中区一楼餐厅</p>
          <router-link to="/activityMy">
            <van-button type="danger">去查看活动报名</van-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      successInfor: {},
      chargeStatus: '',
      orderStatus: '',
      aaa: {}
    }
  },
  mounted () {
    this.successInfor = this.$route.query.orderInfo
    this.chargeMoney()
    this.getPayOrderInfoByOrderNo()
    // this.orderMoney()
    // this.momentDate()
  },
  methods: {
    // 充值状态
    chargeMoney () {
      if (this.successInfor.chargeStatus === '2') {
        this.chargeStatus = '已充值'
      } else {
        this.chargeStatus = '充值中'
      }
    },
    // 长租卡支付成功后的返回页
    // getPayOrderInfoByOrderNo()
    // 支付状态
    // orderMoney () {
    //   if (this.successInfor.orderStatus === '0') {
    //     this.orderStatus = '未支付'
    //   } else if (this.successInfor.orderStatus === '1') {
    //     this.orderStatus = '已支付'
    //   } else {
    //     this.orderStatus = '支付失败'
    //   }
    // },
    // 格式化时间
    // momentDate () {
    //   this.$moment(this.successInfor.paymentTime).format('YYYY-MM-DD hh:mm')
    // }
    // 长租卡支付成功回调
    getPayOrderInfoByOrderNo () {
      let params = {
        orderNo: 'CZ20190414133930284'
      }
      this.$api.getPayOrderInfoByOrderNo(params).then(res => {
        if (res.code === 0) {
          this.aaa = res.data
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
