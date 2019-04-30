<template>
  <div class="Parkingspace">
    <div class="ParkingspaceTit">
      <h3>联东集团 就在您身边</h3>
    </div>
    <div class="ParkingspaceCon">
      <van-cell-group>
        <van-field
          class="AreaClass"
          v-model="gardenPopupFunVal"
          readonly
          placeholder=""
          right-icon="contactArrows"
          left-icon="contactArea"
          @click="cityFun"
        />
        <!-- <van-field
          label="所在园区："
          placeholder="选择你所在的园区"
          v-if="phoneNumStyle"
          readonly
          v-model="inthepark"
          right-icon="contactArrows"
          :error-message="errorInthepark"
        /> -->
        <van-field
          label="所在园区："
          placeholder="选择你所在的园区"
          readonly
          v-model="inthepark"
          right-icon="contactArrows"
          :error-message="errorInthepark"
          @click="intheparkClick"
        />
        <van-field
          label="园区停车场："
          placeholder="选择你停车场"
          readonly
          v-model="parkparkinglot"
          right-icon="contactArrows"
          :error-message="errorParkparkinglot"
          @click="parkClick"
        />
        <!-- <van-field
          label="用户身份："
          v-if="phoneNumStyle"
          readonly
          placeholder=""
          v-model="useridentity"
          right-icon="contactArrows"
        /> -->
        <van-field
          label="用户身份："
          v-model="useridentity"
          readonly
          right-icon="contactArrows"
          :error-message="errorUseridentity"
          @focus="useridentityFocus"
        />
      </van-cell-group>
      <div class="Parkinglocation">
        <p>停车场位置：</p>
        <img :src="addressPicUrl" v-if="parkparkinglot" @click="mahnifyImgFun">
        <img :src="nosrc" v-else  @click="mahnifyImgFun">
      </div>
      <!-- 购买停车卡 -->
        <van-button size="large"  @click="parkingspaceClick">购买停车卡</van-button>

    </div>
    <ul class="annotationBox">
      <li>注：</li>
      <li>1、企业用户可享受长租卡折扣优惠</li>
      <li>2、首页-绑定企业模块可进行企业绑定 </li>
      <li>3、最终解释权归联东集团所有</li>
    </ul>
    <!-- 底部弹层 -->
    <van-popup v-model="cityPopup" position="bottom" :overlay="true">
      <van-picker
        show-toolbar
        title=""
        :columns="cityDate"
        @cancel="onCancelDelSite"
        @confirm="onConfirmSite"
      />
    </van-popup>
    <!-- 底部弹层 所在园区-->
    <van-popup v-model="intheparkStart" position="bottom" :overlay="true">
      <!-- 弹层 选择器 -->
      <van-picker
        show-toolbar
        title=""
        :columns="intheparkData"
        @cancel="onCancelDelInthepark"
        @confirm="onConfirmInthepark"
      />
    </van-popup>
    <!-- 底部弹层 园区停车场-->
    <van-popup v-model="parkStart" position="bottom" :overlay="true">
      <!-- 弹层 选择器 -->
      <van-picker
        show-toolbar
        title=""
        :columns="selectParkLotInfoList"
        @cancel="onCancelDelParkStart"
        @confirm="onConfirmParkStart"
      />
    </van-popup>
    <!-- 点击图片放大 -->
    <van-popup v-model="mahnifyImg" position="center" :overlay="true" class="mahnifyImgMB">
      <img :src="addressPicUrl" v-if="parkparkinglot" class="mahnifyImgClass">
      <img :src="nosrc" v-else class="mahnifyImgClass">
    </van-popup>
  </div>
