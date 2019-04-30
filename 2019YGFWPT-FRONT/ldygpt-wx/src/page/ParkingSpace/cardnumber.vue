<template>
  <div class="cardnumber">
    <div :class="colorStart?'cardnumberBox':'cardnumberBoxLose'" v-for="(item,index) in getLeaseCardOrderItemListByOrderNoData" :key="index">
      <p v-if="item.leaseCardType === 0"><img :src="colorStart ?imgUrl:imgUrl2">{{$route.query.leaseCardName}} 周卡</p>
      <p v-if="item.leaseCardType === 1"><img :src="colorStart ?imgUrl:imgUrl2">{{$route.query.leaseCardName}} 月卡</p>
      <p v-if="item.leaseCardType === 2"><img :src="colorStart ?imgUrl:imgUrl2">{{$route.query.leaseCardName}} 两月</p>
      <p v-if="item.leaseCardType === 3"><img :src="colorStart ?imgUrl:imgUrl2">{{$route.query.leaseCardName}} 季度</p>
      <p v-if="item.leaseCardType === 4"><img :src="colorStart ?imgUrl:imgUrl2">{{$route.query.leaseCardName}} 半年</p>
      <p v-if="item.leaseCardType === 5"><img :src="colorStart ?imgUrl:imgUrl2">{{$route.query.leaseCardName}} 全年</p>
      <p v-if="$route.query.leaseCardType === 6"><img :src="colorStart ?imgUrl:imgUrl2">{{$route.query.leaseCardName}} 永久</p>
      <div class="nameBox">
        <p>{{item.contactName}}</p>
        <span>{{item.contactTeL}}</span>
      </div>
      <div class="cardTime">
        <p>车牌号：{{item.carNumber}}</p>
        <p>有效期：{{item.begTime}}-{{item.endTime}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      colorStart: true,
      imgUrl: require('@/assets/images/parking_icon_card@2x.png'),
      imgUrl2: require('@/assets/images/parking_icon_card_gray@2x.png'),
      getLeaseCardOrderItemListByOrderNoData: []
    }
  },
  mounted () {
    let parmas = {
      orderNo: this.$route.query.orderNo
    }
    this.$api.getLeaseCardOrderItemListByOrderNo(parmas).then(res => {
      if (res.code === 0) {
        this.getLeaseCardOrderItemListByOrderNoData = res.data
        // 判断时间是否过期
        this.getLeaseCardOrderItemListByOrderNoData.forEach((item, index) => {
          // console.log(this.getLeaseCardOrderItemListByOrderNoData, '6666666666666')
          if (moment().format('YYYY-MM-DD') > this.getLeaseCardOrderItemListByOrderNoData[index].endTime) {
            console.log(moment().format('YYYY-MM-DD'), this.getLeaseCardOrderItemListByOrderNoData[index].endTime, '4444444444444444')
            this.colorStart = false
          }
        })
      }
    })
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
.cardnumber{
  .cardnumberBox{
    width:95%;
    margin:0 auto;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding:10px;
    margin:10px;
    background: url(../../assets/images/parking_card03@2x.png) no-repeat;
    background-size: cover;
    color: #E4B290;
    box-sizing: border-box;
    font-size:15px;
      p{
        display: flex;
        justify-content: content;
        align-items: center;
        img{
          width:27px;
          height: 19px;
          padding-right: 8px;
          box-sizing: border-box;
        }
      }
      .nameBox{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        p{
          font-size:24px;
          font-weight:600;
          color:rgba(228,178,144,1);
          line-height:34px;
        }
        span{
          font-size:13px;
          font-weight:400;
          color:rgba(228,178,144,1);
          line-height:19px;
        }
      }
      .cardTime{
        display: flex;
        justify-content: space-between;
          p{
            font-size:10px;
            font-weight:400;
            color:rgba(228,178,144,1);
            line-height:14px;
          }
      }
  }
  .cardnumberBoxLose{
     width:95%;
    margin:0 auto;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    padding:10px;
    margin:10px;
    background: url(../../assets/images/parking_card_gray@2x.png) no-repeat;
    background-size: cover;
    color: #BABABA;
    box-sizing: border-box;
    font-size:15px;
      p{
        display: flex;
        justify-content: content;
        align-items: center;
        img{
          width:27px;
          height: 19px;
          padding-right: 8px;
          box-sizing: border-box;
        }
      }
      .nameBox{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 0;
        p{
          font-size:24px;
          font-weight:600;
          color: #BABABA;
          line-height:34px;
        }
        span{
          font-size:13px;
          font-weight:400;
          color: #BABABA;
          line-height:19px;
        }
      }
      .cardTime{
        display: flex;
        justify-content: space-between;
          p{
            font-size:10px;
            font-weight:400;
            color: #BABABA;
            line-height:14px;
          }
      }
  }
}
</style>
