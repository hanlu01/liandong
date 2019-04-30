<template>
  <div class="information">
    <div class="informationBox">
      <div class="bindingTit">
        <p>1 绑定手机号</p>
        <p>2 完善信息</p>
      </div>
      <div class="forminformation" v-if="forminformationState && $route.query.statusData">
        <van-cell-group v-if="$route.query.statusData.status === 2">
          <van-field
            v-model="information1"
            readonly
            label="所属园区："
            placeholder=""
            left-icon="contact1"
            :error-message="errorInformation1"
            right-icon="contactArrows"
            @click="gardenClick"
          />
          <van-field
            v-model="information2"
            readonly
            label="所属企业："
            placeholder=""
            left-icon="contact2"
            :error-message="errorInformation2"
            right-icon="contactArrows"
            @click="AffiliatedCompany"
          />
          <van-field
            v-model="information3"
            label="姓 名："
            placeholder="请输入姓名"
            left-icon="contact3"
            :error-message="errorInformation3"
            @focus="nameFocus"
          />
          <van-field
            v-model="information4"
            label="身份证号："
            placeholder="请输入身份证号"
            left-icon="contact4"
            @input="enterpriseBlur"
            :error-message="errorInformation4"
            @focus="identityFocus()"
          />
          <van-field
            v-model="information5"
            label="性 别："
            placeholder=""
            disabled
            left-icon="contact5"
            :error-message="errorInformation5"
          />
          <van-field
            v-model="information6"
            label="生 日："
            placeholder=""
            disabled
            left-icon="contact6"
            :error-message="errorInformation6"
          />
          <van-field
            v-model="information7"
            label="部 门："
            placeholder="请输入部门"
            left-icon="contact7"
            :error-message="errorInformation7"
          />
          <van-field
            v-model="information8"
            label="职 务："
            placeholder="请输入职务"
            left-icon="contact8"
            :error-message="errorInformation8"
          />
          <van-field
            v-model="information9"
            label="车 牌 号："
            placeholder="请输入车牌号"
            left-icon="contact9"
            :error-message="errorInformation9"
          />
        </van-cell-group>
        <van-cell-group v-else>
          <van-field
            v-model="information1"
            readonly
            label="所属园区："
            placeholder=""
            left-icon="contact1"
            :error-message="errorInformation1"
            right-icon="contactArrows"
          />
          <van-field
            v-model="information2"
            readonly
            label="所属企业："
            placeholder=""
            left-icon="contact2"
            :error-message="errorInformation2"
            right-icon="contactArrows"
          />
          <van-field
            v-model="information3"
            readonly
            label="姓 名："
            placeholder="请输入姓名"
            left-icon="contact3"
            :error-message="errorInformation3"
          />
          <van-field
            v-model="information4"
            readonly
            label="身份证号："
            placeholder="请输入身份证号"
            left-icon="contact4"
            @input="enterpriseBlur"
            :error-message="errorInformation4"
          />
          <van-field
            v-model="information5"
            readonly
            label="性 别："
            placeholder=""
            disabled
            left-icon="contact5"
            :error-message="errorInformation5"
          />
          <van-field
            v-model="information6"
            readonly
            label="生 日："
            placeholder=""
            disabled
            left-icon="contact6"
            :error-message="errorInformation6"
          />
          <van-field
            v-model="information7"
            readonly
            label="部 门："
            placeholder="请输入部门"
            left-icon="contact7"
            :error-message="errorInformation7"
          />
          <van-field
            v-model="information8"
            readonly
            label="职 务："
            placeholder="请输入职务"
            left-icon="contact8"
            :error-message="errorInformation8"
          />
          <van-field
            v-model="information9"
            readonly
            label="车 牌 号："
            placeholder="请输入车牌号"
            left-icon="contact9"
            :error-message="errorInformation9"
          />
        </van-cell-group>
        <!-- 提交 -->
        <div class="promptStatus">
          <span v-if="$route.query.statusData.status === 2" @click="reject">?审批驳回，请查看详细信息</span>
          <span v-else-if="$route.query.statusData.status === 0">已申请绑定 等待企业管理员审批中</span>
          <!-- <span v-else-if="$route.query.statusData.status === 1">审批通过</span> -->
        </div>
        <van-button size="large" @click="submitClick" v-if="$route.query.statusData.status === 2">提交</van-button>
        <van-button size="large" v-if="$route.query.statusData.status === 1">审批通过</van-button>
        <van-button size="large1" v-if="$route.query.statusData.status === 0">提交</van-button>
      </div>
      <div class="forminformation" v-else-if="forminformationState">
        <van-cell-group>
          <van-field
            v-model="information1"
            readonly
            label="所属园区："
            placeholder=""
            left-icon="contact1"
            :error-message="errorInformation1"
            right-icon="contactArrows"
            @click="gardenClick"
          />
          <van-field
            v-model="information2"
            readonly
            label="所属企业："
            placeholder=""
            left-icon="contact2"
            :error-message="errorInformation2"
            right-icon="contactArrows"
            @click="AffiliatedCompany"
          />
          <van-field
            v-model="information3"
            label="姓 名："
            placeholder="请输入姓名"
            left-icon="contact3"
            :error-message="errorInformation3"
            @focus="nameFocus"
          />
          <van-field
            v-model="information4"
            label="身份证号："
            placeholder="请输入身份证号"
            left-icon="contact4"
            @input="enterpriseBlur"
            :error-message="errorInformation4"
            @focus="identityFocus()"
          />
          <van-field
            v-model="information5"
            label="性 别："
            placeholder=""
            disabled
            left-icon="contact5"
            :error-message="errorInformation5"
          />
          <van-field
            v-model="information6"
            label="生 日："
            placeholder=""
            disabled
            left-icon="contact6"
            :error-message="errorInformation6"
          />
          <van-field
            v-model="information7"
            label="部 门："
            placeholder="请输入部门"
            left-icon="contact7"
            :error-message="errorInformation7"
          />
          <van-field
            v-model="information8"
            label="职 务："
            placeholder="请输入职务"
            left-icon="contact8"
            :error-message="errorInformation8"
          />
          <van-field
            v-model="information9"
            label="车 牌 号："
            placeholder="请输入车牌号"
            left-icon="contact9"
            :error-message="errorInformation9"
          />
        </van-cell-group>
        <!-- 提交 -->
        <van-button size="large" @click="submitClick" v-if="applyStatusState">提交</van-button>
        <van-button size="large" type="info" @click="submitClick2" v-else>提交</van-button>
      </div>
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
      <!-- 右侧弹层 -->
      <van-popup v-model="enterprisePopup" position="top" :overlay="true" class="popupSelsect">
        <form action="/">
          <van-search
            v-model="informationSelsect"
            placeholder="请输入搜索关键词"
            show-action
            @search="onSearch"
            @cancel="onCancelClose"
          />
          <ul>
            <li v-for="(item,index) in enterpriseData" :key="index" @click="selectValue(index)">
              <span>{{item.enterName}}</span>
            </li>
          </ul>
        </form>
      </van-popup>
  </div>
