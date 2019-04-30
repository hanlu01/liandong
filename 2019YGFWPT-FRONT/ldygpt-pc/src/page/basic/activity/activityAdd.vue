<template>
  <div class="activityDialog">
    <div class="activityAdd">
      <div class="activityAdd-left">
        <div class="left-title">
          活动内容
          <span style="display: inline-block;position: absolute;right: 0;font-size: 16px;color: #ccc;">积分折扣规则</span>
          <img src="../../../../static/img/rules.png" alt="" @click="dialogRuleVisible = true">
        </div>
        <div v-show="false">
          <el-form-item label="主键" prop="id">
            <el-input v-model="activityInfo.id" placeholder="请输入标题" class="inputLength"></el-input>
          </el-form-item>
        </div>
        <el-form :inline="true" :model="activityInfo" :rules="rules2" class="demo-ruleForm" ref="ruleForm">
          <div>
            <el-form-item label="发布园区" prop="projectId">
              <el-select v-model="activityInfo.projectId" filterable  placeholder="请选择区域" @change="getAssetCorpAccount" :disabled="activityStatus === 2 || !activityStatus?false:true">
                <el-option v-for="item in parkList"
                          :key="item.projectId"
                          :label=item.projectName
                          :value=item.projectId>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="分账商户" prop="assetCorpAccount">
              <el-select v-model="activityInfo.assetCorpAccount" filterable  placeholder="请输入分账商户号" :disabled="activityStatus === 2 || !activityStatus?false:true">
                <el-option
                  v-for="account in assetCorpAccounts"
                  :key="account.assetCorpAccount"
                  :label=account.assetCorpAccount
                  :value=account.assetCorpAccount>
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="活动标题" prop="activityName">
              <el-input v-model="activityInfo.activityName" placeholder="请输入标题" class="inputLength" :disabled="activityStatus === 2 || !activityStatus?false:true"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="活动地点" class="dateInputLength" prop="activityPosition">
              <el-input v-model="activityInfo.activityPosition" :disabled="activityStatus === 2 || !activityStatus?false:true"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="报名时限" prop="applyBegTime">
              <el-date-picker
                :disabled="activityStatus === 2 || !activityStatus?false:true"
                class="dateInputLength"
                v-model="activityInfo.applyBegTime"
                type="datetime"
                placeholder="选择报名开始日期时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="-" prop="applyEndTime">
              <el-date-picker
                :disabled="activityStatus === 2 || !activityStatus?false:true"
                class="dateInputLength"
                v-model="activityInfo.applyEndTime"
                type="datetime"
                placeholder="选择报名结束日期时间">
              </el-date-picker>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="活动时间" prop="activityBegTime">
                  <el-date-picker
                    :disabled="activityStatus === 2 || !activityStatus?false:true"
                    class="dateInputLength"
                    v-model="activityInfo.activityBegTime"
                    type="datetime"
                    placeholder="选择开始日期时间">
                  </el-date-picker>
            </el-form-item>
                <el-form-item label="-" prop="activityEndTime">
                  <el-date-picker
                    :disabled="activityStatus === 2 || !activityStatus?false:true"
                    class="dateInputLength"
                    v-model="activityInfo.activityEndTime"
                    type="datetime"
                    placeholder="选择结束日期时间">
                  </el-date-picker>
                </el-form-item>
          </div>
          <div>
            <el-form-item label="人数限制" prop="activityCeiling">
              <el-input v-model.number="activityInfo.activityCeiling" class="inputLength" :disabled="activityStatus === 2 || !activityStatus?false:true"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="人员范围">
              <el-radio-group v-model="activityInfo.applyScope" @change="personnelSelect" :disabled="activityStatus === 2 || !activityStatus?false:true">
                <el-radio :label="0">全部</el-radio>
                <el-radio :label="1">企业人员</el-radio>
                <el-radio :label="2">游客</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="积分限制" v-if="scoreOneState" prop="integralScope">
              <el-input v-model.number="activityInfo.integralScope" class="inputLength" :disabled="activityStatus === 2 || !activityStatus?false:true"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="是否有报名费" prop="forFree">
              <el-radio-group v-model="activityInfo.forFree" @change="feeSelect" :disabled="activityStatus === 2 || !activityStatus?false:true">
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="员工报名费" v-if="enterpriseEmpPriceStatus" prop="enterpriseEmpPrice">
              <el-input class="inputLength" v-model="activityInfo.enterpriseEmpPrice" :disabled="activityStatus === 2 || !activityStatus?false:true"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="游客报名费" v-if="visitorPriceStatus" prop="visitorPrice">
              <el-input class="inputLength" v-model="activityInfo.visitorPrice" :disabled="activityStatus === 2 || !activityStatus?false:true"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="活动封面" v-model="activityInfo.activityCoverUrl" prop="activityCoverUrl">
              <el-upload
                :class="{'hidden-add':hasShow}"
                :disabled="activityStatus === 2 || !activityStatus?false:true"
                :action="$config().uploadUrl"
                list-type="picture-card"
                :file-list="fileList"
                :data="{fileType:'picture'}"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove">
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="activityInfo.activityCoverUrl" alt="">
              </el-dialog>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="活动简介" prop="activityIntroduction">
              <VueQuillEditor :oldcontent="activityInfo.activityIntroduce" @newCont="newCont"  v-if="activityStatus === 2 || !activityStatus"></VueQuillEditor>
              <VueQuillEditor :oldcontent="activityInfo.activityIntroduce" status="false" v-else></VueQuillEditor>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div class="activityAdd-right">
          <div class="right-top">
            <div class="top-title">
              报名信息配置
              <img src="../../../../static/img/add.png" alt="" @click="addContent" v-if="configurationState && activityStatus === 2 || !activityStatus">
            </div>
            <div class="top-content" v-for="(item,index) in configurationData" :key="index">
              <img src="../../../../static/img/del.png" alt="" @click="cancleContentData(index)" v-if="activityStatus === 2 || !activityStatus">
              <div class="contentTitle">
                <p>
                  <span v-if="activityId">选项标题:</span>
                  <span v-else>{{selectTitle}}</span>
                  <span>{{item.applyItemName}}</span>
                </p>
                <p>
                  <span v-if="activityId">选项类型:</span>
                  <span v-else>{{selectType}}</span>
                  <span>{{item.applyItemType}}</span>
                </p>
              </div>
              <div class="top-tag">
                <p v-for="(itemActive,indexActive) in item.activityApplyItem" :key="indexActive"><el-tag>{{itemActive.optionName}}</el-tag></p>
              </div>
            </div>
          </div>
          <div class="right-bottom">
            <div class="bottom-title">
              活动评分项
              <img src="../../../../static/img/add.png" alt="" @click="addScore" v-if="scoreState && activityStatus === 2 || !activityStatus">
            </div>
            <div class="bottom-content">
              <div v-for="(item,index) in activityScoreInfo" :key="index">
                <el-form :inline="true" :model="form">
                  <el-form-item label="评分选型" class="content-read">
                    <el-select v-model="item.value" :disabled="activityStatus === 2 || !activityStatus?false:true">
                      <el-option
                        v-for="item in scoreList"
                        :key="item.scoreItemId"
                        :label=item.scoreItemName 
                        :value=item.scoreItemId> 
                      </el-option>
                    </el-select>
                    <el-input class="insetInput" v-model="item2.scoreItemName" placeholder="请选择评分种类" v-for="(item2,index2) in item.valueArr" :key="index2" v-if="item2.scoreItemId === item.value"></el-input>
                    <img src="../../../../static/img/del.png" alt="" @click="cancleScoretData(index)" v-if="activityStatus === 2 || !activityStatus">
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
      </div>
      <el-dialog :visible.sync="dialogContentVisible" width="40%" top="18vh" class="activityAddDialog" :modal="false" title="添加报名信息配置">
        <div v-for="(item,index) in activityApplyItem" :key="index">
          <el-form :inline="true" :model="item">
            <div class="activityAddDialog-row" v-if="index===0">
              <el-form-item label="选项标题" ref="item1">
                <el-input v-model="item.applyItemName" class="inputLength"></el-input>
              </el-form-item>
            </div>
            <div class="activityAddDialog-row" v-if="index===0">
              <el-form-item label="选项类型" ref="item2">
                <el-radio-group v-model="item.applyItemType" placeholder="请选择区域">
                  <el-radio :label="0">单选</el-radio>
                  <el-radio :label="1">多选</el-radio>
                  <el-radio :label="2">填空</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="activityAddDialog-row" v-if="item.applyItemType !== 2">
              <el-form-item label="选项内容" class="selectLength" ref="item3">
                <el-input v-model="item.optionName"></el-input>
                <span>是否填写</span>
                <el-radio-group v-model="item.hasFill" @change="signSelect" class="row-select">
                  <el-radio :label="0">是</el-radio>
                  <el-radio :label="1">否</el-radio>
                </el-radio-group>
                <img src="../../../../static/img/add.png" alt="" @click="addSelectContent" v-if="selectContentState && activityApplyItem.length -1 === index" class="imgAdd">
                <img src="../../../../static/img/del.png" alt="" @click="cancleSelectData(index)" v-if="index > 0 && activityApplyItem.length -1 === index" class="imgDel">
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="activityAddDialog-button">
          <el-button @click.prevent="submit()">提交</el-button>
          <el-button @click.prevent="cancle">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogRuleVisible" width="40%" top="18vh" class="activityAddDialog" :modal="false" title="报名折扣规则">
        <div style="display:flex;justify-content:space-between">
          <span>企业积分区间</span>
          <span class="discount">折扣</span>
        </div>
        <div class="ruleInput" v-for="(item,index) in companyIntegralData" :key="index">
          <el-input v-model="item.integral" disabled style="width:160px"></el-input>
          <span>-</span>
          <el-input v-model="item.integralEnd" v-if="index === companyIntegralData.length-1 && activityStatus === 2 || !activityStatus" style="width:160px" @change=changeData></el-input>
          <el-input v-model="item.integralEnd" v-else disabled  style="width:160px"></el-input>
          <el-input class="lastInput" v-model="item.discount" v-if="index === companyIntegralData.length-1 && activityStatus === 2 || !activityStatus"  style="margin-left:100px;width:100px"></el-input>
          <el-input class="lastInput" v-model="item.discount" v-else disabled  style="margin-left:100px;width:100px"></el-input>
          <p v-if="index === companyIntegralData.length-1">
            <img class="img1" src="../../../../static/img/add.png" alt="" @click="addCompanyIntegral(item.integralEnd,item.discount)" v-if="endState && activityStatus === 2 || !activityStatus">
            <img class="img2" src="../../../../static/img/del.png" alt="" @click="cancleCompanyIntegral(index)" v-if="index>0 && activityStatus === 2 || !activityStatus">
          </p>
        </div>
        <div class="activityAddDialog-button" style="margin-top: 60px">
          <el-button @click.prevent="submit2" v-if="activityStatus === 2 || !activityStatus">提交</el-button>
          <el-button @click.prevent="cancle2" v-if="activityStatus === 2 || !activityStatus">取消</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="activityAddAllDialog-button">
      <el-button @click.prevent="submitAll('ruleForm')" v-if="activityStatus === 2 || !activityStatus">提交</el-button>
      <el-button @click.prevent="cancleAll" v-if="activityStatus === 2 || !activityStatus">取消</el-button>
      <el-button @click.prevent="cancleAll" v-if="activityStatus == 1">返回</el-button>
    </div>
  </div>
