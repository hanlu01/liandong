<template>
  <div class="activitydetailsBox">
    <div class="activitydetails">
      <img :src="activitydetailforwxList.activityCoverUrl" class="activityImg">
      <div class="activityTitBox">
        <h3>{{activitydetailforwxList.activityName}}</h3>
        <van-button slot="button" size="small" type="primary" @click="applyFun" v-if="buttonState || signState === 0"><img src="../../assets/images/activity_sign up@2x.png"/>报名</van-button>
        <van-button slot="button" size="small" type="info" @click="applyFun2" v-else-if="signState === 1"><img src="../../assets/images/activity_signup02@2x.png"/>取消报名</van-button>
        <van-button slot="button" size="small" type="info" @click="applyFun1" v-else><img src="../../assets/images/activity_signup02@2x.png"/>报名</van-button>
      </div>
      <div class="activityTitList">
        <p>活动时间：</p><span>{{activitydetailforwxList.activityBegTime}}至{{activitydetailforwxList.activityEndTime}}</span><br/>
        <p>活动园区：</p><span>{{activitydetailforwxList.projectName}}</span><br/>
        <p>活动地点：</p><span>{{activitydetailforwxList.activityPosition}}</span><br/>
        <p>报名时间：</p><span>{{activitydetailforwxList.applyBegTime}} 至 {{activitydetailforwxList.applyEndTime}}</span><br/>
        <div v-if="activitydetailforwxList.applyScope===0"><p>可报名人员：</p><span>全部</span><br/></div>
        <div v-if="activitydetailforwxList.applyScope===1"><p>可报名人员：</p><span>企业人员</span><br/></div>
        <div v-if="activitydetailforwxList.applyScope===2"><p>可报名人员：</p><span>游客</span><br/></div>
        <div v-if="activitydetailforwxList.forFree===0"><p>活动费用：</p><span>无</span><br/></div>
        <div v-if="activitydetailforwxList.forFree===1 && activitydetailforwxList.applyScope===0"><p>活动费用：</p><span>企业：{{activitydetailforwxList.enterpriseEmpPrice}}元 - 游客：{{activitydetailforwxList.visitorPrice}}元</span><br/></div>
        <div v-if="activitydetailforwxList.forFree===1 && activitydetailforwxList.applyScope===1"><p>活动费用：</p><span>{{activitydetailforwxList.enterpriseEmpPrice}}元</span><br/></div>
        <div v-if="activitydetailforwxList.forFree===1 && activitydetailforwxList.applyScope===2"><p>活动费用：</p><span>{{activitydetailforwxList.visitorPrice}}元</span><br/></div>
        <p>报名人数：</p><span>{{activitydetailforwxList.activityParticipants}}/{{activitydetailforwxList.activityCeiling}}</span>
      </div>
        <h5 class="activityTitle">活动介绍</h5>
      <div class="activityIntroduction" v-html="activitydetailforwxList.activityIntroduce">
      </div>
      <div class="activityEvaluation">
        <h5>活动评价</h5>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
        <div class="activityEvaluationList"  v-for="(item,index) in getmorecommentsList" :key="index">
          <div class="activityEvaluationTop">
            <div class="activityEvaluationTopBox">
              <img :src="item.imgUrl" >
              <div class="activityEvaluationTopSize" v-if="item.userType===0">
                <p>{{item.userName}}</p>
                <p>{{item.enterName}}</p>
              </div>
              <div class="activityEvaluationTopSize" v-if="item.userType===1">
                <p>{{item.userName}}</p>
              </div>
            </div>
            <p>{{item.comment}}</p>
            <p>{{item.createTime}}</p>
          </div>
          <div class="activityEvaluationBottom"></div>
        </div>
        </van-list>
      </div>
      <div class="activityEvaluationContent">
        <!-- <van-popup v-model="show" position="bottom"> -->
          <input type="text" placeholder="说说你的看法吧～" v-model="evaluationSend" @focus="inputFocus">
          <button @click="sendFun">发送</button>
        <!-- </van-popup> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      activitydetailforwxList: {},
      getmorecommentsList: [],
      evaluationSend: '',
      state: true,
      signState: 0,
      buttonState: true,
      loading: false,
      finished: false,
      limit: 10,
      page: 1,
      offset: 0,
      getmorecommentsListLoad: [],
      show: true
    }
  },
  mounted () {
    this.judgeuserhadapply()
    this.state = this.$route.query.state
    this.getactivitydetailforwx()
    this.iscansignup()
  },
  methods: {
    inputFocus () {

    },
    // 获取活动详情
    getactivitydetailforwx () {
      let params = {
        activityId: this.$route.query.id
      }
      this.$api.getactivitydetailforwx(params).then(res => {
        if (res.code === 0) {
          this.activitydetailforwxList = res.data
        } else if (res.code === 1) {
        }
      })
    },
    // 获取更多活动评论详情
    moreFun () {
      let params = {
        page: this.page,
        activityId: this.$route.query.id
      }
      this.$api.getmorecomments(params).then(res => {
        if (res.code === 0) {
          this.getmorecommentsList = this.getmorecommentsList.concat(res.data)
          // 加载状态结束
          this.page++
          this.loading = false
          // 数据全部加载完成
          if (this.getmorecommentsList.length >= res.count) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          this.loading = false
          this.finished = true
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
        this.finished = true
      })
    },
    // 添加活动评论
    sendFun () {
      if (this.evaluationSend.length > 100) {
        this.$toast('评价内容100字以内')
        return false
      } else if (this.evaluationSend.length === 0) {
        this.$toast('评论内容不能为空')
      } else {
        let params = {
          comment: this.evaluationSend,
          activityId: this.$route.query.id
        }
        this.$api.addcomment(params).then(res => {
          if (res.code === 0) {
            this.getmorecommentsList = []
            this.getmorecommentsList = res.data
            this.evaluationSend = ''
          }
        })
      }
    },
    // 点击活动报名时验证是否可以报名
    applyFun () {
      let params = {
        activityId: this.$route.query.id
      }
      this.$api.iscansignup(params).then(res => {
        if (res.code === 0) {
          this.$router.push({path: '/activityApply', query: {activityId: this.$route.query.id}})
        } else if (res.code === 1) {
          this.buttonState = false
          this.$toast(res.msg)
        }
      })
    },
    iscansignup () {
      let params = {
        activityId: this.$route.query.id
      }
      this.$api.iscansignup(params).then(res => {
        if (res.code === 1) {
          this.buttonState = false
        }
      })
    },
    applyFun1 () {
      this.$toast('该活动只允许限制范围内的人员参加')
    },
    applyFun2 () {
      let params = {
        activityId: this.$route.query.id
      }
      this.$api.cancelsignup(params).then(res => {
        if (res.code === 0) {
          this.judgeuserhadapply()
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 判断用户是否报名过活动
    judgeuserhadapply () {
      let params = {
        activityId: this.$route.query.id
      }
      this.$api.judgeuserhadapply(params).then(res => {
        if (res.code === 0) {
          this.signState = 0
        } else {
          this.signState = 1
        }
      })
    },
    onLoad () {
      this.moreFun()
    }
  }
}
</script>
<style lang="less" scoped>
.activitydetailsBox{
  background: #fff;
  .activitydetails{
  .activityImg{
    width:100%;
    height: 188px;
  }
  .activityTitBox{
    display: flex;
    padding: 13px 0 19px 10px;
    box-sizing: border-box;
    h3{
      font-size:24px;
      font-weight:600;
      color:rgba(67,77,93,1);
      line-height:30px;
      width: 67%;
    }
    img{
      width:12px;
      height: 13px;
    }
  }
  .activityTitList{
    font-size:13px;
    font-weight:400;
    color:rgba(67,77,93,1);
    line-height:19px;
    padding-left: 10px;
    box-sizing: border-box;
      p{
        display: inline-block;
        color:rgba(116,128,149,1);
        width: 78px;
        padding: 3px;
      }
  }
  .activityIntroduction{
    // display: flex;
    // justify-content: center;
    width:100%;
    box-sizing: border-box;
    padding: 25px 10px 18px 10px;
      h5{
        font-size:15px;
        font-weight:600;
        color:rgba(67,77,93,1);
        line-height:21px;
        text-align: center;
        position: relative;
        margin-bottom: 13px;
      }
      h5::before{
        content:'';
        width:57px;
        height:7px;
        background:rgba(235,161,160,1);
        position: absolute;
        bottom: 1px;
        left: 44%;
        z-index: -1;
      }
      p{
        font-size:15px;
        font-weight:400;
        color:rgba(116,128,149,1);
        line-height:27px;
        padding-bottom: 15px;
      }
    .activityIntroductionImg{
      width: 100%;
      height: 200px;
      padding-bottom: 19px;
    }
  }
  .activityEvaluation{
    padding: 0px 10px 55px 10px;
    h5{
        font-size:15px;
        font-weight:600;
        color:rgba(67,77,93,1);
        line-height:21px;
        text-align: center;
        position: relative;
        margin-bottom: 13px;
      }
      h5::before{
        content:'';
        width:57px;
        height:7px;
        background:rgba(235,161,160,1);
        position: absolute;
        bottom: 1px;
        left: 44%;
        z-index: -1;
      }
      .activityEvaluationList{
        .activityEvaluationTop{
          padding-top: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #E7E8EC;
            .activityEvaluationTopBox{
              display: flex;
                img{
                width: 30px;
                height: 30px;
                border-radius: 5px;
              }
              .activityEvaluationTopSize{
                padding-left: 5px;
                p{
                  font-size:10px;
                  font-weight:400;
                  color:rgba(116,128,149,1);
                  line-height:14px;
                }
              }
            }
          p{
            font-size:15px;
            font-weight:400;
            color:rgba(67,77,93,1);
            line-height:21px;
          }
          p:nth-child(3){
            font-size:13px;
            font-weight:400;
            color:rgba(116,128,149,1);
            line-height:19px;
          }
        }

      }
  }
  .activityEvaluationContent{
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background:#fff;
    position:fixed;
    bottom:0px;
      input{
        width: 80%;
        height: 35px;
        // border: 1px solid rgba(246,245,245,1);
        background:rgba(246,245,245,1);
        border-radius: 20px;
        text-indent: 10px;
        font-size: 15px;
      }
      button{
        color: #F4403D;
        font-size: 15px;
        background: #fff;
      }
  }
}
}

</style>
