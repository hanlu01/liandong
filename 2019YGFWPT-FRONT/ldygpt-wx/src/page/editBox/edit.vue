<template>
  <div class="editBox">
    <div class="editform">
      <van-cell-group>
        <van-field
          v-model="empInfo.empName"
          placeholder="请输入姓名"
          :readonly="isEmp === '0'?false:true"
          left-icon="contact3"
          :error-message="errorname"
          @focus="nameFocus"
        >
        <label slot="label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名：</label>
        </van-field>
        <van-field
          v-model="empInfo.empTel"
          placeholder="请输入手机号"
          left-icon="contactImg"
          :error-message="errorphone"
          @focus="phoneFocus"
        >
        <label slot="label">手&nbsp;机&nbsp;&nbsp;号：</label>
        </van-field>
          <van-field
            v-model="empInfo.enterName"
            label="所在企业："
            placeholder=""
            readonly
            left-icon="contact2"
            :error-message="errorenterprise"
          />
          <van-field
            v-model="empInfo.empIdNumber"
            label="身份证号："
            readonly
            placeholder="请输入身份证号"
            left-icon="contact4"
            @blur="enterpriseBlur"
            @focus="identityFocus()"
            :error-message="erroridentityCard"
          />
          <van-field
            v-model="genderStart"
            placeholder=""
            disabled
            left-icon="contact5"
            :error-message="errorgenderStart"
          >
        <label slot="label">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别：</label>
        </van-field>
          <van-field
            v-model="empInfo.birthDay"
            placeholder=""
            disabled
            left-icon="contact6"
            :error-message="errorbirthDay"
          >
        <label slot="label">生&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;日：</label>
        </van-field>
          <van-field
            v-model="empInfo.empDep"
            placeholder="请输入部门"
            left-icon="contact7"
            :error-message="errordepartment"
          >
        <label slot="label">部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门：</label>
        </van-field>
          <van-field
            v-model="empInfo.empPosition"
            placeholder="请输入职务"
            left-icon="contact8"
            :error-message="errorduty"
          >
        <label slot="label">职&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;务：</label>
        </van-field>
          <van-field
            v-model="empInfo.empCarNumber"
            label="车 牌 号："
            placeholder="请输入车牌号"
            left-icon="contact9"
            :error-message="errorlicenSeplate"
          >
        <label slot="label">车&nbsp;&nbsp;牌&nbsp;&nbsp;号：</label>
        </van-field>
      </van-cell-group>
        <!-- 提交 -->
        <van-button size="large" @click="submitClick">提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      nameStart: '',
      errorname: '',
      phoneStart: '',
      errorphone: '',
      enterpriseStart: '西安华讯科技有限公司',
      errorenterprise: '',
      identityCardStart: '610502199611125961',
      // identityCardStartFun: '',
      erroridentityCard: '',
      genderStart: '',
      errorgenderStart: '',
      birthDayStart: '',
      errorbirthDayStart: '',
      departmentStart: '',
      dutyStart: '',
      errorbirthDay: '',
      errordepartment: '',
      errorduty: '',
      errorlicenSeplate: '',
      licenSeplateStart: '',
      empInfo: this.$route.query.empInfo,
      isEmp: this.$route.query.isEmp
    }
  },
  mounted () {
    // this.enterpriseBlur()
  },
  methods: {
    // 修改个人信息
    updateEmpInfo () {
      delete this.empInfo.createTime
      let params = this.empInfo
      this.$api.updateEmpInfo(params).then(res => {
        if (res.code === 0) {
          this.$toast('编辑成功')
          this.$router.back(-1)
        } else {
          this.$toast(res.msg)
        }
      })
    },
    // 身份证号 连带性别 出生日期
    enterpriseBlur () {
      console.log(this.empInfo.empIdNumber, 1111111111)
      if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.empInfo.empIdNumber))) {
        this.erroridentityCard = '请输入正确身份证号'
      } else if ((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.empInfo.empIdNumber)) === true) {
        // console.log('年龄：' + this.IdCard(this.information4, 3) + ', 性别：' + this.IdCard(this.information4, 2) + '，  出生日期：' + this.IdCard(this.information4, 1))
        this.genderStart = this.IdCard(this.identityCardStart, 2)
      }
    },
    // 连带性别 出生日期
    IdCard (UUserCard, num) {
      if (num === 1) {
        // 获取出生日期
        let birth = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14)
        return birth
      }
      if (num === 2) {
        // 获取性别
        if (parseInt(UUserCard.substr(16, 1)) % 2 === 1) {
          // 男
          return '男'
        } else {
          // 女
          return '女'
        }
      }
    },
    identityFocus () {
      this.erroridentityCard = ''
    },
    nameFocus () {
      this.errorname = ''
    },
    phoneFocus () {
      this.errorphone = ''
    },
    // 提交
    submitClick () {
      if (!this.empInfo.empName) {
        this.errorname = '姓名不能为空'
      } else if (!this.empInfo.empTel) {
        this.errorphone = '手机号不能为空'
      } else if (!(/^1[34578]\d{9}$/.test(this.empInfo.empTel))) {
        this.errorphone = '请输入正确的手机号'
        // return
      } else if (!this.empInfo.empIdNumber) {
        this.identityCardStart = '身份证号不能为空'
      } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.empInfo.empIdNumber))) {
        this.erroridentityCard = '请输入正确身份证号'
        return false
      } else {
        this.updateEmpInfo()
      }
    }
  }
}
</script>

<style lang="less" scoped>
 .editBox{
    padding: 10px;
    box-sizing: border-box;
    background: #F6F5F5;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0px;
    bottom: 0px;
      .editform{
        background: #fff;
        box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
        border-radius:5px;
        padding-bottom: 1px;
      }
}
</style>
