<template>
    <div class="container">
      <iframe name="hidden_frame" style="display: none"></iframe>

      <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
          <el-form-item label="所属餐厅" prop="diningRoomId">
              <el-select v-model="formSearch.diningRoomId" placeholder="请选择所属餐厅" filterable>
                <el-option v-for="(item,index) in diningRoomList" :key="index" :label="item.diningRoomName" :value="item.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="档口名称" prop="stallName">
            <el-input v-model="formSearch.stallName" placeholder="档口名称"></el-input>
          </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset('formSearch')">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
          <el-button size="small" v-has:addDiningStallInfo round type="primary" @click="openAdd">新增</el-button>
          <el-button size="small" round type="info" v-has:getParamUploadDiningStall @click="uploadOpen">批量导入</el-button>
          <el-button size="small" round type="danger" v-has:modifyDiningStallInfoStatus @click="changeStatus('1')">批量删除</el-button>
          <el-button size="small" round @click="exportData" v-has:stallExport>导出</el-button>
        </el-row>
        <!-- 操作区----end -->

        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column prop="diningRoomName" label="所属餐厅" align="center"></el-table-column>
            <el-table-column prop="stallName" label="档口名称" align="center"></el-table-column>
            <el-table-column prop="stallCode" label="档口编码" align="center"></el-table-column>
            <el-table-column prop="stallLink" label="档口链接" align="center"></el-table-column>
            <el-table-column prop="mainProduct" label="主营产品" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="创建日期" align="center" :formatter="this.$common.timestampToTime"></el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button v-has:modifyDiningStallInfo size="mini" @click="getDetail(scope.row)">编辑</el-button>
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
          <el-form-item label="所属餐厅" prop="diningRoomId">
            <el-select v-model="formAdd.diningRoomId" placeholder="请选择所属餐厅" filterable>
              <el-option v-for="(item,index) in diningRoomList" :key="index" :label="item.diningRoomName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="档口名称" prop="stallName">
            <el-input v-model="formAdd.stallName" placeholder="档口名称"></el-input>
          </el-form-item>
          <el-form-item label="档口编码" prop="stallCode">
            <el-input v-model="formAdd.stallCode" placeholder="档口编码" :readonly="openType == 'add' ? false : true"></el-input>
          </el-form-item>
          <el-form-item label="档口简介" prop="stallDescribe">
            <el-input v-model="formAdd.stallDescribe" placeholder="档口简介"></el-input>
          </el-form-item>
          <el-form-item label="档口链接" prop="stallLink">
            <el-input v-model="formAdd.stallLink" placeholder="档口链接"></el-input>
          </el-form-item>
          <el-form-item label="主营产品" prop="mainProduct">
            <el-input v-model="formAdd.mainProduct" placeholder="主营产品"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submit" :disabled="disabledSubmit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 导入弹框---start -->
      <el-dialog :title="'上传档口信息'" :visible.sync="showUpload" width="700px" v-if="showUpload" :before-close="cancelUpload">
        <steps :uploadType="uploadType"
               v-if="showUpload"
               :tempUrl="tempUrl"
               :tempName="tempName"
               :percentage="percentage"
               :result="result"
               :progressBar="progressBar"
               @upLoad="getParamUploadDiningStall"
               :active="active"></steps>
      </el-dialog>

    </div>
</template>

