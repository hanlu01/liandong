<template>
  <div class="indexHome">
    <div class="headerBox">
      <div class="headerTit">
        <h4 class="headerTitSize">联东U谷</h4>
        <p>创新生活 方便你我</p>
      </div>
      <!-- Swiper -->
      <div class="swiperBox">
        <van-swipe style="height:100%" @change="onChange"  :autoplay="4000" :touchable='true'>
          <van-swipe-item v-for="(item,index) in 3" :key="index">
            <img src="@/assets/images/index/home_banner@2x.png" class="swiperImg">
          </van-swipe-item>
          <div class="custom-indicator" slot="indicator">
            {{ current + 1 }}/3
          </div>
        </van-swipe>
      </div>
    </div>
      <!-- 公告 -->
      <div class="announcementBox">
        <div v-for="(item,index) in getNewAnnouncementsData" :key="index" @click="bulletinListFun" class="announcementBoxFor">
          <div class="announcementTop" v-if="item.lookScope === 0">
            <p>{{item.announcementTitle}}</p>
            <!-- <p class="announcementColor">园区招商进行中</p>
            <p>绑定企业餐厅消费折上折</p> -->
          </div>
          <div class="announcementTop" v-if="item.lookScope === 1">
            <p>{{item.announcementTitle}}</p>
          </div>
          <div class="announcementTop" v-if="item.lookScope === 2">
            <p>{{item.announcementTitle}}</p>
          </div>
        </div>
      </div>
      <!-- 项目 -->
      <div class="projectBox">
        <div @click="enterpriseType" class="projectBoxList">
            <img src="@/assets/images/index/icon_01@2x.png">
            <p>企业绑定</p>
        </div>
        <!-- <router-link :to="{path:'/topUpMoney',query:{accountInfo:myMealCardBoxData}}" class="projectBoxList"> -->
        <router-link :to="{path:'/topUpMoney'}" class="projectBoxList">
          <img src="@/assets/images/index/icon_02@2x.png" alt="">
          <p>智慧餐厅</p>
        </router-link>
        <!-- <router-link to="topUpMoney" class="projectBoxList">
          <img src="@/assets/images/index/icon_02@2x.png" alt="">
          <p>餐卡充值2</p>
        </router-link> -->
        <router-link to="Parkingspace" class="projectBoxList">
        <div class="projectBoxList">
          <img src="@/assets/images/index/icon_03@2x.png" alt="">
          <p>停车卡</p>
        </div>
        </router-link>
        <router-link to="bulletinList" class="projectBoxList">
        <div class="projectBoxList">
          <img src="@/assets/images/index/icon_04@2x.png" alt="">
          <p>系统公告</p>
        </div>
        </router-link>
      </div>
      <!-- 学习成长 -->
      <div class="studyBox" :class="approvalStatus?'studyBox':'studyBoxAntoor'">
        <div class="studyList" @click="studyEvent">
          <div class="studyListLeft">
            <img src="@/assets/images/index/icon_05@2x.png" alt="">
          </div>
          <!-- <router-link to="activitysuccesspage"> -->
          <div class="studyListRight">
            <p>学习成长</p>
            <p>工作学习两不误</p>
          </div>
          <!-- </router-link> -->
        </div>
        <div class="studyList" v-if="approvalStatus">
          <div class="studyListLeft">
            <img src="@/assets/images/index/icon_06@2x.png" alt="">
            <div class="iconSize" v-if="count > 0">{{count}}</div>
          </div>
          <router-link to="Bindingapproval">
            <div class="studyListRight">
              <p @click="getactivitylist">绑定审批</p>
              <p>绑定快，更便捷</p>
            </div>
          </router-link>
          <!-- <div v-else>
            <div class="studyListRight">
              <p @click="getactivitylist1">绑定审批</p>
              <p>绑定快，更便捷</p>
            </div>
          </div> -->
        </div>
      </div>
      <!-- 活动信息top -->
      <div class="activityBox">
        <h4>活动信息</h4>
        <router-link to="activity">
          <p>更多</p>
        </router-link>
      </div>
      <!-- 活动信息内容 -->
      <Information :InformationList="InformationList" :informationHide="true" ></Information>
      <!-- 底部 -->
  </div>
