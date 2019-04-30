<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="角色名称" prop="roleName">
                <el-input v-model="formSearch.roleName" placeholder="角色名称"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="formSearch.status" placeholder="状态">
                    <el-option label="生效" value="A"></el-option>
                    <el-option label="失效" value="D"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
            <el-button size="small" round @click="change('A')">生效</el-button>
            <el-button size="small" round @click="change('D')">失效</el-button>
            <el-button size="small" round type="danger" @click="deleteRole('all')">批量删除</el-button>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" align="center">
            </el-table-column>
            <el-table-column label="角色状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="description" label="角色描述" align="center">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" @click="empowerMenue(scope.row)">菜单</el-button>
                    <el-button size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteRole('one', scope.row.rid)">删除</el-button>
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
        <el-dialog :title="openType == 'add'? '新增角色': '修改信息 '" :visible.sync="dialogAddVisible" width="700px"
                   :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="formAdd.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="description">
                    <el-input v-model="formAdd.description" placeholder="角色描述"></el-input>
                </el-form-item>
                <el-form-item label="类别" prop="status">
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

        <!-- 新增弹框-end -->
        <!-- 角色授权菜单弹窗  start-->
        <el-dialog :visible.sync="empowerMenueWin" width="700px" title="菜单管理" center :before-close="handleClose3"
                   class="import-dialog">
            <div class="menu-tree">
                <el-tree
                        :data="menuTreeList"
                        node-key="pid"
                        @check='getThisTree'
                        ref="tree"
                        show-checkbox
                        :check-strictly="true"
                        :expand-on-click-node="false"
                        :default-expanded-keys="hasGetMenuList">
                    <div class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ data.pname }}</span>
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
        name: 'roleInfoManager',
        data() {
            return {
                formSearch: { //表单查询
                    roleName: '',
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
                    roleName: '',
                    description: '',
                    status: ''
                },
                rulesAdd: {
                    roleName: [
                        {required: true, message: "请输入角色名称", trigger: "blur"}
                    ],
                    description: [{required: true, message: "请输入角色描述", trigger: "blur"}],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                empowerMenueWin: false,
                // 菜单数据
                menuTreeList: [],
                // 选中的菜单id
                selectedMenueIds: [],
                // 当前选中的角色ID
                checkedRoleId: '',
                // 已获得的菜单
                hasGetMenuList: []
            };
        },
        computed: {},
        mounted() {
            this.getRoleList()
        },
        methods: {
            getRoleList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    roleName: this.formSearch.roleName,
                    status: this.formSearch.status
                }
                this.$api.getRoleList(params).then(res => {
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
                this.getRoleList()
            },
            reset() {
                this.formSearch.roleName = ''
                this.formSearch.status = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getRoleList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getRoleList()
            },
            addRole() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addRole(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getRoleList()
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
                    this.addRole()
                } else {
                    this.modifyRole()
                }
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
                let params = {
                    rid: data.rid
                }
                this.$api.getRoleDetails(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formAdd = res.data
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            modifyRole() {
                delete this.formAdd.createDate
                this.$api.modifyRole(this.formAdd).then(res => {
                    if (res.code === 0) {
                        this.cancel()
                        this.getRoleList()
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
                    this.selectListId.push(item.rid)
                });
            },
            change(status) {
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                let params = {
                  rids: this.selectListId.join(','),
                  status: 'A'
                }
                if (status == 'D') {
                  params.status = 'D'
                }
                this.$api.modifyRoleStatus(params).then(res => {
                  if (res.code === 0) {
                    this.getRoleList()
                    this.$message.success('修改成功')
                  } else {
                    // 失败提示
                    this.$message.error(res.msg)
                  }
                })
              }
            },
            deleteRole(type, id) {
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                this.$confirm('确定要删除吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  let params = {
                    rids: ''
                  }
                  if (type == 'all') {
                    params.rids = this.selectListId.join(',')
                  } else {
                    params.rids = id
                  }
                  this.$api.deleteRole(params).then(res => {
                    if (res.code === 0) {
                      this.getRoleList()
                      this.$message.success('删除成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                })
              }
            },
            // 打开菜单窗口
            empowerMenue(val) {
                this.checkedRoleId = val.rid
                this.empowerMenueWin = true
                this.getTreeList()
            },
            // 确定授权
            submitMenu(val) {
                let params = {
                    pIds: '',
                    rid: ''
                }
                if (this.selectedMenueIds.length !== 0) {
                    // 菜单ids
                    params.pIds = this.selectedMenueIds.join(',')
                    // 角色id
                    params.rid = this.checkedRoleId
                } else {
                    this.$message.error('授权菜单不能为空!')
                }
                this.$api.updateRolePermission(params).then(res => {
                    if (res.code === 0) {
                        this.empowerMenueWin = false
                        this.hasGetMenuList = []
                        this.$message.success('授权成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })

            },
            // 取消授权
            handleClose3() {
                this.empowerMenueWin = false
                this.hasGetMenuList = []
            },
            // 获取菜单列表
            getTreeList() {
                this.$api.getTreeMenus().then(res => {
                    this.menuTreeList = JSON.parse(res.data)
                })
                // 获取已经拥有的权限
                this.getRoleMenus()
            },
            // 获取选中的数据
            getThisTree(data, node) {
                this.selectedMenueIds = node.checkedKeys
            },
            // 获取角色已经拥有的菜单
            getRoleMenus() {
                let params = {
                    rid: this.checkedRoleId
                }
                this.$api.getRoleHasMenus(params).then(res => {
                    if (res.code === 0) {
                        res.data.forEach(item => {
                            this.hasGetMenuList.push(item.permissionId)
                        });
                        this.selectedMenueIds = this.hasGetMenuList
                        this.$refs.tree.setCheckedKeys(this.hasGetMenuList)
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
