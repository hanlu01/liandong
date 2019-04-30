<template>
    <div class="container">
        <iframe name="hidden_frame" style="display: none"></iframe>
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="项目名称">
              <el-select placeholder="请选择项目" filterable v-model="formSearch.projectId" @change="getEnterByProject">
                  <el-option v-for="item in projects"
                             :key="item.projectId"
                             :value="item.projectId"
                              :label="item.projectName">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="企业名称">
              <el-select placeholder="请选择企业" filterable v-model="formSearch.enterId">
                <el-option v-for="item in enters"
                           :key="item.enter_code"
                           :value="item.enter_code"
                           :label="item.enter_name">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="用户名称">
                <el-input v-model="formSearch.empName" placeholder="用户名称" style="width:120px;"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
                <el-input v-model="formSearch.empTel" placeholder="手机号码" style="width:150px;"></el-input>
            </el-form-item>
            <el-form-item label="审批状态">
                <el-select v-model="formSearch.applyStatus" placeholder="审批状态" style="width:106px;">
                    <el-option label="未审" value="0"></el-option>
                    <el-option label="通过" value="1"></el-option>
                    <el-option label="驳回" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增人员</el-button>
            <el-button size="small" round type="danger" @click="deleteEmp('all')">批量删除</el-button>
            <el-button size="small" round type="info" @click="approvalEmp">人员审批</el-button>
            <el-button size="small" round @click="uploadOpen">批量导入</el-button>
            <el-button size="small" round @click="exportEmpData">批量导出</el-button>
            <el-button size="small" round @click="assignAdmin('1')">标记管理员</el-button>
            <el-button size="small" round @click="assignAdmin('0')">取消标记管理员</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column prop="projectName" label="所属项目" align="center">
            </el-table-column>
            <el-table-column prop="enterName" label="企业名称" align="center" width="150">
            </el-table-column>
            <el-table-column prop="empName" label="用户名称" align="center">
            </el-table-column>
            <el-table-column prop="empTel" label="手机号码" align="center">
            </el-table-column>
            <el-table-column label="性别" align="center" width="50">
                  <template slot-scope="scope">
                    <span>{{ scope.row.empSex=='2'?'女':'男' }}</span>
                  </template>
            </el-table-column>
            <el-table-column prop="empIdNumber" label="身份证号" align="center">
            </el-table-column>
            <el-table-column prop="empDep" label="所在部门" align="center">
            </el-table-column>
            <el-table-column prop="empPosition" label="职务" align="center">
            </el-table-column>
            <el-table-column prop="empCarNumber" label="车牌号" align="center">
            </el-table-column>
            <el-table-column label="是否是管理员" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.whetherAdmin=='1'?'是':'否' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="餐卡绑定" align="center">
                    <template slot-scope="scope">
                      <span>{{ scope.row.haveMealCard=='0'?'未绑定':'已绑定' }}</span>
                    </template>
            </el-table-column>
           <el-table-column label="是否绑定" align="center" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.wxBiding=='0'?'未绑定':'已绑定' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="审核状态" align="center" width="80">
                  <template slot-scope="scope">
                    <span>{{ scope.row.applyStatus=='0'?'未审':scope.row.applyStatus=='1'?'通过':'驳回' }}</span>
                  </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="230" align="center">
                <template slot-scope="scope">
                  <el-button class="btn-size" size="mini" plain type="info" v-if="scope.row.applyStatus=='0'" icon="el-icon-edit-outline" @click="rejectEmp(scope.row.id)">审批驳回</el-button>
                  <el-button class="btn-size" size="mini" plain type="success" icon="el-icon-edit" @click="getDetail(scope.row)">编辑</el-button>
                  <el-button class="btn-size" size="mini" plain type="danger" icon="el-icon-delete" @click="deleteEmp('one', scope.row.id)">删除</el-button>
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
      <el-dialog :title="openType == 'add'? '新增人员': '修改信息 '" :visible.sync="dialogAddVisible" width="700px">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                 ref='formAdd' class="add-dialog-form" >
          <el-form-item label="ID" prop="id" v-show="false">
            <el-input v-model="formAdd.id"></el-input>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectId">
            <el-select placeholder="请选择项目" filterable v-model="formAdd.projectId" @change="getEnterByProject" :disabled="openType == 'mof'">
              <el-option v-for="item in projects"
                         :key="item.projectId"
                         :value="item.projectId"
                         :label="item.projectName">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属企业" prop="enterId">
            <el-select placeholder="请选择企业" filterable v-model="formAdd.enterId" :disabled="openType == 'mof'">
              <el-option v-for="item in enters"
                         :key="item.enter_code"
                         :value="item.enter_code"
                         :label="item.enter_name">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户名称" prop="empName">
            <el-input v-model="formAdd.empName" placeholder="用户名称"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="empTel">
            <el-input v-model="formAdd.empTel" placeholder="手机号码"  :disabled="openType == 'mof'"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="empIdNumber">
            <el-input v-model="formAdd.empIdNumber" placeholder="身份证号"></el-input>
          </el-form-item>
          <el-form-item label="生日" prop="birthDay">
            <el-input v-model="formAdd.birthDay" placeholder="生日" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="empSex">
            <el-radio-group v-model="formAdd.empSex">
              <el-radio :label="1" disabled >男</el-radio>
              <el-radio :label="2" disabled >女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属部门" prop="empDep">
            <el-input v-model="formAdd.empDep" placeholder="所属部门" ></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="empPosition">
            <el-input v-model="formAdd.empPosition" placeholder="职位"></el-input>
          </el-form-item>
          <el-form-item label="车牌号" prop="empCarNumber">
            <el-input v-model="formAdd.empCarNumber" placeholder="车牌号"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增弹框---end -->

      <!-- 驳回弹框---start -->
      <el-dialog :title="'驳回原因'" :visible.sync="dialogRejectVisible" width="500px">
        <el-form :label-position="labelPosition" :label-width="labelWidth" class="add-dialog-form" >
          <el-input type="textarea" :rows="5" maxlength="50" resize="none" v-model="rejectReason"></el-input>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="rejectCancel">取 消</el-button>
          <el-button type="primary" @click="rejectCommit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 驳回弹框---end -->

      <!-- 上传弹框---end -->
      <el-dialog title="上传人员信息" :visible.sync="showUpload" width="700px" v-if="showUpload" :before-close="cancelUpload">
        <steps :uploadType="uploadType"
               v-if="showUpload"
               :tempUrl="tempUrl"
               :tempName="tempName"
               :percentage="percentage"
               :result="result"
               :progressBar="progressBar"
               @upLoad="getImportParameter"
               :active="active"></steps>
      </el-dialog>
    </div>
