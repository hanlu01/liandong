<template>
    <div class="container">
      <iframe name="hidden_frame" style="display: none"></iframe>

      <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
          <el-form-item label="所属项目" prop="projectId" >
            <el-select v-model="formSearch.projectId" class="el-select" filterable >
              <el-option
                v-for="item in projectList"
                :key="item.projectId"
                :label="item.projectName+item.projectId"
                :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="餐厅名称" prop="diningRoomName">
                <el-input v-model="formSearch.diningRoomName" placeholder="餐厅名称"></el-input>
            </el-form-item>
          <el-form-item label="餐厅设备厂商" prop="diningTerminalManufacturer">
            <el-select v-model="formSearch.diningTerminalManufacturer" placeholder="请选择所属餐厅">
              <el-option v-for="(item,index) in terminalManufacturerList" :key="index" :label="item.dname" :value="item.dcode"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset('formSearch')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
          <el-button size="small" v-has:addDiningRoomInfo round type="primary" @click="openAdd">新增</el-button>
          <el-button size="small" round type="info" v-has:getParamUploadDiningRoom @click="uploadOpen">批量导入</el-button>
          <el-button size="small" round type="danger" v-has:modifyDiningRoomInfoStatus @click="changeStatus('1')">批量删除</el-button>
          <el-button size="small" round v-has:roomExport @click="exportData">导出</el-button>
        </el-row>
        <!-- 操作区----end -->

        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" align="center"></el-table-column>
            <el-table-column prop="diningRoomName" label="餐厅名称" align="center"></el-table-column>
            <el-table-column prop="diningRoomCode" label="餐厅编码" align="center"></el-table-column>
            <el-table-column prop="diningRoomAddress" label="餐厅地址" align="center"></el-table-column>
            <el-table-column prop="diningRoomArea" label="餐厅面积" align="center"></el-table-column>
            <el-table-column prop="diningRoomNum" label="可容纳人数" align="center"></el-table-column>
            <el-table-column prop="diningTerminalManufacturer" label="设备厂商" align="center">
              <template slot-scope="scope">
                <span v-for="(item,index) in terminalManufacturerList" :key="index" :label="item.dname" :value="item.dcode"
                      v-if="item.dcode == scope.row.diningTerminalManufacturer">{{ item.dname }}</span>
              </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建日期" align="center" :formatter="this.$common.timestampToTime">
          </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getDetail(scope.row)" v-has:modifyDiningRoomInfo>编辑</el-button>
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
      <el-dialog :title="openType == 'add'? '新增餐厅信息': '修改餐厅信息 '" :visible.sync="dialogAddVisible" width="700px"
                 :before-close="cancel">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                 ref='formAdd' class="add-dialog-form">
          <el-form-item label="餐厅编码" prop="diningRoomCode" ref="diningRoomCodeRef">
            <el-input v-model="formAdd.diningRoomCode" placeholder="餐厅编码,必须唯一" :readonly="openType == 'add' ? false : true"></el-input>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName" v-show="false">
            <el-input v-model="formAdd.projectName" placeholder="所属项目"></el-input>
          </el-form-item>
          <el-form-item label="所属项目" prop="projectId" >
            <el-select v-model="formAdd.projectId" class="el-select" @change="changeProject" filterable>
              <el-option
                v-for="item in projectList"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="餐厅设备厂商" prop="diningTerminalManufacturer">
            <el-select v-model="formAdd.diningTerminalManufacturer" placeholder="请选择餐厅设备厂商" :disabled="manufacturerReadonly ? true : false">
              <el-option v-for="(item,index) in terminalManufacturerList" :key="index" :label="item.dname" :value="item.dcode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="餐厅名称" prop="diningRoomName">
            <el-input v-model="formAdd.diningRoomName" placeholder="餐厅名称"></el-input>
          </el-form-item>
          <el-form-item label="餐厅简介" prop="diningRoomIntroduce">
            <el-input v-model="formAdd.diningRoomIntroduce" placeholder="餐厅简介"></el-input>
          </el-form-item>
          <el-form-item label="餐厅地址" prop="diningRoomAddress">
            <el-input v-model="formAdd.diningRoomAddress" placeholder="餐厅地址"></el-input>
          </el-form-item>
          <el-form-item label="餐厅评价链接" prop="diningRoomLink">
            <el-input v-model="formAdd.diningRoomLink" placeholder="餐厅评价链接"></el-input>
          </el-form-item>
          <el-form-item label="餐厅面积" prop="diningRoomArea">
            <el-input v-model="formAdd.diningRoomArea" placeholder="餐厅面积"></el-input>
          </el-form-item>
          <el-form-item label="可容纳人数" prop="diningRoomNum">
            <el-input v-model="formAdd.diningRoomNum" placeholder="可容纳人数"></el-input>
          </el-form-item>
          <el-form-item label="餐厅合作方" prop="diningRoomPartner">
            <el-input v-model="formAdd.diningRoomPartner" placeholder="餐厅合作方"></el-input>
          </el-form-item>
          <el-form-item label="是否为智慧餐厅" prop="isWisdom">
            <el-radio-group v-model="formAdd.isWisdom">
               <el-radio label="0">是</el-radio>
               <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit" :disabled="disabledSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 新增弹框---end -->
      <el-dialog :title="'上传餐厅信息'" :visible.sync="showUpload" width="700px" v-if="showUpload" :before-close="cancelUpload">
        <steps :uploadType="uploadType"
               v-if="showUpload"
               :tempUrl="tempUrl"
               :tempName="tempName"
               :percentage="percentage"
               :result="result"
               :progressBar="progressBar"
               @upLoad="getParamUploadDiningRoom"
               :active="active"></steps>
      </el-dialog>

    </div>
