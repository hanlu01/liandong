<template>
    <div class="container">
        <iframe name="hidden_frame" style="display: none"></iframe>
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="园区名称">
              <el-select placeholder="请选择园区" filterable v-model="formSearch.projectId">
                  <el-option v-for="item in projects"
                             :key="item.projectId"
                             :value="item.projectId"
                              :label="item.projectName">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户号">
              <el-input v-model="formSearch.assetCorpAccount" placeholder="分账商户号"></el-input>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增商户号</el-button>
            <el-button size="small" round type="danger" @click="deleteProjectChinaPay('all')">删除商户号</el-button>
            <!--<el-button size="small" round @click="">批量导入</el-button>-->
            <el-button size="small" round @click="exportChinaPayRelData">导出信息</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="36">
            </el-table-column>
            <el-table-column prop="projectName" label="所属园区" align="center">
            </el-table-column>
            <el-table-column prop="assetCorpAccount" label="分账商户号" align="center">
            </el-table-column>
            <el-table-column prop="creator" label="创建用户" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" title="删除" plain type="danger" icon="el-icon-delete" @click="deleteProjectChinaPay('one',scope.row.id)">删除</el-button>
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

      <!-- 表格---end -->
      <!-- 新增弹框---start -->
      <el-dialog :title="openType == 'add'? '新增商户号': '修改商户号'" :visible.sync="dialogAddVisible" width="700px">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :model="formAdd" :rules="rulesAdd" ref='formAdd' class="add-dialog-form" label-width="82px">
          <el-form-item label="所属园区" prop="projectId" >
            <el-select v-model="formAdd.projectId" class="el-select" filterable :disabled="openType =='add'?false:true">
              <el-option
                v-for="item in projects"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
          <div class="asset_corp_dev" v-for="(rel,index) in chinaPayRels" :key="index">
            <el-form-item label="分账商户号"  prop="assetCorpAccount">
              <el-input  class="asset_corp_input" v-model="rel.assetCorpAccount"></el-input>
            </el-form-item>
            <p v-if="index === chinaPayRels.length-1">
              <img class="img1" src="../../../../static/img/add.png" alt="" @click="addData()"  v-if="endState">
              <img class="img2" src="../../../../static/img/del.png" alt="" @click="cancleData(index)" v-if="index>0">
            </p>

          </div>
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
        name: 'activityChinaPay',
        data() {
            return {
                formSearch: { //表单查询
                    projectId: '',
                    activityName: '',
                    activityTime: '',
                    dataStatus: ''
                },
                chinaPayRels:[{assetCorpAccount:""}],
                showUpload:false,
                endState:true,
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
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
                  projectId:[{required: true, message: "请选择园区", trigger: "blur"}]
                },
                formPwd: {
                    oldPwd: '',
                    newPwd: '',
                    newPwd2: ''
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                fileName: '',
                file: '',
                uploadType:'incremental',
                sex: '1',
                currentId:'',
                percentage: 0,
                result: '',
                progressBar: false,
                active: 1
            };
        },
        mounted() {
            this.getProjectChinaPayList()
        },
        methods: {
            handleChange(value) {
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getProjectChinaPayList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    projectId: this.formSearch.projectId,
                    assetCorpAccount: this.formSearch.assetCorpAccount
                }
                this.$api.getProjectChinaPayList(params).then(res => {
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
            search() {
                this.pageInfo.currentPage = 1
                this.getProjectChinaPayList()
            },
            reset() {
                this.formSearch.projectId = ''
                this.formSearch.assetCorpAccount = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getProjectChinaPayList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getProjectChinaPayList()
            },
            openAdd() {
              this.formAdd = {
                projectId:''
              }
              this.chinaPayRels= [{
                assetCorpAccount:"",
                relId:""
              }],
              this.openType = 'add'
              this.dialogAddVisible = true
            },
            //添加分账商户号
            addData(){
                //获取最后一个分账商户号判断已经存在不能进行添加
                  let params = {
                    account: this.chinaPayRels[this.chinaPayRels.length-1].assetCorpAccount,
                    projectId:this.formAdd.projectId
                  }
                  this.$api.checkAssetCorpAccount(params).then(res => {
                    if (res.code === 0) {
                      this.chinaPayRels.push({assetCorpAccount:""})
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
            },
            cancleData(index){
              this.chinaPayRels.splice(index,1)
              this.endState = true
            },
            cancel() {
              this.dialogAddVisible = false
              this.formAdd = {}
            },
            //导出数据
            exportChinaPayRelData() {
              let params = {
                projectId: this.formSearch.projectId,
                assetCorpAccount: this.formSearch.assetCorpAccount
              }
              this.$api.exportChinaPayRelData(params).then(res => {
                if (res.code == 0 && res.data!="") {
                  //下载文件
                  this.$api.downLoadTempFileByName(res.data,"hidden_frame")
                } else {
                  this.$message.error(res.msg)
                }
              })
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
                        this.formAdd = res.data
                        this.currentId = res.data.id
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            submit() {
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  let rels = []
                  let accounts = ''
                  let empty = true
                  this.chinaPayRels.forEach((item, index) => {
                    if(!item.assetCorpAccount){
                      empty = false
                    }else{
                      rels.push(item.assetCorpAccount)
                    }
                  })
                  if(!empty){
                    this.$alert("分账商户号不能为空")
                  }else{
                    accounts = rels.join(",");
                    let assetCorpAccountRel = {
                      projectId: this.formAdd.projectId,
                      assetCorpAccount: accounts
                    }
                    this.addAssetCorpAccount(assetCorpAccountRel)
                  }
                }
              })
            },
            addAssetCorpAccount(params) {
              this.$api.addAssetCorpAccount(params).then(res => {
                if (res.code === 0) {
                  this.cancel()
                  this.getProjectChinaPayList()
                  this.$message.success('新增成功')
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
            },
            roofPlacement(activityId){
              let params = {
                activityId: activityId
              }
              this.$api.roofPlacement(params).then(res => {
                if (res.code === 0) {
                  this.$message.success('置顶成功')
                  this.getActivityList()
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
                  this.$router.push({ path: "/activityApplyUserInfo" ,query:{activityId:activityId} });
             },
            showActivityCommentInfo(activityId){console.log("aaa");
                  this.$router.push({ path: "/activityCommentInfo" ,query:{activityId:activityId} });
            },
            //修改活动状态
            deleteProjectChinaPay(model,id) {
              var num =  this.selectListId.length;
              if(model == 'all'&&num == 0){
                  this.$message.error("请选择要删除的数据!")
              }else{
                  this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    let params = {
                      ids: '',
                    }
                    if (model == 'all') {
                      params.ids = this.selectListId.join(',')
                    } else {
                      params.ids = id
                    }
                    this.$api.deleteProjectChinaPay(params).then(res => {
                      if (res.code === 0) {
                        this.getProjectChinaPayList()
                        this.$message.success('删除成功!')
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

    .asset_corp_dev{
      display:flex;
      p{
        position: relative;
        // display:flex;
        // justify-content: space-between;
        .img1{
          width: 22px;
          position: absolute;
          right:-36px;
          bottom:29px
        }
        .img2{
          position: absolute;
          right:-76px;
          bottom:28px
        }
      }
    }

    .asset_corp_input{
      width: 216px;
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
