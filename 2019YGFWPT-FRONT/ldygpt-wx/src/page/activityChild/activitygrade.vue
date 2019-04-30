<template>
  <div class="activitygrade">
    <div class="activityTitBox">
      <h3>{{rateData.activityName}}！</h3>
      <div class="activityTitList">
        <p>活动时间：</p><span>{{rateData.activityBegTime}} 至 {{rateData.activityEndTime}}</span><br/>
        <p>活动园区：</p><span>{{rateData.projectName}}</span><br/>
        <p>活动地点：</p><span>{{rateData.activityPosition}}</span><br/>
        <p>报名费用：</p><span>{{rateData.price}}</span><br/>
      </div>
      </div>
    <div class="activityTitBox">
      <div class="activityTitBoxRate" v-for="(item,index) in rateData.scoreInfos" :key="index">
        <p>{{item.scoreItemName}}</p>
        <van-rate v-model="item.rateValue" v-if="item.scoreItemType === 0"/>
        <van-cell-group>
          <van-field v-model="item.inputValue" placeholder="请输入您的意见" v-if="item.scoreItemType === 1" maxlength="25"/>
        </van-cell-group>
      </div>
    </div>
    <van-button size="large" @click="rateSubmit">提交</van-button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      rateValue: 0,
      rateData: {}
    }
  },
  mounted () {
    this.getactivityscoreinfo(this.$route.query.activityId)
  },
  methods: {
    // 获取活动评分信息
    getactivityscoreinfo (val) {
      let params = {
        activityId: val
      }
      this.$api.getactivityscoreinfo(params).then(res => {
        if (res.code === 0) {
          this.rateData = res.data
        }
      })
    },
    // 提交活动评分信息
    submissionactivityscoreinfo () {
      let submitFlag = true
      let scoreInfoData = []
      let scoreInfoString = ''
      let scoreInfoDataString = ''
      this.rateData.scoreInfos.forEach((item, index) => {
        if (item.rateValue) {
          scoreInfoString = `${item.id}-${item.rateValue}`
        } else if (item.inputValue) {
          scoreInfoString = `${item.id}-${item.inputValue}`
        } else {
          submitFlag = false
          return
        }
        if (submitFlag) {
          scoreInfoData.push(scoreInfoString)
        }
      })
      // 如果评分项有空值
      if (!submitFlag) {
        this.$toast('评分项没有全部填写哦')
        return false
      }
      scoreInfoDataString = scoreInfoData.join()
      let params = {
        activityId: this.$route.query.activityId,
        comments: scoreInfoDataString
      }
      this.$api.submissionactivityscoreinfo(params).then(res => {
        if (res.code === 0) {
          this.$toast('提交成功')
          this.$router.push({path: '/activityMy'})
        }
      })
    },
    rateSubmit () {
      this.submissionactivityscoreinfo()
    }
  }
}
</script>
<style lang="less" scoped>
.activitygrade{
  padding: 10px;
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  .activityTitBox{
    // display: flex;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
    border-radius:5px;
    padding: 13px 0 19px 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    h3{
      font-size:24px;
      font-weight:600;
      color:rgba(67,77,93,1);
      line-height:30px;
      width: 69%;
      padding-bottom: 15px;
    }img{
      width:12px;
      height: 13px;
    }
    p{
      display: inline-block;
      color:rgba(116,128,149,1);
      width: 66px;
      padding: 3px;
      font-size:13px;
    }
    .spanColor{
      color:rgba(244,64,61,1);
    }
    span{
      font-size:13px;
    }
    .activityTitBoxRate{
      display: flex;
      align-items: center;
      padding: 6px 0px;
        span{
          padding-left: 8px;
        }
    }
    .textareaBox{
      display: flex;
      flex-direction: column;
      span{
        font-size:15px;
        font-weight:400;
        color:rgba(67,77,93,1);
        padding-bottom: 5px;
        line-height:21px;
      }
      textarea{
        width: 95%;
        height: 70px;
        border: 1px solid rgba(231,232,236,1);
        // color: rgba(199,202,208,1);
        text-indent: 10px;
        font-size: 15px;
      }
    }
  }
  .activityTitList{
    font-size:15px;
    font-weight:400;
    color:rgba(67,77,93,1);
    line-height:19px;
    box-sizing: border-box;
      p{
        display: inline-block;
        color:rgba(116,128,149,1);
        width: 66px;
        padding: 3px;
      }
  }
}
</style>