</template>
<script>
export default {
  data () {
    return {
      PicUrlImg: 0,
      nosrc: require('@/assets/images/index/timg.png'),
      addressPicUrl: '',
      errorarea: '',
      cityPopup: false,
      gardenPopupState: false,
      intheparkStart: false,
      useableintheparkStart: true,
      parkStart: false,
      gardenPopupProStart: false,
      gardenPopupFunVal: '', // 选择区域
      areaModelEmitFunVal: '',
      inthepark: '', // 所在园区
      errorInthepark: '',
      parkparkinglot: '', // 园区停车场
      errorParkparkinglot: '',
      useridentity: '', // 用户身份
      errorUseridentity: '',
      // columns: [],
      cityDate: [],
      projectList: [],
      intheparkData: [],
      initIntheparkData: [],
      parkLotInfoList: [],
      selectParkLotInfoList: [],
      parkData: [],
      parkLotId: '',
      // phoneNumStyle: true,
      mahnifyImg: false,
      intheparkDataList: [],
      defaultIndex: Number
    }
  },
  mounted () {
    this.toLeaseCardPageProjectList()
    // if (!this.parkparkinglot) {
    //   this.$toast('所在园区没有停车场')
    //   this.PicUrlImg = 1
    // }
  },
  methods: {
    // 根据城市查询园区列表
    getProjectListByCity () {
      this.intheparkData = []
      this.inthepark = ''
      let params = {
        city: this.gardenPopupFunVal
      }
      this.$api.getProjectListByCity(params).then((res) => {
        if (res.code === 0) {
          this.intheparkDataList = res.data
          this.intheparkDataList.forEach((item, index) => {
            // console.log(res.data, '7777')
            this.intheparkData.push({id: item.projectId, text: item.projectName})
          })
        }
      })
    },
    // 跳转到车位长租页面获得项目列表
    toLeaseCardPageProjectList () {
      this.$api.toLeaseCardPageProjectList().then((res) => {
        if (res.code === 0) {
          this.projectList = res.data
          if (res.data.wxAccountInfo) {
            this.gardenPopupFunVal = res.data.wxAccountInfo.city + '市' ? res.data.wxAccountInfo.city + '市' : '北京市'

            this.projectList.cityInfo.forEach((item, index) => {
              this.cityDate.push(item.cityName)
            })
            this.getProjectListByCity()
          } else {
            this.projectList.cityInfo.forEach((item, index) => {
              this.gardenPopupFunVal = this.projectList.cityInfo[0].cityName
              console.log(this.gardenPopupFunVal, 'eee')
              this.cityDate.push(item.cityName)
            })
            this.getProjectListByCity()
          }
          // this.gardenPopupFunVal = res.data.wxAccountInfo.city ? res.data.wxAccountInfo.city : '北京'
          // this.inthepark = res.data.data[0].projectName
          // this.parkStart = false
          // this.phoneNumStyle = false
          if (res.data.wxAccountInfo.isEmployee === '1') {
            // this.getParkLotDetails(res.data.parkLotInfoList[0].id)
            this.useridentity = '企业员工'
            // this.useableintheparkStart = false
            // this.parkparkinglot = res.data.parkLotInfoList[0].parkLotName
            // this.parkLotInfoList = res.data.parkLotInfoList
            // res.data.parkLotInfoList.forEach(item => {
            //   this.selectParkLotInfoList.push(item.parkLotName)
            // })
          } else {
            this.useridentity = '游客'
            // this.useableintheparkStart = true
            // res.data.data.forEach((item) => {
            //   this.intheparkData.push(item.projectName)
            // })
            // this.initIntheparkData = res.data.data
            // this.getParkLotListByProjectId(res.data.data[0].projectId)
            // this.phoneNumStyle = false
          }
        }
      })
    },
    // 通过停车场id获取停车场详情
    getParkLotDetails (parkLotId) {
      this.parkLotId = parkLotId
      let params = {
        parkLotId
      }
      this.$api.getParkLotDetails(params).then((res) => {
        if (res.code === 0) {
          this.addressPicUrl = res.data.addressPicUrl
        }
      })
    },
    // 通过项目id获取停车场列表信息
    getParkLotListByProjectId (projectId) {
      let params = {
        projectId
      }
      this.$api.getParkLotListByProjectId(params).then((res) => {
        if (res.code === 0) {
          if (res.data.length) {
            this.parkparkinglot = res.data[0].parkLotName
            this.parkLotInfoList = res.data
            res.data.forEach(item => {
              this.selectParkLotInfoList.push(item.parkLotName)
            })
            this.getParkLotDetails(res.data[0].id)
          } else {
            this.parkparkinglot = ''
            this.parkLotInfoList = ''
            this.selectParkLotInfoList = []
          }
        }
      })
    },
    // 点击放大图片
    mahnifyImgFun () {
      this.mahnifyImg = true
    },
    // 地址
    cityFun () {
      this.cityPopup = true
      if (this.gardenPopupFunVal === '北京市') {
        // this.defaultIndex = 1
      }
    },
    // 所属园区显示弹层
    gardenClick () {
      this.gardenPopupProStart = true
    },
    intheparkClick () {
      if (!this.intheparkDataList) {
        this.$toast('没有园区')
        return
      }
      this.intheparkStart = true
      this.errorInthepark = ''
    },
    // 切换园区
    onConfirmInthepark (value, index) {
      console.log(index, '0000')
      this.inthepark = value.text
      this.getParkLotListByProjectId(this.intheparkData[index].id)
      console.log(this.intheparkData[index].id, '44444')
      this.intheparkStart = false
    },
    onCancelDelInthepark () {
      this.intheparkStart = false
    },
    parkClick () {
      if (!this.parkparkinglot) {
        this.$toast('所在园区没有停车场')
        this.PicUrlImg = 1
        return
      }
      this.parkStart = true
      this.errorParkparkinglot = ''
    },
    onConfirmParkStart (value, index) {
      this.parkparkinglot = this.parkLotInfoList[index].parkLotName
      this.parkStart = false
      this.getParkLotDetails(this.parkLotInfoList[index].id)
    },
    onCancelDelParkStart () {
      this.parkStart = false
    },
    useridentityFocus () {
      this.errorUseridentity = ''
    },
    // 地址
    onConfirmSite (value, index) {
      this.gardenPopupFunVal = value
      console.log(this.gardenPopupFunVal, '111')
      this.getProjectListByCity()
      // this.projectId = this.projectList[index].projectId
      this.cityPopup = false
    },
    onCancelDelSite () {
      this.cityPopup = false
    },
    // 购买停车卡
    parkingspaceClick () {
      if (!this.inthepark) {
        this.errorInthepark = '输入所在园区'
        return
      }
      if (!this.parkparkinglot) {
        this.errorParkparkinglot = '输入园区停车场位置'
        return
      }
      if (!this.useridentity) {
        this.errorUseridentity = '输入用户身份'
        return false
      }
      this.$router.replace({path: '/parkingspacelist', query: {id: this.parkLotId}})
    }

  }
}
</script>
<style  lang="less" scoped>
.Parkingspace{
    box-sizing: border-box;
    background: #F6F5F5;
    /* height: 100%; */
    width: 100%;
    /* position: absolute; */
    /* top: 0px; */
    /* bottom: 0px; */
    .ParkingspaceTit{
      background:url(../../assets/images/parking_img_top@2x.png) no-repeat;
      background-size: cover;
      height: 150px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      box-sizing: border-box;
      h3{
        font-size:24px;
        font-weight:500;
        color:rgba(255,255,255,1);
        line-height:34px;
      }
    }
    .ParkingspaceCon{
      background: #fff;
      margin: 0 10px;
      border-radius: 5px;
      padding: 10px 0;
      box-sizing: border-box;
      box-shadow: 0px 0px 5px 0px rgba(174, 179, 196, 0.5);
      margin-top: -47px;
        .Parkinglocation{
          display: flex;
            p{
              max-width: 90px;
              font-size: 15px;
              font-weight: 400;
              color: #748095;
              padding: 10px 3px 10px 15px;
            }
            img{
              width:105px;
              height: 105px;
              box-shadow: 0px 0px 1px 0px #e1d9d9;
              margin-top: 10px;
            }
        }
    }
    .annotationBox{
      font-size:13px;
      font-weight:400;
      color:rgba(116,128,149,1);
      line-height:19px;
      padding: 10px;
      box-sizing: border-box;
        li:nth-child(1){
          color: #F4403D;
        }
        li +li{
          padding-left: 20px;
        }
    }
    .mahnifyImgClass{
      width:100%;
      height: 100%;
    }
}
</style>
