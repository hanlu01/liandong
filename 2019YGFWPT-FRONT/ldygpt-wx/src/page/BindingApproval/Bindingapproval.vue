<template>
  <div class="Bindingapproval expen-page">
    <div class="task-list">
        <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="getapprovalemplist"
            >
            <van-cell v-for="(item, index) in staffList" :key="index" >
              <div class="BindingapprovalContent">
                <div class="activityEvaluationTopBox">
                  <img :src="item.headImgUrl" v-if="item.headImgUrl">
                  <img src="@/assets/images/timg.jpg" v-else>
                  <div class="activityEvaluationTopSize">
                    <p>{{item.empName}}</p>
                    <p>{{item.empTel}}</p>
                  </div>
                </div>
                <router-link :to="{path:'/approvaldetails',query:{id:item.id}}">
                  <div class="BindingapprovalContentRight">
                    <p>去审批</p>
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
      staffList: [],
      page: 1,
      isLoading: false,
      loading: false,
      finished: false
    }
  },
  mounted () {
    // this.getapprovalemplist()
  },
  methods: {
    onRefresh () {
      this.staffList = []
      this.page = 1
      this.getapprovalemplist()
    },
    // 获取审批员工列表
    getapprovalemplist () {
      let params = {
        page: this.page
      }
      this.$api.getapprovalemplist(params).then(res => {
        if (res.code === 0) {
          this.staffList = this.staffList.concat(res.data)
          // 加载状态结束
          this.page++
          this.loading = false
          this.isLoading = false
          // 数据全部加载完成
          if (this.staffList.length >= res.count) {
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
    }
  }
}
</script>
<style lang="less" scoped>
.Bindingapproval{
  box-sizing: border-box;
  background: #F6F5F5;
  width: 100%;
    .BindingapprovalContent{
      background:rgba(255,255,255,1);
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      padding: 10px;
      box-sizing: border-box;
      margin: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
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
              font-size:15px;
              font-weight:400;
              color:#434D5D;
              line-height:17px;
            }
            p:nth-child(2){
              font-size:13px;
              font-weight:400;
              color:#748095;
              line-height:14px;
            }
          }
        }
        .BindingapprovalContentRight{
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
}
.van-cell{
  padding: 0px!important;
  background-color: #F7F7F7!important;
}
.task-list{
  height: calc(100vh - 35px);
}
</style>
