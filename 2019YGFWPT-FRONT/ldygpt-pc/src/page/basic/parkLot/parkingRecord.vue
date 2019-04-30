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
          <el-form-item label="进入时间" prop="inDateTime">
            <el-date-picker
              v-model="formSearch.inDateTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择车辆进入时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="出入时间" prop="outDateTime">
            <el-date-picker
              v-model="formSearch.outDateTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择车辆出入时间">
            </el-date-picker>
          </el-form-item>
            <el-form-item label="车牌号" prop="carNumber">
              <el-input v-model="formSearch.carNumber" placeholder="车牌号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-row class="mgb15">
               <!-- <el-button size="small" round type="primary" @click="openAdd">新增</el-button>-->
            </el-row>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <!--<el-table-column type="selection" width="60">
            </el-table-column>-->
            <el-table-column prop="projectName" label="所属项目" align="center">
            </el-table-column>
            <el-table-column prop="parkLotName" label="停车场名称" align="center">
            </el-table-column>
            <el-table-column prop="carNumber" label="车牌号" align="center">
            </el-table-column>
            <el-table-column prop="inDateTime" label="车辆进入时间" value-format="yyyy-MM-dd"  format="yyyy-MM-dd" align="center">
            </el-table-column>
            <el-table-column prop="outDateTime" label="车辆出入时间" value-format="yyyy-MM-dd"  format="yyyy-MM-dd" align="center">
            </el-table-column>
            <el-table-column prop="vendorCode" label="停车场供应商" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.vendorCode=='ETCP'">ETCP</span>
                <span v-if="scope.row.vendorCode=='TJD'">停简单</span>
              </template>
            </el-table-column>
            <el-table-column prop="parkAmount" label="停车费/元" align="center">
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
        name: "parkingRecord",
        data() {
            return {
                selectValue: [],
                formSearch: { //表单查询
                    projectId:'',
                    parkLotId:'',
                    inDateTime:'',
                    outDateTime:'',
                    carNumber:''
                },
                selectListId: [],
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
              projectInfoList:[],
              parkLotInfoList: [],
                tableData: [],
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                rulesAdd: {

                }

            };
        },
        mounted() {
            this.getParkingRecordList()
            this.findProjectInfoList()
        },
        methods: {
          getParkingRecordList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    projectId: this.formSearch.projectId,
                  parkLotId:this.formSearch.parkLotId,
                  inDateTime:this.formSearch.inDateTime,
                  outDateTime:this.formSearch.outDateTime,
                  carNumber:this.formSearch.carNumber
                }
                this.$api.getParkingRecordList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                      console.log(res.data)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },

            search() {
                this.pageInfo.currentPage = 1
                this.getParkingRecordList()
            },
            reset() {
                this.formSearch.projectId = ''
              this.formSearch.parkLotId = ''
                this.formSearch.inDateTime = ''
                this.formSearch.outDateTime = ''
               this.formSearch.carNumber = ''

            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getParkingRecordList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getParkingRecordList()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
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
          }

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

        .sys-transfer {
            width: 500px;
            margin: 0 auto;
        }


    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width:100%;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 100%;
        height: 100%;
        display: block;
      }

    .el-select {
        display: inline-block;
        position: relative;
        width: 100%;
    }
</style>
