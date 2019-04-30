<template>
  <div class="rechargesuccess">
    <div class="rechargesuccessBox">
      <div class="recharContent">
        <img v-if="successInfor.paymentStatus == 1" src="@/assets/images/img_success@2x.png" alt="">
        <img v-if="successInfor.paymentStatus != 1" src="@/assets/images/img_fail@2x.png" alt="">
        <p v-if="successInfor.paymentStatus == 1">长租卡购买成功！</p>
        <p v-if="successInfor.paymentStatus == 4">长租卡购买失败！</p>
        <div class="recharContentLi">
          <div class="recharContentSpan">
            <p>订单编码：</p><span>{{successInfor.orderNo}}</span>
          </div>
          <div class="recharContentSpan">
            <div v-if="successInfor.leaseCardType === 0" class="recharContentBox"><p>长租卡类型：</p><span>周卡</span></div>
            <div v-if="successInfor.leaseCardType === 1" class="recharContentBox"><p>长租卡类型：</p><span>月卡</span></div>
            <div v-if="successInfor.leaseCardType === 2" class="recharContentBox"><p>长租卡类型：</p><span>两月</span></div>
            <div v-if="successInfor.leaseCardType === 3" class="recharContentBox"><p>长租卡类型：</p><span>季度</span></div>
            <div v-if="successInfor.leaseCardType === 4" class="recharContentBox"><p>长租卡类型：</p><span>半年</span></div>
            <div v-if="successInfor.leaseCardType === 5" class="recharContentBox"><p>长租卡类型：</p><span>全年</span></div>
            <div v-if="successInfor.leaseCardType === 6" class="recharContentBox"><p>长租卡类型：</p><span>永久</span></div>
          </div>
          <div class="recharContentSpan">
            <p>所属园区：</p><span>{{successInfor.projectName}}</span>
          </div>
          <div class="recharContentSpan">
            <p>停车场：</p><span>{{successInfor.parkLotName}}</span>
          </div>
          <div class="recharContentSpan">
            <p>购买数量：</p><span>{{successInfor.orderItemNum}}张</span>
          </div>
          <div class="recharContentSpan">
            <p>订单金额：</p><span>{{successInfor.orderAmount}}元</span>
          </div>
          <div class="recharContentSpan">
            <p>支付时间：</p><span>{{orderTime}}</span>
          </div>
        </div>
        <div class="btnFooter" @click="jumpActivity()">
          <van-button type="danger" style="color:#fff">返回我的停车卡列表</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      successInfor: {},
      chargeStatus: '',
      orderStatus: '',
      aaa: {},
      orderTime: ''
    }
  },
  mounted () {
    this.getPayOrderInfoByOrderNo()
  },
  methods: {
    jumpActivity () {
      this.$router.push({path: '/parkingstubmy'})
    },
    // 长租卡支付成功回调
    getPayOrderInfoByOrderNo () {
      let params = {
        orderNo: this.$route.query.orderNo
      }
      this.$api.getPayOrderInfoByOrderNo(params).then(res => {
        if (res.code === 0) {
          this.successInfor = res.data
          this.orderTime = moment(res.data.orderTime).format('YYYY-MM-DD HH:mm')
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
        // height: 500px;
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
                  .recharContentBox{
                    display: flex;
                  }
              }
             .recharContentSpan:nth-child(6){
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
