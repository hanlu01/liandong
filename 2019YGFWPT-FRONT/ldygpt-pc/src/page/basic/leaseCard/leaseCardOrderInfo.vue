<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
          <el-form-item label="所属项目" prop="projectId" >
            <el-select v-model="formSearch.projectId" filterable class="el-select" @change="findParkLotInfoList">
              <el-option
                v-for="item in projectInfoList"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属停车场" prop="parkLotId" >
            <el-select v-model="formSearch.parkLotId" filterable class="el-select">
              <el-option
                v-for="item in parkLotInfoList"
                :key="item.id"
                :label="item.parkLotName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="长租卡类型" prop="leaseCardType">
            <el-select v-model="formSearch.leaseCardType" class="el-select">
              <el-option
                v-for="item in leaseCardTypeList"
                :key="item.id"
                :label="item.dname"
                :value="item.dcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="formSearch.userType" class="el-select">
              <el-option
                v-for="item in sallScopeList"
                :key="item.id"
                :label="item.dname"
                :value="item.dcode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="处理状态" prop="isDeal">
            <el-select v-model="formSearch.isDeal" placeholder="处理状态">
              <el-option label="未处理" value="0"></el-option>
              <el-option label="已处理" value="1"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-row class="mgb15">

            </el-row>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="orderNo" label="订单编码" align="center">
            </el-table-column>
          <el-table-column prop="projectName" label="所属项目" align="center">
          </el-table-column>
          <el-table-column prop="parkLotName" label="所属停车场" align="center">
          </el-table-column>
            <el-table-column prop="leaseCardType" label="长租卡类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.leaseCardType==0">周</span>
                <span v-if="scope.row.leaseCardType==1">月</span>
                <span v-if="scope.row.leaseCardType==2">俩月</span>
                <span v-if="scope.row.leaseCardType==3">季度</span>
                <span v-if="scope.row.leaseCardType==4">半年</span>
                <span v-if="scope.row.leaseCardType==5">年</span>
                <span v-if="scope.row.leaseCardType==6">永久</span>
              </template>
            </el-table-column>
            <el-table-column prop="serialNumber" label="支付流水号" align="center">
            </el-table-column>
            <el-table-column prop="orderAmount" label="支付金额/元" align="center">
            </el-table-column>
            <el-table-column prop="orderTime" label="支付时间" :formatter="dateFormat" align="center">
            </el-table-column>
            <el-table-column prop="userType" label="用户类型" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.userType==0">全部</span>
                    <span v-if="scope.row.userType==1">企业人员</span>
                    <span v-if="scope.row.userType==2">游客</span>
                </template>
            </el-table-column>
          <el-table-column prop="userTel" label="用户电话" align="center">
          </el-table-column>
            <el-table-column prop="isDeal" label="状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.isDeal==0 ?'未处理':'已处理' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getDetail(scope.row.orderNo)">订单明细</el-button>
                    <el-button size="mini"  plain type="danger" v-if="scope.row.isDeal==0" @click="deleteOrder(scope.row.id)">订单作废</el-button>
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
        <!-- 购买明细弹框---start -->
      <el-dialog title="购买明细" :visible.sync="dialogAddVisible" width="1200px">
        <el-table :data="orderItemData"  border style="width: 100%">
          <!--<el-table-column prop="orderId" label="订单主键" align="center">
          </el-table-column>-->
          <el-table-column  prop="orderNo" label="订单编码"  align="center">
          </el-table-column>
          <el-table-column prop="leaseCardType" label="长租卡类型"  align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.leaseCardType==0">周</span>
              <span v-if="scope.row.leaseCardType==1">月</span>
              <span v-if="scope.row.leaseCardType==2">俩月</span>
              <span v-if="scope.row.leaseCardType==3">季度</span>
              <span v-if="scope.row.leaseCardType==4">半年</span>
              <span v-if="scope.row.leaseCardType==5">年</span>
              <span v-if="scope.row.leaseCardType==6">永久</span>
            </template>
          </el-table-column>
          <el-table-column prop="begTime" label="开始时间"  width="245px" align="center">
            <template scope="scope">
              <el-date-picker type="date" @change="getEndTime(scope.row)" :picker-options="pickerOptions" :clearable="false"
                              :editable="false" v-model="scope.row.begTime"   :disabled="flag"
                              value-format="yyyy-MM-dd"  format="yyyy-MM-dd">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="截止时间" width="245px" align="center">
            <template scope="scope">
              <el-date-picker type="date" :clearable="false" :editable="false" :disabled="true" v-model="scope.row.endTime"
                              value-format="yyyy-MM-dd" format="yyyy-MM-dd">

              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column prop="contactName"  label="联系人姓名" align="center">
          </el-table-column>
          <el-table-column prop="contactTeL" label="联系人电话"  align="center">
          </el-table-column>
          <el-table-column prop="carNumber" label="车牌号"  align="center">
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">处 理</el-button>
        </div>
      </el-dialog>
        <!-- 购买明细弹框---end -->
    </div>
</template>

