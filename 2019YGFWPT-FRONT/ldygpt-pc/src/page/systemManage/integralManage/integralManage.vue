<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="员工姓名" prop="userName">
                <el-input v-model="formSearch.userName" placeholder="员工姓名"></el-input>
            </el-form-item>
            <el-form-item label="员工工号" prop="userNo">
                <el-input v-model="formSearch.userNo" placeholder="员工工号"></el-input>
            </el-form-item>
            <el-form-item label="积分范围" prop="integralValue">
                <el-input v-model="formSearch.minValue" placeholder="" style="width:20%"></el-input>&nbsp;至&nbsp;<el-input
                    v-model="formSearch.maxValue" placeholder="" style="width:20%"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="uploadOpen('incremental')">批量增加积分</el-button>
            <el-button size="small" round type="primary" @click="openAdd">新增积分</el-button>
            <el-button size="small" round type="danger" @click="uploadOpen('deduction')">批量扣除积分</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="userName" label="员工姓名" align="center">
            </el-table-column>
            <el-table-column prop="userNo" label="员工工号" align="center">
            </el-table-column>
            <el-table-column prop="integralTotal" label="当前积分" align="center">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" @click="getDetail(scope.row)">积分记录</el-button>
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

        <!-- 新增弹框---end -->
        <el-dialog :title="openType == 'batchAdd'? '批量增加积分': '批量扣减积分'" :visible.sync="showUpload" width="700px"
                   :before-close="cancelUpload">
            <div class="upload-content">
                <el-upload
                        class="upload-block"
                        drag
                        action=""
                        :on-progress="upProgress"
                        :before-upload="beforeAvatarUpload">
                    <div v-show="!isprogress">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">
                            <p class="up-tips">点击或将文件拖拽到这里上传</p>
                            <p>支持扩展名：<span class="red-text">.xls .xslx</span></p>
                        </div>
                    </div>
                    <div v-show="fileName">
                        <p class="up-tips">{{fileName}}</p>
                    </div>
                </el-upload>
                <!--<el-form-item label="积分说明">
                  <el-input type="textarea" v-model="form.desc"></el-input>
                </el-form-item>-->
                <div class="progres-bar">
                    <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage"
                                 status="success"></el-progress>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelUpload">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'integral',
        data() {
            return {
                percentage: 0,
                showUpload: false,
                formSearch: { //表单查询
                    userName: '',
                    userNo: ''
                },
                selectListId: [],
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                    userName: '',
                    userNo: ''
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                isprogress: false,
                fileName: '',
                file: '',
                uploadType: '',
                getTime: null
            };
        },
        mounted() {
            this.getUserIntegralList()
        },
        methods: {
            getUserIntegralList() {
                let params = {
                    pageNo: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.pageSize,
                    userName: this.formSearch.userName,
                    userNo: this.formSearch.userNo,
                    minValue: this.formSearch.minValue,
                    maxValue: this.formSearch.maxValue
                }
                this.$api.getUserIntegralList(params).then(res => {
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
                this.getUserIntegralList()
            },
            reset() {
                this.formSearch.userName = ''
                this.formSearch.userNo = ''
                this.formSearch.minValue = ''
                this.formSearch.maxValue = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getUserIntegralList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getUserIntegralList()
            },
            addIntegral() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addIntegral(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getUserIntegralList()
                                this.$message.success('新增成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            uploadOpen(type) {
                this.showUpload = true
                this.uploadType = type
            },
            submit() {

            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            getDetail(data) {
                this.$router.push({
                    name: "integralRecord",
                    params: {userNo: data.userNo, tenementCode: data.tenementCode}
                });
            },
            // 验证上传文件
            beforeAvatarUpload(file) {
                this.fileName = file.name
                this.file = file
            },
            upProgress() {
                this.isprogress = true
                this.getImportParameter()
            },
            getImportParameter() {
                this.$api.getImportUserIntegralParameter().then(res => {
                    if (res.zkGroup) {
                        let fd = new window.FormData()
                        fd.append('file', this.file)
                        fd.append('zkGroup', res.zkGroup)
                        fd.append('zkAddress', res.zkAddress)
                        fd.append('classPath', res.classPath)
                        fd.append('params', this.uploadType)
                        this.$api.excelFileUpload(fd).then(res => {
                            if (res.code == 0) {
                                this.percentage = 100
                                window.clearInterval(this.getTime)
                            } else {
                                this.percentage = 0
                                window.clearInterval(this.getTime)
                            }
                        }).catch(err => {
                            window.clearInterval(this.getTime)
                        })
                        this.getExportExcelSchedule()
                    }
                })
            },
            getExportExcelSchedule() {
                this.getTime = setInterval(() => {
                    this.$api.getExportExcelSchedule().then(res => {
                        this.percentage = res.data
                    })
                }, 1000)
            },
            cancelUpload() {
                this.fileName = ''
                this.file = ''
                this.percentage = 0
                this.showUpload = false
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
                console.log(this.selectListId)
            },
            change(status) {
                let params = {
                    integralIds: this.selectListId.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyIntegralStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getUserIntegralList()
                        this.$message.success('修改成功')
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
</style>
