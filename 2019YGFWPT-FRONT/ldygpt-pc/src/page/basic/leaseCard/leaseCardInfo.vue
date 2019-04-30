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
            <el-form-item label="长租卡名称" prop="leaseCardName">
                <el-input v-model="formSearch.leaseCardName" placeholder="长租卡名称"></el-input>
            </el-form-item>
            <el-form-item label="出售范围" prop="sallScope">
                  <el-select v-model="formSearch.sallScope" class="el-select">
                      <el-option
                      v-for="item in sallScopeList"
                      :key="item.id"
                      :label="item.dname"
                      :value="item.dcode">
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
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-row class="mgb15">
                <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
                <el-button size="small" round type="danger" @click="deleteLeaseCard('all')">批量删除</el-button>
                <el-button size="small" round type="danger" @click="change(0)">上架</el-button>
                <el-button size="small" round type="danger" @click="change(1)">下架</el-button>
            </el-row>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
          <el-table-column prop="projectName" label="所属项目" align="center">
          </el-table-column>
          <el-table-column prop="parkLotName" label="所属停车场" align="center">
          </el-table-column>
            <el-table-column prop="leaseCardName" label="长租卡名称" align="center">
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
            <el-table-column prop="leaseCardPrice" label="价格/元" align="center">
            </el-table-column>
            <el-table-column prop="sallScope" label="出售范围" align="center">
                <template slot-scope="scope">
                    <span v-if="scope.row.sallScope==0">全部</span>
                    <span v-if="scope.row.sallScope==1">企业人员</span>
                    <span v-if="scope.row.sallScope==2">游客</span>
                </template>
            </el-table-column>
            <el-table-column prop="leaseCardStatus" label="状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.leaseCardStatus==0 ?'上架':'下架' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" @click="getDetail(scope.row)" v-if="scope.row.leaseCardStatus==1">编辑</el-button>
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
        <!-- 新增弹框---start -->
        <el-dialog :title="openType == 'add'? '新增': '修改 '" :visible.sync="dialogAddVisible" width="700px">
             <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
               <el-form-item label="所属项目" prop="projectId" >
                 <el-select v-model="formAdd.projectId" filterable class="el-select" :disabled="openType =='add'?false:true" @change="findParkLotInfoList">
                   <el-option
                     v-for="item in projectInfoList"
                     :key="item.projectId"
                     :label="item.projectName"
                     :value="item.projectId">
                   </el-option>
                 </el-select>
               </el-form-item>
               <el-form-item label="所属停车场" prop="parkLotId" >
                     <el-select v-model="formAdd.parkLotId" filterable class="el-select" :disabled="openType =='add'?false:true">
                         <el-option
                         v-for="item in parkLotInfoList"
                         :key="item.id"
                         :label="item.parkLotName"
                         :value="item.id">
                         </el-option>
                     </el-select>
                 </el-form-item>
               <el-form-item label="长租卡名称" prop="leaseCardName">
                 <el-input v-model="formAdd.leaseCardName" placeholder="长租卡名称" maxlength="20"></el-input>
               </el-form-item>
                <el-form-item label="长租卡类型" prop="leaseCardType">
                  <el-select v-model="formAdd.leaseCardType" class="el-select" :disabled="openType =='add'?false:true">
                    <el-option
                      v-for="item in leaseCardTypeList"
                      :key="item.id"
                      :label="item.dname"
                      :value="item.dcode">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="价格" prop="leaseCardPrice">
                  <el-input-number v-model="formAdd.leaseCardPrice" :precision="2" :step="100" :min="0" :max="100000000" placeholder="请输入价格"></el-input-number>
                </el-form-item>
                <el-form-item label="出售范围" prop="sallScope">
                    <el-select v-model="formAdd.sallScope" class="el-select">
                        <el-option
                        v-for="item in sallScopeList"
                        :key="item.id"
                        :label="item.dname"
                        :value="item.dcode">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 新增弹框---end -->
    </div>
</template>