<script>
    export default {
        name: "leaseCardOrderInfo",
        data() {
            return {
                selectValue: [],
                formSearch: { //表单查询
                },
                dialogAddVisible: false,    //添加弹框显示
                selectListId: [],
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
              flag:false,
              payStatus:'',
              is_deal : '',
              projectInfoList:[],
              parkLotInfoList: [],
                sallScopeList:[],
                leaseCardTypeList:[],
                orderItemData:[],
                tableData: [],
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() < Date.now() - 8.64e7
                }
              },
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px' //lable宽度

            };
        },
      created() {
        this.getSallScopeList()
        this.getLeaseCardTypeList()
        this.findProjectInfoList()
      },
        mounted() {
          this.getLeaseCardOrderInfoList()
        },
        methods: {
          getLeaseCardOrderInfoList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    leaseCardType: this.formSearch.leaseCardType,
                    userType: this.formSearch.userType,
                    isDeal: this.formSearch.isDeal,
                  projectId: this.formSearch.projectId,
                  parkLotId:this.formSearch.parkLotId
                }
                this.$api.getLeaseCardOrderInfoList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            dateFormat(row, column, cellValue, index){
              var t=new Date(row.orderTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
              return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();
            },

            search() {
                this.pageInfo.currentPage = 1
                this.getLeaseCardOrderInfoList()
            },
            reset() {
                this.formSearch.leaseCardType=''
                this.formSearch.userType=''
                this.formSearch.isDeal=''
                this.formSearch.projectId = ''
                this.formSearch.parkLotId = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getLeaseCardOrderInfoList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getLeaseCardOrderInfoList()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },

          getLeaseCardTypeList () {
            let params = {
            }
            this.$api.getLeaseCardTypeList(params).then(res => {
              if (res.code === 0) {
                this.leaseCardTypeList = res.data
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },
          getSallScopeList () {
            let params = {
            }
            this.$api.getSallScopeList(params).then(res => {
              if (res.code === 0) {
                this.sallScopeList = res.data
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },
          //获取园区列表
          findProjectInfoList(){
            this.$api.findProjectInfoList().then(res=>{
              if (res.code === 0){
                this.projectInfoList = res.data
              }
            })
          },
          //通过项目id获取停车场列表
          findParkLotInfoList(val){
            let params = {
              projectId: val
            }
            this.formSearch.parkLotId = ''
            this.$api.getParkLotInfoListByProjectId(params).then(res=>{
              if (res.code === 0) {
                this.formSearch = {
                  parkLotId:'',
                  projectId :this.formSearch.projectId
                }

                this.parkLotInfoList = res.data
              } else {
                this.$message.error(res.msg)
              }
            })
          },
          getDetail(val) {
            let params = {
              orderNo: val
            }
            this.is_deal = ''
            this.$api.getLeaseCardOrderItemList(params).then(res => {
              if (res.code === 0) {
                console.log("res.data====",res.data)
                this.orderItemData = res.data
                this.payStatus = res.data[0].paymentStatus
                this.is_deal = res.data[0].isDeal
                if(this.is_deal==1){
                  this.flag = true
                }else {
                  this.flag = false
                }
                this.dialogAddVisible = true
                console.log("this.payStatus====",this.payStatus)
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },
          getEndTime (item) {
            console.log(item)
            console.log(item.begTime)
            let params = {
              begTime:item.begTime,
              orderInfoId:item.orderId,
            }
            this.$api.getEndTimeByBegTime(params).then(res => {
              if (res.code === 0) {
                console.log("res.data.endTime====",res.data)
                item.endTime = res.data
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },
          submit() {
            if(this.is_deal==1){
              this.$message.error("操作失败，只能操作未处理的订单！")
              return
            }
            let orderItemIds=[]
            let orderInfoId=this.orderItemData[0].orderId
            let begTimes=[]

            this.orderItemData.forEach((item,index)=>{
              console.log("item.begTime======",item.begTime);
              //console.log("moment--item.begTime======",moment(item.begTime).format("yyyy-MM-dd HH:mm:ss"));
              orderItemIds.push(item.id)
              begTimes.push(item.begTime)
            })
            let ids = orderItemIds.join()
            let times = begTimes.join()
            let params = {
              orderItemIdStr:ids,
              orderInfoId:orderInfoId,
              begTimeStr:times
            }
            console.log("params====",params);
           this.dealLeaseCardTime(params);
          },
          cancel() {
            this.dialogAddVisible = false
            this.getLeaseCardOrderInfoList()
          },
          dealLeaseCardTime(params) {
            this.$api.dealLeaseCardTime(params).then(res => {
              if (res.code === 0) {
                this.dialogAddVisible = false
                this.getLeaseCardOrderInfoList()
                this.$message.success('修改成功')
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },
          deleteOrder(id) {
            this.$confirm('作废订单后需要自行去进行退款申请，确定要作废该订单吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let params = {
                uid: id
              }
              this.$api.deleteOrder(params).then(res => {
                if (res.code === 0) {
                  this.getLeaseCardOrderInfoList()
                  this.$message.success('操作成功')
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
            })
          }
        }
    };
</script>
<style lang="scss" scoped>
    // 设置输入框的宽度
        .el-form-item__content {
            width: 300px;
        }

</style>
