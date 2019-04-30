<template>
  <div class="Parkingcarddetails">
    <div class="ParkingcarddetailsImg">
      <div class="titImgBox">
        <img src="@/assets/images/parking_card_01@2x.png" class="card-bg-1" alt="">
        <img  v-if="VehicletopupArr.length>1" src="@/assets/images/parking_card_01@2x.png" class="card-bg-2" alt="">
        <img v-if="VehicletopupArr.length>2"  src="@/assets/images/parking_card_01@2x.png" class="card-bg-3" alt="">
      </div>
      <div class="messageBox">
        <h4>{{getLeaseCardDetailByIdData.leaseCardName}}
          <span v-if="getLeaseCardDetailByIdData.leaseCardType === 0">周卡</span>
          <span v-if="getLeaseCardDetailByIdData.leaseCardType === 1">月卡</span>
          <span v-if="getLeaseCardDetailByIdData.leaseCardType === 2">俩月</span>
          <span v-if="getLeaseCardDetailByIdData.leaseCardType === 3">季度</span>
          <span v-if="getLeaseCardDetailByIdData.leaseCardType === 4">半年</span>
          <span v-if="getLeaseCardDetailByIdData.leaseCardType === 5">全年</span>
          <span v-if="getLeaseCardDetailByIdData.leaseCardType === 6">永久</span>
           </h4>
        <p>￥
          <span>{{getLeaseCardDetailByIdData.disCountCardPrice}}</span>
          <span v-if="getLeaseCardDetailByIdData.disCountCardPrice === null">{{getLeaseCardDetailByIdData.leaseCardPrice}}</span>
          <del v-if="getLeaseCardDetailByIdData.leaseCardPrice"><span style="font-size: 12px;">￥{{getLeaseCardDetailByIdData.leaseCardPrice}}</span></del>
        </p>
        <div class="buyNumber">
          <p>购买数量：<span>{{VehicletopupArr.length}}张</span></p>
          <p>总价：<span>{{$route.query.leaseCardPrice * VehicletopupArr.length ? $route.query.leaseCardPrice * VehicletopupArr.length : $route.query.leaseCardPrice}}元</span></p>
        </div>
      </div>
    </div>
    <!-- 车辆 -->
    <div>
      <div class="Vehicletopup" v-for="(item,index) in VehicletopupArr" :key="index">
        <h4><img :src='item.src' @click="licenseplateIcon(index)">车辆信息</h4>
        <van-cell-group>
          <van-field
            v-model="item.licenseplatenumber"
            center
            clearable
            label="车 牌 号："
            placeholder="请输入车牌号"
            :error-message="item.errorLicenseplate"
            @focus="licenseplateFun(index)"
            @blur="affirmFun(index)"
          >
          <!-- <van-button slot="button" size="small" type="primary" @click="affirmFun(index)">确定</van-button> -->
          </van-field>
          <van-field
            v-model="phone"
            v-if="item.numberPlateState"
            class="phoneClass"
            label="联系电话："
            readonly
            placeholder="请输入联系电话"
            :error-message="item.errorphone"
          />
          <van-field
            v-model="item.phone"
            v-else
            label="联系电话："
            placeholder="请输入联系电话"
            :error-message="item.errorphone"
            @focus="phoneBlur(index)"
          />
          <van-field
            v-model="item.myName"
            label="姓名："
            placeholder="请输入姓名"
            :error-message="item.errorName"
            @focus="errorNameBlur(index)"
          />
          <div class="dataTimeBox">
            <van-field
              v-model="item.dataTime"
              label="有效日期："
              placeholder="开始时间"
              readonly
              left-icon="dataTimeIcon"
              :error-message="item.errordataTime"
              @click="dataTimeFun"
              @blur="dataTimeBlue(index)"
            />
            <van-field
              v-model="item.dataTimeEnd"
              label="至"
              readonly
              placeholder="结束时间"
              :error-message="item.errordataTimeEnd"
            />
          </div>
        </van-cell-group>
      </div>
    </div>
    <div class="btnvehicle" v-if="this.VehicletopupArr.length < 3">
     <van-button slot="button" size="small" type="primary" @click="confirmVehicle">添加车辆</van-button>
    </div>
    <van-button size="large" @click="submitCar">提交</van-button>
    <!-- 底部蒙层 时间选择-->
    <van-popup v-model="dataTimeModel" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        @confirm="Onconfirm"
        @cancel="Onconcancel"
      />
    </van-popup>
    <!-- 底部蒙层 时间选择-->
    <van-popup v-model="dataTimeModelEnd" position="bottom" :overlay="true">
      <van-datetime-picker
        v-model="currentDateEnd"
        type="date"
        @cancel="OnconcancelEnd"
      />
    </van-popup>
    <!-- 提示框 -->
    <!-- <van-popup v-model="PromptedToPurchase" position="center" :overlay="true">
      sfasfsdfds
    </van-popup> -->
     <div v-html="formHtml"></div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      licenseplatenumber: '',
      errorLicenseplate: '',
      phone: '',
      errorphone: '',
      errordataTimeEnd: '',
      dataTime: '',
      errordataTime: '',
      myName: '',
      errorName: '',
      dataTimeEnd: '',
      changeCard: '',
      dataTimeModel: false,
      currentDate: new Date(),
      dataTimeModelEnd: false,
      currentDateEnd: new Date(),
      numberPlateState: true,
      formHtml: '',
      begTimeStart: '',
      NewData: '',
      VehicletopupArr: [{
        src: require('@/assets/images/parking_icon_car@2x.png'),
        licenseplatenumber: '',
        phone: '',
        myName: '',
        dataTime: '',
        dataTimeEnd: '',
        errorLicenseplate: '',
        errordataTimeEnd: '',
        numberPlateState: true
      }],
      VehicletopuporderInfo: [],
      getLeaseCardDetailByIdData: {}

    }
  },
  mounted () {
    this.getLeaseCardDetailById()
  },
  methods: {
    // 转变卡片类型
    changeCardStyle () {
      if (this.$route.query.leaseCardType === 0) {
        this.changeCard = '周卡'
      } else if (this.$route.query.leaseCardType === 1) {
        this.changeCard = '月卡'
      } else if (this.$route.query.leaseCardType === 2) {
        this.changeCard = '俩月'
      } else if (this.$route.query.leaseCardType === 3) {
        this.changeCard = '季度'
      } else if (this.$route.query.leaseCardType === 4) {
        this.changeCard = '半年'
      } else if (this.$route.query.leaseCardType === 5) {
        this.changeCard = '全年'
      } else if (this.$route.query.leaseCardType === 6) {
        this.changeCard = '永久'
      }
    },

    dataTimeFun () {
      this.dataTimeModel = true
    },
    Onconfirm (value) {
      let middleDate = moment(value).format('YYYY-MM-DD')
      this.VehicletopupArr[this.VehicletopupArr.length - 1].dataTime = middleDate
      // this.VehicletopupArr.forEach((item, index) => {
      //   this.VehicletopupArr[index].dataTime = middleDate
      //   console.log(this.VehicletopupArr, index, 'kkkkkkkkkkkk')
      // })
      this.dataTimeModel = false
      // 根据开始时间计算截止时间
      this.$api.getEndTimeByBegTime({leaseCardType: this.$route.query.leaseCardType, begTime: middleDate}).then(res => {
        if (res.code === 0) {
          this.VehicletopupArr[this.VehicletopupArr.length - 1].dataTimeEnd = res.data.slice(0, 10)
        }
      })
    },
    // 根据id获取长租卡详情
    getLeaseCardDetailById () {
      this.$api.getLeaseCardDetailById({leaseCardId: this.$route.query.id}).then(res => {
        if (res.code === 0) {
          this.getLeaseCardDetailByIdData = res.data
        }
      })
    },
    Onconcancel () {
      this.dataTimeModel = false
    },
    dataTimeEndFun () {
      this.dataTimeModelEnd = true
    },
    // OnconfirmEnd (value) {
    //   let middleDate = moment(value).format('YYYY-MM-DD')
    //   this.VehicletopupArr[this.VehicletopupArr.length - 1].dataTimeEnd = middleDate
    //   this.dataTimeModelEnd = false
    // },
    OnconcancelEnd () {
      this.dataTimeModelEnd = false
    },
    licenseplateFun (index) {
      this.VehicletopupArr[index].errorLicenseplate = ''
    },
    phoneBlur (index) {
      this.$set(this.VehicletopupArr[index], 'errorphone', '')
    },
    dataTimeBlue (index) {
      this.$set(this.VehicletopupArr[index], 'errordataTime', '')
    },
    errorNameBlur (index) {
      this.$set(this.VehicletopupArr[index], 'errorName', '')
    },
    // 确认
    affirmFun (index) {
      // this.VehicletopupArr.forEach((item, ind) => {
      //   if (this.VehicletopupArr[ind].licenseplatenumber === item.licenseplatenumber && index !== ind) {
      //     // this.VehicletopupArr[index].errorLicenseplate = '车牌号不能重复'
      //     this.$toast('车牌号不能重复')
      //     return false
      //   }
      // })
      for (let ind = 0; ind < this.VehicletopupArr.length; ind++) {
        if (this.VehicletopupArr[ind].licenseplatenumber === this.VehicletopupArr[index].licenseplatenumber && index !== ind) {
          // this.VehicletopupArr[index].errorLicenseplate = '车牌号不能重复'
          this.$toast('车牌号不能重复')
          return false
        }
      }
      if (!this.VehicletopupArr[index].licenseplatenumber) {
        this.VehicletopupArr[index].errorLicenseplate = '车牌号不能为空'
      } else if (!(/^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/).test(this.VehicletopupArr[index].licenseplatenumber)) {
        this.VehicletopupArr[index].errorLicenseplate = '请输入正确车牌号'
        return false
      } else if (this.VehicletopupArr[index].licenseplatenumber) {
        this.VehicletopupArr[index].numberPlateState = false
        this.VehicletopupArr[index].errorLicenseplate = ''
        // 校验输入车牌是否有购买相同的长租卡
        let params = {
          leaseCardId: this.$route.query.id,
          carNumber: this.VehicletopupArr[index].licenseplatenumber
        }
        this.$api.checkCarNumberAndCardType(params).then(res => {
          this.begTimeStart = res.data
          console.log(this.begTimeStart, 222222222222)
          // this.VehicletopupArr[index].dataTime = res.data

          // 根据开始时间计算截止时间
          this.Onconfirm(res.data)
        })
      }
    },
    // 添加车辆信息
    confirmVehicle () {
      if (!this.VehicletopupArr[this.VehicletopupArr.length - 1].licenseplatenumber) {
        this.VehicletopupArr[this.VehicletopupArr.length - 1].errorLicenseplate = '车牌号不能为空'
        return false
      }
      if (!(/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/).test(this.VehicletopupArr[this.VehicletopupArr.length - 1].licenseplatenumber)) {
        this.VehicletopupArr[this.VehicletopupArr.length - 1].errorLicenseplate = '请输入正确车牌号'
        return false
      }
      if (this.VehicletopupArr[this.VehicletopupArr.length - 1].licenseplatenumber) {
        this.VehicletopupArr[this.VehicletopupArr.length - 1].numberPlateState = false
        this.VehicletopupArr[this.VehicletopupArr.length - 1].errorLicenseplate = ''
      }
      if (!this.VehicletopupArr[this.VehicletopupArr.length - 1].phone) {
        // this.VehicletopupArr[this.VehicletopupArr.length - 1].errorphone = '手机号不能为空'
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '手机号不能为空')
        return false
      } else {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '')
      }
      if (!(/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(this.VehicletopupArr[this.VehicletopupArr.length - 1].phone))) {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '请输入正确手机号')
        return false
      } else {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '')
      }
      if (!this.VehicletopupArr[this.VehicletopupArr.length - 1].myName) {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorName', '请输入姓名')
        return
      }
      for (let index = 0; index < this.VehicletopupArr.length; index++) {
        if (!this.VehicletopupArr[index].dataTime) {
          this.$set(this.VehicletopupArr[index], 'errordataTime', '日期不能为空')
          return false
        } else {
          this.$set(this.VehicletopupArr[index], 'errordataTime', '')
        }
      }

      if (this.VehicletopupArr.length < 3) {
        this.VehicletopupArr.push({
          src: require('@/assets/images/parking_icon_del@2x.png'),
          licenseplatenumber: '',
          phone: '',
          myName: '',
          dataTime: '',
          dataTimeEnd: '',
          errorLicenseplate: '',
          errorphone: '',
          errordataTime: '',
          errordataTimeEnd: '',
          numberPlateState: true
        })
        // splice(index,1)
        // console.log(this.VehicletopupArr[index].licenseplatenumber)
      }
    },
    // 删除车辆信息
    licenseplateIcon (index) {
      this.VehicletopupArr.splice(index, 1)
    },
    cardFun () {

    },
    // 提交
    submitCar () {
      for (let ind = 0; ind < this.VehicletopupArr.length; ind++) {
        for (let index = 0; index < this.VehicletopupArr.length; index++) {
          if (this.VehicletopupArr[ind].licenseplatenumber === this.VehicletopupArr[index].licenseplatenumber && index !== ind) {
          // this.VehicletopupArr[index].errorLicenseplate = '车牌号不能重复'
            this.$toast('车牌号不能重复')
            return
          }
        }
      }
      if (!this.VehicletopupArr[this.VehicletopupArr.length - 1].licenseplatenumber) {
        this.VehicletopupArr[this.VehicletopupArr.length - 1].errorLicenseplate = '车牌号不能为空'
        return false
      }
      if (!(/(^[\u4E00-\u9FA5]{1}[A-Z0-9]{6}$)|(^[A-Z]{2}[A-Z0-9]{2}[A-Z0-9\u4E00-\u9FA5]{1}[A-Z0-9]{4}$)|(^[\u4E00-\u9FA5]{1}[A-Z0-9]{5}[挂学警军港澳]{1}$)|(^[A-Z]{2}[0-9]{5}$)|(^(08|38){1}[A-Z0-9]{4}[A-Z0-9挂学警军港澳]{1}$)/).test(this.VehicletopupArr[this.VehicletopupArr.length - 1].licenseplatenumber)) {
        this.VehicletopupArr[this.VehicletopupArr.length - 1].errorLicenseplate = '请输入正确车牌号'
        return false
      }
      if (this.VehicletopupArr[this.VehicletopupArr.length - 1].licenseplatenumber) {
        this.VehicletopupArr[this.VehicletopupArr.length - 1].numberPlateState = false
        this.VehicletopupArr[this.VehicletopupArr.length - 1].errorLicenseplate = ''
      }
      if (!this.VehicletopupArr[this.VehicletopupArr.length - 1].phone) {
        // this.VehicletopupArr[this.VehicletopupArr.length - 1].errorphone = '手机号不能为空'
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '手机号不能为空')
        return false
      } else {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '')
      }
      if (!(/^(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(this.VehicletopupArr[this.VehicletopupArr.length - 1].phone))) {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '请输入正确手机号')
        return false
      } else {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorphone', '')
      }
      if (!this.VehicletopupArr[this.VehicletopupArr.length - 1].myName) {
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errorName', '请输入姓名')
        return
      }
      if (!this.VehicletopupArr[this.VehicletopupArr.length - 1].dataTime) {
        // this.VehicletopupArr[this.VehicletopupArr.length - 1].errordataTime = '日期不能为空'
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errordataTime', '日期不能为空')
        return false
      } else {
        // this.VehicletopupArr[this.VehicletopupArr.length - 1].errordataTime = ''
        this.$set(this.VehicletopupArr[this.VehicletopupArr.length - 1], 'errordataTime', '')
      }

      let orderInfo = ''
      let licenseplate = []
      for (let index = 0; index < this.VehicletopupArr.length; index++) {
        orderInfo += `${this.VehicletopupArr[index].licenseplatenumber}|${this.VehicletopupArr[index].myName}|${this.VehicletopupArr[index].phone}|${this.VehicletopupArr[index].dataTime}|${this.VehicletopupArr[index].dataTimeEnd},`
        licenseplate.push(this.VehicletopupArr[index].licenseplatenumber)
      }
      // 转变卡片类型
      this.changeCardStyle()
      this.$dialog.confirm({
        title: '提示',
        overlay: true,
        message: `您确定要为<span>${licenseplate.join('、')}</span>购买<span>${this.$route.query.leaseCardName} ${this.changeCard}</span>吗？`
      }).then(() => {
        // on confirm
        // 长租卡购买
        this.$api.buyLeaseCard({leaseCardId: this.$route.query.id, orderInfo, disCountPrice: this.getLeaseCardDetailByIdData.disCountCardPrice}).then(res => {
          if (res.code === 0) {
            // 调用银联页面
            let params = {
              orderNo: res.data.orderNo
            }
            this.$api.encapsulBuyLeaseCardparams(params).then(res => {
              if (res.code === 0) {
                let params = res.data.param
                let paramForm = ''
                this.formHtml = ''
                Object.keys(params).forEach(function (key) {
                  // console.log(key, params[key])
                  paramForm += `<input type="hidden" name="${key}" id="bizType" value="${params[key]}"/>`
                })
                this.formHtml = '<form id = "pay_form" action="' + res.data.url + '" method="post">' + paramForm + '</form>'
                setTimeout(() => {
                  document.all.pay_form.submit()
                }, 0)
              }
            })
          }
        })
      }).catch(() => {
        // on cancel
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Parkingcarddetails{
  box-sizing: border-box;
  background: #fff;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    .ParkingcarddetailsImg{
      background: url(../../assets/images/parking_bg_top@2x.png) no-repeat;
      background-size: cover;
      background-position: 50%;
      height: 24%;
      padding: 0 10px;
      width:100%;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      position: relative;
        .titImgBox{
          display: flex;
          justify-content: center;
            img{
              bottom: 5%;
              position: absolute;
              width:95%;
              left: 9px;
            }
            .card-bg-2{
              width: 90%;
              bottom: 18%;
              left: 18px;
            }
            .card-bg-3{
              bottom: 11%;
              width: 93%;
              left:13px;
            }
        }
        .messageBox{
          position: absolute;
          bottom: 15%;
          left: 28px;
          z-index: 999;
          width: 85%;
            h4{
              font-size:15px;
              font-weight:600;
              color:rgba(228,178,144,1);
              line-height:21px;
              padding-left: 23px;
              box-sizing: border-box;
              position: relative;
            }
            h4::before{
              content: '';
              background: url(../../assets/images/parking_icon_card@2x.png) no-repeat;
              background-size: cover;
              position: absolute;
              left: 1px;
              width: 19px;
              height: 19px;
            }
            p{
              text-align: center;
              font-size:15px;
              font-weight:400;
              color:rgba(228,178,144,1);
              line-height:21px;
                span{
                  font-size:40px;
                  font-weight:600;
                  line-height:52px;
                }
            }
            .buyNumber{
              display: flex;
              justify-content: center;
                p,span{
                  font-size:10px;
                  font-weight:400;
                  color:#E4B290;
                  line-height:14px;
                }
                p{
                  margin-left: 14px;
                }

            }
        }
    }
    .Vehicletopup{
      padding:10px 10px;
      box-sizing: border-box;
        h4{
          font-size:15px;
          font-weight:600;
          color:rgba(67,77,93,1);
          line-height:21px;
            img{
              width: 15px;
              height: 16px;
              padding-right: 5px;
            }
            // &:nth-child(2){
            //   width: 24px;
            //   height: 24px;
            // }
        }
        .dataTimeBox{
          display:flex;
          padding-left: 15px;
            .van-cell {
              .van-field__label{
                max-width: 16px;
              }
            }

        }
    }
}
</style>
