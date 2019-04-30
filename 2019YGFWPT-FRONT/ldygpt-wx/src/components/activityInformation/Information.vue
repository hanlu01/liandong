<template>
  <div class="informationBox">
    <div class="information" v-for="(item,index) in InformationList" :key="index">
      <div class="informationLeft">
        <img :src="item.img">
        <div class="informationSize" v-if="information">
          <!-- 活动状态 -->
          <p v-if="item.activityStatus === '0'">活动未开始</p>
          <p v-if="item.activityStatus === '1'">活动进行中</p>
          <p v-if="item.activityStatus === '2'">活动已结束</p>
        </div>
      </div>
      <div class="informationCenter" @click="informationFun(item)">
        <h4>{{item.title}}</h4>
        <p>{{item.position}}</p>
        <p>{{item.time}}</p>
        <p v-if="informationHide">{{item.number}}</p>
        <!-- 活动报名状态 -->
        <div v-if="informationStyle">
          <p v-if="item.applyStatus === '0'">报名状态：未开始</p>
          <p v-if="item.applyStatus === '1'">报名状态：进行中</p>
          <p v-if="item.applyStatus === '2'">报名状态：已结束</p>
        </div>
      </div>
      <router-link :to="{path:'/activitygrade', query:{activityId:item.id}}" v-if="informationGrade && item.activityStatus === '1' || item.activityStatus === '2'">
        <div class="informationRight">
          <img src="@/assets/images/index/activity_icon_evaluate@2x.png">
          <p>看评分</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    InformationList: {
      type: Array,
      required: true
    },
    information: {
      type: Boolean,
      default: false
    },
    informationHide: {
      type: Boolean,
      default: false
    },
    informationStyle: {
      type: Boolean,
      default: false
    },
    informationGrade: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
    }
  },
  methods: {
    informationFun (item) {
      if (this.informationHide) {
        this.$router.push({path: 'activitydetails', query: {id: item.id, state: true}})
      } else {
        this.$router.push({path: 'activitydetails', query: {id: item.id, state: false}})
      }
    }
  }
}
</script>

<style lang="less" >
.informationBox{
  padding-bottom: 67px;
  .information {
    width: 94%;
    margin: 10px auto 10px;
    font-size: 15px;
    background: #fff;
    box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
    border-radius:5px;
    padding: 10px 0;
    display: flex;
    align-items: center;
    flex:1;
      .informationLeft{
        width: 100px;
        height: 100px;
        border-radius: 5px;
        margin: 0 10px;
        -ms-flex-pack: center;
        position: relative;
          .informationSize{
            position: absolute;
            bottom: 0px;
            left: 0;
            right: 0;
            height: 25px;
            left: center;
            background: rgba(8,13,23,.5);
            border-radius: 0px 0px 5px 5px;
            font-synthesis: 15px;
              p{
                text-align: center;
                vertical-align: middle;
                line-height: 25px;
                color: #fff;
              }
          }
          img{
            width:100%;
            height: 100%;
            border-radius: 5px;
          }
      }
      .informationCenter{
          h4{
            font-size: 15px;
            padding-top: 10px;
          }
          p{
            font-size: 13px;
            color:#748095;
            padding-top: 8px;
            position: relative;
            left: 12px;
          }
          p:nth-child(2){
            padding-top: 15px;
          }
          p:nth-child(4){
            left:0;
          }
          p:nth-child(2)::before{
            content:'';
            width: 12px;
            height: 14px;
            background: url(../../assets/images/index/icon_map@2x.png) no-repeat;
            background-size: cover;
            position: absolute;
            top: 14px;
            left: -15px;
          }
          p:nth-child(3)::before{
            content:'';
            width: 14px;
            height: 14px;
            background: url(../../assets/images/index/icon_date@2x.png) no-repeat;
            background-size: cover;
            position: absolute;
            top: 8px;
            left: -15px;
          }
      }
      .informationCenter{
        padding-right: 8px;
        width: 50%;
      }
      .informationRight{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-right: 10px;
        // padding-top: 12px;
        border-left: 1px dashed rgb(240, 210, 209);
        padding: 36px 8px;
          img{
            width: 18px;
            padding-bottom: 5px;
          }
          p{
            font-size:15px;
            font-weight:400;
            color:rgba(244,64,61,1);
            white-space: nowrap;
            font-size: 14px;
            white-space: nowrap;
          }
      }
  }
}

</style>
