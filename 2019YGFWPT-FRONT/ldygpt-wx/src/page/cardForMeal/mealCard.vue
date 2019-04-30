<template>
  <div class="mealCard">
    <div class="bindingTab">
        <!-- 绑定手机号 -->
          <van-cell-group>
            <van-field
              v-model="mealCardModel"
              v-if="phoneNumStyle"
              readonly
              label="所属园区："
              placeholder=""
              left-icon="mealCardIcon"
              right-icon="contactArrows"
            />
            <van-field
              v-model="mealCardModel"
              label="所属园区："
              readonly
              v-else
              placeholder=""
              left-icon="mealCardIcon"
              right-icon="contactArrows"
              :error-message="this.errorMealCardModel"
              @click="gardenClick"
            />
            <van-field
              v-model="phoneNum"
              v-if="phoneNumStyle"
              readonly
              center
              clearable
              left-icon="contactImg"
              label="手机号："
              placeholder="请输入手机号"
              :error-message='this.errorPhone'
              @focus="phoneFocus"
            >
              <van-button v-if="isShowCode" slot="button" :disabled="disabled" size="small" type="primary" @click="getCode">获取验证码{{count === -1?'':count}}</van-button>
              <!-- <van-button slot="button" size="small" type="primary" v-else>{{count}}s</van-button> -->
            </van-field>
            <van-field
              v-model="phoneNum"
              v-else
              center
              clearable
              left-icon="contactImg"
              label="手机号："
              placeholder="请输入手机号"
              :error-message='this.errorPhone'
              @focus="phoneFocus"
            >
              <!-- <van-button v-if="count < 0" slot="button" size="small" type="primary" @click="getCode">获取验证码</van-button>
              <van-button slot="button" disabled size="small" type="primary" v-else>倒计时{{count}}s</van-button> -->
              <van-button v-if="isShowCode" :disabled="disabled" slot="button" size="small" type="primary" @click="getCode">获取验证码{{count === -1?'':count}}</van-button>
              <!-- <van-button slot="button" size="small" type="primary" v-else>{{count}}s</van-button> -->
            </van-field>
            <van-field
              v-if="isShowCode"
              v-model="codePhone"
              label="验证码："
              left-icon="codeImg"
              placeholder="请输入验证码"
              :error-message='this.errorCode'
              @focus="codeFocus"
            />
            <van-field
              v-model="nameModel"
              v-if="phoneNumStyle"
              readonly
              label="姓 名："
              placeholder="请输入姓名"
              left-icon="contact3"
              :error-message="this.errornameModel"
              @focus="nameFocus"
            />
            <van-field
              v-model="nameModel"
              v-else
              label="姓 名："
              placeholder="请输入姓名"
              left-icon="contact3"
              :error-message="this.errornameModel"
              @focus="nameFocus"
            />
          </van-cell-group>
          <!-- 提交 -->
          <van-button size="large" @click="nextStep" >提交</van-button>
          <!-- <van-button size="large" disabled v-else>提交</van-button> -->
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
      errorPhone: '',
      errorCode: '',
      count: -1,
      timer: null,
      outhSend: '',
      mealCardModel: '',
      errorMealCardModel: '',
      gardenPopup: false, // 所属园区弹层
      columns: [],
      nameModel: '',
      errornameModel: '',
      projectList: [],
      projectId: '',
      oldphoneNum: '',
      isShowCode: true,
      phoneNumStyle: true,
      disabled: false
    }
  },
  created () {
    // 跳转至餐卡绑定页面需要数据
    this.$api.toDiningCardBidingPageInfo().then((res) => {
      if (res.code === 0) {
        res.data.data.forEach((item) => {
          this.columns.push(item.projectName)
        })
        this.projectList = res.data.data
        this.phoneNumStyle = false

        if (res.data.empInfoVo) {
          this.oldphoneNum = res.data.empInfoVo.empTel
          this.phoneNum = res.data.empInfoVo.empTel
          this.nameModel = res.data.empInfoVo.empName
          this.mealCardModel = res.data.empInfoVo.projectName
          this.projectId = res.data.empInfoVo.projectId
          this.isShowCode = false
        }
        if (res.data.wxAccountInfo.isEmployee === '1' && res.data.empInfoVo) {
          this.phoneNum = res.data.empInfoVo.empTel
          this.phoneNumStyle = true

          this.nameModel = res.data.empInfoVo.empName
          this.mealCardModel = res.data.empInfoVo.projectName
          this.projectId = res.data.empInfoVo.projectId
          this.isShowCode = false
        } else {
          this.oldphoneNum = res.data.empInfoVo.empTel
          this.phoneNum = res.data.empInfoVo.empTel
          this.phoneNumStyle = false
        }
      }
    })
  },
  watch: {
    phoneNum (val) {
      if (this.oldphoneNum) {
        if (this.oldphoneNum !== val) {
          this.isShowCode = true
        } else {
          this.isShowCode = false
        }
      }
    }
  },
  methods: {
    // 查询当前手机号是否被绑定过
    checkphonehasbindingTel () {
      let param = {
        phone: this.phoneNum
      }
      this.$api.checkphonehasbindingTel(param).then((res) => {
        if (res.code === 0) {
          let params = {
            phone: this.phoneNum
          }
          // 获取手机验证码
          this.$api.getphoneverificationcodeTel(params).then((res) => {
            if (res.code === 0) {
              this.outhSend = res.data
            }
          })
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 校验手机号验证码
    verificationPhoneTel () {
      let params = {
        phone: this.phoneNum,
        verificationCode: this.codePhone
      }
      this.$api.verificationPhoneTel(params).then((res) => {
        if (res.code === 0) {
          // this.isDisable = false
          // 餐卡绑定
          let params = {
            userTel: this.phoneNum,
            userName: this.nameModel,
            projectId: this.projectId
          }
          this.$api.cardBiding(params).then(res => {
            if (res.code === 0) {
              this.$toast('绑定成功')
              this.$router.replace({path: './myMealCard'})
            } else {
              this.$toast(res.msg)
            }
          })
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 获取验证码
    getCode () {
      if (!this.phoneNum) {
        this.errorPhone = '手机号不能为空'
        return
      } else if (!(/^1[34578]\d{9}$/.test(this.phoneNum))) {
        this.errorPhone = '请输入正确的手机号'
        return
      } else if (!this.oldphoneNum) {
        this.disabled = true
        const TIME_COUNT = 60
        if (!this.timer) {
          // alert(1)
          this.count = TIME_COUNT
          this.timer = setInterval(() => {
            // alert(2)
            if (this.count > -1 && this.count <= TIME_COUNT) {
              this.count--
            } else {
              this.count = ''
              clearInterval(this.timer)
              this.timer = null
              this.disabled = false
            }
          }, 1000)
        }
        this.checkphonehasbindingTel()
      } else if (this.oldphoneNum !== this.phoneNum) {
        this.$dialog.confirm({
          title: '提示',
          message: `您确定要修改手机号吗？`,
          overlay: true
        }).then(() => {
          this.disabled = true
          const TIME_COUNT = 60
          if (!this.timer) {
          // alert(1)
            this.count = TIME_COUNT
            this.timer = setInterval(() => {
            // alert(2)
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.count = ''
                clearInterval(this.timer)
                this.timer = null
                this.disabled = false
              }
            }, 1000)
          }
          this.checkphonehasbindingTel()
        })
      }
      if (this.submitFun) {
        this.submitFun = false
      }
    },
    // 获取input焦点时
    phoneFocus () {
      this.errorPhone = ''
    },
    codeFocus () {
      this.errorCode = ''
    },
    // 提交
    nextStep () {
      // this.isDisable = true
      if (!this.mealCardModel) {
        this.errorMealCardModel = '所属园区不能为空'
        return
      } else if (!this.phoneNum) {
        this.errorPhone = '手机号不能为空'
        return
      } else if (!this.codePhone && this.isShowCode) {
        this.errorCode = '验证码不能为空'
        return
      } else if (!this.nameModel) {
        this.errornameModel = '姓名不能为空'
        return
      }
      if (this.codePhone && this.isShowCode) {
        // 验证码显示时调
        this.verificationPhoneTel()
      } else {
        // 餐卡绑定
        let params = {
          userTel: this.phoneNum,
          userName: this.nameModel,
          projectId: this.projectId
        }
        this.$api.cardBiding(params).then(res => {
          if (res.code === 0) {
            this.isDisable = true
            this.$toast(res.msg)
            this.$toast('绑定成功')
            this.$router.push({path: './myMealCard'})
          } else {
            this.$toast(res.msg)
          }
        })
      }
    },
    // 弹层 选择器
    onConfirm (value, index) {
      // this.$toast(`当前值：${value}, 当前索引：${index}`)
      this.gardenPopup = false
      this.mealCardModel = value
      this.projectId = this.projectList[index].projectId
      this.errorMealCardModel = ''
    },
    onCancel () {
      this.gardenPopup = false
    },
    // 所属园区显示弹层
    gardenClick () {
      this.gardenPopup = true
    },
    nameFocus () {
      this.errornameModel = ''
    }
  }
}
</script>
<style lang="less" scoped>
.mealCard{
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
