<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="字典目录名称" prop="name">
                <el-input v-model="formSearch.name" placeholder="字典目录名称"></el-input>
            </el-form-item>
            <el-form-item label="字典目录编码" prop="code">
                <el-input v-model="formSearch.code" placeholder="字典目录编码"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="formSearch.status" placeholder="状态">
                    <el-option label="生效" value="A"></el-option>
                    <el-option label="失效" value="D"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
            <el-button size="small" round @click="change('A')">生效</el-button>
            <el-button size="small" round @click="change('D')">失效</el-button>
            <el-button size="small" round type="danger" @click="deleteTenement('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="name" label="字典目录名称" align="center">
            </el-table-column>
            <el-table-column prop="code" label="字典目录编码" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="createDate" label="所属系统" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column> -->
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" @click="openDetail(scope.row)">详情</el-button>
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteTenement('one', scope.row.id)">删除
                    </el-button>
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
        <el-dialog :title="openType == 'add'? '新增字典': '修改信息 '" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="字典目录名称" prop="name">
                    <el-input v-model="formAdd.name" placeholder="字典目录名称"></el-input>
                </el-form-item>
                <el-form-item label="字典目录编码" prop="code">
                    <el-input v-model="formAdd.code" placeholder="字典目录编码"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formAdd.status">
                        <el-radio label="A">生效</el-radio>
                        <el-radio label="D">失效</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增弹框---end -->
        <el-dialog title="字典明细" :visible.sync="dialogDetail" width="1000px">
            <el-row class="mgb15">
                <el-button size="small" round type="primary" @click="openAdd1">新增</el-button>
                <el-button size="small" round @click="change1('A')">生效</el-button>
                <el-button size="small" round @click="change1('D')">失效</el-button>
                <el-button size="small" round type="danger" @click="deleteTenement1('all')">批量删除</el-button>
            </el-row>
            <el-table :data="tableData1" border stripe style="width: 100%" @selection-change="handleSelectionChange1">
                <el-table-column type="selection" width="60">
                </el-table-column>
                <el-table-column prop="dname" label="字典值" align="center">
                </el-table-column>
                <el-table-column prop="dcode" label="字典值编码" align="center">
                </el-table-column>
                <el-table-column prop="orderNum" label="排序" align="center">
                </el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="createDate" label="所属系统" align="center" :formatter="this.$common.timestampToTime">
                </el-table-column> -->
                <el-table-column label="操作" width="230" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="getDetail1(scope.row)">编辑</el-button>
                        <el-button size="mini" plain type="danger" @click="deleteTenement1('one', scope.row.id)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination background
                           layout="total,sizes,prev, pager, next,jumper"
                           :current-page="pageInfo1.currentPage"
                           :page-size="pageInfo1.pageSize"
                           @size-change="handleSizeChange1"
                           @current-change="handleCurrentChange1"
                           :total="pageInfo1.pageTotal"
                           :page-sizes="[5, 10, 20, 50]">
            </el-pagination>
            <el-dialog :title="openType == 'add'? '新增': '修改 '" :visible.sync="dialogAddVisible1" width="600px"
                       append-to-body>
                <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd1" :model="formAdd1"
                         ref='formAdd1' class="add-dialog-form">
                    <el-form-item label="字典值" prop="dname">
                        <el-input v-model="formAdd1.dname" placeholder="字典值"></el-input>
                    </el-form-item>
                    <el-form-item label="字典值编码" prop="dcode">
                        <el-input v-model="formAdd1.dcode" placeholder="字典值编码"></el-input>
                    </el-form-item>
                    <el-form-item label="排序" prop="orderNum">
                        <el-input v-model="formAdd1.orderNum" placeholder="排序"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="formAdd1.status">
                            <el-radio label="A">生效</el-radio>
                            <el-radio label="D">失效</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="cancel1">取 消</el-button>
                    <el-button type="primary" @click="submit1">确 定</el-button>
                </div>
            </el-dialog>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'dictionnaireManage',
        data() {
            return {
                formSearch: { //表单查询
                    name: '',
                    code: '',
                    status: ''
                },
                dialogAddVisible1: false,
                dialogDetail: false,
                selectListId: [],
                selectListId1: [],
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                pageInfo1: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                    name: '',
                    code: '',
                    status: ''
                },
                rulesAdd: {
                    name: [
                        {required: true, message: "请输入字典目录名称", trigger: "blur"}
                    ],
                    code: [{required: true, message: "请输入字典目录编码", trigger: "blur"}],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}]
                },
                formAdd1: { //表单添加
                    dname: '',
                    dcode: '',
                    status: ''
                },
                rulesAdd1: {
                    dname: [
                        {required: true, message: "请输入字典值", trigger: "blur"}
                    ],
                    dcode: [{required: true, message: "请输入字典值编码", trigger: "blur"}],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}]
                },
                tableData: [],
                tableData1: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px',
                dictPid: ''
            };
        },
        computed: {},
        mounted() {
            this.getDictionnaire()
        },
        methods: {
            getDictionnaire() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    name: this.formSearch.name,
                    code: this.formSearch.code,
                    status: this.formSearch.status
                }
                this.$api.getDictionnaire(params).then(res => {
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
                this.getDictionnaire()
            },
            reset() {
                this.formSearch.name = ''
                this.formSearch.code = ''
                this.formSearch.status = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getDictionnaire()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getDictionnaire()
            },
            addDictionnaire() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addDictionnaire(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.$message.success('新增成功')
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
                    this.addDictionnaire()
                } else {
                    this.modifyDictionnaire()
                }
            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.getDictionnaire()
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            getDetail(data) {
                console.log(data)
                this.openType = 'mof'
                this.dialogAddVisible = true
                this.formAdd = data
            },
            modifyDictionnaire() {
                delete this.formAdd.createDate
                this.$api.modifyDictionnaire(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.$message.success('修改成功')
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
                console.log(this.selectListId)
            },
            change(status) {
                if(this.selectListId.join(',')==null || this.selectListId.join(',')==''){
                  this.$message.error("请先选择要操作的选项")
                  return
                }

                let params = {
                    ids: this.selectListId.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyDictionnaireStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getDictionnaire()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteTenement(type, id) {

              if (type == 'all') {
                if(this.selectListId.join(',')==null || this.selectListId.join(',')==''){
                  this.$message.error("请先选择要操作的选项")
                  return
                }

              } else {
                if(id==null || id==''){
                  this.$message.error("请先选择要操作的选项")
                  return
                }
              }
              this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                  let params = {
                    ids: ''
                  }
                  if (type == 'all') {
                    params.ids = this.selectListId.join(',')
                  } else {
                    params.ids = id
                  }
                this.$api.deleteDictionnaire(params).then(res => {
                    if (res.code === 0) {
                        this.getDictionnaire()
                        this.$message.success('删除成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
              })
            },
            handleSizeChange1(size) {
                this.pageInfo1.currentPage = 1
                this.pageInfo1.pageSize = size
                this.queryDictListById()
            },
            handleCurrentChange1(currentPage) {
                this.pageInfo1.currentPage = currentPage
                this.queryDictListById()
            },
            openDetail(data) {
                this.dialogDetail = true
                this.dictPid = data.id
                this.queryDictListById()
            },
            queryDictListById() {
                let params = {
                    page: this.pageInfo1.currentPage,
                    limit: this.pageInfo1.pageSize,
                    id: this.dictPid
                }
                this.$api.queryDictListById(params).then(res => {
                    if (res.code === 0) {
                        this.pageInfo1.pageTotal = res.count
                        this.tableData1 = res.data
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            handleSelectionChange1(val) {
                this.selectListId1 = []
                val.forEach(item => {
                    this.selectListId1.push(item.id)
                });
                console.log(this.selectListId1)
            },
            openAdd1() {
                this.openType = 'add'
                this.dialogAddVisible1 = true
            },
            cancel1() {
                this.queryDictListById()
                this.dialogAddVisible1 = false
                this.formAdd1 = {}
            },
            submit1() {
                if (this.openType == 'add') {
                    this.addDictById()
                } else {
                    this.modifyDictDdetail()
                }
            },
            addDictById() {
                this.$refs['formAdd1'].validate((valid) => {
                    if (valid) {
                        this.formAdd1.pid = this.dictPid
                        this.$api.addDictById(this.formAdd1).then(res => {
                            if (res.code === 0) {
                                this.cancel1()
                                this.$message.success('新增成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            modifyDictDdetail() {
                this.$api.modifyDictDdetail(this.formAdd1).then(res => {
                    if (res.code === 0) {
                        this.cancel1()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            getDetail1(data) {
                console.log(data)
                this.openType = 'mof'
                this.dialogAddVisible1 = true
                this.formAdd1 = data
            },
            change1(status) {
                if(this.selectListId1.join(',')==null || this.selectListId1.join(',')==''){
                  this.$message.error("请先选择要操作的选项")
                  return
                }
                let params = {
                    ids: this.selectListId1.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyDdetailStatus(params).then(res => {
                    if (res.code === 0) {
                        this.queryDictListById()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteTenement1(type, id) {
              if (type == 'all') {
                if(this.selectListId.join(',')==null || this.selectListId.join(',')==''){
                  this.$message.error("请先选择要操作的选项")
                  return
                }

              } else {
                if(id==null || id==''){
                  this.$message.error("请先选择要操作的选项")
                  return
                }
              }

                let params = {
                    ids: ''
                }
                if (type == 'all') {
                    params.ids = this.selectListId1.join(',')
                } else {
                    params.ids = id
                }
                this.$api.deleteDictdetailData(params).then(res => {
                    if (res.code === 0) {
                        this.queryDictListById()
                        this.$message.success('删除成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },

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
