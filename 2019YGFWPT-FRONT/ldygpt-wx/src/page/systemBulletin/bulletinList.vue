<template>
  <div class="bulletinList">
    <div class="bulletinListNull" v-if="bulletinListIf">
      <div class="bulletinListNullBox">
        <img src="@/assets/images/icon/icon_meal card@2xw.png" alt="">
        <div class="btnSize">
          <p>你现在暂时没有公告哦～</p>
          <van-button slot="button" size="small" type="primary" @click="bulletinFun">返回</van-button>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="40">
          <div v-for="(item,index) in getAnnouncementListByUserData" :key="index">
            <div class="bulletinListCon" v-if="item.lookScope === 0">
              <div class="bulletinListConLeft">
                <div class="announcementColor">
                  <p>{{item.announcementTitle}}</p>
                  <p>{{item.createDate}}</p>
                </div>
              </div>
              <div class="bulletinListConRight" @click="bulletnFun(item,index)">
                <p>{{item.projectName}}</p>
              </div>
            </div>
            <div class="bulletinListCon" v-if="item.lookScope === 1">
              <div class="bulletinListConLeft">
                <div class="announcementColor">
                  <p>{{item.announcementTitle}}</p>
                  <p>{{item.createDate}}</p>
                </div>
              </div>
              <div class="bulletinListConRight" @click="bulletnFun(item,index)">
                <p>{{item.projectName}}</p>
              </div>
            </div>
            <div class="bulletinListCon" v-if="item.lookScope === 2">
              <div class="bulletinListConLeft">
                <div class="announcementColor">
                  <p>{{item.announcementTitle}}</p>
                  <p>{{item.createDate}}</p>
                </div>
              </div>
              <div class="bulletinListConRight" @click="bulletnFun(item,index)">
                <p>{{item.projectName}}</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      classStyleA: true,
      // classStyleB: false,
      getAnnouncementListByUserData: [],
      createDate: '',
      bulletinListIf: false,
      loading: false,
      finished: false,
      list: [],
      isLoading: false,
      busy: false,
      ellipsis: false,
      currentPage: 1,
      pageNum: 1,
      pageLimit: 10
    }
  },
  mounted () {
    this.busy = true
    this.getAnnouncementListByUser()
  },
  methods: {
    loadMore () {
      if (!this.busy) {
        this.getAnnouncementListByUser()
      }
    },
    // onRefresh () {
    //   this.getAnnouncementListByUserData = []
    //   this.currentPage = 1
    //   this.getAnnouncementListByUser()
    // },
    // 获取当月系统公告列表
    getAnnouncementListByUser () {
      let params = {
        pageNum: this.pageNum, // 当前页
        pageLimit: this.pageLimit
      }
      this.$api.getAnnouncementListByUser(params).then(res => {
        if (res.code === 0) {
          if (res.data) {
            this.getAnnouncementListByUserData = [...this.getAnnouncementListByUserData, ...res.data]
            this.pageNum++
          }
          if (res.data.length < this.pageLimit) {
            this.busy = true
          } else {
            this.busy = false
          }
          if (this.getAnnouncementListByUserData.length > 2) {
            this.ellipsis = true
          }
          // this.getAnnouncementListByUserData = this.getAnnouncementListByUserData.concat(res.data)
          // // 加载状态结束
          // this.currentPage++
          // this.loading = false
          // this.isLoading = false
          // // 数据全部加载完成
          // if (this.getAnnouncementListByUserData.length >= res.count) {
          //   this.finished = true
          // } else {
          //   this.finished = false
          // }
        }
      })
    },
    bulletnFun (item, index) {
      this.$router.push({path: 'bulletinDetails', query: {id: item.id}})
    },
    bulletinFun () {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.bulletinList{
  box-sizing: border-box;
  background: #F6F5F5;
  width: 100%;
  .bulletinListNull{
    background: #fff;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
      .bulletinListNullBox{
        display: flex;
        justify-content: center;
        align-items: center;
        -webkit-box-orient: vertical;
        flex-direction: column;
        padding-top: 107px;
          .btnSize{
          text-align: center;
            p{
              padding: 8px 0 20px 0;
            }
        }
        img{
          width:170px;
          height: 124px;
        }
      }
  }
    .bulletinListCon{
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      padding: 10px;
      box-sizing: border-box;
      margin: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
        .bulletinListConLeft{
          .bulletinListConLeftSize{
            padding: 10px 0px 6px 10px;
            position: relative;
            text-indent: 22px;
              p:nth-child(1){
                font-size:15px;
                font-weight:400;
                color:rgba(67,77,93,1);
                line-height:21px;
              }
              p:nth-child(2){
                font-size:13px;
                font-weight:400;
                color:rgba(116,128,149,1);
                line-height:19px;
              }
          }
          .bulletinListConLeftSize::before{
            content: '';
            width: 20px;
            height: 10px;
            background: url(../../assets/images/index/notice_top_bg@2x.png) no-repeat;
            background-size: cover;
            position: absolute;
            top: 23px;
            left: 5px;
          }
          .announcementColor{
            color: #748095;
            padding: 10px 0px 6px 10px;
            position: relative;
            text-indent: 15px;
              // p{
              //   width:68%;
              //   overflow: hidden;
              //   text-overflow:ellipsis;
              //   white-space: nowrap;
              // }
              P:nth-child(1)::before{
                content: '';
                width: 15px;
                height: 8px;
                background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
                background-size: cover;
                position: absolute;
                top: 23px;
                left: 5px;
                border-radius: 3px;
              }
              p:nth-child(1){
                font-size:15px;
                font-weight:400;
                color:rgba(67,77,93,1);
                line-height:21px;
                width: 217px;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
              }
              p:nth-child(2){
                font-size:13px;
                font-weight:400;
                color:rgba(116,128,149,1);
                line-height:19px;
              }
          }
          // .unreadBulletin{
          //   color: #748095;
          //   padding: 10px 0px 6px 10px;
          //   position: relative;
          //   text-indent: 15px;
          //     P:nth-child(1)::before{
          //       content: '';
          //       width: 13px;
          //       height: 5px;
          //       background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
          //       border-radius:3px;
          //       position: absolute;
          //       top: 23px;
          //       left: 5px;
          //     }
          //     p:nth-child(1){
          //       font-size:15px;
          //       font-weight:400;
          //       color:rgba(67,77,93,1);
          //       line-height:21px;
          //     }
          //     p:nth-child(2){
          //       font-size:13px;
          //       font-weight:400;
          //       color:rgba(116,128,149,1);
          //       line-height:19px;
          //     }
          // }
        }
        .bulletinListConRight{
          position: relative;
          color: #748095;
          font-size: 13px;
          right: 10px;
            p::after{
              content: '';
              width: 8px;
              height: 12px;
              background: url(../../assets/images/index/icon_arrow@2x.png) no-repeat;
              background-size: cover;
              position: absolute;
              right: -11px;
              top: 1px;
            }
        }
    }
    // .bulletinListCon:nth-child(2){
    //   .bulletinListConLeftSize{
    //     P:nth-child(1)::before{
    //       content: '';
    //       width: 13px;
    //       height: 5px;
    //       background:linear-gradient(308deg,rgba(239,189,194,1) 0%,rgba(230,115,115,1) 100%);
    //       border-radius:3px;
    //       position: absolute;
    //       top: 23px;
    //       left: 5px;
    //     }
    //   }
    // }
}
</style>
