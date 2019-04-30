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
            <!-- <van-cell  class="informationBox"> -->
            <van-cell v-for="(item, index) in getactivitybyuserList" :key="index" class="informationBox">
              <div class="information" >
                <div class="informationLeft">
                  <img :src="item.img">
                </div>
                <div class="informationCenter" @click="informationFun(item)">
                  <h4>{{item.title}}</h4>
                  <p>{{item.position}}</p>
                  <p>{{item.time}}</p>
                  <p v-if="informationHide">{{item.number}}</p>
                </div>
                <router-link :to="{path:'/activitygrade', query:{activityId:item.id}}" v-if="item.activityStatus === '1' || item.activityStatus === '2'">
                  <div class="informationRight">
                    <img src="@/assets/images/index/activity_icon_evaluate@2x.png">
                    <p>看评分</p>
                  </div>
                </router-link>
              </div>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      informationHide: true,
      getactivitybyuserList: [],
      selectIndex: 0,
      title: ['报名中', '已结束'],
      isLoading: false,
      loading: false,
      finished: false,
      pageInfo: {
        currentPage: 1,
        status: 'active'
      }
    }
  },
  mounted () {

  },
  methods: {
    informationFun (item) {
      if (this.informationHide) {
        this.$router.push({path: 'activitydetails', query: {id: item.id, state: true}})
      } else {
        this.$router.push({path: 'activitydetails', query: {id: item.id, state: false}})
      }
    },
    selectItem (index) {
      this.selectIndex = index
      if (this.selectIndex === 0) {
        this.pageInfo.status = 'active'
      } else if (this.selectIndex === 1) {
        this.pageInfo.status = 'over'
      }
      this.pageInfo.currentPage = 1
      this.getactivitybyuserList = []
      this.getList()
    },
    onRefresh () {
      this.getactivitybyuserList = []
      this.pageInfo.currentPage = 1
      this.getList()
    },
    // list
    getactivitybyuser () {
      let params = {
        status: this.pageInfo.status,
        page: this.pageInfo.currentPage
      }
      this.$api.getactivitybyuser(params).then(res => {
        if (res.code === 0) {
          this.getactivitybyuserList = this.getactivitybyuserList.concat(res.data)
          // 加载状态结束
          this.pageInfo.currentPage++
          this.loading = false
          this.isLoading = false
          // 数据全部加载完成
          if (this.getactivitybyuserList.length >= res.count) {
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
      this.getactivitybyuser()
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
  .patrol-task{
    .informationBox{
      line-height: 1;
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
            flex: 1;
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
  }
</style>
