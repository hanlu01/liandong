<template>
  <div class="activityApply">
    <div class="activityTitBox activityTitBoxSize">
      <h3>{{applyData.activityName}}</h3>
      <div class="activityTitList">
        <div class="activityBox"><p>活动时间：</p><span>{{applyData.activityBegTime}} 至 {{applyData.activityEndTime}}</span></div>
        <div class="activityBox"><p>活动园区：</p><span>{{applyData.projectName}}</span></div>
        <div class="activityBox"><p>活动地点：</p><span>{{applyData.activityPosition}}</span></div>
        <div class="activityBox"><p>报名时间：</p><span>{{applyData.applyBegTime}} 至 {{applyData.applyEndTime}}</span></div>
        <div class="activityBox"><p>可报名人员：</p><span>{{applyData.applyScope}}</span></div>
        <div class="activityBox"><p>报名人数：</p><span>{{applyData.activityParticipants}}/{{applyData.activityCeiling}}</span></div>
      </div>
    </div>
    <!-- <div class="activityTitBox" v-if="applyData.forFree === 0">
      <p>活动费用：</p>
      <span class="spanColor">无</span>
    </div> -->
    <div class="activityTitBox" v-if="applyData.forFree != 0">
      <p>活动费用：</p>
      <span class="spanColor">￥{{applyData.price}}元</span>
      <span class="spanColorOrigin" v-if="applyData.discount < 100">￥{{applyData.originPrice}}元</span>
      <span class="spanColorDiscount" v-if="applyData.discount < 100">{{applyData.discount}}%</span>
    </div>
    <div class="activityTitBox">
      <div class="activityBox"><p>昵 称：</p><span>{{applyData.nickName}}</span></div>
      <div class="activityBox"><p>姓 名：</p><input v-model="applyData.name" placeholder="请输入姓名" class="nameInput"></div>
      <div class="activityBox"><p>手机号：</p><input v-model="applyData.phone" placeholder="请输入手机号" class="nameInput"></div>
      <div class="activityBox" v-if="applyData.cusType === '企业员工'"><p >绑定企业：</p><span v-if="applyData.cusType === '企业员工'">{{applyData.enterName}}</span></div>
      <div class="activityBox"><p>用户身份：</p><span>{{applyData.cusType}}</span></div>
    </div>
    <div >
      <div class="inputListBox" v-for="(item,index) in applyData.applyItems" :key="index">
        <div class="inputBox" v-if="item.applyItemType === 0">
          <span>{{item.applyItemName}} &nbsp;&nbsp; (单选)</span>
          <van-radio-group v-model="item.radio" >
            <van-radio class="radioStyle " :class="itemOPtions.hasFill == 0? 'has-fill':''" v-for="(itemOPtions, indexOPtions) in item.options"
              :key="indexOPtions"
              :name="itemOPtions.optionName">{{itemOPtions.optionName}}
              <div class="other-content" @click.stop="unSelect">
                <input placeholder="请填写" v-model="itemOPtions.fillContent" v-if="itemOPtions.hasFill === 0">
              </div>
            </van-radio>
          </van-radio-group>
        </div>
        <div class="inputBox" v-if="item.applyItemType === 1">
          <span>{{item.applyItemName}} &nbsp;&nbsp; (多选)</span>
          <van-checkbox-group v-model="item.result"  @change="chexkChange">
            <van-checkbox
              v-for="(itemOPtions, indexOPtions) in item.options"
              :key="indexOPtions"
              :name="itemOPtions.optionName"
              class="radioStyle"
              :class="itemOPtions.hasFill == 0? 'has-fill':''"
            >
              {{itemOPtions.optionName}}
              <div class="other-content" @click.stop="unSelect">
                <input placeholder="请填写" v-model="itemOPtions.fillContent" v-if="itemOPtions.hasFill === 0">
              </div>
            </van-checkbox>
          </van-checkbox-group>
        </div>
        <div class="inputBox" v-if="item.applyItemType === 2">
          <span>{{item.applyItemName}} &nbsp;&nbsp; (填空)</span>
          <van-cell-group  style="margin-top:10px">
            <!-- <van-field
            v-model="item.value"
            placeholder="请填写"/> -->
            <textarea v-model="item.value" class="text-area" rows="4" placeholder="请填写"></textarea>
          </van-cell-group>
        </div>
      </div>
    </div>
    <!-- 底部弹层 -->
      <van-popup v-model="gardenPopup" position="bottom" :overlay="true">
        <!-- 弹层 选择器 -->
        <van-picker
          show-toolbar
          title="喜欢的活动类型"
          :columns="likeActivityData"
          @cancel="onCancel"
          @confirm="onConfirm"
        />
      </van-popup>
    <van-button size="large" @click="paymentRegistration" v-if="applyData.forFree === 0">提交报名</van-button>
    <van-button size="large" @click="paymentRegistration" v-else>支付报名</van-button>
    <div v-html="formHtml"></div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      verify: false,
      genderStart: '',
      likeActivity: '',
      gardenPopup: false,
      resultArrIndex: -1,
      result: [],
      applyData: {
        applyItems: [
          {
            result: []
          }
        ]
      },
      radio: '',
      value: '',
      // applyData: {},
      formHtml: '',
      likeActivityData: ['游泳', '健身', '跳舞']
    }
  },
  mounted () {
    this.getsignupinfo()
  },
  methods: {
    chexkChange (val, index) {
      // console.log(index)
      // console.log(this.applyData.applyItems)
    },
    unSelect () {

    },
    // 获取活动报名信息
    getsignupinfo () {
      let params = {
        activityId: this.$route.query.activityId
      }
      this.$api.getsignupinfo(params).then(res => {
        if (res.code === 0) {
          if (res.data.applyItems.length > 0) {
            res.data.applyItems.forEach((item, index) => {
              if (item.applyItemType === 0) {
                item.radio = item.feedbackValue ? item.feedbackValue[0] : ''
              } else if (item.applyItemType === 1) {
                item.result = item.feedbackValue ? item.feedbackValue : []
              } else if (item.applyItemType === 2) {
                item.value = item.feedbackValue ? item.feedbackValue[0] : ''
              }
            })
          }
          this.applyData = res.data
        }
      })
    },
    // 提交活动报名信息
    signupactivity () {
      if (this.verify) {
        return false
      }
      let resultArr = []
      let radioString = ''
      let resultStringLink = ''
      let valueString = ''
      let resultString = ''
      let applyArr = []
      let applyString = ''
      // let resultState = false
      this.applyData.applyItems.forEach((item, index) => {
        // 单选
        if (item.applyItemType === 0) {
          let find = item.options.filter(i => {
            return item.radio === i.optionName
          })
          console.log(find)
          if (find[0].hasFill === 0) {
            radioString = `${item.id}-${item.radio}_${find[0].fillContent}`
            applyArr.push(radioString)
          } else if (find[0].hasFill === 1) {
            radioString = `${item.id}-${item.radio}`
            applyArr.push(radioString)
          }
        }
        // 多选
        if (item.applyItemType === 1) {
          let selectArr = []
          item.result.forEach(resItem => {
            let find = item.options.filter(i => {
              return resItem === i.optionName
            })
            selectArr = selectArr.concat(find)
          })
          selectArr.forEach(seleItem => {
            if (seleItem.hasFill === 0) {
              resultString = `${seleItem.optionName}_${seleItem.fillContent}`
              resultArr.push(resultString)
            } else if (seleItem.hasFill === 1) {
              resultString = `${seleItem.optionName}`
              resultArr.push(resultString)
            }
          })
          resultStringLink = `${item.id}-${resultArr.join('/')}`
          applyArr.push(resultStringLink)
        }
        // 填空
        if (item.applyItemType === 2) {
          valueString = `${item.id}-${item.value}`
          applyArr.push(valueString)
        }
      })
      applyString = applyArr.join()
      let params = {
        applyPrice: this.applyData.price,
        feedBackInfo: applyString,
        activityId: this.$route.query.activityId,
        applyId: this.applyData.applyId,
        applyUserTel: this.applyData.phone,
        applyUserName: this.applyData.name
      }
      // 校验规则
      if (!this.applyData.name) {
        this.$toast('请填写名字')
      } else if (!this.applyData.phone) {
        this.$toast('请输入手机号')
      } else if (!(/^1[34578]\d{9}$/.test(this.applyData.phone))) {
        this.$toast('请输入正确的手机号')
      } else if (this.applyData.applyItems.length > 0) {
        console.log('!')
        for (let i = 0; i < this.applyData.applyItems.length; i++) {
          if (this.applyData.applyItems[i].applyItemType === 1) {
            if (this.applyData.applyItems[i].result.length === 0) {
              this.$toast('请选择多选项')
              return false
            }
            for (let j = 0; j < this.applyData.applyItems[i].options.length; j++) {
              for (let k = 0; k < this.applyData.applyItems[i].result.length; k++) {
                if (this.applyData.applyItems[i].result[k] === this.applyData.applyItems[i].options[j].optionName && !this.applyData.applyItems[i].options[j].fillContent && this.applyData.applyItems[i].options[j].hasFill === 0) {
                  console.log('@@@@@@@@@')
                  this.$toast('请输入多选项的描述')
                  return false
                }
              }
              // if (i === j && this.applyData.applyItems[i].options[j].hasFill === 0) {
              //   this.$toast('请输入多选项的描述')
              //   return false
              // }
            }
          } else if (this.applyData.applyItems[i].applyItemType === 0) {
            if (!this.applyData.applyItems[i].radio) {
              this.$toast('请选择单选项')
              return false
            }
            for (let j = 0; j < this.applyData.applyItems[i].options.length; j++) {
              if (this.applyData.applyItems[i].radio === this.applyData.applyItems[i].options[j].optionName && !this.applyData.applyItems[i].options[j].fillContent && this.applyData.applyItems[i].options[j].hasFill === 0) {
                this.$toast('请输入单选项的描述')
                return false
              }
              // if (i === j && this.applyData.applyItems[i].options[j].hasFill === 0) {

              // }
            }
          } else {
            if (!this.applyData.applyItems[i].value) {
              this.$toast('请填写内容')
              return false
            }
          }
        }
        this.verify = true
        this.$api.signupactivity(params).then(res => {
          if (res.code === 0) {
            if (this.applyData.forFree === 0) {
              this.$router.push({path: '/activityMy'})
            } else {
              let params = {
                orderNo: res.data.orderNo
              }
              this.$api.encapsulationactivitypayparams(params).then(res => {
                if (res.code === 0) {
                  let params = res.data.param
                  let paramForm = ''
                  this.formHtml = ''
                  Object.keys(params).forEach(function (key) {
                    console.log(key, params[key])
                    paramForm += `<input type="hidden" name="${key}" id="bizType" value="${params[key]}"/>`
                  })
                  this.formHtml = '<form id = "pay_form" action="' + res.data.url + '" method="post">' + paramForm + '</form>'
                  setTimeout(() => {
                    document.all.pay_form.submit()
                  }, 0)
                }
              })
            }
          }
        })
      } else {
        this.$api.signupactivity(params).then(res => {
          if (res.code === 0) {
            if (this.applyData.forFree === 0) {
              this.$router.push({path: '/activityMy'})
            } else {
              let params = {
                orderNo: res.data.orderNo
              }
              this.$api.encapsulationactivitypayparams(params).then(res => {
                if (res.code === 0) {
                  let params = res.data.param
                  let paramForm = ''
                  this.formHtml = ''
                  Object.keys(params).forEach(function (key) {
                    console.log(key, params[key])
                    paramForm += `<input type="hidden" name="${key}" id="bizType" value="${params[key]}"/>`
                  })
                  this.formHtml = '<form id = "pay_form" action="' + res.data.url + '" method="post">' + paramForm + '</form>'
                  setTimeout(() => {
                    document.all.pay_form.submit()
                  }, 0)
                }
              })
            }
          }
        })
      }
    },
    // 支付报名
    paymentRegistration () {
      this.signupactivity()
    },
    likeStyle () {
      this.gardenPopup = true
    },
    onCancel () {
      this.gardenPopup = false
    },
    onConfirm (value) {
      this.likeActivity = value
      this.gardenPopup = false
    }
  }
}
</script>
<style lang="less" scoped>
.text-area{
  border:1px solid rgba(231,232,236,1);
  width: 100%;
  border-radius: 5px;
}
.has-fill{
  height:50px;
  background:rgba(250,243,238,1);
  border-radius:5px;
  border:1px solid rgba(228,178,144,1);
  margin-bottom: 5px;
  margin-top: 5px;
}
.other-content{
  position: absolute;
  bottom: 10px;
  left: 30px;
  input{
    width: 275px;
    background:rgba(250,243,238,1);
  }
}
.activityApply{
  padding: 10px;
  box-sizing: border-box;
  background: #F6F5F5;
  // height: 100%;
  width: 100%;
  // position: absolute;
  // top: 0px;
  // bottom: 0px;
  .activityTitBoxSize{
    font-size: 13px;
    .activityTitList{
      .activityBox{
        display: flex;
        align-items: center;
          p{
          width: 78px;
        }
        p,span{
          font-size: 12px;
        }
        span{
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          display: inline-block;
        }
      }
    }

  }
  .activityTitBox{
    // display: flex;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
    border-radius:5px;
    padding: 13px 0 19px 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    font-size: 14px;
      .activityBox{
        display: flex;
        padding: 5px 0;
        align-items: center;
      }
    h3{
      font-size:24px;
      font-weight:600;
      color:rgba(67,77,93,1);
      line-height:30px;
      width: 69%;
      padding-bottom: 15px;
    }img{
      width:12px;
      height: 13px;
    }
    p{
      display: inline-block;
      color:rgba(116,128,149,1);
      width: 90px;
      padding: 3px;
      font-size:15px;
    }
    .spanColor{
      color:rgba(244,64,61,1);
    }
    .spanColorOrigin{
      text-decoration: line-through;
      color:rgba(199,202,208,1)
    }
    .spanColorDiscount{
      color:rgba(67,77,93,1);
    }
    span{
      font-size:15px;
    }
  }
  .activityTitList{
    font-size:15px;
    font-weight:400;
    color:rgba(67,77,93,1);
    line-height:19px;
    box-sizing: border-box;
      p{
        display: inline-block;
        color:rgba(116,128,149,1);
        width: 90px;
        padding: 3px;
      }
  }
  .inputListBox{
    padding:10px;
    box-sizing: border-box;
    box-shadow:0px 0px 5px 0px rgba(152,155,165,0.5);
    border-radius:5px;
    background: #fff;
    margin-bottom: 10px;
  }
  .inputBox{
    color: #748095;
    font-size: 15px;
    .radioStyle{
      padding: 10px;
      font-size: 15px;
      position: relative;
    }
    .inputTit{
      font-size: 15px;
      color: #748095;
    }
    .textareaBox{
      display: flex;
      flex-direction: column;
      padding: 10px 15px;
      span{
        font-size:15px;
        font-weight:400;
        color:rgba(116,128,149,1);
        padding-bottom: 5px;
        line-height:21px;
      }
      textarea{
        width: 95%;
        height: 70px;
        border: 1px solid rgba(231,232,236,1);
        text-indent: 10px;
        font-size: 15px;
      }
    }
  }
  .nameInput{
    // border-bottom: 1px solid rgba(231,232,236,1)
  }
}
</style>
