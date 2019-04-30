<template>
    <div class="patrol-task expen-page">
      <div class="nav-bar">
      <div
        class="nav-item"
        :class="{ active: selectIndex == index }"
        @click="selectItem(index)"
        v-for="(item, index) in title"
        :key="index"
      >
        {{item}}
      </div>
    </div>
      <div class="task-list">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getList"
            >
            <!-- <van-cell  class="expensecalendar"> -->
            <van-cell v-for="(item, index) in presentMomentData" :key="index" class="expensecalendar">
              <div class="expensecalendarBox">
                <div class="activityBox">
                  <h4>{{item.outId}}</h4>
                  <p v-if="$route.query.index === 1">去评价</p>
                </div>
                <div class="expensecalendarBoxBot">
                  <div class="expensecalendarBoxBotLeft">
                    <h4 v-if="$route.query.index === 1">{{item.diningStallName}}</h4>
                    <p v-if="$route.query.index === 1">{{item.diningRoomName}}</p>
                    <p>{{item.projectName}}</p>
                    <p>{{item.userTel}}</p>
                    <p>{{formatTime(item.consuleTime)}}</p>
                  </div>
                  <div class="expensecalendarBoxBotRight">
                    <p>{{item.amount}}元</p>
                  </div>
                </div>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
</template>

<script>
import moment from 'moment'
export default {
  data () {
    return {
      presentMomentData: [],
      selectIndex: 0,
      title: [],
      titleIndex1: ['当日消费', '历史消费'],
      titleIndex0: ['当日充值', '历史充值'],
      isLoading: false,
      loading: false,
      finished: false,
      pageInfo: {
        currentPage: 1,
        recType: '0'
      }
    }
  },
  components: {
    // surveyItem
  },
  mounted () {

  },
  methods: {
    formatTime (time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    },
    selectItem (index) {
      this.selectIndex = index
      if (this.selectIndex === 0) {
        this.pageInfo.recType = '0'
      } else if (this.selectIndex === 1) {
        this.pageInfo.recType = '1'
      }
      this.pageInfo.currentPage = 1
      this.presentMomentData = []
      this.getList()
    },
    onRefresh () {
      this.presentMomentData = []
      this.pageInfo.currentPage = 1
      this.getList()
    },
    // 当天消费、历史消费记录
    myConsumerRecord () {
      let params = {
        currType: this.pageInfo.recType,
        page: this.pageInfo.currentPage
      }
      this.$api.myConsumerRecord(params).then(res => {
        if (res.code === 0) {
          this.presentMomentData = this.presentMomentData.concat(res.data)
          // 加载状态结束
          this.pageInfo.currentPage++
          this.loading = false
          this.isLoading = false
          // 数据全部加载完成
          if (this.presentMomentData.length >= res.count) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          this.loading = false
          this.finished = true
          this.isLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
        this.finished = true
        this.isLoading = false
      })
    },
    // 当日充值、历史充值
    myChargeRecord () {
      let params = {
        currType: this.pageInfo.recType,
        page: this.pageInfo.currentPage
      }
      this.$api.myChargeRecord(params).then(res => {
        if (res.code === 0) {
          this.presentMomentData = this.presentMomentData.concat(res.data)
          // 加载状态结束
          this.pageInfo.currentPage++
          this.loading = false
          this.isLoading = false
          // 数据全部加载完成
          if (this.presentMomentData.length >= res.count) {
            this.finished = true
          } else {
            this.finished = false
          }
        } else {
          this.loading = false
          this.finished = true
          this.isLoading = false
        }
      }).catch(err => {
        console.log(err)
        this.loading = false
        this.finished = true
        this.isLoading = false
      })
    },
    getList () {
      // index0充值  1消费
      if (this.$route.query.index === 0) {
        this.myChargeRecord()
      } else if (this.$route.query.index === 1) {
        this.myConsumerRecord()
      }
    }
  },
  created () {
    if (this.$route.query.index === 0) {
      this.title = this.titleIndex0
    } else if (this.$route.query.index === 1) {
      this.title = this.titleIndex1
    }
  }
}
</script>

<style lang="less" scoped>
  .patrol-task {
    height: 100vh;
    .nav-bar {
      display: flex;
      justify-content: space-around;
      align-content: center;
      font-size: 14px;
      font-weight: bold;
      background: #fff;
      .nav-item {
          flex: 1;
          height: 35px;
          line-height: 35px;
          position: relative;
          text-align: center;
          color: rgba(117, 117, 117, 1);
      }
      .active {
          color: rgba(239, 36, 36, 1);
          &:after{
              content: '';
              display: inline-block;
              width: 28px;
              height: 3px;
              background: rgba(239, 36, 36, 1);
              border-radius: 4px;
              position: absolute;
              bottom: -1px;
              left: 50%;
              transform: translate(-50%, 0);
          }
      }
    }
  }
  .van-cell{
    padding: 0px!important;
    background-color: #F7F7F7!important;
  }
  .task-list{
    height: calc(100vh - 35px);
  }
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
            top: 6px;
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
