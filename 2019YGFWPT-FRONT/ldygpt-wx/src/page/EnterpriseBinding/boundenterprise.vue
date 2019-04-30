<template>
  <div class="bindingPhone">
    <div class="bindingTab">
      <div class="bindingTit">
        <p>1 绑定手机号</p>
        <p>2 完善信息</p>
      </div>
      <!-- <van-tabs v-model="active"> -->
        <!-- 绑定手机号 -->
        <!-- <van-tab title="1 绑定手机号"> -->
          <van-cell-group v-if="phoneNumState">
            <van-field
              v-model="phoneNum"
              center
              clearable
              left-icon="contactImg"
              label="手机号："
              placeholder="请输入手机号"
              :error-message='errorPhone'
              @focus="phoneFocus"
            >
              <van-button slot="button" size="small" type="primary" @click="getCode" v-if="isClickPhoneState">获取验证码{{count === -1?'':count}}</van-button>
              <van-button slot="button" size="small" type="primary" v-else disabled>获取验证码{{count === -1?'':count}}</van-button>
            </van-field>
            <van-field
              v-model="codePhone"
              label="验证码："
              left-icon="codeImg"
              placeholder="请输入验证码"
              :error-message='errorCode'
              @focus="codeFocus"
            />
          </van-cell-group>
          <van-cell-group v-else>
            <van-field
              disabled
              v-model="phoneNum"
              center
              clearable
              left-icon="contactImg"
              label="手机号："
              placeholder="请输入手机号"
              :error-message='errorPhone'
              @focus="phoneFocus"
            >
            </van-field>
          </van-cell-group>
          <!-- 下一步 -->
          <van-button size="large" @click="nextStep">下一步</van-button>
    </div>
  </div>
</template>
<script>
export default {
  components: {
  },
  data () {
    return {
      active: 0,
      codePhone: '',
      phoneNum: '',
      phoneBindingState: true,
      phoneNumState: true,
      isClickPhoneState: true,
      verificationPhoneState: true,
      errorPhone: '',
      errorCode: '',
      count: -1,
      timer: null,
      outhSend: ''
    }
  },
  mounted () {
    this.getcurrentphone()
  },
  methods: {
    // 获取当前手机号
    getcurrentphone () {
      this.$api.getcurrentphone().then(res => {
        if (res.code === 0) {
          this.phoneNum = res.data
          if (this.phoneNum) {
            this.phoneNumState = false
            this.$toast('您已绑定过餐卡')
          }
        }
      })
    },
    // 查询改手机号是否被别的用户使用过
    checkphonehasbinding () {
      let param = {
        phone: this.phoneNum
      }
      this.$api.checkphonehasbinding(param).then(res => {
        if (res.code === 0) {
          let params = {
            phone: this.phoneNum
          }
          this.isClickPhoneState = false
          const TIME_COUNT = 60
          if (!this.timer) {
            this.count = TIME_COUNT
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.count = ''
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
          this.$api.getphoneverificationcode(params).then(res => {
            if (res.code === 0) {
              this.outhSend = res.data
            }
          })
        } else {
          this.$toast('此手机已被绑定')
          // this.phoneBindingState = false
        }
      })
    },
    // 发送手机号及验证码进行校验接口
    verificationPhone () {
      let params = {
        phone: this.phoneNum,
        verificationCode: this.codePhone
      }
      this.$api.verificationPhone(params).then(res => {
        if (res.code === 0) {
          this.$router.push({path: '/information', query: {phone: this.phoneNum}})
        } else {
          this.$toast('验证码错误')
        }
      })
    },
    // 获取验证码
    getCode () {
      if (!this.phoneNum) {
        this.errorPhone = '手机号不能为空'
      } else if (!(/^1[34578]\d{9}$/.test(this.phoneNum))) {
        this.errorPhone = '请输入正确的手机号'
      } else if (this.phoneBindingState) {
        this.checkphonehasbinding()
      }
    },
    // 获取input焦点时
    phoneFocus () {
      this.errorPhone = ''
    },
    codeFocus () {
      this.errorCode = ''
    },
    // 下一步
    nextStep () {
      if (!this.phoneNum) {
        this.errorPhone = '手机号不能为空'
        return false
      } if (!this.phoneNumState) {
        this.$router.push({path: '/information', query: {phone: this.phoneNum}})
      } else if (!(/^1[34578]\d{9}$/.test(this.phoneNum))) {
        this.errorPhone = '请输入正确的手机号'
        return false
      } else if (!this.codePhone) {
        this.errorCode = '验证码不能为空'
        return false
      } else {
        this.verificationPhone()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bindingPhone{
  padding: 10px;
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    .bindingTab{
      background: #fff;
      box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
      border-radius:5px;
      padding-bottom: 1px;
        .bindingTit{
          display: flex;
          -ms-flex-pack: distribute;
          -ms-flex-align: center;
          align-items: center;
          font-size: 13px;
           & p:nth-child(1){
            color: #F4403D;
            background: #fff;
            flex: 1;
            line-height: 40px;
            height: 40px;
            text-align: center;
            border-top-left-radius: 5px;
           }
           & p:nth-child(2){
              color: #748095;
              background-color: #F6F5F5;
              background-size: cover;
              flex: 1;
              height: 40px;
              line-height: 40px;
              height: 40px;
              text-align: center;
              border-bottom-left-radius: 24px;
              border-top-right-radius: 5px;
           }
        }
    }
}
</style>