</template>
<script>
import VueQuillEditor from '@/components/common/quillEditor';
export default {
  components: {VueQuillEditor },
  data(){
    return{
      dialogVisible:false,
      dialogContentVisible:false,
      dialogRuleVisible:false,
      scoreState:true,
      selectContentState:true,
      signState:true,
      scoreOneState:false,
      configurationState:true,
      endState:true,
      enterpriseEmpPriceStatus:false,
      visitorPriceStatus:false,
      selectTitle: '',
      selectType:'',
      selectContent:'',
      stateIndex:-1,
      endData:'',
      value:'',
      form:{
        value:''
      },
      indexValue: -1,
      index: -1,
      tagData:[],
      parkList:[],
      assetCorpAccounts:[],
      scoreList:[],
      configurationData:[],
      companyIntegralData:[{integral: 1}],
      activityInfo:{},
      activityId:this.$route.query.activityId,
      activityStatus:this.$route.query.status,
      discountInfos:[],
      applyItem:[],
      scoreRels:[],
      activityParams:{},
      fileList:[],
      activityVo:{
        projectId:"12"
      },
      applyItems:[
        {
          applyItemName:"12",
        }
      ],
      scoreInfos:[],
      activityDiscountInfos:[],
      rules2: {
        projectId: [
          { required: true, message: '请选择园区', trigger: 'change' }
        ],
        assetCorpAccount:[
          { required: true, message: '请选择分账商户号', trigger: 'blur' }
        ],
        activityName: [
          { required: true, message: '请输入活动标题', trigger: 'blur' }
        ],
        activityBegTime: [
          { type: 'date', required: true, message: '请选择开始日期', trigger: 'change' }
        ],
        activityEndTime: [
          { type: 'date', required: true, message: '请选择结束日期', trigger: 'change' }
        ],
        activityPosition: [
          { required: true, message: '请输入活动地点', trigger: 'blur' }
        ],
        activityCeiling: [
          { required: true, message: '请输入人数限制', trigger: 'blur' },
          {  type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        applyScope: [
          { required: true, message: '请输入报名人员范围', trigger: 'blur' }
        ],
        applyBegTime: [
          { type: 'date', required: true, message: '请选择报名开始日期', trigger: 'change' }
        ],
        applyEndTime: [
          { type: 'date', required: true, message: '请选择报名结束时间', trigger: 'change' }
        ],
        integralScope: [
          { required: true, message: '请输入积分限制', trigger: 'blur' },
          {  type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        forFree:[
          { required: true, message: '请选择是否有活动报名费用', trigger: 'blur' }
        ],
        enterpriseEmpPrice: [
          { required: true, message: '请填写报名费用', trigger: 'blur' }
        ],
        visitorPrice: [
          { required: true, message: '请填写报名费用', trigger: 'blur' }
        ]
      },
      activityApplyItem:[
        {
          applyItemName:'',
          applyItemType:'',
          hasFill:'',
          optionName:''
        }
      ],
      activityApplyItem2:[],
      activityScoreInfo:[],
      fileId:'',
      hasShow:false
    }
  },
  watch:{
    activityScoreInfo(){
      if (this.activityScoreInfo.length >= 10){
        this.scoreState = false
      }else{
        this.scoreState = true
      }
    },
    activityApplyItem(){
      if(this.activityApplyItem.length >= 10){
        this.selectContentState = false
      }else{
        this.selectContentState = true
      }
    },
    configurationData(){
      if(this.configurationData.length >= 10){
        this.configurationState = false
      }else{
        this.configurationState = true
      }
    },
    endData(){
      if(Number(this.endData) === 100){
        this.endState = false
      } else if (Number(this.endData) < 100) {
        this.endState = true
      }
    }
  },
  mounted(){
    this.getParkList()
    this.getActivityScoreList()
    if(this.activityId != undefined){
        this.getDetail(this.activityId)
    }
  },
  methods:{
    newCont (value) {debugger
      this.activityInfo.activityIntroduction = value
    },
    // 获取园区列表
    getParkList(){
      this.$api.getParkList().then(res=>{
        if (res.status === 0) {
          this.parkList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    getAssetCorpAccount(val) {
      let params = {
        projectId: val
      }
      this.$api.getAssetCorpAccount(params).then(res => {
        if (res.code === 0) {
          this.assetCorpAccounts = res.data
        } else {
          // 失败提示
          this.$message.error(res.msg)
        }
      })
    },
    getDetail(data) {
      let params = {
        activityId: data
      }
      this.$api.getActivityDetail(params).then(res => {
        if (res.code === 0) {
          //封装报名项信息
          this.activityInfo = res.data.activity
          this.activityInfo.applyBegTime = new Date(res.data.activity.applyBegTime)
          this.activityInfo.applyEndTime = new Date(res.data.activity.applyEndTime)
          this.activityInfo.activityBegTime = new Date(res.data.activity.activityBegTime)
          this.activityInfo.activityEndTime = new Date(res.data.activity.activityEndTime)
          let applyScope = this.activityInfo.applyScope
          if(applyScope == 1){
            this.scoreOneState = true
          }
          let forFree = this.activityInfo.forFree
          if(forFree == 0){
            this.enterpriseEmpPriceStatus = false
            this.visitorPriceStatus = false
          }else{
            if(applyScope == 0){
              this.enterpriseEmpPriceStatus = true
              this.visitorPriceStatus = true
            }else if(applyScope == 1){
              this.enterpriseEmpPriceStatus = true
              this.visitorPriceStatus = false
            }else{
              this.enterpriseEmpPriceStatus = false
              this.visitorPriceStatus = true
            }
          }
          let file = {name:'',url:this.activityInfo.activityCoverUrl}
          this.hasShow = true
          this.fileList.push(file)
          //封装积分折扣信息
          this.discountInfos = res.data.discountInfos
          if(this.discountInfos){
              this.companyIntegralData = [],
              this.discountInfos.forEach((item,index)=>{
                let discountInfo = {integral: item.begIntegral,integralEnd:item.endIntegral,discount:item.discountNum}
                this.companyIntegralData.push(discountInfo)
              })
          }
          //封装报名项信息
          this.configurationData = res.data.applyItem
          this.configurationData.forEach((item,index)=>{
            item.activityApplyItem = item.options
            if (item.applyItemType == '0') {
              item.applyItemType = '单选'
            } else if (item.applyItemType == '1') {
              item.applyItemType = '多选'
            } else {
              item.applyItemType = '填空'
            }
          })

          //封装评分项信息
          this.activityScoreInfo = res.data.scoreRels
          this.activityScoreInfo.forEach((item,index)=>{
            item.value = item.scoreName
          })
        } else {
          // 失败提示
          this.$message.error(res.msg)
        }
      })
    },
     // 获取活动评分列表
    getActivityScoreList(){
      this.$api.getActivityScoreList().then(res=>{
        if (res.status === "0") {
          this.scoreList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    //添加活动
    getActivity(params){
      this.$api.getActivity(params).then(res=>{
        this.$alert(res.msg)
        this.$router.push({ name: "activityInfo"});
      })
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    addScore(){
      if(this.activityScoreInfo.length < 10){
        this.activityScoreInfo.push({valueArr:this.scoreList})
      }
    },
    addContent(){
      this.activityApplyItem = [{
          applyItemName:'',
          applyItemType:'',
          hasFill:'',
          optionName:''
        }]
      this.dialogContentVisible = true
    },
    changeData(val){
      if (val < 100) {
        this.endState = true
      }
    },
    addSelectContent(){
      this.activityApplyItem.push({
          applyItemName:'',
          applyItemType:'',
          hasFill:'',
          optionName:''
        })
    },
    // 校验活动规则
    addCompanyIntegral(end,discount){
      this.endData = end
      if (!end) {
        this.$alert('请输入区间')
      } else if (!discount){
        this.$alert("请输入折扣值")
      } else if(Number(end)>100){
        this.$alert('请输入小于或者等于100的数值区间')
      } else if (Number(end) === 100){
        this.endState = false
      } else {
        this.companyIntegralData.push({
          integral:Number(end)+0.1
        })
      }
    },
    // 删除活动规则选项
    cancleCompanyIntegral(index){
      this.companyIntegralData.splice(index,1)
      this.endState = true
    },
    //人员范围判断
    personnelSelect(val){
        if(val == 1) {
          this.scoreOneState = true
        }else{
          this.scoreOneState = false
        }
        let forFree = this.activityInfo.forFree;
        if(forFree != undefined){
          if(forFree == 1&&val == 0){
            this.enterpriseEmpPriceStatus = true
            this.visitorPriceStatus = true
          }else if(forFree == 1&&val == 1){
            this.enterpriseEmpPriceStatus = true
            this.visitorPriceStatus = false
          }else if(forFree == 1&&val == 2){
            this.enterpriseEmpPriceStatus = false
            this.visitorPriceStatus = true
          }
        }
    },
    //是否有报名费
    feeSelect(val){
      if(val == "0") {//没有报名费
          this.enterpriseEmpPriceStatus = false
          this.visitorPriceStatus = false
      }else{//有报名费
        let applyScope = this.activityInfo.applyScope
        if(applyScope != undefined){
          if(applyScope == "0"){
            this.enterpriseEmpPriceStatus = true
            this.visitorPriceStatus = true
            this.companyIntegralData = [{integral: 1}]
          }else if(applyScope == "1"){
            this.enterpriseEmpPriceStatus = true
            this.companyIntegralData = [{integral: 1}]
          }else if(applyScope == "2"){
            this.visitorPriceStatus = true
          }
        }
      }
    },
    // 是否填写判断
    signSelect(val){
      if (val === '1') {
        this.signState = true
      } else {
        this.signState = false
      }
    },
    // 报名信息配置提交
    submit(){
      this.selectTitle = `${this.$refs.item1[0].label}:`
      this.selectType = `${this.$refs.item2[0].label}:`
      if (!this.activityApplyItem[0].applyItemName) {
        this.$alert('请输入标题')
      } else if (this.activityApplyItem[0].applyItemType === '') {
        this.$alert('请输入选项类型')
      } else if (!this.activityApplyItem[0].optionName&&this.activityApplyItem[0].applyItemType != 2) {
        this.$alert('请输入选项内容')
      } else if (this.activityApplyItem[0].hasFill === ''&&this.activityApplyItem[0].applyItemType != 2) {
        this.$alert('请选择是否填写')
      } else {
        for(let item of this.activityApplyItem){
          this.activityApplyItem2.push({
              hasFill:item.hasFill,
              optionName:item.optionName,
              applyItemName:item.applyItemName,
              applyItemType:item.applyItemType,
              selectNumber:'',
            })
        }
        if (this.activityApplyItem2[0].applyItemType === 0){
          this.activityApplyItem2[0].applyItemType = "单选"
          this.activityApplyItem2[0].selectNumber = "0"
        } else if (this.activityApplyItem2[0].applyItemType === 1) {
          this.activityApplyItem2[0].applyItemType = "多选"
          this.activityApplyItem2[0].selectNumber = "1"
        } else{
          this.activityApplyItem2[0].applyItemType = "填空"
          this.activityApplyItem2[0].selectNumber = "2"
        }
        this.configurationData.push({
          index:this.index,
          selectTitle:this.selectTitle,
          applyItemName:this.activityApplyItem2[0].applyItemName,
          selectType:this.selectType,
          applyItemType:this.activityApplyItem2[0].applyItemType,
          selectNumber:this.activityApplyItem2[0].selectNumber,
          activityApplyItem:this.activityApplyItem2
        })
        this.dialogContentVisible = false
        this.activityApplyItem2 = [],
        this.activityApplyItem = [{
          applyItemName:'',
          applyItemType:'',
          hasFill:'',
          optionName:''
        }]
      }
    },
    //活动规则提交
    submit2(){
      if(!this.companyIntegralData[this.companyIntegralData.length-1].integralEnd){
        this.$alert('请输入积分区间')
      } else if (this.companyIntegralData[this.companyIntegralData.length-1].integralEnd < 0){
        this.$alert('请输入正确的积分区间')
      } else if (this.companyIntegralData[this.companyIntegralData.length-1].integralEnd > 100) {
        this.$alert('请输入小于100的积分区间')
      } else if (!this.companyIntegralData[this.companyIntegralData.length-1].discount){
        this.$alert('请输入折扣')
      } else if (this.companyIntegralData[this.companyIntegralData.length-1].discount > 100) {
        this.$alert('折扣区间在0~100，请输入正确的折扣')
      } else if (this.companyIntegralData[this.companyIntegralData.length-1].discount < 0) {
        this.$alert('折扣区间在0~100，请输入正确的折扣')
      } else {
        this.dialogRuleVisible = false
      }
    },
    //活动规则取消
    cancle2(){
      this.dialogRuleVisible = false
    },
    // 新增提交
    submitAll(formName){
      let scoreItem = ''
      let activityScoreArr = []
      let activityScoreString = ''
      let activityApplyItem = []
      let formatArr = []
      let formatString = ''
      let applyItems = ''
      let applyItems2 = ''
      let companyIntegralArr = []
      let companyString = ''
      let companyIntegralString = ''
      // 以下依次是传给后端的数据格式
      this.configurationData.forEach((item,index)=>{
        activityApplyItem = []
        item.activityApplyItem.forEach((item2,index2)=>{
          applyItems2 = `${item2.optionName}_${item2.hasFill}`
          activityApplyItem.push(applyItems2)
        })
        if (item.selectNumber) {
          applyItems = `${item.applyItemName}-${item.selectNumber}-${activityApplyItem.join('/')}`
        } else {
          if (item.applyItemType == '单选') {
              item.applyItemType = '0'
            } else if (item.applyItemType == '多选') {
              item.applyItemType = '1'
            } else {
              item.applyItemType = '2'
            }
          if(item.applyItemType == '2'){
            applyItems = `${item.applyItemName}-${item.applyItemType}`
          }else{
            applyItems = `${item.applyItemName}-${item.applyItemType}-${activityApplyItem.join('/')}`
          }
        }
        formatArr.push(applyItems)
      })
      formatString = formatArr.join()
      this.activityScoreInfo.forEach((item,index)=>{
        if (item.valueArr) {
          item.valueArr.forEach((item2,index2)=>{
            if(item2.scoreItemId === item.value){
              scoreItem = `${item.value}-${item2.scoreItemName}`
            }
          })
        } else {
          scoreItem = `${item.scoreItemId}-${item.scoreName}`
        }
        activityScoreArr.push(scoreItem)
      })
      activityScoreString = activityScoreArr.join()
      if(this.activityInfo.forFree != 0&&this.activityInfo.applyScope != 2){
        this.companyIntegralData.forEach((item,index)=>{
          companyString = `${item.integral}-${item.integralEnd}-${item.discount}`
          companyIntegralArr.push(companyString)
        })
        companyIntegralString = companyIntegralArr.join()
      }
      let activityVo = {
        id:this.activityInfo.id,
        projectId:this.activityInfo.projectId,
        activityName:this.activityInfo.activityName,
        activityBegTime:window.moment(this.activityInfo.activityBegTime).format('YYYY-MM-DD HH:mm:ss'),
        activityEndTime:window.moment(this.activityInfo.activityEndTime).format('YYYY-MM-DD HH:mm:ss'),
        activityIntroduce:this.activityInfo.activityIntroduction,
        activityCoverUrl:this.activityInfo.activityCoverUrl,
        activityCeiling:this.activityInfo.activityCeiling,
        applyBegTime:window.moment(this.activityInfo.applyBegTime).format('YYYY-MM-DD HH:mm:ss'),
        applyEndTime:window.moment(this.activityInfo.applyEndTime).format('YYYY-MM-DD HH:mm:ss'),
        applyScope:this.activityInfo.applyScope,
        integralScope:this.activityInfo.integralScope,
        enterpriseEmpPrice:this.activityInfo.enterpriseEmpPrice,
        visitorPrice:this.activityInfo.visitorPrice,
        activityPosition:this.activityInfo.activityPosition,
        applyItems: formatString,
        scoreInfos: activityScoreString,
        activityDiscountInfos: companyIntegralString,
        fileUploadId:this.fileUploadId,
        assetCorpAccount:this.activityInfo.assetCorpAccount,
        forFree:this.activityInfo.forFree
      }
      if(this.activityInfo.activityEndTime < this.activityInfo.applyEndTime){
        this.$alert('活动报名结束时间不能晚于活动结束时间')
      }else if(this.activityInfo.activityBegTime >= this.activityInfo.activityEndTime){
        this.$alert('活动开始时间不能晚于活动结束时间')
      }else if(this.activityInfo.applyBegTime >= this.activityInfo.applyEndTime){
        this.$alert('活动报名开始时间不能晚于活动报名结束时间')
      }else if (!activityVo.scoreInfos) {
        this.$alert('请输入活动评分')
      } else if (this.activityInfo.forFree == 1&&this.activityInfo.applyScope != 2&&!this.companyIntegralData[this.companyIntegralData.length-1].integralEnd) {
        this.$alert('请输入报名折扣规则')
      } else if (!activityVo.applyItems) {
        this.$alert('请输入报名信息配置')
      } else {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getActivity(activityVo)
          } else {
            console.log('error submit!!');
            return false;
          }
        });      
      }
       
    },
    cancle(){
      this.dialogContentVisible = false
    },
    cancleAll(){
      this.$router.push({ name: "activityInfo"});
    },
    cancleContentData(index){
      this.configurationData.splice(index,1)
    },
    cancleSelectData(index){
      this.activityApplyItem.splice(index,1)
    },
    cancleScoretData(index){
      this.activityScoreInfo.splice(index,1)
    },
    handleRemove(){
      this.hasShow = false
    },
    handleAvatarSuccess(res, file) {
      this.activityInfo.activityCoverUrl = URL.createObjectURL(file.raw);
      this.activityInfo.activityCoverUrl = res.data.filePath;
      this.fileId = res.data.id;
      this.hasShow = true
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'||file.type === 'image/jpg'||file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 jpg/jpeg/png 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }

      return isJPG && isLt2M;
    }
  }
}
</script>
<style lang="scss" scoped>
.activityAdd{
  height:660px;
  background:#FFFFFF;
  display:flex;
  .activityAdd-left{
    width:80%;
    background:#FFFFFF;
    border-right: 10px solid rgba(240,242,245,1);
    padding:10px;
    overflow-y:scroll;
    .left-title{
      text-align: center;
      font-size: 18px;
      color:#303133;
      margin-bottom:10px;
      position: relative;
      img{
        vertical-align: middle;
        position: absolute;
        right: 33px;
        top: 20px;
      }
    }
  }
  .activityAdd-right{
    width:50%;
    background:#999999;
    .right-top{
      height:50%;
      padding:10px;
      background:#FFFFFF;
      overflow-y:scroll;
      .top-tag{
        display:flex;
        flex-wrap: wrap;
        p{
          margin-left:10px;
          margin-top:6px
        }
      }
      .top-title{
        text-align: center;
        font-size: 18px;
        color:#303133;
        margin-bottom:10px;
        position: relative;
        img{
          vertical-align: middle;
          position: absolute;
          right:20px
        }
      }
      .top-content{
        border: 1px solid rgba(225,225,225,0.5);
        margin-bottom:6px;
        padding:6px;
        border-radius: 4px;
        box-shadow: 0px 4px 0px 0px rgba(225,225,225,0.1);
        position: relative;
        .contentTitle{
          display:flex;
          font-size: 14px;
          color: #606266;
          p:last-child{
            margin-left:10px
          }
        }
        img{
          position: absolute;
          right:20px;
          top:50%;
          margin-top: -16px
        }
      }
    }
    .right-bottom{
      border-top: 10px solid rgba(240,242,245,1);
      height: 42.5%;
      padding:10px;
      background:#FFFFFF;
      overflow-y:scroll;
      .bottom-title{
        text-align: center;
        font-size: 18px;
        color:#303133;
        margin-bottom:10px;
        position: relative;
        img{
          vertical-align: middle;
          position: absolute;
          right:20px
        }
      }
      .bottom-content{
        img{
          position: absolute;
          top:6px;
          right:-40px
        }
      }
    }
  }
  .activityAddDialog{
    .activityAddDialog-row{
      display:flex;
      justify-content: center;
      .imgAdd{
        position: absolute;
        right:-40px;
        top:6px
      }
      .imgDel{
        width: 26px;
        position: absolute;
        right:-80px;
        top:6px
      }
    }
    .activityAddDialog-button{
      display:flex;
      justify-content: center
    }
    img{
      position: absolute;
      right:66px;
      top:14px
    }
    .discount{
        margin-left:360px
      }
    .ruleInput{
      position: relative;
      margin-top: 20px;
      margin-bottom: 20px;
      span{
        display:inline-block;
        width: 100px;
        height:40px;
        line-height: 40px;
        text-align: center
      }
      .img1{
          position: absolute;
          right:44px;
          top:11px;
          width: 24px;
        }
        .img2{
          position: absolute;
          right:12px;
          top:11px
        }
    }
  }
}
.activityAddAllDialog-button{
  margin-top:30px;
  display:flex;
  justify-content: center;
  padding:10px
}
.hidden-add /deep/ .el-upload--picture-card{
  display:none;
}
</style>
