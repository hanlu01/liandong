<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
          <el-form-item label="所属项目" prop="projectId" >
            <el-select v-model="formSearch.projectId" class="el-select" filterable>
              <el-option
                v-for="item in projectList"
                :key="item.projectId"
                :label="item.projectName"
                :value="item.projectId">
              </el-option>
            </el-select>
          </el-form-item>
            <el-form-item label="企业名称" prop="enterName">
                <el-input v-model="formSearch.enterName" placeholder="企业名称"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="phoneNo">
                <el-input v-model="formSearch.phoneNo" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="enterStatus">
                <el-select v-model="formSearch.enterStatus" placeholder="状态">
                     <el-option label="正常" value="0"></el-option>
                     <el-option label="停用" value="1"></el-option>
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
            <el-table-column prop="enterCode" label="企业编码" align="center"></el-table-column>
            <el-table-column prop="cusCode" label="客户编码" align="center"></el-table-column>
            <el-table-column prop="enterName" label="企业名称" align="center"></el-table-column>
            <el-table-column prop="bigAreaName" label="大区" align="center"></el-table-column>
            <el-table-column prop="provinceName" label="省份" align="center"></el-table-column>
            <el-table-column prop="cityName" label="城市" align="center"></el-table-column>
            <el-table-column prop="projectName" label="所属项目" align="center"></el-table-column>
            <el-table-column prop="enterIntegral" label="信用积分" align="center"></el-table-column>
            <el-table-column prop="phoneNo" label="手机号" align="center"></el-table-column>
            <el-table-column prop="enterStatus" label="状态" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.enterStatus=='0'?'正常':'停用' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
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
      <el-dialog :title="'修改企业信息'" :visible.sync="dialogAddVisible" width="700px"
                 :before-close="cancel">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                 ref='formAdd' class="add-dialog-form">
          <el-form-item label="企业enterCode" prop="enterCode" v-show="false">
            <el-input v-model="formAdd.enterCode" placeholder="企业enterCode"></el-input>
          </el-form-item>
          <el-form-item label="企业id" prop="id" v-show="false">
            <el-input v-model="formAdd.id" placeholder="企业id"></el-input>
          </el-form-item>

          <el-form-item label="手机号" prop="phoneNo">
            <el-input v-model="formAdd.phoneNo" placeholder="手机号"></el-input>
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
        name: 'enterprisePage',
        data() {
            return {
                formSearch: { //表单查询
                    enterName: '',
                    enterStatus: '',
                    phoneNo :'',
                    projectId:''
                },
                selectListId: [],
                openType: 'mof', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                  phoneNo: '',
                  enterCode:'',
                  id:''
                },
                rulesAdd: {
                  phoneNo: [
                    {required: true, message: "手机号不能为空", trigger: "blur"},
                    { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码' }
                  ]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px',
                projectList:[]
            };
        },
        computed: {},
        created() {
          this.findAllProject ()
        },
        mounted() {
            this.getEnterprisePage()
        },
        methods: {
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
            getEnterprisePage() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    enterName: this.formSearch.enterName,
                    enterStatus: this.formSearch.enterStatus,
                    phoneNo: this.formSearch.phoneNo,
                    projectId: this.formSearch.projectId,
                }
                this.$api.getEnterprisePage(params).then(res => {
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
                this.getEnterprisePage()
            },
            reset(formName) {
              this.$refs[formName].resetFields();
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getEnterprisePage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getEnterprisePage()
            },
            submit() {
                  this.modifyEnterprise()
            },
            cancel() {
                this.dialogAddVisible = false
                this.getEnterprisePage()
            },
            getDetail(data) {
                this.openType = 'mof'
                this.dialogAddVisible = true
                this.formAdd = data
            },
            modifyEnterprise() {
                if (this.formAdd.phoneNo === null || this.formAdd.phoneNo === '') {
                  this.$message.error('请输入手机号码')
                  return false
                }else if(this.formAdd.phoneNo.length != 11){
                    this.$message.error('请输入正确手机号码')
                    return false
                }else{
                    let params = {
                      phoneNo: this.formAdd.phoneNo,
                      enterCode:this.formAdd.enterCode,
                      id:this.formAdd.id
                    }
                    this.$api.validateEnterPhone(params).then(res => {
                      if (res.code == 0) {
                        console.log(res.data)
                        if(res.data >0){
                          this.$message.error(this.formAdd.phoneNo +'此手机号已被其他企业绑定')
                        }else{
                          this.$api.modifyEnterprise(this.formAdd).then(res => {
                            if (res.code === 0) {
                              this.cancel()
                              this.$message.success('修改成功')
                              this.getEnterprisePage()
                            } else {
                              // 失败提示
                              this.$message.error(res.msg)
                            }
                          })
                        }
                      }
                    })
                }

            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
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
