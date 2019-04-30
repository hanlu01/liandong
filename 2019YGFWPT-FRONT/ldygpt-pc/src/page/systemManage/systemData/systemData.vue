<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="系统参数名称" prop="sysParamName">
                <el-input v-model="formSearch.sysParamName" placeholder="系统参数名称"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="formSearch.status" placeholder="状态">
                    <!-- <el-option label="生效" value="A"></el-option>
                    <el-option label="失效" value="D"></el-option> -->
                    <el-option :label="item.dname" :value="item.dcode" v-for="(item, index) in dict"
                               :key="index"></el-option>
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
            <el-button size="small" round type="danger" @click="deleteSysParams('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="sysParamName" label="系统参数名称" align="center">
            </el-table-column>
            <el-table-column prop="sysParamKey" label="系统参数key" align="center">
            </el-table-column>
            <el-table-column prop="sysParamValue" label="系统参数值" align="center">
            </el-table-column>
            <el-table-column prop="sysRemark" label="备注信息" align="center">
            </el-table-column>
            <el-table-column label="状态" align="center" width="100">
                <template slot-scope="scope">
                    <!-- <span>{{ scope.row.status=='A'?'生效':'失效' }}</span> -->
                    <span>{{formatDict('1', 'state')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" plain type="primary" >详情</el-button> -->
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteSysParams('one', scope.row.sysParamId)">
                        删除
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
        <el-dialog :title="openType == 'add'? '新增系统参数': '修改信息 '" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="系统参数名称" prop="sysParamName">
                    <el-input v-model="formAdd.sysParamName" placeholder="系统参数名称"></el-input>
                </el-form-item>
                <el-form-item label="系统参数key" prop="sysParamKey">
                    <el-input v-model="formAdd.sysParamKey" placeholder="系统参数key"></el-input>
                </el-form-item>
                <el-form-item label="系统参数值" prop="sysParamValue">
                    <el-input v-model="formAdd.sysParamValue" placeholder="系统参数值"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" prop="sysRemark">
                    <el-input v-model="formAdd.sysRemark" placeholder="备注信息" type="textarea"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="formAdd.status">
                        <el-radio :label="item.dcode" v-for="(item, index) in dict" :key="index">{{item.dname}}
                        </el-radio>
                        <!-- <el-radio label="D">失效</el-radio> -->
                    </el-radio-group>
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
        name: 'systemData',
        data() {
            return {
                formSearch: { //表单查询
                    sysParamName: '',
                    status: ''
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
                    sysParamName: '',
                    sysParamKey: '',
                    status: '',
                    sysParamValue: '',
                    sysRemark: ''
                },
                rulesAdd: {
                    sysParamName: [
                        {required: true, message: "请输入系统参数名称", trigger: "blur"}
                    ],
                    sysParamKey: [{required: true, message: "请输入系统参数key", trigger: "blur"}],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}],
                    sysParamValue: [{required: true, message: "请输入系统参数值", trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px',
                dict: []
            };
        },
        computed: {},
        created() {
            this.getDict('state')
        },
        mounted() {
            this.sysParamsList()
        },
        methods: {
            getDict(code) {
                this.dict = this.$common.getDict(code)
            },
            // 字典格式化
            formatDict(val, code) {
                // this.dict = this.$common.formatDict(code)
                let state = ''
                this.dict.forEach(item => {
                    if (val == item.dcode) {
                        state = item.dname
                    }
                })
                return state
            },
            sysParamsList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    sysParamName: this.formSearch.sysParamName,
                    status: this.formSearch.status
                }
                this.$api.sysParamsList(params).then(res => {
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
                this.sysParamsList()
            },
            reset() {
                this.formSearch.sysParamName = ''
                this.formSearch.status = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.sysParamsList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.sysParamsList()
            },
            addSysParams() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addSysParams(this.formAdd).then(res => {
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
                    this.addSysParams()
                } else {
                    this.modifySysParams()
                }
            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.sysParamsList()
                this.dialogAddVisible = false
                this.formAdd = {}
            },
            getDetail(data) {
                console.log(data)
                this.openType = 'mof'
                this.dialogAddVisible = true
                this.formAdd = data
            },
            modifySysParams() {
                delete this.formAdd.createDate
                this.$api.modifySysParams(this.formAdd).then(res => {
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
                    this.selectListId.push(item.sysParamId)
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
                this.$api.modifySysParamsStatus(params).then(res => {
                    if (res.code === 0) {
                        this.sysParamsList()
                        this.$message.success('修改成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            deleteSysParams(type, id) {

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
                    this.$api.deleteSysParams(params).then(res => {
                        if (res.code === 0) {
                            this.sysParamsList()
                            this.$message.success('删除成功')
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
</style>
