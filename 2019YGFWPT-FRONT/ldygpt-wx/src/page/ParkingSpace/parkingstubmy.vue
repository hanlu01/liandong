<template>
  <div class="expensecalendar">
    <div class="expensecalendarBox" v-for="(item,index) in getLeaseCardListByUserData" :key="index">
      <div class="activityBox" @click="expensecalendarFun(index)">
        <h4>{{item.orderNo}}</h4>
        <p>{{item.orderItemNum}}张</p>
      </div>
      <div class="expensecalendarBoxBot">
        <div class="expensecalendarBoxBotLeft">
          <h4 v-if="item.leaseCardType === 0">{{item.leaseCardName}} 周卡</h4>
          <h4 v-if="item.leaseCardType === 1">{{item.leaseCardName}} 月卡</h4>
          <h4 v-if="item.leaseCardType === 2">{{item.leaseCardName}} 两月</h4>
          <h4 v-if="item.leaseCardType === 3">{{item.leaseCardName}} 季度</h4>
          <h4 v-if="item.leaseCardType === 4">{{item.leaseCardName}} 半年</h4>
          <h4 v-if="item.leaseCardType === 5">{{item.leaseCardName}} 全年</h4>
          <h4 v-if="item.leaseCardType === 6">{{item.leaseCardName}} 永久</h4>
          <p>位置：{{item.leaseCardName}}<span>{{item.parkLotName}}</span></p>
          <p>{{item.orderTime}}</p>
        </div>
        <div class="expensecalendarBoxBotRight">
          <p>{{item.leaseCardPrice}}／张</p>
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
      getLeaseCardListByUserData: [],
      getLeaseCardOrderItemListByOrderNoData: []
    }
  },
  mounted () {
    this.getLeaseCardListByUser()
  },
  methods: {
    // expensecalendarFun (index) {
    //   console.log(index, '1222222222222222')

    // },
    // 获取微信用户购买的长租卡列表
    getLeaseCardListByUser () {
      this.$api.getLeaseCardListByUser().then(res => {
        if (res.code === 0) {
          this.getLeaseCardListByUserData = res.data
          let orderTime = moment(res.data.orderTime).format('YYYY-MM-DD HH:mm')
          this.getLeaseCardListByUserData.orderTime = orderTime
          console.log(orderTime, '999')
        }
      })
    },
    // 通过长租卡购买订单号获取订单明细列表
    expensecalendarFun (index) {
      this.$router.push({path: '/cardnumber', query: {orderNo: this.getLeaseCardListByUserData[index].orderNo, leaseCardName: this.getLeaseCardListByUserData[index].leaseCardName}})
    }

  }
}
</script>
<style lang="less" scoped>
.expensecalendar{
  .expensecalendarBox{
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
    border-radius:5px;
    box-sizing: border-box;
    margin: 10px;
      .activityBox{
        display: flex;
        justify-content: space-between;
        width: 95%;
        background: #E7E8EC;
        margin: 0 auto;
        padding:10px;
        font-size: 14px;
        h4{
          font-size: 14px;
          font-weight: 500;
          color: #434D5D;
        }
        p{
          font-size: 13px;
          color: #748095;
          padding-right: 10px;
          position: relative;
        }
        p::after{
          content: '';
          width: 8px;
          height: 12px;
          background: url(../../assets/images/index/icon_arrow@2x.png) no-repeat;
          background-size: cover;
          position: absolute;
          right: 0px;
        }
    }
  }
  .expensecalendarBoxBot{
    padding:10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
      h4{
        font-size:15px;
        font-weight:600;
        color:rgba(67,77,93,1);
        line-height:21px;
      }
      p{
        font-size:13px;
        font-weight:400;
        color:rgba(116,128,149,1);
        line-height:30px;
      }
      .expensecalendarBoxBotRight{
        width: 60px;
        p{
          font-size:15px;
          font-weight:400;
          color:rgba(244,64,61,1);
          line-height:21px;
        }
      }
      .expensecalendarBoxBotLeft{
        span{
          padding-left: 8px;
        }
        p{
          color:#434D5D;
        }
      }
  }
}
</style>