</template>

<script>
export default {
  data () {
    return {
      information1: '',
      information2: '',
      information3: '',
      information4: '',
      information5: '',
      information6: '',
      information7: '',
      information8: '',
      information9: '',
      informationSelsect: '123',
      enterpriseDataState: true,
      applyStatusState: true,
      forminformationState: true,
      errorInformation1: '',
      errorInformation2: '',
      errorInformation3: '',
      errorInformation4: '',
      errorInformation5: '',
      errorInformation6: '',
      errorInformation7: '',
      errorInformation8: '',
      errorInformation9: '',
      gardenPopup: false, // 所属园区弹层
      enterprisePopup: false, // 所属企业弹层
      enterprisePopupInput: '',
      enterpriseData: [],
      columns: [],
      project: '',
      projectId: '',
      enterId: '',
      empSex: '',
      empData: {}
    }
  },
  watch: {
    informationSelsect (val) {
      this.getenterprisebyproject()
    }
  },
  mounted () {
    if (this.$route.query.statusData) {
      this.getenterpriseInfo()
    } else {
      this.getempinfo()
    }
    this.exchangeSex2(this.$route.query.statusData.emp.empSex)
  },
  methods: {
    // 判断身份证是否被用过
    validateidcardnumber () {
      let params = {}
      if (this.empData.id) {
        params = {
          id: this.empData.id,
          idCard: this.information4
        }
      } else if (this.$route.query.statusData) {
        params = {
          id: this.$route.query.statusData.emp.id,
          idCard: this.information4
        }
      } else {
        params = {
          id: null,
          idCard: this.information4
        }
      }
      this.$api.validateidcardnumber(params).then(res => {
        if (res.code === 0) {
          this.binding()
        } else {
          this.$toast('身份证已被使用，请更换身份证')
        }
      })
    },
    // 获取企业用户信息
    getempinfo () {
      let params = {
        phone: this.$route.query.phone
      }
      this.$api.getempinfo(params).then(res => {
        if (res.code === 0) {
          if (res.data.emp) {
            // 赋值
            this.empData = res.data.emp
            this.information1 = res.data.emp.projectName
            this.information2 = res.data.emp.enterName
            this.information3 = res.data.emp.empName
            this.information4 = res.data.emp.empIdNumber
            this.information5 = res.data.emp.empSex
            this.information6 = res.data.emp.birthDay
            this.information7 = res.data.emp.empDep
            this.information8 = res.data.emp.empPosition
            this.information9 = res.data.emp.empCarNumber
            this.columns = res.data.projects
            this.exchangeSex2(res.data.emp.empSex)
            this.exChangeColumns()
            if (res.data.applyStatus === 1) {
              this.applyStatusState = false
            }
          } else {
            this.getprojects()
          }
        }
      })
    },
    // 判断审批状态
    getenterpriseInfo () {
      if (this.$route.query.statusData) {
        this.information1 = this.$route.query.statusData.emp.projectName
        this.information2 = this.$route.query.statusData.emp.enterName
        this.information3 = this.$route.query.statusData.emp.empName
        this.information4 = this.$route.query.statusData.emp.empIdNumber
        this.information5 = this.$route.query.statusData.emp.empSex
        this.information6 = this.$route.query.statusData.emp.birthDay
        this.information7 = this.$route.query.statusData.emp.empDep
        this.information8 = this.$route.query.statusData.emp.empPosition
        this.information9 = this.$route.query.statusData.emp.empCarNumber
        this.projectId = this.$route.query.statusData.emp.projectId
        this.enterId = this.$route.query.statusData.emp.enterId
        this.columns = this.$route.query.statusData.projects
        this.exChangeColumns()
      }
    },
    // 获取园区列表信息
    getprojects () {
      this.$api.getprojects().then(res => {
        if (res.code === 0) {
          this.columns = res.data
          this.exChangeColumns()
        }
      })
    },
    // 模糊搜索企业信息
    getenterprisebyproject () {
      let param = {
        projectId: this.projectId,
        enterName: this.informationSelsect
      }
      this.$api.getenterprisebyproject(param).then(res => {
        if (res.code === 0) {
          if (res.data && res.data.length) {
            this.enterpriseData = []
            this.enterpriseData = res.data
          } else {
            this.enterpriseDataState = false
          }
        }
      })
    },
    // 绑定企业
    binding () {
      this.exchangeSex()
      let emp = {}
      if (this.$route.query.statusData) {
        emp = {
          projectId: this.projectId,
          enterId: this.enterId,
          empName: this.information3,
          empIdNumber: this.information4,
          empSex: this.empSex,
          id: this.$route.query.statusData.emp.id,
          empTel: this.$route.query.phone,
          birthDay: this.information6,
          empDep: this.information7,
          empPosition: this.information8,
          empCarNumber: this.information9
        }
      } else if (this.empData.id) {
        emp = {
          projectId: this.empData.projectId,
          enterId: this.empData.enterId,
          empName: this.information3,
          empIdNumber: this.information4,
          empSex: this.empSex,
          id: this.empData.id,
          empTel: this.empData.empTel,
          birthDay: this.information6,
          empDep: this.information7,
          empPosition: this.information8,
          empCarNumber: this.information9
        }
      } else {
        emp = {
          projectId: this.projectId,
          enterId: this.enterId,
          empName: this.information3,
          empIdNumber: this.information4,
          empSex: this.empSex,
          empTel: this.$route.query.phone,
          birthDay: this.information6,
          empDep: this.information7,
          empPosition: this.information8,
          empCarNumber: this.information9
        }
      }
      this.$api.binding(emp).then(res => {
        if (res.code === 0) {
          this.$toast('提交成功')
          this.$router.push({path: '/'})
        }
      })
    },
    // columns数组对象赋值
    exChangeColumns () {
      this.columns.forEach((item, index) => {
        item.text = item.projectName
        item.keyId = item.projectId
      })
    },
    // 刷选园区id
    brushSelectionProjected () {
      this.project = this.columns.find((item, index) => {
        if (item.projectName === this.information1) {
          return item
        }
      })
      this.projectId = this.project.projectId
    },
    // 选择模糊查询出来的数据
    selectValue (index) {
      this.information2 = this.enterpriseData[index].enterName
      this.enterId = this.enterpriseData[index].enterCode
      this.enterprisePopup = false
      this.forminformationState = true
    },
    // 性别转换
    exchangeSex () {
      if (this.information5 === '男') {
        this.empSex = '1'
      } else {
        this.empSex = '2'
      }
    },
    exchangeSex2 (val) {
      if (val === 1) {
        this.information5 = '男'
      } else {
        this.information5 = '女'
      }
    },
    submitClick () {
      if (!this.information1) {
        this.errorInformation1 = '所属园区不能为空'
      }
      if (!this.information2) {
        this.errorInformation2 = '所属企业不能为空'
      }
      if (!this.information3) {
        this.errorInformation3 = '姓名不能为空'
      }
      if (!this.information4) {
        this.errorInformation4 = '身份证号不能为空'
      } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.information4))) {
        this.errorInformation4 = '请输入正确身份证号'
      } else {
        this.validateidcardnumber()
      }
    },
    submitClick2 () {
      this.$toast('已审批通过，请勿重复提交')
    },
    // 身份证号 连带性别 出生日期
    enterpriseBlur () {
      if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.information4))) {
        this.errorInformation4 = '请输入正确身份证号'
      } else if ((/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(this.information4)) === true) {
        // console.log('年龄：' + this.IdCard(this.information4, 3) + ', 性别：' + this.IdCard(this.information4, 2) + '，  出生日期：' + this.IdCard(this.information4, 1))
        this.information5 = this.IdCard(this.information4, 2)
        this.information6 = this.IdCard(this.information4, 1)
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
    reject () {
      this.$dialog.alert({
        title: '驳回原因',
        message: this.$route.query.statusData.emp.rejectReson
      }).then(() => {
        // on close
      })
    },
    // 弹层 选择器
    onConfirm (value, index) {
      this.gardenPopup = false
      this.information1 = value.text
      this.brushSelectionProjected()
      this.errorInformation1 = ''
    },
    // 右侧弹层 所属企业
    AffiliatedCompany () {
      if (this.information2) {
        return
      }
      this.enterpriseData = []
      this.informationSelsect = ''
      this.enterprisePopup = true
      this.forminformationState = false
      this.errorInformation2 = ''
    },
    onCancel () {
      this.gardenPopup = false
    },
    // 所属园区显示弹层
    gardenClick () {
      if (this.information1) {
        return
      }
      this.gardenPopup = true
    },
    identityFocus () {
      this.errorInformation4 = ''
    },
    nameFocus () {
      this.errorInformation3 = ''
    },
    // 所属企业 搜索
    onSearch () {
      if (this.enterpriseDataState) {
        this.enterprisePopup = false
        this.forminformationState = true
        this.information2 = this.informationSelsect
      } else {
        this.$toast('没有此企业')
      }
    },
    // 所属企业 取消
    onCancelClose () {
      this.enterprisePopup = false
      this.forminformationState = true
    }
  }
}
</script>

<style lang="less" scoped>
.information {
  padding: 10px;
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
    .informationBox{
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
              color: #748095;
              background-color: #F6F5F5;
              background-size: cover;
              flex: 1;
              height: 40px;
              line-height: 40px;
              height: 40px;
              text-align: center;
              border-bottom-right-radius: 24px;
              border-top-right-radius: 5px;
            }
            & p:nth-child(2){
            color: #F4403D;
            background: #fff;
            flex: 1;
            line-height: 40px;
            height: 40px;
            text-align: center;
            border-top-left-radius: 5px;
            }
        }
        .forminformation{
          // back
        }
    }
  .popupSelsect{
    li{
      width:100%;
      height: 34px;
      box-sizing: border-box;
      padding: 10px 20px;
      background: rgba(255,255,255,1);
      color:#748095;
      border-bottom: 1px solid #eee;
    }
  }
  .promptStatus{
    display:flex;
    justify-content: center;
    color:rgba(244,64,61,1);
  }
}
</style>