<script>
  import steps from '@/components/upload/steps.vue'
    export default {
        name: 'diningStallInfo',
        components: {steps},
        data() {
            return {
                formSearch: { //表单查询
                    stallName: '',
                    diningRoomId:'',
                },
                selectListId: [],
                openType: 'mof', //add新增 mof修改
                diningRoomList: [],// 餐厅数据
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加

                },
                showUpload:false,
                uploadType:'incremental',//增量导入
                fileName: '',
                file: '',
                tempUrl: '/ld/static/template/档口信息导入模板.xls',
                tempName: '档口信息导入模板.xls',
                percentage: 0,
                result: '',
                progressBar: false,
                disabledSubmit:false,
                active: 1,
                rulesAdd: {
                  stallName: [
                    {required: true, message: "请输入档口名称", trigger: "blur"},
                    {max: 15, message: '最大长度15个字符', trigger: 'blur' }
                  ],
                  diningRoomId: [
                    {required: true, message: "请选择所属餐厅", trigger: "blur"}
                  ],
                  stallDescribe : [
                    {required: true, message: "请输入档口简介", trigger: "blur"}
                  ],
                  stallCode : [
                    {required: true, message: "", trigger: "blur",validator: this.validateStallCode}
                  ],
                  stallLink : [
                    {required: true, message: "请输入档口链接", trigger: "blur"}
                  ],
                  mainProduct : [
                    {required: true, message: "请选择主营产品", trigger: "blur"}
                  ],
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
            this.findDinningStallPage()
        },
        methods: {
            validateStallCode(rule, value, callback){
              if (!value) {
                return callback(new Error('请输入档口编码'))
              }else{
                let _this = this;
                let params = {
                  stallCode: value,
                }
                _this.$api.findDiningStallList(params).then(res => {
                  if (res.code === 0) {
                    if(res.data.length !=0){
                      if(_this.openType === 'add'){
                        _this.$message.error( value + "此档口编码已存在");
                        _this.disabledSubmit = true
                        return callback(new Error(value + '此档口编码已存在'))
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
            findDinningStallPage() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    stallName: this.formSearch.stallName,
                    diningRoomId: this.formSearch.diningRoomId,
                }
                this.$api.findDinningStallPage(params).then(res => {
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
                this.findDinningStallPage()
            },
            reset(formName) {
              this.$refs[formName].resetFields();
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.findDinningStallPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.findDinningStallPage()
            },
            submit() {
              if (this.openType == 'add') {
                this.addDiningStallInfo()
              } else {
                this.modifyDiningStallInfo()
              }
              this.disabledSubmit = false
            },
            addDiningStallInfo(){
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.addDiningStallInfo(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.findDinningStallPage()
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
              this.findDiningRoomList();
            },
            cancel() {
                this.findDinningStallPage()
                this.dialogAddVisible = false
                this.formAdd = {}
                this.disabledSubmit = false
                if(this.openType === 'add'){
                  this.$refs['formAdd'].resetFields();//取消后清除input值
                }
            },
            getDetail(data) {
                this.openType = 'mof'
                this.dialogAddVisible = true
                this.formAdd = data
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
              this.findDinningStallPage()
            },
            //执行导入
            getParamUploadDiningStall (file) {
              this.$api.getParamUploadDiningStall().then(res => {
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
                      this.findDinningStallPage()
                      window.clearInterval(this.getTime)
                    } else {
                      this.active = 1
                      this.percentage = 0
                      this.$message.error({
                        dangerouslyUseHTMLString: true,
                        message: res.msg,
                        duration:10000,//时长 0表示永久
                        showClose:true
                      });
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
            exportData(){
              let params = {
                stallName: this.formSearch.stallName,
                diningRoomId: this.formSearch.diningRoomId
              }
              this.$api.stallExport(params).then(res => {
                if (res.code == 0 && res.data!="") {
                  this.$api.downLoadTempFileByName(res.data,"hidden_frame")
                }else {
                  this.$message.error(res.msg)
                }
              })
            },
            modifyDiningStallInfo() {
              delete this.formAdd.updateTime
              this.$api.modifyDiningStallInfo(this.formAdd).then(res => {
                if (res.code === 0) {
                  this.cancel()
                  this.findDinningStallPage()
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
                this.$confirm('删除档口信息将会删除档口信息绑定的所有终端设备,请谨慎操作！', '提示', {
                  confirmButtonText: '确定删除',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$api.modifyDiningStallInfoStatus(params).then(res => {
                    if (res.code === 0) {
                      this.$message.success('删除成功')
                      this.findDinningStallPage()
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
