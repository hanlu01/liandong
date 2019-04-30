<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="园区名称">
              <el-select placeholder="请选择园区" filterable v-model="formSearch.projectId"  style="width:160px;">
                  <el-option v-for="item in projects"
                             :key="item.projectId"
                             :value="item.projectId"
                              :label="item.projectName">
                  </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="活动标题">
                <el-input v-model="formSearch.activityName" placeholder="活动标题" style="width:170px;"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
                <el-date-picker
                  v-model="formSearch.activityBegTime"
                  type="datetime"
                  placeholder="选择活动开始时间"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width:196px;">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="formSearch.activityEndTime"
                type="datetime"
                placeholder="选择活动结束时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width:196px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发布状态">
                <el-select v-model="formSearch.dataStatus" placeholder="活动状态" style="width:106px;">
                    <el-option label="上架" value="1"></el-option>
                    <el-option label="下架" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:10px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="addActivity">新增活动</el-button>
            <el-button size="small" round type="danger" @click=" upperActivityStatus('all','delete')">删除活动</el-button>
            <el-button size="small" round  @click="upperActivityStatus('all','upperShelf')">上架活动</el-button>
            <el-button size="small" round  @click=" upperActivityStatus('all','downShelf')">下架活动</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="36">
            </el-table-column>
            <el-table-column prop="projectName" label="所属园区" align="center">
            </el-table-column>
            <el-table-column prop="activityName" label="活动标题" align="center">
            </el-table-column>
            <el-table-column prop="activityPosition" label="活动地点" align="center">
            </el-table-column>
            <el-table-column label="活动时间" align="center" width="156">
              <template slot-scope="scope">
                <span>{{ scope.row.activityBegTime}}</span><br>
                <span>至</span><br>
                <span>{{ scope.row.activityEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报名人数(人)"  align="center" width="102">
              <template slot-scope="scope">
                <span>{{ scope.row.activityParticipants}}</span>/<span>{{ scope.row.activityCeiling }}</span>
              </template>
            </el-table-column>
            <el-table-column label="报名时间" align="center" width="156">
              <template slot-scope="scope">
                <span>{{ scope.row.applyBegTime}}</span><br>
                <span>至</span><br>
                <span>{{ scope.row.applyEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="applyScope" label="报名范围" align="center" width="80">
              <template slot-scope="scope">
                <span>{{ scope.row.applyScope=='0'?'全部':scope.row.applyScope=='1'?'企业':'游客' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="报名费用(元)" align="center"  width="106">
              <template slot-scope="scope">
                <span v-if="scope.row.applyScope=='0'">企:{{ scope.row.enterpriseEmpPrice}} - 游:{{scope.row.visitorPrice}} </span>
                <span v-if="scope.row.applyScope=='1'">{{ scope.row.enterpriseEmpPrice}}</span>
                <span v-if="scope.row.applyScope=='2'">{{scope.row.visitorPrice}} </span>
              </template>
            </el-table-column>
            <el-table-column label="发布状态" align="center" width="80">
               <template slot-scope="scope">
                <span>{{ scope.row.dataStatus=='1'?'上架':'下架' }}</span>
               </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" title="详情" plain type="info" icon="el-icon-zoom-in" @click="getDetail(scope.row,1)">详情</el-button>
                    <el-button class="btn-size" size="mini" title="编辑" plain type="success" icon="el-icon-edit" v-if="scope.row.dataStatus != 1"  @click="getDetail(scope.row,2)">编辑</el-button>
                    <el-button class="btn-size" size="mini" title="删除" plain type="danger" icon="el-icon-delete" v-if="scope.row.dataStatus != 1" @click="upperActivityStatus('one','delete',scope.row.id)">删除</el-button>
                    <el-button class="btn-size" size="mini" title="活动置顶" plain icon="el-icon-upload2" @click="roofPlacement(scope.row.id)">置顶</el-button>
                    <el-button class="btn-size" size="mini" title="查看报名" plain icon="el-icon-document" @click="showActivityUserInfo(scope.row.id)">报名</el-button>
                    <el-button class="btn-size" size="mini" title="查看评论" plain icon="el-icon-menu" @click="showActivityCommentInfo(scope.row.id)">评论</el-button>
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
        <!-- 新增活动弹窗 -->
        <el-dialog :visible.sync="dialogActivityVisible" width="80%" class="activityDialog">
            <activity-add @cancleDialog="cancleDialog" @submitCancleDialog="submitCancleDialog"></activity-add>
        </el-dialog>

    </div>
</template>

<script>
import activityAdd from './activityAdd'
    export default {
        name: 'activityInfo',
        components: {
            'activity-add': activityAdd
        },
        data() {
            return {
                formSearch: { //表单查询
                    projectId: '',
                    activityName: '',
                    activityTime: '',
                    dataStatus: ''
                },
                showUpload:false,
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
                dialogActivityVisible:false, //增加活动弹窗
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
            this.getActivityList()
        },
        methods: {
            handleChange(value) {
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getActivityList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    projectId: this.formSearch.projectId,
                    activityName: this.formSearch.activityName,
                    activityBegTime: this.formSearch.activityBegTime,
                    activityEndTime: this.formSearch.activityEndTime,
                    dataStatus: this.formSearch.dataStatus

                }
                this.$api.getActivityList(params).then(res => {
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
                this.getActivityList()
            },
            reset() {
                this.formSearch.projectId = ''
                this.formSearch.activityName = ''
                this.formSearch.activityBegTime = ''
                this.formSearch.activityEndTime = ''
                this.formSearch.dataStatus = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getActivityList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getActivityList()
            },
            getDetail(data,name) {
                this.$router.push({ name: "activityAdd" ,query:{activityId:data.id,status:name} });
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
                  this.$router.push({ name: "activityApplyUserInfo" ,query:{activityId:activityId} });
             },
            showActivityCommentInfo(activityId){
                  this.$router.push({ name: "activityCommentInfo" ,query:{activityId:activityId} });
            },
            //修改活动状态
            upperActivityStatus(model,type,id) {
              var num =  this.selectListId.length;
              if(model == 'all'&&num == 0){
                  this.$message.error("请选择要操作的数据")
              }else{
                  let title = '';
                  if(type == 'upperShelf'){
                    title = '上架';
                  }else if(type == 'downShelf'){
                    title = '下架';
                  }else if(type == 'delete'){
                    title = '作废';
                  }
                  this.$confirm('确定要'+title+'吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    let params = {
                      ids: '',
                      status:type
                    }
                    if (model == 'all') {
                      params.ids = this.selectListId.join(',')
                    } else {
                      params.ids = id
                    }
                    this.$api.upperActivityStatus(params).then(res => {
                      if (res.code === 0) {
                        this.getActivityList()
                        this.$message.success(title+'成功')
                      } else {
                        // 失败提示
                        this.$message.error(res.msg)
                      }
                    })
                  })
              }

            },
            addActivity(){
              this.$router.push({ name: "activityAdd"});
            },
             //关闭弹窗
            cancleDialog(val){
                this.dialogActivityVisible = val
            },
            //提交执行事件
            submitCancleDialog(val){
                this.dialogActivityVisible = val
                  this.$confirm('确定要'+title+'吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    let params = {
                      ids: '',
                      status:type
                    }
                    if (model == 'all') {
                      params.ids = this.selectListId.join(',')
                    } else {
                      params.ids = id
                    }
                    this.$api.upperActivityStatus(params).then(res => {
                      if (res.code === 0) {
                        this.getActivityList()
                        this.$message.success(title+'成功')
                      } else {
                        // 失败提示
                        this.$message.error(res.msg)
                      }
                    })
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

    .container {
        .btn-size {
            padding: 4px 5px;
        }

        .el-button + .el-button {
            margin-left: 5px;
        }
    }
</style>
