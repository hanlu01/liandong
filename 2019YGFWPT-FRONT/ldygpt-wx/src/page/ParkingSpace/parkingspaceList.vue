<template>
  <div class="parkingspaceList">
    <div class="parkingspaceListImg">
    </div>
      <div class="parkingspaceConlist">
        <div class="parkingspaceCon" v-for="(item,index) in getLeaseCardListByUserList" :key="index">
          <div class="parkingspaceLeft">
            <h4>{{item.leaseCardName}}</h4>
            <p>￥<span>{{item.leaseCardPrice}}</span></p>
            <router-link :to="{name: 'Parkingcarddetails', query: {id: item.id, leaseCardType: item.leaseCardType, leaseCardName: item.leaseCardName, leaseCardPrice: item.leaseCardPrice}}">
              <p class="buy">立即购买</p>
            </router-link>
          </div>
          <div class="parkingspaceRight">
            <img src="@/assets/images/parking_img_01@2x.png" v-if="item.leaseCardType === 0">
            <img src="@/assets/images/parking_img_02@2x.png" v-if="item.leaseCardType === 1">
            <img src="@/assets/images/parking_img_03@2x.png" v-if="item.leaseCardType === 2">
            <img src="@/assets/images/parking_img_04@2x.png" v-if="item.leaseCardType === 3">
            <img src="@/assets/images/parking_img_05@2x.png" v-if="item.leaseCardType === 4">
            <img src="@/assets/images/parking_img_06@2x.png" v-if="item.leaseCardType === 5">
            <img src="@/assets/images/parking_img_07@2x.png" v-if="item.leaseCardType === 6">
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      getLeaseCardListByUserList: []
    }
  },
  mounted () {
    this.getLeaseCardListByParkLotId()
  },
  methods: {
    // 获取所选停车场下可售卖的长租卡列表
    getLeaseCardListByParkLotId () {
      let params = {
        parkLotId: this.$route.query.id
      }
      this.$api.getLeaseCardListByParkLotId(params).then((res) => {
        if (res.code === 0) {
          this.getLeaseCardListByUserList = res.data
          if (!this.getLeaseCardListByUserList.length) {
            this.$toast('暂无在售停车卡')
          }
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.parkingspaceList{
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    .parkingspaceListImg{
      background: url(../../assets/images/parking_top_bg@2x.png) no-repeat;
      background-size: cover;
      height: 180px;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .parkingspaceConlist{
      position: absolute;
      left: 0;
      width: 100%;
      top:95px;
        .parkingspaceCon{
        background: #fff;
        margin: 0 10px;
        border-radius: 5px;
        padding: 10px 0 13px 18px;
        box-sizing: border-box;
        box-sizing: border-box;
        box-shadow: 0px 0px 5px 0px rgba(174, 179, 196, 0.5);
        // margin-top: -85px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
        border-radius:5px;
        margin-bottom: 10px;
          .parkingspaceLeft{
            h4{
              font-size:15px;
              font-weight:600;
              color:rgba(67,77,93,1);
              line-height:21px;
            }
            p{
              font-weight:600;
              color:rgba(67,77,93,1);
              span{
                font-size:30px;
                font-weight:600;
                color:rgba(67,77,93,1);
                line-height:42px;
              }
            }
            .buy{
              font-size:13px;
              font-weight:400;
              color:rgba(244,64,61,1);
              line-height:19px;
              position: relative;
            }
            .buy::after{
              content: '';
              background: url(../../assets/images/icon_arrow@2x.png) no-repeat;
              width:7px;
              height: 11px;
              background-size: cover;
              position: absolute;
              top: 4px;
              left: 57px;
            }
          }
          .parkingspaceRight{
            img{
              width:69px;
              height: 70px;
            }
          }
      }
    }
}
</style>
