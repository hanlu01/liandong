<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="企业名称" style="width:18%;">
              <el-input v-model="formSearch.enterName" placeholder="企业名称" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="人员名称" style="width:18%;">
                <el-input v-model="formSearch.applyUserName" placeholder="人员名称" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="报名电话" style="width:18%;">
              <el-input v-model="formSearch.applyUserTel" placeholder="报名电话" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="人员类型" style="width:18%;">
              <el-select v-model="formSearch.applyUserType" placeholder="人员类型" style="width:200px;">
                <el-option label="企业人员" value="0"></el-option>
                <el-option label="游客" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付状态" style="width:18%;">
                <el-select v-model="formSearch.paymentStatus" placeholder="支付状态" style="width:200px;">
                    <el-option label="未支付" value="0"></el-option>
                    <el-option label="已支付" value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="报名状态" style="width:18%;">
              <el-select v-model="formSearch.applyStatus" placeholder="报名状态" style="width:200px;">
                <el-option label="已报名" value="0"></el-option>
                <el-option label="已取消" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round plain type="danger" @click="cancelSignUp()">取消报名</el-button>
            <el-button size="small" round @click="back()">返回活动</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="36">
            </el-table-column>
            <el-table-column prop="enterName" label="所属企业" align="center">
            </el-table-column>
            <el-table-column prop="applyUserName" label="用户名称" align="center">
            </el-table-column>
            <el-table-column prop="applyUserTel" label="电话号码" align="center">
            </el-table-column>
            <el-table-column label="人员类型" align="center" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.applyUserType=='0'?'企业员工':'游客' }}</span>
              </template>
            </el-table-column>
          <el-table-column prop="actualMoney" label="支付金额" align="center">
          </el-table-column>
            <el-table-column label="支付状态" align="center" width="80">
                <template slot-scope="scope">
                  <span>{{(scope.row.forFree=='0'?'无报名费':(scope.row.paymentStatus=='0'?'未支付':(scope.row.paymentStatus=='1'?"已支付":(scope.row.paymentStatus=='2'?"已退款":(scope.row.paymentStatus=='3'?"作废":"支付失败"))))) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="报名状态" align="center" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.applyStatus=='0'?'已报名':'已取消' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="报名时间" align="center">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="190" align="center">
              <template slot-scope="scope">
                <el-button class="btn-size" size="mini" title="报名详情" plain type="success" icon="el-icon-tickets" @click="getFeedbackApplyInfoByUser(scope.row)">报名详情</el-button>
                <el-button class="btn-size" size="mini" title="评分详情" plain type="primary" icon="el-icon-star-off" @click="getFeedbackScoreInfoByUser(scope.row)">评分详情</el-button>
              </template>
            </el-table-column>
        </el-table>
        <el-pagination background
                       layout="total,sizes,prev, pager, next,jumper"
                       :current-page="pageInfo.currentPage"
                       :page-size="pageInfo.pageSize"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :total="pageInfo.pageTotal"
                       :page-sizes="[5, 10, 20, 50]">
        </el-pagination>
        <!-- 表格---end -->

      <!-- 报名信息弹框 ---start -->
      <el-dialog title="报名信息" :visible.sync="dialogApplyVisible" width="700px">
        <el-form :label-position="labelPosition" label-width="180px" class="add-dialog-form" v-for="item in applyItems">
          <el-form-item :label="item.applyItemType == 0?item.applyItemName+'(单选)':(item.applyItemType == 1?item.applyItemName+'(多选)':item.applyItemName+'(填空)')" v-if="item.applyItemType != 2">
            <el-checkbox disabled v-for="option in item.options"
                         :label="option.optionName"
                         v-model="item.feedbackValue">
                  <span v-if="option.hasFill == 0">{{option.hasFill == 0? option.optionName + ':' + option.fillContent : option.optionName}}</span>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label="item.applyItemName" v-if="item.applyItemType == 2">
            <el-input :value="item.feedbackValue" :disabled="true" >
            </el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 报名信息弹框 ---end -->

      <!-- 评分信息弹框 ---start-->
      <el-dialog title="评分信息" :visible.sync="dialogScoreVisible" width="700px">
        <el-form :label-position="labelPosition" :label-width="labelWidth" class="add-dialog-form" v-for="item in scoreItems">
          <el-form-item :label="item.scoreItemName" v-if="item.scoreItemType == 0">
            <el-rate
              v-model="item.feedbackValue"
              disabled
              show-text
              text-color="#ff9900">
            </el-rate>
            </el-checkbox>
          </el-form-item>
          <el-form-item :label="item.scoreItemName" v-if="item.scoreItemType == 1">
            <el-input :value="item.feedbackValue"
                      :label="item.scoreItemName" :disabled="true" >
            </el-input>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 评分信息弹框 ---end-->
    </div>
</template>

<script>
    export default {
        name: 'activityApplyUserInfo',
        data() {
            return {
                formSearch: { //表单查询
                    enterName: '',
                    applyUserName: '',
                    applyUserTel: '',
                    applyUserType: '',
                    paymentStatus: ''
                },
                activityId:this.$route.query.activityId,
                applyItems:[],
                scoreItems:{},
                showUpload:false,
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
                selectListId: [],
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                pageInfo2: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                  empSex: 1
                },
                formPwd: {
                    oldPwd: '',
                    newPwd: '',
                    newPwd2: ''
                },
                tableData: [],
                dialogApplyVisible:false,    //添加弹框显示
                dialogScoreVisible:false,
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                fileName: '',
                file: '',
                uploadType:'incremental',
                currentId:'',
                percentage: 0,
                result: '',
                progressBar: false
            };
        },
        mounted() {
            this.getActivityApplyUserList()
        },
        methods: {
            back(){
              this.$router.push('/ld/activityInfo')
            },
            handleChange(value) {
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getActivityApplyUserList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    enterName: this.formSearch.enterName,
                    applyUserName: this.formSearch.applyUserName,
                    applyUserTel: this.formSearch.applyUserTel,
                    applyUserType: this.formSearch.applyUserType,
                    paymentStatus: this.formSearch.paymentStatus,
                    applyStatus: this.formSearch.applyStatus,
                    activityInfoId: this.activityId

                }
                this.$api.getActivityApplyUserList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            uploadOpen() {
              this.showUpload = true
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getActivityApplyUserList()
            },
            reset() {
                this.formSearch.enterName = ''
                this.formSearch.empName = ''
                this.formSearch.applyUserTel = ''
                this.formSearch.applyUserType = ''
                this.formSearch.paymentStatus = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getActivityApplyUserList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getActivityApplyUserList()
            },
            //报名信息
            getFeedbackApplyInfoByUser(data) {
                let params = {
                    activityInfoId:data.activityInfoId,
                    applyUserOpenId:data.applyUserOpenId
                }
                this.$api.getFeedbackApplyInfoByUser(params).then(res => {
                    if (res.code === 0) {
                        this.dialogApplyVisible = true;
                        this.applyItems = res.data.applyItems;
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
          //评分信息
          getFeedbackScoreInfoByUser(data) {
            let params = {
              activityInfoId:data.activityInfoId,
              openId:data.applyUserOpenId
            }
            this.$api.getFeedbackScoreInfoByUser(params).then(res => {
              if (res.code === 0) {
                this.dialogScoreVisible = true;
                if(res.data.scoreItems){
                  this.scoreItems = res.data.scoreItems;
                }else{
                  this.$alert("暂无评分信息")
                }
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },
            showActivityUserInfo(activityId){
                  this.$router.replace({ name: "showActivityUserInfo" ,params:{id:activityId} });
             },
            //取消报名处理
            cancelSignUp(){
              let num = this.selectListId.length;
              if(num == 0){
                this.$message.error("请选择需要取消报名的数据!");
                return false;
              }
              let params = {
                applyIds:this.selectListId.join(',')
              }
              this.$api.cancelSignUp(params).then(res => {
                if (res.code === 0) {
                  this.getActivityApplyUserList()
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
            },
        }
    };
</script>
<style lang="scss" scoped>
    // 设置输入框的宽度
    .el-form-item__content {
        width: 360px;
    }

    .add-dialog-form {
        width: 600px;
        margin: 0 auto;
    }

    .container {
        .btn-size {
            padding: 4px 5px;
        }

        .el-button + .el-button {
            margin-left: 5px;
        }
    }
</style>