<script>
    export default {
        name: "leaseCardInfo",
        data() {
            return {
                selectValue: [],
                formSearch: { //表单查询
                  parkLotId: '',
                  leaseCardName: '',
                  leaseCardType: '',
                  sallScope: ''
                },
                dialogAddVisible: false,    //添加弹框显示
                selectListId: [],
              parkLotInfoList: [],
                listLoading: false,//
                openType: 'add', //add新增 mof修改
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                                },
                projectInfoList:[],
                sallScopeList:[],
                leaseCardTypeList:[],
                tableData: [],
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                rulesAdd: {
                  projectId: [{required: true, message: "请选择所属园区", trigger: "blur"}],
                  parkLotId: [{required: true, message: "请选择所属停车场", trigger: "blur"}],
                  leaseCardName: [{required: true, message: "请输入长租卡名称", trigger: "blur"}],
                  leaseCardType: [{required: true, message: "请选择长租卡时段", trigger: "blur"}],
                  sallScope: [{required: true, message: "请选择长租卡出售范围", trigger: "blur"}],
                  leaseCardPrice: [{required: true, message: "请输入长租卡价格", trigger: "blur"}]

                },
              parkLot_Id:''
            };
        },
        mounted() {
          this.getLeaseCardInfoList()
         // this.findParkLotList()
          this.getLeaseCardTypeList()
          this.getSallScopeList()
          this.findProjectInfoList()

        },
        methods: {
          getLeaseCardInfoList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    parkLotId: this.formSearch.parkLotId,
                    leaseCardName: this.formSearch.leaseCardName,
                    leaseCardType: this.formSearch.leaseCardType,
                    sallScope: this.formSearch.sallScope,
                    projectId:this.formSearch.projectId
                }
                this.$api.getLeaseCardInfoList(params).then(res => {
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
                this.getLeaseCardInfoList()
            },
            reset() {
                this.formSearch.parkLotId = ''
                this.formSearch.leaseCardName = ''
                this.formSearch.leaseCardType = ''
                this.formSearch.sallScope = ''
              this.formSearch.projectId=''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getLeaseCardInfoList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getLeaseCardInfoList()
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
            this.formAdd.parkLotId = ''
            this.formSearch.parkLotId = ''
            this.$api.getParkLotInfoListByProjectId(params).then(res=>{
              if (res.code === 0) {
                this.formAdd = {
                  parkLotId:'',
                  projectId :this.formAdd.projectId,
                  leaseCardName: this.formAdd.leaseCardName,
                  leaseCardType: this.formAdd.leaseCardType,
                  sallScope: this.formAdd.sallScope,
                  leaseCardPrice: this.formAdd.leaseCardPrice
                }
                this.formSearch = {
                  parkLotId:'',
                  projectId :this.formSearch.projectId,
                  leaseCardName: this.formSearch.leaseCardName,
                  leaseCardType: this.formSearch.leaseCardType,
                  sallScope: this.formSearch.sallScope
                }

                this.parkLotInfoList = res.data
              } else {
                this.$message.error(res.msg)
              }
            })
          },

            submit() {
              this.saveLeaseCard();
            },
          saveLeaseCard() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        if (this.openType == 'mof') {
                          this.formAdd.parkLotId = this.parkLot_Id

                          console.log("parkLotId ----- parkLot_Id------------"+this.parkLot_Id)
                        }
                        this.$api.saveLeaseCard(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getLeaseCardInfoList()
                              if (this.openType == 'add') {
                                this.$message.success('新增成功')
                              }else{
                                this.$message.success('修改成功')
                              }
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            openAdd() {
                this.formAdd = {}
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
            },
         /* findParkLotList () {
            let params = {
            }
            this.$api.findParkLotList(params).then(res => {
              if (res.code === 0) {
                this.parkLotList = res.data
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },*/
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
          change(status) {
            if(this.selectListId.join(',')==null || this.selectListId.join(',')==''){
              this.$message.error("请先选择要操作的选项")
            }else{
              let params = {
                ids: this.selectListId.join(','),
                cardStatus: status
              }
              this.$api.updateCardStatus(params).then(res => {
                if (res.code === 0) {
                  this.getLeaseCardInfoList()
                  this.$message.success('操作成功')
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
            }

          },
          deleteLeaseCard(type, id) {
            if (type == 'all') {
              if(this.selectListId.join(',')==null || this.selectListId.join(',')==''){
                this.$message.error("请先选择要操作的选项")
              }else{
                this.$confirm('确定要删除吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  let params = {
                    ids: this.selectListId.join(',')
                  }
                  this.$api.deleteLeaseCard(params).then(res => {
                    if (res.code === 0) {
                      this.getLeaseCardInfoList()
                      this.$message.success('删除成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                })
              }
            }
          },

            getDetail(data) {
                let params = {
                    id: data.id
                }
                this.$api.getLeaseCardDetails(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true

                      this.parkLot_Id = ''
                      this.parkLot_Id = res.data.parkLotId

                      this.formAdd = res.data

                      console.log("res.data------------"+res.data)
                      console.log("res.data.parkLotId------------"+res.data.parkLotId)
                        this.formAdd.leaseCardType=''+res.data.leaseCardType
                        this.formAdd.sallScope=''+res.data.sallScope
                        this.formAdd.parkLotId = res.data.parkLotName



                      console.log("parkLot_Id------------"+this.parkLot_Id)
                    } else {
                        // 失败提示
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
</style>
