<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="formSearch.userName" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item label="用户账号" prop="acctName">
                <el-input v-model="formSearch.acctName" placeholder="用户账号"></el-input>
            </el-form-item>
            <el-form-item label="用户工号" prop="workCode">
                <el-input v-model="formSearch.workCode" placeholder="用户工号"></el-input>
            </el-form-item>
            <el-form-item label="账号状态" style="width:18%;">
                <el-select v-model="formSearch.status" placeholder="账号状态" style="width:200px;">
                    <el-option label="开通" value="A"></el-option>
                    <el-option label="关闭" value="D"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="userName" label="用户姓名" align="center">
            </el-table-column>
            <el-table-column prop="sex" label="用户性别" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.sex=='0'?'男':'女' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="acctName" label="用户账号" align="center">
            </el-table-column>
            <el-table-column prop="workCode" label="用户工号" align="center">
            </el-table-column>
            <el-table-column prop="departmentName" label="所属部门" align="center">
            </el-table-column>
            <el-table-column prop="companyName" label="所属公司" align="center">
            </el-table-column>
            <el-table-column prop="phoneNo" label="用户电话" align="center">
            </el-table-column>
            <el-table-column prop="createDate" label="创建日期" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column prop="status" label="账号状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'开通':'关闭' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" @click="empowerMenue(scope.row)">分配权限</el-button>
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
        <!-- 角色弹窗  start-->
        <el-dialog :visible.sync="empowerMenueWin" width="700px" title="园区管理" center :before-close="handleClose3"
                   class="import-dialog">
            <div class="menu-tree">
                <el-tree
                        :data="menuTreeList"
                        node-key="code"
                        @check='getThisTree'
                        ref="tree"
                        show-checkbox
                        :check-strictly="false"
                        :expand-on-click-node="false"
                        :default-expanded-keys="hasGetList">
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ data.name }}</span>
                    </div>
                </el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose3">取 消</el-button>
            <el-button type="primary" @click="submitMenu">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 角色授权菜单弹窗  end -->
    </div>
</template>

<script>
    export default {
        name: 'userInfoManager',
        data() {
            return {
                formSearch: { //表单查询
                    userName: '',
                    acctName: '',
                    workCode: '',
                    status: ''
                },
                selectedStore: [],
                options: [],
                selectedOptions: [],
                passwordDialog: false,
                selectListId: [],
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
                },
                formPwd: {
                    oldPwd: '',
                    newPwd: '',
                    newPwd2: ''
                },
                rulesPwd: {
                    oldPwd: [
                        {required: true, message: "请输入原始密码", trigger: "blur"}
                    ],
                    newPwd: [{required: true, message: "请输入新的密码", trigger: "blur"}],
                    newPwd2: [{required: true, message: "请重新输入新的密码", trigger: "blur"}]
                },
                rulesAdd: {
                    userName: [
                        {required: true, message: "请输入租户名称", trigger: "blur"}
                    ],
                    tenementCode: [{required: true, message: "请输入租户编码", trigger: "blur"}],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                // 角色分配弹框展示
                assignRolesWinShow: false,
                // 角色列表数据
                roleTableData: [],
                // 已选中的角色ridList
                hasCheckedRoleIds: [],
                hasCheckedRoleIdsBack: [],
                // 当前选中的用户ID
                checkedUserId: '',
                // 当前用户已拥有的角色
                userHasRoleList: [],
                empowerMenueWin: false,
                roleIndexArr: [],
                // 组织数据
                menuTreeList: [],
                // 已获得的组织
                hasGetList: [],
                // 当前选中的角色ID
                checkedRoleId: '',
                // 选中数据
                selectData: []
            };
        },
        mounted() {
            this.getLdUserList()
        },
        methods: {
            handleChange(value) {
                console.log(JSON.stringify(value))
                this.selectedOptions = value[value.length - 1].split(',')
            },
            getLdUserList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    userName: this.formSearch.userName,
                    acctName: this.formSearch.acctName,
                    workCode: this.formSearch.workCode,
                    status: this.formSearch.status,
                }
                this.$api.getLdUserList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            // 取消授权
            handleClose3() {
                this.empowerMenueWin = false
                this.hasGetList = []
            },
            // 打开分配权限窗口
            empowerMenue(val) {
                this.checkedRoleId = val.uid
                this.empowerMenueWin = true
                this.getTreeList()
            },
            // 获取菜单列表
            getTreeList() {
                this.$api.getEmpTrees().then(res => {
                    this.menuTreeList = res.data
                })
                // 获取已经拥有的权限
                this.getRoleMenus()
            },
            // 获取角色已经拥有的菜单
            getRoleMenus() {
                let params = {
                    uid: this.checkedRoleId
                }
                this.$api.selected(params).then(res => {
                    if (res.code === 0) {
                        res.data.forEach(item => {
                            this.hasGetList.push(item.projectId)
                        });
                        console.log(this.hasGetList)
                        this.$refs.tree.setCheckedKeys(this.hasGetList)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            // 获取选中的数据
            getThisTree(data, node) {
                this.selectedMenueIds = node.checkedKeys
            },
            // 确定授权
            submitMenu(val) {
               let nodes=this.$refs.tree.getCheckedNodes(true,false);
               if (nodes.length>0) {
                    for ( var i = 0; i < nodes.length; i++ ) {
                        this.selectData.push(nodes[i].code)
                    }
                let eids=this.selectData.join(',')
                let uid=this.checkedRoleId
                let params = {
                    eids: eids,
                    uid: uid
                }
                 this.$api.addEmpUser(params).then(res => {
                    if (res.code === 0) {
                        this.empowerMenueWin = false
                        this.hasGetList=[]
                        this.$message.success('分配成功')
                    } else {
                        this.$message.error('分配权限失败')
                    }
                })
                this.selectData=[]
                this.empowerMenueWin = false
               } else {
                    this.$message.error('请至少选择一个园区!')
               }
            },
            search() {
                this.pageInfo.currentPage = 1
                this.getLdUserList()
            },
            reset() {
                this.formSearch.userName = ''
                this.formSearch.workCode = ''
                this.formSearch.acctName = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getLdUserList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getLdUserList()
            },
            handleSizeChange2(size) {
                this.pageInfo2.currentPage = 1
                this.pageInfo2.pageSize = size
                this.getLoginRoleList()
            },
            handleCurrentChange2(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getLoginRoleList()
            },

            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.uid)
                });
                console.log(this.selectListId)
            },
            change(status) {
                let params = {
                    uids: this.selectListId.join(','),
                    status: 'A'
                }
                if (status == 'D') {
                    params.status = 'D'
                }
                this.$api.modifyUserStatus(params).then(res => {
                    if (res.code === 0) {
                        this.getLdUserList()
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

    .container {
        .btn-size {
            padding: 4px 5px;
        }

        .el-button + .el-button {
            margin-left: 5px;
        }
    }
</style>