</template>
<script>
import Information from '@/components/activityInformation/Information'
export default {
  components: {
    Information
    // footerBox
  },
  data () {
    return {
      current: 0, // 轮播图下标
      count: 0,
      approvalStatus: false,
      InformationList: [],
      myMealCardBoxData: {},
      enterpriseTypeData: {},
      getNewAnnouncementsData: []// 获取最新系统公告前三条
    }
  },
  mounted () {
    this.getactivitylist()
    // this.getEmpUserInfo()
    this.getNewAnnouncements()
    this.hasapprovalrole()
  },
  methods: {
    // 获取最新系统公告前三条
    getNewAnnouncements () {
      this.$api.getNewAnnouncements().then(res => {
        if (res.code === 0) {
          this.getNewAnnouncementsData = res.data
        }
      })
    },
    // 判断当前用户是否有审批权限
    hasapprovalrole () {
      this.$api.hasapprovalrole().then(res => {
        if (res.code === 0) {
          this.approvalStatus = true
          this.getapprovalcount()
        } else {
          this.approvalStatus = false
          // this.$toast('您没有审批权限')
        }
      })
    },
    // 当前用户待审批审批个数
    getapprovalcount () {
      this.$api.getapprovalcount().then(res => {
        if (res.code === 0) {
          this.count = res.data
          console.log('审批个数', res)
        }
      })
    },
    // 相应的企业状态跳转
    enterpriseType () {
      this.getcurrentuserbindstatus()
    },
    // 轮播图
    onChange (index) {
      this.current = index
    },
    // 获取当前用户的绑定企业的状态
    getcurrentuserbindstatus () {
      this.$api.getcurrentuserbindstatus().then(res => {
        if (res.code === 0) {
          this.enterpriseTypeData = res.data
          if (this.enterpriseTypeData.status === 0 || this.enterpriseTypeData.status === 1 || this.enterpriseTypeData.status === 2) {
            this.$router.push({path: '/information', query: {statusData: this.enterpriseTypeData}})
          } else {
            this.$router.push({path: '/boundenterprise'})
          }
        }
      })
    },
    // 获取首页活动列表
    getactivitylist () {
      this.$api.getactivitylist().then(res => {
        if (res.code === 0) {
          this.InformationList = res.data
        } else if (res.code === 1) {
          console.log('接口错误')
        }
      })
    },
    getactivitylist1 () {
      this.$toast('您没有审批权限')
    },
    // 获取餐卡充值用户信息
    // getEmpUserInfo () {
    //   this.$api.getEmpUserInfo().then(res => {
    //     if (res.code === 0) {
    //       this.myMealCardBoxData = res.data
    //       console.log('11122', this.myMealCardBoxData)
    //     }
    //   })
    // },
    bulletinListFun () {
      this.$router.push({path: 'bulletinList'})
    },
    studyEvent () {
      this.$toast('暂未开放，敬请期待')
      return false
    }
  }
}
</script>
<style lang="less" scoped>
@import '../../assets/style/pagestyle/swiper';
.indexHome{
  width:100%;
  background: #F6F5F5;
  min-height: 400px;
  padding-bottom: 27px;
    .headerBox{
      width: 100%;
      height: 180px;
      background:url(../../assets/images/index/top_bg@2x.png) no-repeat;
      background-size: cover;
        .headerTit{
          padding: 15px 10px 0px 10px;
          color:#fff;
            .headerTitSize{
              position: relative;
              text-indent: 29px;
            }
            .headerTitSize::before{
              content: '';
              position: absolute;
              left: 1px;
              top: -2px;
              width:22px;
              height: 22px;
              background: url(../../assets/images/index/logo@2x.png) no-repeat;
              background-size: cover;
            }
            p{
              margin:10px 0
            }
        }
        .swiperBox{
          width: 94%;
          height: 160px;
          margin: 0 auto;
          box-shadow: 0px 0px 5px 0px rgba(174, 179, 196, 0.5);
            .swiperImg{
              width:100%;
              height: 100%;
            }
        }
    }
    .announcementBox{
      width: 94%;
      margin: 53px auto 10px;
      font-size: 15px;
      // background-color: #fff;
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      background: url(../../assets/images/index/notice_img@2x.png) no-repeat #fff;
      background-size: 27%;
      background-position: 95% 96%;
        .announcementBoxFor{
            p{
              padding: 10px 0px 6px 10px;
              position: relative;
              text-indent: 14px;
            }
            .announcementColor{
              // color: #748095;
            }
            P:nth-child(3){
              padding-bottom: 10px;
            }
            P:nth-child(1)::before{
              content: '';
              width: 24px;
              height: 11px;
              background: url(../../assets/images/index/notice_top_bg@2x.png) no-repeat;
              background-size: cover;
              position: absolute;
              top: 12px;
              left: 5px;
            }
            P:nth-child(2)::before{
              content: '';
              width:19px;
              height: 8px;
              background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
              border-radius:3px;
              position: absolute;
              top: 12px;
              left: 7px;
            }
            P:nth-child(3)::before{
              content: '';
              width:19px;
              height: 8px;
              background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
              border-radius:3px;
              position: absolute;
              top: 12px;
              left: 7px;
            }
            .announcementTop{
              p{
                width:68%;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              P::before{
                content: '';
                width:13px;
                height: 5px;
                background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
                border-radius:3px;
                position: absolute;
                top: 14px;
                left: 7px;
            }
          }
          }
          // .announcementBoxFor:nth-child(2){
          //   .announcementTop{
          //         P::before{
          //           content: '';
          //           width:19px;
          //           height: 8px;
          //           background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
          //           border-radius:3px;
          //           position: absolute;
          //           top: 12px;
          //           left: 7px;
          //       }
          //     }
          // }
          // .announcementBoxFor:nth-child(3){
          //   .announcementTop{
          //         P::before{
          //           content: '';
          //           width:19px;
          //           height: 8px;
          //           background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
          //           border-radius:3px;
          //           position: absolute;
          //           top: 12px;
          //           left: 7px;
          //       }
          //     }
          // }

    }
    .projectBox{
      width: 94%;
      margin: 10px auto 10px;
      font-size: 15px;
      background: #fff;
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      display: flex;
      padding: 18px 0;
      font-size: 13px;
        .projectBoxList{
          display: flex;
          flex-direction:column;
          flex: 1;
          align-items: center;
            img{
              width:40px;
            }
            p{
              padding-top:6px;
              color: #434D5D;
            }
        }
    }
    .studyBox{
      width: 94%;
      margin: 10px auto 10px;
      font-size: 15px;
      background: #fff;
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      display: flex;
      flex: 1;
      padding: 18px 0;
      justify-content: space-around;
        .studyList{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 5px;
            .studyListLeft{
              width:40px;
              padding-left: 5px;
              position: relative;
                img{
                  width:100%;
                }
                .iconSize{
                  width:14px;
                  height: 14px;
                  background:rgba(244,64,61,1);
                  color: #fff;
                  font-size: 10px;
                  border-radius: 50%;
                  display: inline-block;
                  text-align: center;
                  vertical-align: middle;
                  position: absolute;
                  top: 4px;
                  right: 5px;
                }
            }
            .studyListRight{
              padding-left: 5px;
                P:nth-child(1){
                  font-size: 15px;
                  font-weight:500;
                  color:rgba(67,77,93,1);
                  line-height:21px;
                }
                P:nth-child(2){
                  font-size:13px;
                  font-weight:400;
                  color:rgba(116,128,149,1);
                  line-height:19px;
                }
            }
        }
    }
    .studyBoxAntoor{
      width: 94%;
      margin: 10px auto 10px;
      font-size: 15px;
      background: #fff;
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      padding: 18px 0;
      justify-content: flex-start;
        .studyList{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-left: 5px;
            .studyListLeft{
              width:40px;
              position: relative;
                img{
                  width:100%;
                }
                .iconSize{
                  width:14px;
                  height: 14px;
                  background:rgba(244,64,61,1);
                  color: #fff;
                  font-size: 10px;
                  border-radius: 50%;
                  display: inline-block;
                  text-align: center;
                  vertical-align: middle;
                  position: absolute;
                  top: 4px;
                  right: 5px;
                }
            }
            .studyListRight{
              padding-left: 5px;
                P:nth-child(1){
                  font-size: 15px;
                  font-weight:500;
                  color:rgba(67,77,93,1);
                  line-height:21px;
                }
                P:nth-child(2){
                  font-size:13px;
                  font-weight:400;
                  color:rgba(116,128,149,1);
                  line-height:19px;
                }
            }
        }
    }
    .activityBox{
      display: flex;
      justify-content: space-between;
      width: 94%;
      margin: 13px auto 5px;
      font-size: 14px;
        h4{
          font-size: 14px;
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
          height: 15px;
          background: url(../../assets/images/index/icon_arrow@2x.png) no-repeat;
          background-size: 82%;
          position: absolute;
          right: 0px;
          top: 2px;
        }
    }
}
</style>
