<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="所属项目" prop="projectId" >
              <el-select v-model="formSearch.projectId" class="el-select" filterable >
                <el-option
                  v-for="item in projectList"
                  :key="item.projectId"
                  :label="item.projectName"
                  :value="item.projectId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单号" prop="orderNo">
                <el-input v-model="formSearch.orderNo" placeholder="订单号"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="formSearch.userName" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="userTel">
                <el-input v-model="formSearch.userTel" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="充值状态" prop="chargeStatus">
              <el-select v-model="formSearch.chargeStatus" placeholder="充值状态">
                <el-option label="未充值" value="0"></el-option>
                <el-option label="充值中" value="1"></el-option>
                <el-option label="已充值" value="2"></el-option>
                <el-option label="充值失败" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="formSearch.orderCreateTimeStartVo"
                type="datetime"
                placeholder="选择下单开始时间"
                style="width:196px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="下单时间">
              <el-date-picker
                v-model="formSearch.orderCreateTimeEndVo"
                type="datetime"
                placeholder="选择下单结束时间"
                style="width:196px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="厂商" prop="cardVendor">
              <el-select v-model="formSearch.cardVendor" placeholder="厂商">
                <el-option label="雄伟" value="XW"></el-option>
                <el-option label="小牛" value="XN"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset('formSearch')">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
            <el-table-column prop="orderNo" label="订单号" align="center"></el-table-column>
            <el-table-column prop="orderCreateTime" label="下单时间" align="center" :formatter="this.$common.timestampToTime"></el-table-column>
            <el-table-column prop="serialNumber" label="微信订单号" align="center"></el-table-column>
            <el-table-column prop="projectName" label="所属园区" align="center"></el-table-column>
            <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
            <el-table-column prop="userTel" label="手机号" align="center"></el-table-column>
            <el-table-column prop="totalAmount" label="充值金额" align="center">
              <template slot-scope="scope">
                <span>{{scope.row.totalAmount}}元</span>
              </template>
            </el-table-column>
            <el-table-column prop="cardVendor" label="厂商" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.cardVendor=='XN'">小牛</span>
                <span v-if="scope.row.cardVendor=='XW'">雄伟</span>
              </template>
            </el-table-column>
            <el-table-column prop="paymentTime" label="支付时间" align="center" :formatter="this.$common.timestampToTime"></el-table-column>
            <el-table-column prop="source" label="支付类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.paymentType=='1'">现金</span>
                <span v-if="scope.row.paymentType=='3'">银联</span>
                <span v-if="scope.row.paymentType=='4'">支付宝</span>
                <span v-if="scope.row.paymentType=='5'">微信</span>
              </template>
            </el-table-column>
            <el-table-column prop="chargeStatus" label="充值状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.chargeStatus=='0'">未充值</span>
                <span v-if="scope.row.chargeStatus=='1'">充值中</span>
                <span v-if="scope.row.chargeStatus=='2'">已充值</span>
                <span v-if="scope.row.chargeStatus=='3'">充值失败</span>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="充值类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.source=='0'">微信端充值</span>
                <span v-if="scope.row.source=='1'">后台充值</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
              <template slot-scope="scope">
                <el-button v-has:diningCharge v-if="scope.row.orderStatus=='1' && scope.row.chargeStatus=='3'" size="mini" @click="toCharge(scope.row)">充值</el-button>
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

    </div>
</template>

<script>
    export default {
        name: 'cardOrder',
        data() {
            return {
                formSearch: { //表单查询
                  orderNo: '',
                  userName: '',
                  userTel: '',
                  orderStatus: '',
                  chargeStatus:'',
                  cardVendor:''
                },
                selectListId: [],
                openType: 'mof', //add新增 mof修改
                listLoading: false,
                projectList:[],
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px',
            };
        },
        computed: {},
        created() {
        },
        mounted() {
            this.findDinningCardOrderPage()
            this.findAllProject ()
        },
        methods: {
            toCharge(row){
              this.$confirm('确定要手动充值吗?', '提示', {
                confirmButtonText: '充值',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                let params = {
                  orderNo: row.orderNo
                }
                this.$api.diningCharge(params).then(res => {
                  if (res.code === 0) {
                    this.$message.success('充值成功')
                    this.findDinningCardOrderPage()
                  } else {
                    // 失败提示
                    this.$message.error(res.msg)
                  }
                })
              })
            },
            findAllProject () {
              this.$api.findAllProject().then(res => {
                if (res.code === 0) {
                  this.projectList = res.data
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
            },
            findDinningCardOrderPage() {
                let params = {
                  page: this.pageInfo.currentPage,
                  limit: this.pageInfo.pageSize,
                  orderNo: this.formSearch.orderNo,
                  userName: this.formSearch.userName,
                  userTel : this.formSearch.userTel,
                  orderStatus : this.formSearch.orderStatus,
                  chargeStatus : this.formSearch.chargeStatus,
                  cardVendor : this.formSearch.cardVendor,
                  orderCreateTimeStartVo : this.formSearch.orderCreateTimeStartVo,
                  orderCreateTimeEndVo : this.formSearch.orderCreateTimeEndVo,
                }
                this.$api.findDinningCardOrderPage(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            search() {
                this.pageInfo.currentPage = 1
                this.findDinningCardOrderPage()
            },
            reset(formName) {
              this.$refs[formName].resetFields();
              this.formSearch.orderCreateTimeStartVo = ''
              this.formSearch.orderCreateTimeEndVo = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.findDinningCardOrderPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.findDinningCardOrderPage()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },
        }
    };
</script>
<style lang="scss" scoped>
    // 设置输入框的宽度
    .el-form-item__content {
        width: 300px;
    }

    .add-dialog-form {
        width: 400px;
        margin: 0 auto;
    }
</style>
