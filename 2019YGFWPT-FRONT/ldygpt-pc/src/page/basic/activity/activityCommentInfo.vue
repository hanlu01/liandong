<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="评论人员" style="width:18%;">
                <el-input v-model="formSearch.userName" placeholder="评论人员" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="开始时间" style="width:20%;">
                <el-date-picker
                  v-model="formSearch.begTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择评论开始时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" style="width:20%;">
                <el-date-picker
                  v-model="formSearch.endTime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择评论结束时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="评论状态" style="width:18%;">
                <el-select v-model="formSearch.status" placeholder="评论状态" style="width:200px;">
                    <el-option label="有效" value="1"></el-option>
                    <el-option label="作废" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round plain type="danger" @click="cancelComment">作废评论</el-button>
            <el-button size="small" round @click="back()">返回活动</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="36">
            </el-table-column>
            <el-table-column prop="activityName" label="活动名称" align="center" width="266" >
            </el-table-column>
            <el-table-column prop="userName" label="评论人员" align="center" width="120" >
            </el-table-column>
            <el-table-column label="人员类型" align="center" width="100" >
              <template slot-scope="scope">
                <span>{{ scope.row.userType=='1'?'企业员工':'游客' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="enterName" label="所属企业" align="center" width="120" >
            </el-table-column>
            <el-table-column prop="comment" label="评论内容" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="评论时间" align="center" width="166" >
            </el-table-column>
            <el-table-column label="是否报名" align="center" width="106" >
                <template slot-scope="scope">
                  <span>{{ scope.row.hasApply=='1'?'已报名':'未报名' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="评论状态" align="center" width="106" >
              <template slot-scope="scope">
                <span>{{ scope.row.status=='1'?'作废':'有效' }}</span>
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


    </div>
</template>

<script>
    export default {
        name: 'activityCommentInfo',
        data() {
            return {
                formSearch: { //表单查询
                    userName: '',
                    begTime: '',
                    endTime: '',
                    status: ''
                },
                activityId:this.$route.query.activityId,
                applyItems:{},
                showUpload:false,
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
                selectListId: [],
                enters: [],
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
                formPwd: {
                    oldPwd: '',
                    newPwd: '',
                    newPwd2: ''
                },
                tableData: [],
                dialogApplyVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                fileName: '',
                file: '',
                uploadType:'incremental',
                currentId:'',
                percentage: 0,
                result: '',
                progressBar: false,
                active: 1
            };
        },
        mounted() {
            this.getActivityCommentList()
        },
        methods: {
            back(){
              this.$router.push({ name: "activityInfo"});
            },
            handleChange(value) {
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getActivityCommentList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    userName: this.formSearch.userName,
                    begTime: this.formSearch.begTime,
                    endTime: this.formSearch.endTime,
                    status: this.formSearch.status,
                    activityId: this.activityId

                }
                this.$api.getActivityCommentList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
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
                this.getActivityCommentList()
            },
            reset() {
                this.formSearch.userName = ''
                this.formSearch.begTime = ''
                this.formSearch.endTime = ''
                this.formSearch.status = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getActivityCommentList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getActivityCommentList()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },
            //修改活动状态
            cancelComment() {
              var num = this.selectListId.length;
              if(num>0){
                this.$confirm('确定要作废所选评论吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    let params = {
                      ids: this.selectListId.join(',')
                    }
                    this.$api.cancelComment(params).then(res => {
                      if (res.code === 0) {
                        this.getActivityCommentList()
                        this.$message.success('作废成功')
                      } else {
                        // 失败提示
                        this.$message.error(res.msg)
                      }
                    })
                })
              }else{
                this.$message.error("请选择数据进行作废")
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
