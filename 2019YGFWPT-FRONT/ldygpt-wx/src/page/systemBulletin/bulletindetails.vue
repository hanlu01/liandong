<template>
  <div class="bulletinDetails">
    <div  v-if="getDetailData.lookScope === 0">
      <h4>{{getDetailData.announcementTitle}}</h4>
      <div class="bulletinDetailsTit">
        <p>{{getDetailData.projectName}}</p>
        <p>{{createDate}}</p>
      </div>
      <div class="bulletinDetailsContent">
        {{getDetailData.announcementText}}
      </div>
    </div>
    <div  v-if="getDetailData.lookScope === 1">
      <h4>{{getDetailData.announcementTitle}}</h4>
      <div class="bulletinDetailsTit">
        <p>{{getDetailData.projectName}}</p>
        <p>{{createDate}}</p>
      </div>
      <div class="bulletinDetailsContent">
        {{getDetailData.announcementText}}
      </div>
    </div>
    <div  v-if="getDetailData.lookScope === 2">
      <h4>{{getDetailData.announcementTitle}}</h4>
      <div class="bulletinDetailsTit">
        <p>{{getDetailData.projectName}}</p>
        <p>{{createDate}}</p>
      </div>
      <div class="bulletinDetailsContent">
        {{getDetailData.announcementText}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      getDetailData: {},
      createDate: ''
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    // 获取公告详情
    getDetail () {
      let params = {
        id: this.$route.query.id
      }
      this.$api.getDetail(params).then(res => {
        if (res.code === 0) {
          this.getDetailData = res.data
          this.createDate = this.getDetailData.createDate.substring(0, 16)
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.bulletinDetails{
  padding:15px;
  box-sizing: border-box;
  background:rgba(255,255,255,1);
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    h4{
      font-size:24px;
      font-weight:600;
      color:rgba(67,77,93,1);
      line-height:30px;
    }
    .bulletinDetailsTit{
      font-size: 13px;
      color:#748095;
      padding-top: 12px;
      display: flex;
      position: relative;
      left: 12px;
        p:nth-child(1)::before{
          content:'';
          width: 12px;
          height: 14px;
          background: url(../../assets/images/index/icon_map@2x.png) no-repeat;
          background-size: cover;
          position: absolute;
          top: 1px;
          left: -15px;
        }
        p:nth-child(2){
          padding-left: 27px;
        }
        p{
          position: relative;
        }
        p:nth-child(2)::before{
          content:'';
          width: 14px;
          height: 14px;
          background: url(../../assets/images/index/icon_date@2x.png) no-repeat;
          background-size: cover;
          position: absolute;
          top: -1px;
          left: 11px;
        }
    }
    .bulletinDetailsContent{
      font-size:15px;
      font-weight:400;
      color:rgba(116,128,149,1);
      line-height:27px;
      width: 100%;
      padding-top: 23px;
      text-indent: 34px;
    }
}
</style>
