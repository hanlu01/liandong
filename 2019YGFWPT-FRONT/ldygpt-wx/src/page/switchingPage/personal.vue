<template>
<div class="personal">
    <div class="headerBox">
      <div class="headerTop">
        <div class="headerLeft">
          <div class="headerImg">
            <img :src="personalInfo.empInfo.headImgUrl" alt="" v-if="personalInfo.empInfo">
            <img src="../../assets/images/icon_head portrait.png" alt="" v-else>
          </div>
          <div class="headerTit">
            <div class="headerInfor">
              <div class="headerTitSize">
                <span>{{personalInfo.empInfo.empName}}</span>
                <img src="../../assets/images/user_icon_boy.png" alt="" v-if="personalInfo.empInfo.empSex === 1">
                <img src="../../assets/images/user_icon_boy.png" alt="" v-else>
              </div>
              <p>{{personalInfo.empInfo.empTel}}</p>
            </div>
          </div>
        </div>
        <div class="headerRight">
          <router-link :to="{path:'/edit',query:{empInfo:personalInfo.empInfo, isEmp:personalInfo.isEmp}}">
            <img src="../../assets/images/user_icon_edit.png" alt="">
            <span>编辑</span>
          </router-link>
        </div>
      </div>
      <div class="headerBottom">
        <div class="bottomCompany"  >
          <div class="bottomCompanyBox">
            <span>绑定企业：</span>
            <span>{{personalInfo.empInfo.enterName}}</span>
          </div>
          <van-button round type="warning" @click="untieFun" v-if="untiedStatus">解绑</van-button>
        </div>
        <div class="bottomId">
          <span>身份证号：</span>
          <span>{{personalInfo.empInfo.empIdNumber}}</span>
        </div>
        <div class="bottomDepartment">
          <div>
            <span>部 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门：</span>
            <span>{{personalInfo.empInfo.empDep}}</span>
          </div>
          <div>
            <span>职务：</span>
            <span>{{personalInfo.empInfo.empPosition}}</span>
          </div>
        </div>
        <div class="bottomPlate">
          <div>
            <span>车 &nbsp;牌 &nbsp;号:</span>
            <span>{{personalInfo.empInfo.empCarNumber}}</span>
          </div>
          <div>
            <span>生日：</span>
            <span>{{personalInfo.empInfo.birthDay}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="inforBox">
      <ul>
        <li>
          <img src="../../assets/images/icon_05.png" alt="">
          <p @click="topUpFunc(personalInfo)">
            <span>我的餐卡</span>
            <br>
            <span class="amount" v-if="personalInfo.empInfo.haveMealCard === 1">余额:</span>
            <span class="amount" v-if="personalInfo.empInfo.haveMealCard === 0">去绑定</span>
            <span class="boxNumber" v-if="personalInfo.empInfo.haveMealCard === 1 && personalInfo.mealCard">{{personalInfo.mealCard.cardBalance}}</span>
            <span class="amount" v-if="personalInfo.empInfo.haveMealCard === 1">元</span>
          </p>
        </li>
        <li>
          <img src="../../assets/images/icon_06.png" alt="">
          <router-link to="/parkingstubmy">
          <p>
            <span>我的停车卡</span>
            <br>
            <span class="boxNumber" v-if="personalInfo.leaseCardInfo">{{personalInfo.leaseCardInfo}}</span>
            <span class="amount" v-if="personalInfo.leaseCardInfo">张</span>
          </p>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="inforRecord">
      <div class="recordBox">
        <div class="recordContent" v-for="(item,index) in recordContentArr" :key="index" @click="recordContentArrFun(index)">
          <div class="contentLeft">
            <img :src="item.icon" alt="">
            <span>{{item.record}}</span>
          </div>
          <img src="../../assets/images/icon_arrow.png" alt="">
        </div>
      </div>
    </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      personalInfo: '',
      temporaryData: {},
      untiedStatus: true,
      recordContentArr: [
        {
          icon: require('../../assets/images/xiaofeijilu.png'),
          record: '餐卡充值记录'
        },
        {
          icon: require('../../assets/images/user_icon_02.png'),
          record: '餐卡消费记录'
        },
        {
          icon: require('../../assets/images/user_icon_03.png'),
          record: '我的活动'
        }
      ]
    }
  },
  mounted () {
    this.myInfo()
    this.getempinfoforuntying()
    this.judgecanuntying()
  },
  methods: {
    // 解绑
    untieFun () {
      this.$dialog.confirm({
        title: '提示',
        overlay: true,
        // message: `您确定要解绑<span>${this.personalInfo.empInfo.enterName}</span>吗？ 如果餐卡已绑定，会自动一起解绑。`
        message: `您确定要解绑<span>${this.temporaryData.enterName}</span>吗？ 如果餐卡已绑定，会自动一起解绑。`
      }).then(() => {
        this.untying()
      }).catch(() => {
      })
    },
    recordContentArrFun (index) {
      if (index === 0 || index === 1) {
        this.$router.push({path: '/expensecalendar', query: {index: index}})
      }
      if (index === 2) {
        this.$router.push({path: '/activityMy'})
      }
    },

    topUpFunc (personalInfo) {
      // this.$api.myDiningCardInfo().then(res => {
      // if (res.code === 0) {
      console.log(personalInfo.mealCard, '777777777')
      if (personalInfo.empInfo.haveMealCard === 0) {
        this.$router.push({path: './topUp'})
      } else {
        this.$router.push({path: './myMealCard'})
      }
      // }
      // })
    },
    // 个人中心
    myInfo () {
      this.$api.myInfo().then(res => {
        if (res.code === 0) {
          this.personalInfo = res.data
        }
      })
    },
    // 临时数据
    getempinfoforuntying () {
      this.$api.getempinfoforuntying().then(res => {
        if (res.code === 0) {
          this.temporaryData = res.data
        }
      })
    },
    // 判断用户是否可以解绑企业
    judgecanuntying () {
      this.$api.judgecanuntying().then(res => {
        if (res.code === 0) {
          if (res.data === '1') {
            this.untiedStatus = true
          } else {
            this.untiedStatus = false
            // this.$toast('不可以解绑')
          }
        }
      })
    },
    // 解绑企业
    untying () {
      this.$api.untying().then(res => {
        if (res.code === 0) {
          this.judgecanuntying()
          this.$toast('解绑成功')
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.personal{
  width:100%;
  background: #F6F5F5;
  min-height: 400px;
    .headerBox{
      width: 100%;
      height: 180px;
      padding: 20px 10px 0 10px;
      box-sizing:border-box;
      font-size: 15px;
      background:url(../../assets/images/index/top_bg@2x.png) no-repeat;
      background-size: cover;
      .headerTop{
        width:100%;
        height: 40px;
        display:flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom:10px;
        .headerLeft{
          display:flex;
          .headerImg{
            width: 40px;
            height: 40px;
            img{
              width: 40px;
              border-radius:50%;
            }
          }
          .headerTit{
            display:flex;
            align-items: center;
            height: 40px;
            justify-content: space-between;
            color:#fff;
            .headerInfor{
              padding-left:7px;
              .headerTitSize{
                img{
                  width: 13px;
                  margin-left:10px
                }
              }
              p{
                margin-top:4px
              }
            }
          }
        }
        .headerRight{
          img{
            width: 15px;
            vertical-align: middle
          }
          span{
            color:rgba(255,255,255,1);
            vertical-align: middle
          }
        }
      }
      .headerBottom{
        width:100%;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
        border-radius:5px;
        box-sizing:border-box;
        padding:8px 0 12px 11px;
        .bottomCompany{
          height: 30px;
          padding-right:15px;
          display:flex;
          box-sizing:border-box;
          align-items: center;
          justify-content: space-between;

          .bottomCompanyBox{
            width: 75%;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            span:first-child{
              color:rgba(116,128,149,1);
            }
          }
        }
        .bottomId{
          margin-top:21px;
          box-sizing:border-box;
          // padding-right:77px;
          span:first-child{
            color:rgba(116,128,149,1);
          }
        }
        .bottomDepartment{
          display:flex;
          padding-right:78px;
          box-sizing:border-box;
          justify-content: space-between;
          margin-top:26px;
          span:first-child{
            color:rgba(116,128,149,1);
          }
        }
        .bottomPlate{
          display:flex;
          padding-right:78px;
          box-sizing:border-box;
          justify-content: space-between;
          margin-top: 26px;
          span:first-child{
            color:rgba(116,128,149,1);
          }
        }
        // height: 185px;
      }
    }
    .inforBox{
      width:100%;
      margin-top:70px;
      padding:0 10px 0 10px;
      box-sizing:border-box;
      .boxNumber{
        color:#F4403D;
      }
      .amount{
        color:#748095;
        font-size: 12px;
      }
      ul{
        width:100%;
        padding:18px 10px;
        box-sizing:border-box;
        display:flex;
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 5px 0px rgba(152,155,165,0.5);
        border-radius:5px;
        li{
          width:50%;
          display:flex;
          align-items: center;
          img{
            width: 40px;
          }
          p{
            margin-left:7px;
            color:#434D5D;
            font-size: 15px;
            span{
              line-height: 22px;
            }
            span:first-child{
              margin-bottom:4px;
              font-weight:bold
            }
          }
        }
        li:last-child{
          padding-left:10px;
          border-left:1px solid rgba(228,226,226,1)
        }
        // height: 75px;
      }
    }
    .inforRecord{
      margin-top:10px;
      width:100%;
      padding:0 10px 0 10px;
      box-sizing:border-box;
      .recordBox{
        background:rgba(255,255,255,1);
        box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
        border-radius:5px;
        .recordContent{
          height: 50px;
          display:flex;
          padding-left:9px;
          box-sizing:border-box;
          border-bottom:1px solid rgba(231,232,236,1);
          padding-right:20px;
          justify-content: space-between;
          align-items: center;
          img{
            width: 7px;
          }
          .contentLeft{
            display:flex;
            align-items: center;
            img{
              width: 18px;
            }
            span{
              margin-left:6px
            }
          }
        }
      }
    }
}

</style>
