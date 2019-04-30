<template>
  <div class="expensecalendar">
    <div class="expensecalendarBox" v-for="(item,index) in momentData" :key="index">
      <div class="activityBox">
        <h4>{{item.outId}}</h4>
        <p v-if="recType === 1">去评价</p>
      </div>
      <div class="expensecalendarBoxBot">
        <div class="expensecalendarBoxBotLeft">
          <h4>{{item.diningStallName}}</h4>
          <p>{{item.diningRoomName}}</p>
          <p>{{item.projectName}}</p>
          <p>{{item.userTel}}</p>
          <p>{{item.consuleTime}}</p>
        </div>
        <div class="expensecalendarBoxBotRight">
          <p>{{item.amount}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['momentData', 'recType'],
  data () {
    return {}
  },
  mounted () {
    console.log('1111111', this.momentData)
  }
}
</script>
<style lang="less" scoped>
.expensecalendar{
  margin-top:32px;
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
          background: url(../../../assets/images/index/icon_arrow@2x.png) no-repeat;
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
        p{
          font-size:15px;
          font-weight:400;
          color:rgba(244,64,61,1);
          line-height:21px;
        }
      }
  }
}
</style>
