<template>
  <div class="approvaldetails">
    <div class="activityTitBox">
      <van-cell-group>
        <van-field
          v-model="approvalDetail.name"
          label="姓 名："
          placeholder=""
            disabled
        />
        <van-field
          v-model="approvalDetail.phone"
          label="手机号："
          placeholder=""
            disabled
        />
          <van-field
            v-model="approvalDetail.enterName"
            label="绑定企业："
            placeholder=""
            readonly
            disabled
          />
          <van-field
            v-model="approvalDetail.idNumber"
            label="身份证号："
            placeholder=""
            disabled
          />
          <van-field
            v-model="approvalDetail.sex"
            label="性 别："
            placeholder=""
            disabled
          />
          <van-field
            v-model="approvalDetail.dep"
            label="部 门："
            placeholder=""
            disabled
          />
          <van-field
            v-model="approvalDetail.position"
            label="职 务："
            placeholder=""
            disabled
          />
          <van-field
            v-model="approvalDetail.car"
            label="车 牌 号："
            placeholder=""
            disabled
          />
      </van-cell-group>
      </div>
      <div class="btn">
        <van-button type="primary" @click="overrule(2)">驳回</van-button>
        <van-button type="danger" style="color:#fff" @click="traverse(1)">通过</van-button>
      </div>
      <van-dialog
        v-model="show"
        title="驳回原因"
        show-cancel-button
        :beforeClose="beforeClose"
      >
        <textarea name="" id="" rows="10" v-model="imputData" class="textStyle"></textarea>
      </van-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      approvalDetail: '',
      show: false,
      imputData: '',
      statusVal: ''
    }
  },
  mounted () {
    this.getapprovalempdetail()
  },
  methods: {
    // 获取审批人员详情
    getapprovalempdetail () {
      let params = {
        id: this.$route.query.id
      }
      this.$api.getapprovalempdetail(params).then(res => {
        if (res.code === 0) {
          this.approvalDetail = res.data
        }
      })
    },
    // 审批企业员工
    approvalemp (params) {
      this.$api.approvalemp(params).then(res => {
        if (res.code === 0) {
          this.$toast(res.msg)
          this.$router.push({path: '/Bindingapproval'})
        }
      })
    },
    overrule (val) {
      this.show = true
      this.statusVal = val
    },
    traverse (val) {
      let params = {
        id: this.$route.query.id,
        status: val
      }
      this.approvalemp(params)
    },
    beforeClose (action, done) {
      if (action === 'confirm') {
        if (this.imputData.length > 50) {
          this.$toast('最多输入50个字')
          done(false)
        } else if (this.imputData.length === 0) {
          console.log('5646')
          this.$toast('请输入驳回原因')
          done(false)
        } else {
          let params = {
            id: this.$route.query.id,
            status: this.statusVal,
            rejectReason: this.imputData
          }
          this.approvalemp(params)
        }
      } else if (action === 'cancel') {
        done() // 关闭
      }
    }
  }
}
</script>
<style lang="less" scoped>
.approvaldetails{
   padding: 10px;
  box-sizing: border-box;
  background: #F6F5F5;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0px;
  bottom: 0px;
  .activityTitBox{
    // display: flex;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 5px 0px rgba(174,179,196,0.5);
    border-radius:5px;

  }
  .btn{
    display: flex;
    justify-content: space-around;
    margin-top: 24px;
    padding: 20px;
    box-sizing: border-box;
  }
  .textStyle{
    border:none;
    width:100%;
    padding:10px;
    box-sizing: border-box;
    resize:none;
  }
}
</style>