</template>

<script>
    import steps from '@/components/upload/steps.vue'
    import {scCard} from '../../../../static/js/IdCardCheck.js'
    export default {
        name: 'enterpriseEmpManager',
        components: {steps},
        data() {
            return {
                formSearch: { //表单查询
                    projectId: '',
                    enterId:'',
                    userName: '',
                    empTel: '',
                    applyStatus: ''
                },
                showUpload:false,
                selectedOptions: [],
                selectListId: [],
                projects: [],
                enters: [],
                openType: 'add', //add新增 mof修改
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
                rulesAdd: {
                    projectId:[{required: true, message: "请选择项目", trigger: "blur"}],
                    enterId:[{required: true, message: "请选择企业", trigger: "blur"}],
                    empName: [{required: true, message: "请输入用户名称", trigger: "blur"},,
                      { max:30, message: '长度在30个字符内', trigger: 'blur' }],
                    empTel: [{required: true, message: "", trigger: "blur",validator: this.validatePhone}],
                    empIdNumber: [{required: true, message: "", trigger: "blur",validator: this.validateIdCardNumber}],
                    empDep: [{max: 30, message: '长度在30个字符内',trigger: "blur"}],
                    empPosition: [{max: 30, message: '长度在30个字符内',trigger: "blur"}],
                    empCarNumber: [{max: 30, message: '长度在30个字符内',trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                dialogRejectVisible:false,  //驳回弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                fileName: '',
                file: '',
                uploadType:'incremental',
                sex: '1',
                tempUrl: '/ld/static/template/企业员工信息导入模板.xls',
                tempName: '企业员工信息导入模板.xls',
                percentage: 0,
                result: '',
                progressBar: false,
                active: 1,
                validatorFlag:true,
                currentEmp:'',
                rejectReason:''
            };
        },
        mounted() {
            this.getEmpList()
        },
        methods: {
          validatePhone(rule, value, callback){
            if (!value) {
              this.validatorFlag  = false
              return callback(new Error('请输入电话号码'))
            }else{
               //正则表达式验证
              var reg = /^[1][0-9]{10}$/;
              if (!reg.test(value)) {
                this.validatorFlag  = false
                return callback(new Error('请输入正确电话号码'))
              } else {
                let params = {
                  phone: value
                }
                this.$api.validateEmpPhone(params).then(res => {
                  if (res.code === 0) {
                      this.validatorFlag  = true
                      return callback()
                  } else {
                    this.$message.error(res.msg)
                    this.validatorFlag  = false
                    this.formAdd.empTel = ''
                    return callback()
                  }
                })
              }
              }
            },
            validateIdCardNumber(rule, value, callback){
              if (!value) {
                this.validatorFlag  = false
                return callback(new Error('请输入身份证号'))
              }else{
                if (!scCard(value)) {debugger
                  this.validatorFlag  = false
                  return callback(new Error('请输入正确身份证号'))
                } else {
                  let params = {
                    id:this.formAdd.id,
                    idCard: value
                  }
                  this.$api.validateIdCardNumber(params).then(res => {
                    if (res.code === 0) {
                      this.validatorFlag  = true
                      let birth = value.substring(6, 10) + "-" + value.substring(10, 12) + "-" + value.substring(12, 14);
                      this.formAdd.birthDay = birth;
                      var sex;
                      if (value.length == 18) {
                        sex = value.charAt(16);
                        if (sex % 2 == 0) {
                          this.formAdd.empSex = 2;
                        } else {
                          this.formAdd.empSex = 1;
                        }
                      }else{
                        sex = value.charAt(14);
                        if (sex % 2 == 0) {
                          this.formAdd.empSex = 2;
                        } else {
                          this.formAdd.empSex = 1;
                        }
                      }
                      return callback()
                    } else {
                      this.validatorFlag  = false
                      this.$message.error(res.msg)
                      return callback()
                    }
                  })
                }
              }
            },
            handleChange(value) {
                this.selectedOptions = value[value.length - 1].split(',')
            },
           getEmpList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    projectId: this.formSearch.projectId,
                    enterId: this.formSearch.enterId,
                    empName: this.formSearch.empName,
                    empTel: this.formSearch.empTel,
                    applyStatus: this.formSearch.applyStatus
                }
                this.$api.getEmpList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                        this.projects = res.projects
                    } else {
                        this.$message.error(res.msg)
                    }
                })
           },
          uploadOpen() {
            this.showUpload = true
          },
          cancelUpload () {
            this.fileName = ''
            this.file = ''
            this.showUpload = false
          },
          search() {
              this.pageInfo.currentPage = 1
              this.getEmpList()
          },
          reset() {
              this.formSearch.projectId = ''
              this.formSearch.enterId = ''
              this.formSearch.empName = ''
              this.formSearch.empTel = ''
              this.formSearch.empStatus = ''
          },
          handleSizeChange(size) {
              this.pageInfo.currentPage = 1
              this.pageInfo.pageSize = size
              this.getEmpList()
          },
          handleCurrentChange(currentPage) {
              this.pageInfo.currentPage = currentPage
              this.getEmpList()
          },
          addSaveEmp() {
              if(!this.validatorFlag){
                  return false;
              }
              this.$refs['formAdd'].validate((valid) => {
                  if (valid) {
                      this.$api.addSaveEmp(this.formAdd).then(res => {
                          if (res.code === 0) {
                              this.cancel()
                              this.getEmpList()
                              this.$message.success('新增成功')
                          } else {
                              // 失败提示
                              this.$message.error(res.msg)
                          }
                      })
                  }
              })
          },
          editSaveEmp() {debugger
              if(!this.validatorFlag){
                return false;
              }
              this.formAdd.createTime = null;
              this.$api.editSaveEmp(this.formAdd).then(res => {
                if (res.code === 0) {
                  this.cancel()
                  this.getEmpList()
                  this.$message.success('修改成功')
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
          },
          submit() {
              if (this.openType == 'add') {
                  this.addSaveEmp()
              } else {
                  this.editSaveEmp()
              }
          },
          openAdd() {
              this.openType = 'add'
              this.dialogAddVisible = true
              this.formAdd = {}
              this.formAdd = {empSex:'1'}
          },
          cancel() {
              this.dialogAddVisible = false
              this.formAdd = {}
          },
          getDetail(data) {
              let params = {
                  id: data.id
              }
              this.$api.getEmpDetails(params).then(res => {
                  if (res.code === 0) {
                      this.openType = 'mof'
                      this.dialogAddVisible = true
                      this.formAdd = {}
                      this.formAdd = res.data.emp
                      this.enters = res.data.enters
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
          deleteEmp(type, id) {
              if(type == 'all'){
                let num = this.selectListId.length;
                if(num == 0){
                  this.$message.error("请选择需要删除的数据!");
                  return false;
                }
              }
              this.$confirm('删除员工信息，如果已绑定餐卡将会自动解绑。确定要删除吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  let params = {
                      ids: ''
                  }
                  if (type == 'all') {
                      params.ids = this.selectListId.join(',')
                  } else {
                      params.ids = id
                  }
                  this.$api.deleteEmp(params).then(res => {
                      if (res.code === 0) {
                          this.getEmpList()
                          this.$message.success('删除成功')
                      } else {
                          // 失败提示
                          this.$message.error(res.msg)
                      }
                  })
              })
          },
          getEnterByProject(val) {
            let params = {
              projectId: val
            }
            this.$api.getEnterByProject(params).then(res => {
              if (res.code === 0) {
                  this.enters = res.data
              } else {
                  // 失败提示
                  this.$message.error(res.msg)
              }
            })
          },
          //标记为管理人员
          assignAdmin(status) {
              let num = this.selectListId.length;
              if(num == 0){
                this.$message.error("请选择要标记的人员!");
                return false;
              }
              let params = {
                ids: this.selectListId.join(','),
                status:status
              }
              this.$api.assignAdmin(params).then(res => {
                if (res.code === 0) {
                  this.getEmpList()
                  this.$message.success('操作成功')
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
          },
          //执行导入
          getImportParameter (file) {
            this.$api.getImportEmpParameter().then(res => {
              if (res.code == 0) {
                let fd = new window.FormData()
                fd.append('file', file)
                fd.append('zkGroup', res.data.zkGroup)
                fd.append('zkAddress', res.data.zkAddress)
                fd.append('classPath', res.data.classPath)
                fd.append('params', 'incremental')
                this.active = 2
                this.$api.excelFileUpload(fd).then(res => {
                  if (res.code == 0) {
                    this.percentage = 100
                    this.result = res.data
                    window.clearInterval(this.getTime)
                    this.getEmpList()
                  } else {
                    this.percentage = 0
                    window.clearInterval(this.getTime)
                    this.result = res.data
                  }
                  this.active = 3
                }).catch(err => {
                  window.clearInterval(this.getTime)
                })
                this.getExportExcelSchedule()
              }
            })
          },
          //加载进度条
          getExportExcelSchedule () {
            this.progressBar = true
            this.getTime = setInterval(() => {
                this.$api.getExportExcelSchedule().then(res => {
                this.percentage = res.data
              })
            },500)
          },
          //关闭导入框
          cancelUpload () {
            this.percentage = 0
            this.progressBar = false
            this.fileName = ''
            this.file = ''
            this.showUpload = false
            this.active = 1
            this.findBudgetPage()
          },
          //导出数据
          exportEmpData () {
            let params = {
              projectId: this.formSearch.projectId,
              enterId: this.formSearch.enterId,
              empName: this.formSearch.empName,
              empTel: this.formSearch.empTel,
              empStatus: this.formSearch.empStatus
            }
            this.$api.exportEmpData(params).then(res => {
              if (res.code == 0 && res.data!="") {
                  //下载文件
                  this.$api.downLoadTempFileByName(res.data,"hidden_frame")
              } else {
                this.$message.error(res.msg)
              }
            })
          },
          validatorIdNumber(val){
              this.$message.error('请选择导入的文件')
          },
          approvalEmp(){
            let num = this.selectListId.length;
            if(num == 0){
              this.$message.error("请选择要审批的人员!");
              return false;
            }
            let params = {
              status:1,
              ids: this.selectListId.join(',')
            }
            this.$api.approvalEmp(params).then(res => {
              if (res.code === 0) {
                this.getEmpList()
                this.$message.success('审批成功')
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
          },
          rejectEmp(id){
            this.currentEmp = id,
            this.dialogRejectVisible = true
          },
          rejectCancel(){
            this.dialogRejectVisible = false
          },
          rejectCommit(){
              if(!this.rejectReason){
                  this.$alert("请输入驳回原因")
                  return false
              }else{
                let params = {
                  status:2,
                  ids: this.currentEmp,
                  rejectReason:this.rejectReason
                }
                this.$api.approvalEmp(params).then(res => {
                  if (res.code === 0) {
                    this.dialogRejectVisible = false
                    this.getEmpList()
                    this.$message.success('驳回成功')
                  } else {
                    // 失败提示
                    this.$message.error(res.msg)
                  }
                })
              }
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

    .container {
        .btn-size {
            padding: 4px 5px;
        }

        .el-button + .el-button {
            margin-left: 5px;
        }
    }
</style>