</template>

<script>
  import steps from '@/components/upload/steps.vue'
    export default {
        name: 'diningRoomInfo',
        components: {steps},
        data() {
            return {
                formSearch: { //表单查询
                  diningRoomName: '',
                  diningTerminalManufacturer: '',
                  projectId:''
                },
                selectListId: [],
                terminalManufacturerList: [],// 餐厅厂商设备列表
                projectList:[],
                openType: 'mof', //add新增 mof修改
                listLoading: false,
                showUpload:false,
                uploadType:'incremental',//增量导入
                fileName: '',
                file: '',
                tempUrl: '/ld/static/template/餐厅信息导入模板.xls',
                tempName: '餐厅信息导入模板.xls',
                percentage: 0,
                result: '',
                progressBar: false,
                disabledSubmit:false,
                active: 1,
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                  projectName:''
                },
                rulesAdd: {
                  diningRoomName: [
                    {required: true, message: "请输入餐厅名称", trigger: "blur"},
                    {max: 15, message: '最大长度15个字符', trigger: 'blur' }
                  ],
                  projectId: [
                    {required: true, message: "请选择餐厅所属项目", trigger: "blur"}
                  ],
                  diningRoomCode : [
                    {required: true, message: "", trigger: "blur",validator: this.validateDiningCode},
                    {max: 8, message: '最大长度8个字符', trigger: 'blur' }
                  ],
                  diningRoomAddress : [
                    {required: true, message: "请输入餐厅地址", trigger: "blur"},
                    {max: 50, message: '最大长度 50 个汉字', trigger: 'blur' }
                  ],
                  diningRoomLink : [
                    {required: true, message: "请输入餐厅评价链接", trigger: "blur"},
                    {max: 100, message: '最大长度 100 个汉字', trigger: 'blur' }
                  ],
                  diningRoomArea : [
                    {required: true, message: "请输入餐厅面积", trigger: "blur"},
                    { pattern: /^[0-9]+$/, message: '餐厅面积必须为数字值' },
                    {max:10, message: '最大长度10位数字' }
                  ],
                  diningRoomNum : [
                    { required: true, message: '请输入最大就餐人数'},
                    { pattern: /^[0-9]+$/, message: '就餐人数必须为数字值' },
                    {max:5, message: '最大长度5位数字' }
                  ],
                  diningRoomPartner : [
                    {required: true, message: "请输入餐厅合作伙伴方", trigger: "blur"},
                    {max: 50, message: '最大长度 50 个汉字', trigger: 'blur' }
                  ],
                  isWisdom : [
                    {required: true, message: "请选择是否为智慧餐厅", trigger: "blur"}
                  ],
                  diningRoomIntroduce : [
                    {required: true, message: "请输入餐厅简介", trigger: "blur"},
                    {max: 100, message: '最大长度 100 个汉字', trigger: 'blur' }
                  ],
                  diningTerminalManufacturer : [
                    {required: true, message: "请选择餐厅设备厂商", trigger: "blur"}
                  ]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px',
                dict: [],
                manufacturerReadonly:false
            };
        },
        computed: {},
        created() {
          this.getDictTerminalManufacturer(),
          this.findAllProject ()
        },
        mounted() {
            this.getDiningRoomInfoPage()
        },
        methods: {
          validateDiningCode(rule, value, callback){
            if (!value) {
              return callback(new Error('请输入餐厅编码'))
            }else{
                  let _this = this;
                  let params = {
                    diningRoomCode: value,
                  }
                _this.$api.findDiningRoomList(params).then(res => {
                  if (res.code === 0) {
                    if(res.data.length !=0){
                      if(_this.openType === 'add'){
                        _this.disabledSubmit = true
                        _this.$message.error( value + "此餐厅编码已存在");
                        return callback(new Error(value + '此餐厅编码已存在'))
                      }else{
                        _this.disabledSubmit = false
                        return callback()
                      }
                    }else{
                      _this.disabledSubmit = false
                      return callback()
                    }
                  } else {
                    _this.$message.error(res.msg)
                    return callback()
                  }
                })
            }
          },
          changeProject(val){
            let obj = {};
            obj = this.projectList.find((item)=>{
              return item.projectId === val;
            });
            this.formAdd.projectName = obj.projectName
            this.$api.getManufacturerIdByProId(this.formAdd).then(res => {
              if (res.code === 0) {
                if(res.data){
                  this.manufacturerReadonly = true
                  this.formAdd.diningTerminalManufacturer= res.data.diningTerminalManufacturer
                }else{
                  this.manufacturerReadonly = false
                }
              } else {
                this.$message.error(res.msg)
              }
            })
          },
          exportData(){
            let params = {
              diningRoomName: this.formSearch.diningRoomName,
              diningTerminalManufacturer : this.formSearch.diningTerminalManufacturer,
              projectId : this.formSearch.projectId
            }
            this.$api.roomExport(params).then(res => {
              if (res.code == 0 && res.data!="") {
                this.$api.downLoadTempFileByName(res.data,"hidden_frame")
              }else {
                this.$message.error(res.msg)
              }
            })
          },
          uploadOpen() {
            this.showUpload = true
          },
          cancelUpload () {
            this.percentage = 0
            this.progressBar = false
            this.fileName = ''
            this.file = ''
            this.showUpload = false
            this.active = 1
          },
          //执行导入
          getParamUploadDiningRoom (file) {
            this.$api.getParamUploadDiningRoom().then(res => {
              if (res.code == 0) {
                let fd = new window.FormData()
                fd.append('file', file)
                fd.append('zkGroup', res.data.zkGroup)
                fd.append('zkAddress', res.data.zkAddress)
                fd.append('classPath', res.data.classPath)
                this.active = 2
                this.$api.excelFileUpload(fd).then(res => {
                  if (res.code == 0) {
                    this.active = 3
                    this.percentage = 100
                    this.result = res.data
                    this.$message.success({
                      dangerouslyUseHTMLString: true,
                      message: res.msg,
                      duration:10000,//时长 0表示永久
                      showClose:true
                    });
                    this.getDiningRoomInfoPage()
                    window.clearInterval(this.getTime)
                  } else {
                    this.active = 1
                    this.$message.error({
                      dangerouslyUseHTMLString: true,
                      message: res.msg,
                      duration:10000,//时长 0表示永久
                      showClose:true
                    });
                    this.percentage = 0
                    window.clearInterval(this.getTime)
                    this.result = res.data
                  }
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
          // 获取厂商字典
            getDictTerminalManufacturer(){
              this.$api.getDictTerminalManufacturer(this.formAdd).then(res => {
                if (res.code === 0) {
                  this.terminalManufacturerList = res.data
                } else {
                  this.$message.error(res.msg)
                }
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
            getDiningRoomInfoPage() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    diningRoomName: this.formSearch.diningRoomName,
                    diningTerminalManufacturer : this.formSearch.diningTerminalManufacturer,
                    projectId : this.formSearch.projectId
                }
                this.$api.getDiningRoomInfoPage(params).then(res => {
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
                this.getDiningRoomInfoPage()
            },
            reset(formName) {
              this.$refs[formName].resetFields();
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getDiningRoomInfoPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getDiningRoomInfoPage()
            },
            submit() {
                if (this.openType == 'add') {
                  this.addDiningRoomInfo()
                } else {
                  this.modifyDiningRoomInfo()
                }
              this.disabledSubmit = false
            },
            addDiningRoomInfo(){
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.addDiningRoomInfo(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.getDiningRoomInfoPage()
                      this.$message.success('新增成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                }
              })
            },
            openAdd() {
              this.openType = 'add'
              this.dialogAddVisible = true
              this.disabledSubmit = false
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
                this.disabledSubmit = false
                this.getDiningRoomInfoPage()
                if(this.openType === 'add'){
                  this.$refs['formAdd'].resetFields();//取消后清除input值
                }
            },
            getDetail(data) {
                this.openType = 'mof'
                this.dialogAddVisible = true
                this.formAdd = data
            },
            modifyDiningRoomInfo() {
              this.$refs['formAdd'].validate((valid) => {
                delete this.formAdd.createTime
                if (valid) {
                  this.$api.modifyDiningRoomInfo(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.getDiningRoomInfoPage()
                      this.$message.success('修改成功')
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                }
              })
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },
            // 逻辑删除
            changeStatus(status) {
              let params = {
                ids: this.selectListId.join(','),
                dataStatus: status
              }
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                this.$confirm('删除餐厅将会删除该餐厅下绑定的所有档口信息以及终端设备,请谨慎操作！', '提示', {
                  confirmButtonText: '确定删除',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$api.modifyDiningRoomInfoStatus(params).then(res => {
                    if (res.code === 0) {
                      this.$message.success('删除成功')
                      this.getDiningRoomInfoPage()
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
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
</style>
