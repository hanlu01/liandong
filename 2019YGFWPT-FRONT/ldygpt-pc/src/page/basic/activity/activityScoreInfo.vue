<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="评分项名称" prop="scoreItemName">
                <el-input v-model="formSearch.scoreItemName" placeholder="评分项名称"></el-input>
            </el-form-item>
            <el-form-item label="评分项类型" prop="scoreItemType" >
                 <el-select v-model="formSearch.scoreItemType" class="el-select">
                     <el-option
                     v-for="item in scoreItemTypeList"
                     :key="item.id"
                     :label="item.dname"
                     :value="item.dcode">
                     </el-option>
                 </el-select>
             </el-form-item>
            <el-form-item label="启用状态" prop="scoreItemStatus" >
               <el-select v-model="formSearch.scoreItemStatus" class="el-select">
                   <el-option
                   v-for="item in scoreItemStatusList"
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
                <el-button size="small" round @click="change(0)">启用</el-button>
                <el-button size="small" round @click="change(1)">停用</el-button>
            </el-row>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="scoreItemName" label="评分项名称" align="center">
            </el-table-column>
            <el-table-column prop="scoreItemType" label="评分项类型" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.scoreItemType==0 ?'打分项':'填空项' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="scoreItemStatus" label="启用状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.scoreItemStatus==0 ?'启用':'停用' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" @click="getDetail(scope.row)">编辑</el-button>
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
                <el-form-item label="评分项名称" prop="scoreItemName">
                    <el-input v-model="formAdd.scoreItemName" placeholder="评分项名称" maxlength="15"></el-input>
                </el-form-item>
                <el-form-item label="评分项类型" prop="scoreItemType">
                    <el-select v-model="formAdd.scoreItemType" class="el-select" :disabled="openType =='add'?false:true">
                         <el-option
                         v-for="item in scoreItemTypeList"
                         :key="item.id"
                         :label="item.dname"
                         :value="item.dcode">
                         </el-option>
                     </el-select>
                </el-form-item>
                <el-form-item label="启用状态" prop="scoreItemStatus">
                    <el-select v-model="formAdd.scoreItemStatus" class="el-select" :disabled="openType =='add'?false:true">
                       <el-option
                       v-for="item in scoreItemStatusList"
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
        name: "activityScore",
        data() {
            return {
                selectValue: [],
                formSearch: { //表单查询
                    scoreItemName: '',
                    scoreItemType: '',
                    scoreItemStatus: ''
                },
                dialogAddVisible: false,    //添加弹框显示
                selectListId: [],
                listLoading: false,//
                openType: 'add', //add新增 mof修改
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                                },
                scoreItemTypeList:[],
                scoreItemStatusList:[],
                tableData: [],
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                rulesAdd: {
                    scoreItemName: [
                        {required: true, message: "请输入评分项名称", trigger: "blur"}
                    ],
                    scoreItemType: [{required: true, message: "请选择评分类型", trigger: "blur"}],
                    scoreItemStatus: [{required: true, message: "请选择启用状态", trigger: "blur"}]
                },
            };
        },
        computed: {},
        mounted() {
            this.getActivityScoreInfoList()
            this.getScoreItemTypeList()
            this.getScoreItemStatusList()
        },
        methods: {
            getScoreItemTypeList () {
                let params = {
                }
                this.$api.getScoreItemTypeList(params).then(res => {
                   if (res.code === 0) {
                      console.log(res.data);
                      this.scoreItemTypeList = res.data
                  } else {
                      // 失败提示
                      this.$message.error(res.msg)
                  }
              })
            },
            getScoreItemStatusList () {
                let params = {
                }
                this.$api.getScoreItemStatusList(params).then(res => {
                   if (res.code === 0) {
                      console.log(res.data);
                      this.scoreItemStatusList = res.data
                  } else {
                      // 失败提示
                      this.$message.error(res.msg)
                  }
              })
            },
            getActivityScoreInfoList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    scoreItemName: this.formSearch.scoreItemName,
                    scoreItemType: this.formSearch.scoreItemType,
                    scoreItemStatus: this.formSearch.scoreItemStatus
                }
                this.$api.getActivityScoreInfoList(params).then(res => {
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
                this.getActivityScoreInfoList()
            },
            reset() {
                this.formSearch.scoreItemName = ''
                this.formSearch.scoreItemType = ''
                this.formSearch.scoreItemStatus = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getActivityScoreInfoList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getActivityScoreInfoList()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },
             change(status) {
                  if(this.selectListId.join(',')==null || this.selectListId.join(',')==''){
                    this.$message.error("请先选择要操作的选项")
                  }else{
                    let params = {
                      ids: this.selectListId.join(','),
                      status: status
                    }
                    this.$api.modifyScoreInfo(params).then(res => {
                      if (res.code === 0) {
                        this.getActivityScoreInfoList()
                        this.$message.success('操作成功')
                      } else {
                        // 失败提示
                        this.$message.error(res.msg)
                      }
                    })
                  }
              },
            addSaveActivityScoreInfo() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addSaveActivityScoreInfo(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getActivityScoreInfoList()
                                this.$message.success('新增成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            editSaveActivityScoreInfo() {
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.editSaveActivityScoreInfo(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.getActivityScoreInfoList()
                      this.$message.success('修改成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                }
              })
            },
            submit() {
                if (this.openType == 'add') {
                    this.addSaveActivityScoreInfo()
                } else {
                    this.editSaveActivityScoreInfo()
                }
            },
            openAdd() {
                this.formAdd = {}
                this.formAdd.scoreItemStatus='0'
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            getDetail(data) {
                let params = {
                    uid: data.id
                }
                this.$api.getActivityScoreDetails(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formAdd = res.data
                        this.formAdd.scoreItemStatus=''+res.data.scoreItemStatus
                        this.formAdd.scoreItemType=''+res.data.scoreItemType
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
