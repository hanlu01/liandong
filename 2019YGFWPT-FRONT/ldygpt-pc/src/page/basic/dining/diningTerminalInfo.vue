<template>
    <div class="container">
      <iframe name="hidden_frame" style="display: none"></iframe>

      <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
          <el-form-item label="所属餐厅" prop="diningRoomId">
            <el-select v-model="formSearch.diningRoomId" placeholder="请选择所属餐厅" v-on:change="changeRoom('formSearch')" filterable>
              <el-option v-for="(item,index) in diningRoomList" :key="index" :label="item.diningRoomName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属档口" prop="diningStallId">
              <el-select v-model="formSearch.diningStallId" placeholder="请选择所属档口" filterable>
                <el-option v-for="(item,index) in diningStallList" :key="index" :label="item.stallName" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="终端设备名称" prop="terminalName">
            <el-input v-model="formSearch.terminalName" placeholder="终端设备名称"></el-input>
          </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset('formSearch')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
          <el-button size="small" v-has:addDiningTerminalInfo round type="primary" @click="openAdd">新增</el-button>
          <el-button size="small" v-has:getParamUploadDiningTerminal round type="info" @click="uploadOpen">批量导入</el-button>
          <el-button size="small" v-has:modifyDiningTerminalStatus round type="danger" @click="changeStatus('1')">批量删除</el-button>
          <el-button size="small" v-has:terminalExport round @click="exportData">导出</el-button>
        </el-row>
        <!-- 操作区----end -->

        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="diningRoomName" label="所属餐厅" align="center"></el-table-column>
            <el-table-column prop="stallName" label="所属档口" align="center"></el-table-column>
            <el-table-column prop="terminalName" label="终端设备名称" align="center"></el-table-column>
            <el-table-column prop="terminalCode" label="终端设备编码" align="center"></el-table-column>
            <el-table-column prop="terminalType" label="终端类型" align="center">
              <template slot-scope="scope">
                <span v-for="(item,index) in dictTerminalTypeList" :key="index" :label="item.dname" :value="item.dcode"
                      v-if="item.dcode == scope.row.terminalType">{{ item.dname }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button v-has:modifyDiningTerminalInfo size="mini" @click="getDetail(scope.row)">编辑</el-button>
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
      <el-dialog :title="openType == 'add'? '新增终端设备信息': '修改终端设备信息 '" :visible.sync="dialogAddVisible" width="700px"
                 :before-close="cancel">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                 ref='formAdd' class="add-dialog-form">

          <el-form-item label="所属餐厅" prop="diningRoomId">
            <el-select v-model="formAdd.diningRoomId" placeholder="请选择所属餐厅" v-on:change="changeRoom('formAdd')" filterable>
              <el-option v-for="(item,index) in diningRoomList" :key="index" :label="item.diningRoomName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="所属档口" prop="diningStallId">
            <el-select v-model="formAdd.diningStallId" placeholder="请选择所属档口" filterable>
              <el-option v-for="(item,index) in diningStallList" :key="index" :label="item.stallName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端编码" prop="terminalCode">
            <el-input v-model="formAdd.terminalCode" placeholder="终端设备编码" :readonly="openType == 'add' ? false : true"></el-input>
          </el-form-item>
          <el-form-item label="终端类型" prop="terminalType">
            <el-select v-model="formAdd.terminalType" placeholder="请选择终端设备类型">
              <el-option v-for="(item,index) in dictTerminalTypeList" :key="index" :label="item.dname" :value="item.dcode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="终端名称" prop="terminalName">
            <el-input v-model="formAdd.terminalName" placeholder="终端设备名称"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 新增弹框---end -->

      <el-dialog :title="'上传终端设备信息'" :visible.sync="showUpload" width="700px" v-if="showUpload" :before-close="cancelUpload">
        <steps :uploadType="uploadType"
               v-if="showUpload"
               :tempUrl="tempUrl"
               :tempName="tempName"
               :percentage="percentage"
               :result="result"
               :progressBar="progressBar"
               @upLoad="getParamUploadDiningTerminal"
               :active="active"></steps>
      </el-dialog>

    </div>
</template>

<script>
    import steps from '@/components/upload/steps.vue'
    export default {
        name: 'diningTerminalInfo',
        components: {steps},
        data() {
            return {
                formSearch: { //表单查询
                    terminalName: '',
                    diningStallId: '',
                    diningRoomId:'',
                },
                selectListId: [],
                openType: 'mof', //add新增 mof修改
                diningStallList: [],// 档口信息
                diningRoomList: [],// 餐厅数据
                dictTerminalTypeList:[],//设备类型字典数据
                listLoading: false,//
                showUpload:false,
                uploadType:'incremental',//增量导入
                fileName: '',
                file: '',
                tempUrl: '/ld/static/template/餐厅终端设备导入模板.xls',
                tempName: '餐厅终端设备导入模板.xls',
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

                },
                rulesAdd: {
                  terminalName: [
                    {required: true, message: "请输入终端设备名称", trigger: "blur"},
                    {max: 15, message: '最大长度15个字符', trigger: 'blur' }
                  ],
                  terminalType: [
                    {required: true, message: "请选择终端类型", trigger: "blur"}
                  ],
                  terminalCode : [
                    {required: true, message: "", trigger: "blur",validator: this.validateTerminalCode}
                  ],
                  diningStallId : [
                    {required: true, message: "请选择终端所属档口", trigger: "blur"}
                  ]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px'
            };
        },
        computed: {},
        created() {
          this.findDiningRoomList();
        },
        mounted() {
            this.getDictTerminalType()
            this.findDiningTerminalPage()
        },
        methods: {
            validateTerminalCode(rule, value, callback){
              if (!value) {
                return callback(new Error('请输入终端设备编码'))
              }else{
                let _this = this;
                let params = {
                  terminalCode: value,
                }
                _this.$api.findDiningTerminalList(params).then(res => {
                  if (res.code === 0) {
                    if(res.data.length !=0){
                      if(_this.openType === 'add'){
                        _this.$message.error( value + "此终端设备编码已存在");
                        _this.disabledSubmit = true
                        return callback(new Error(value + '此终端设备编码已存在'))
                      }else{
                        _this.disabledSubmit = false
                        return callback()
                      }
                    }else{
                      this.disabledSubmit = false
                      return callback()
                    }
                  } else {
                    _this.$message.error(res.msg)
                    return callback()
                  }
                })
              }
            },
            exportData(){
              let params = {
                terminalName: this.formSearch.terminalName,
                diningRoomId: this.formSearch.diningRoomId,
                diningStallId: this.formSearch.diningStallId,
              }
              this.$api.terminalExport(params).then(res => {
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
            getParamUploadDiningTerminal (file) {
              this.$api.getParamUploadDiningTerminal().then(res => {
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
                      window.clearInterval(this.getTime)
                      this.findDiningTerminalPage()
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
            findDiningTerminalPage() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    terminalName: this.formSearch.terminalName,
                    diningRoomId: this.formSearch.diningRoomId,
                    diningStallId: this.formSearch.diningStallId,
                }
                this.$api.findDiningTerminalPage(params).then(res => {
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
                this.findDiningTerminalPage()
            },
            reset(formName) {
              this.$refs[formName].resetFields();
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.findDiningTerminalPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.findDiningTerminalPage()
            },
            submit() {
                  if (this.openType == 'add') {
                    this.addDiningTerminalInfo()
                  } else {
                    this.modifyDiningTerminalInfo()
                  }
            },
            addDiningTerminalInfo(){
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.addDiningTerminalInfo(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.findDiningTerminalPage()
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
              this.findDiningStallList()
              this.openType = 'add'
              this.dialogAddVisible = true
              this.findDiningRoomList();
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
                this.disabledSubmit = false
                this.findDiningTerminalPage()
                if(this.openType === 'add'){
                  this.$refs['formAdd'].resetFields();//取消后清除input值
                }
            },
            getDetail(data) {
              this.findDiningStallList()
                this.openType = 'mof'
                this.dialogAddVisible = true
                this.formAdd = data
            },
            // 餐厅列表
            findDiningRoomList(){
              this.$api.findDiningRoomList().then(res => {
                if (res.code === 0) {
                  this.diningRoomList = res.data;
                } else {
                  this.$message.error(res.msg)
                }
              })
            },
            // 档口列表
            changeRoom(form){
              console.log(form)
              let params;
              if(form === 'formAdd'){
                this.formAdd.diningStallId = ''
                params = {
                  diningRoomId: this.formAdd.diningRoomId
                }
              }else{
                this.formSearch.diningStallId = ''
                params = {
                  diningRoomId: this.formSearch.diningRoomId
                }
              }
              this.$api.findDiningStallList(params).then(res => {
                if (res.code === 0) {

                  this.formAdd = {
                    diningStallId:'',
                    diningRoomId :this.formAdd.diningRoomId
                  }

                  this.diningStallList = res.data;
                } else {
                  this.$message.error(res.msg)
                }
              })
            },
          findDiningStallList(){
            let params = {
              diningRoomId: ''
            }
            this.$api.findDiningStallList(params).then(res => {
              if (res.code === 0) {
                this.diningStallList = res.data;
              } else {
                this.$message.error(res.msg)
              }
            })
          },
            getDictTerminalType(){
              this.$api.getDictTerminalType(this.formAdd).then(res => {
                if (res.code === 0) {
                  this.dictTerminalTypeList = res.data;
                } else {
                  this.$message.error(res.msg)
                }
              })
            },
            modifyDiningTerminalInfo() {
              this.$api.modifyDiningTerminalInfo(this.formAdd).then(res => {
                if (res.code === 0) {
                  this.cancel()
                  this.findDiningTerminalPage()
                  this.$message.success('修改成功')
                } else {
                  this.$message.error(res.msg)
                }
              })
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
                console.log(this.selectListId)
            },
            changeStatus(status) {
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                let params = {
                  ids: this.selectListId.join(','),
                  dataStatus: status
                }
                this.$confirm('确定要删除吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$api.modifyDiningTerminalStatus(params).then(res => {
                    if (res.code === 0) {
                      this.$message.success('删除成功')
                      this.findDiningTerminalPage()
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
