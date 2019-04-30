<template>
  <div class="topUpMoney">
    <!-- <div class="moneyMask" v-if="rechargeState">
      <van-loading class="loading"/>
    </div> -->
    <!-- <myMealCardCom></myMealCardCom> -->
      <div class="topUpMoneyCen">
        <van-cell-group>
          <van-field
          class="gardenClass"
            v-model="garden"
            readonly
            placeholder="选择园区"
            :error-message="errorgarden"
            right-icon="contactArrows"
            @click="gardenClick"
          />
        </van-cell-group>
        <div class="myphone">
          <van-cell-group>
            <van-field
              clearable
              v-model="getPhoneNumber"
              label="手机号"
              placeholder="请输入办卡时所留手机号"
            />
          </van-cell-group>
        </div>
        <div class="moneyList">
          <div v-for="(item,index) in money" :key="index" :class="{ classred:index==current}" @click="addClass(index)" class="moneyListBox">
            <span v-show="!item.insert">{{item.type === 1 ? item.name : (getPhoneMoney ? getPhoneMoney : item.name)}}</span>
            <van-field
              v-show="item.type === 2 && item.insert"
              @blur="insertFun(index)"
              v-model="getPhoneMoney"
              placeholder=""
              type="number"
            />
          </div>
        </div>
        <!-- <router-link to="rechargesuccess" style="display: inherit;"> -->
          <van-button size="large" @click="submitPay">充值</van-button>
        <!-- </router-link> -->
      </div>
      <!-- 底部弹层 -->
      <van-popup v-model="gardenPopup" position="bottom" :overlay="true">
        <!-- 弹层 选择器 -->
        <van-picker
          show-toolbar
          title="所属园区"
          :columns="columns"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-popup>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      garden: '选择园区',
      errorgarden: '',
      gardenPopup: false,
      rechargeState: false,
      columns: [],
      phoneMoney: '186 1234 2345',
      current: 0,
      gardenId: '',
      getPhoneNumber: '',
      myMealCardBoxData: {},
      getPhoneMoney: '',
      orderInfo: {},
      getInputPhoneMoney: '20',
      money: [
        {name: '20', type: 1},
        {name: '30', type: 1},
        {name: '50', type: 1},
        {name: '100', type: 1},
        {name: '200', type: 1},
        {name: '其他金额', type: 2, insert: false}
      ]
    }
  },
  watch: {
    getPhoneMoney (val) {
      this.getInputPhoneMoney = val
    }
  },
  mounted () {
    this.getEmpUserInfo()
  },
  methods: {
    getEmpUserInfo () {
      this.$api.getEmpUserInfo().then(res => {
        if (res.code === 0 && res.data) {
          this.myMealCardBoxData = res.data
          this.getPhoneNumber = this.myMealCardBoxData.empInfoVo.empTel
          this.garden = this.myMealCardBoxData.empInfoVo.projectName
          this.gardenId = this.myMealCardBoxData.empInfoVo.projectId
          console.log('11122', this.myMealCardBoxData)
        }
      })
    },
    callPay (data) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (document.addEventListener) {
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady(data), false)
        } else if (document.attachEvent) {
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady(data))
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady(data))
        }
      } else {
        this.onBridgeReady(data)
      }
    },
    onBridgeReady (data) {
      // this.rechargeState = false
      let _this = this
      let orderNo = data.orderNo
      WeixinJSBridge.invoke(   // eslint-disable-line
        'getBrandWCPayRequest', {
          'appId': 'wxfb4f706bc9b0ea1f', // 公众号名称，由商户传入
          'timeStamp': data.data.timeStamp, // 时间戳，自1970年以来的秒数
          'nonceStr': data.data.nonceStr, // 随机串
          'package': data.data.package,
          'signType': data.data.signType, // 微信签名方式：
          'paySign': data.data.paySign // 微信签名
        },
        function (res) {
          if (res.err_msg === 'get_brand_wcpay_request:ok') {
            let params = {
              orderNo: orderNo
            }
            _this.$api.getOrderDetailByOrderNo(params).then(res => {
              if (res.code === 0) {
                _this.$router.push({path: '/rechargesuccess', query: {orderInfo: res.data}})
              }
            })
            // this.router.push({path: '/rechargesuccess', query: {orderInfo: this.orderInfo}})
            // 使用以上方式判断前端返回,微信团队郑重提示：
            // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
          }
        })
      // }
    },
    // 餐卡充值
    doRecharge () {
      let params = {
        phoneNo: this.getPhoneNumber,
        // projectId: '3346753',
        projectId: this.gardenId,
        rechargeAmount: this.getInputPhoneMoney
      }
      if (!params.projectId) {
        this.$toast('请选择园区')
      } else if (!params.phoneNo) {
        this.$toast('手机号不能为空')
      } else if (!(/^1[34578]\d{9}$/.test(params.phoneNo))) {
        this.$toast('请输入正确的手机号')
      } else if (params.rechargeAmount >= 0.01) {
        // this.rechargeState = true
        this.$api.doRecharge(params).then(res => {
          if (res.code === 0) {
            // this.rechargeState = true
            this.callPay(res)
          } else {
            this.$toast(res.msg)
            // this.rechargeState = false
          }
        })
      } else {
        this.$toast('最少支持0.01元')
      }
    },
    addClass (index) {
      this.current = index
      if (this.money[index].type === 2) {
        this.money[index].insert = true
        this.getInputPhoneMoney = this.money[this.money.length - 1].name
      } else {
        this.getInputPhoneMoney = this.money[index].name
      }
    },
    insertFun (index) {
      this.money[index].insert = false
      this.money[index].name = this.getPhoneMoney
    },
    // columns数组对象赋值
    exChangeColumns () {
      this.myMealCardBoxData.projectList.forEach((item, index) => {
        item.text = item.projectName
        item.keyId = item.projectId
      })
      this.columns = this.myMealCardBoxData.projectList
    },
    // 所属园区显示弹层
    gardenClick () {
      this.gardenPopup = true
      this.exChangeColumns()
    },
    // 充值
    submitPay () {
      this.doRecharge()
    },
    onCancel () {
      this.gardenPopup = false
    },
    // 弹层 选择器
    onConfirm (value, index) {
      this.gardenPopup = false
      this.garden = value.text
      this.gardenId = value.keyId
    }
  }
}
</script>

<style lang="less" scoped>
.topUpMoney {
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  .moneyMask{
    position:absolute;
    width:100%;
    height:100%;
    background:#000;
    opacity: 0.5;
    z-index:100000;
    .loading{
      position:absolute;
      left:50%;
      margin-left:-30px;
      top:50%;
      margin-top:-30px
    }
  }
  .topUpMoneyCen{
    background: #fff;
    margin:10px;
    border-radius: 5px;
    box-sizing: border-box;
    padding: 10px 0;
    display: flex;
    // align-items: center;
    flex-direction: column;
    box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
    position: absolute;
    width: 95%;
    .myphone{
      width: 95%;
    }
    .moneyList{
      width:100%;
      display: flex;
      flex-wrap: wrap;
        .moneyListBox{
          width: 23.333333%;
          min-height: 14px;
          border-radius: 5px;
          border: 1px solid #f3cecd;
          padding: 10px;
          display: inline-block;
          margin: 6px;
          text-align: center;
          font-size: 15px;
          font-weight: 400;
          color: rgba(116,128,149,1);
        }
        .classred{
          color: #F4403D;
          background:rgba(243,206,205,1);
        }
    }
  }
}
</style>
