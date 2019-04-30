<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
              <el-form-item label="所属项目" prop="projectId" >
                  <el-select v-model="formSearch.projectId" filterable class="el-select">
                      <el-option
                      v-for="item in projectList"
                      :key="item.projectId"
                      :label="item.projectName"
                      :value="item.projectId">
                      </el-option>
                  </el-select>
              </el-form-item>
          <el-form-item label="公告状态" prop="announcementStatus" >
            <el-select v-model="formSearch.announcementStatus" filterable class="el-select">
              <el-option label="上架" value="0"></el-option>
              <el-option label="下架" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="可见范围" prop="lookScope" >
            <el-select v-model="formSearch.lookScope" filterable class="el-select">
              <el-option label="全部" value="0"></el-option>
              <el-option label="企业人员" value="1"></el-option>
              <el-option label="游客" value="2"></el-option>
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
                <el-button size="small" round type="danger" @click="deleteByIds">批量删除</el-button>
                <el-button size="small" round type="danger" @click="changeStatus(0)">上架</el-button>
                <el-button size="small" round type="danger" @click="changeStatus(1)">下架</el-button>
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
            <el-table-column prop="announcementTitle" label="公告标题" align="center">
            </el-table-column>
            <el-table-column prop="announcementStatus" label="公告状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.announcementStatus==0 ?'上架':'下架' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="lookScope" label="可见范围" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.lookScope==0">全部</span>
                <span v-if="scope.row.lookScope==1">企业人员</span>
                <span v-if="scope.row.lookScope==2">游客</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="创建时间" align="center">
            </el-table-column>
            <el-table-column prop="username" label="创建人" align="center">
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" @click="getDetail(scope.row)"  v-if="scope.row.announcementStatus==1">编辑</el-button>
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
                     <el-select v-model="formAdd.projectId" filterable class="el-select">
                         <el-option
                         v-for="item in projectList"
                         :key="item.projectId"
                         :label="item.projectName"
                         :value="item.projectId">
                         </el-option>
                     </el-select>
                 </el-form-item>
                <el-form-item label="公告标题" prop="announcementTitle">
                    <el-input v-model="formAdd.announcementTitle" placeholder="公告标题" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="可见范围" prop="lookScope">
                    <el-select v-model="formAdd.lookScope" class="el-select">
                      <el-option label="全部" value="0"></el-option>
                      <el-option label="企业人员" value="1"></el-option>
                      <el-option label="游客" value="2"></el-option>
                    </el-select>
                </el-form-item>
               <el-form-item label="公告内容" prop="announcementText">
                 <el-input type="textarea" :rows="12" v-model="formAdd.announcementText" placeholder="公告内容" maxlength="500"></el-input>
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
        name: "announcement",
        data() {
            return {
                selectValue: [],
                formSearch: { //表单查询
                    announcementStatus: '',
                    projectId: '',
                    lookScope: ''
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

                 imageUrl: '',
                 projectList:[],
                tableData: [],
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                rulesAdd: {
                    projectId: [{required: true, message: "请选择所属项目", trigger: "blur"}],
                  announcementText: [{required: true, message: "请输入公告内容", trigger: "blur"}],
                  announcementTitle: [{required: true, message: "请输入公告标题", trigger: "blur"}],
                  lookScope: [{required: true, message: "请选择可见范围", trigger: "blur"}]

                }

            };
        },
        mounted() {
            this.getAnnouncementList()
            this.getProjectList ()
        },
        methods: {

          getAnnouncementList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                  announcementStatus: this.formSearch.announcementStatus,
                  lookScope: this.formSearch.lookScope,
                    projectId: this.formSearch.projectId
                }
                this.$api.getAnnouncementList(params).then(res => {
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
                this.getAnnouncementList()
            },
            reset() {
                this.formSearch.projectId = ''
                this.formSearch.announcementStatus = ''
                this.formSearch.lookScope = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getAnnouncementList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getAnnouncementList()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },
            submit() {
              this.saveAnnouncement()
            },
          saveAnnouncement() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.saveAnnouncement(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getAnnouncementList()
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
          changeStatus(status) {
            if(this.selectListId.join(',')==null || this.selectListId.join(',')==''){
              this.$message.error("请先选择要操作的选项")
            }else{
              let params = {
                ids: this.selectListId.join(','),
                status: status
              }
              this.$api.updateAnnouncementStatus(params).then(res => {
                if (res.code === 0) {
                  this.getAnnouncementList()
                  this.$message.success('操作成功')
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
            }

          },
            openAdd() {
                this.formAdd = {}
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.dialogAddVisible = false
            },
            getProjectList () {
                let params = {
                }
                this.$api.getProjectList(params).then(res => {
                   if (res.code === 0) {
                      console.log(res.data);
                      this.projectList = res.data
                  } else {
                      // 失败提示
                      this.$message.error(res.msg)
                  }
              })
            },

            deleteByIds() {
              let params = {
                ids: this.selectListId.join(',')
              }
              if(params.ids==null || params.ids==''){
                this.$message.error("请先选择要操作的选项")
              }else{
                this.$confirm('确定要删除吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$api.deleteAnnouncements(params).then(res => {
                    if (res.code === 0) {
                      this.getAnnouncementList()
                      this.$message.success('删除成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                })
              }
            },

            getDetail(data) {
                let params = {
                    id: data.id
                }
                this.$api.getAnnouncementDetails(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formAdd = res.data
                        this.formAdd.lookScope = res.data.lookScope+''

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
