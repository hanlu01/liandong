<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="用户名称" prop="username">
                <el-input v-model="formSearch.username" placeholder="用户名称"></el-input>
            </el-form-item>
            <el-form-item label="用户账号" prop="acctName">
                <el-input v-model="formSearch.acctName" placeholder="用户账号"></el-input>
            </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
         <el-row class="mgb15">
            <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
            <el-button size="small" round type="success" @click="change('A')">生效</el-button>
            <el-button size="small" round type="danger" @click="change('D')">失效</el-button>
            <el-button size="small" round type="warning" @click="resetPwd">重置密码</el-button>
            <!--<el-button size="small" round type="danger" @click="deleteUser('all')">批量删除</el-button>-->
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="username" label="用户姓名" align="center">
            </el-table-column>
            <el-table-column prop="acctName" label="用户账号" align="center">
            </el-table-column>
            <el-table-column prop="phoneNo" label="手机号" align="center">
            </el-table-column>
            <el-table-column prop="email" label="用户邮箱" align="center">
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.status=='A'?'生效':'失效' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="createDate" label="更新日期" align="center" :formatter="this.$common.timestampToTime">
            </el-table-column>
            <el-table-column label="操作" width="230" align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="getDetail(scope.row)">账号编辑</el-button>
                <!--<el-button size="mini" @click="changePwd(scope.row)">修改密码</el-button>-->
                <el-button size="mini" plain type="primary" @click="empowerMenue(scope.row)">选择餐厅</el-button>
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
        <el-dialog :title="openType == 'add'? '新增餐厅管理员': '修改餐厅管理员'" :visible.sync="dialogAddVisible" width="700px" :before-close="cancel">
            <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                <el-form-item label="用户帐号" prop="acctName">
                    <el-input v-model="formAdd.acctName" placeholder="用户帐号" :readonly="openType == 'add' ? false : true"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="username">
                    <el-input v-model="formAdd.username" placeholder="用户姓名"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phoneNo">
                    <el-input v-model="formAdd.phoneNo" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="formAdd.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="备注信息" prop="remark">
                    <el-input v-model="formAdd.remark" placeholder="备注信息" type="textarea"></el-input>
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



      <!-- 选择餐厅  start-->
      <el-dialog :visible.sync="relDialog" width="700px" title="选择餐厅" center :before-close="handleClose3"
                 class="import-dialog">
        <div class="menu-tree">
          <el-tree
            :data="diningTreeList"
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


      <el-dialog
        :visible.sync="showPwd"
        width="450px"
        title="修改密码"
        :modal='false'
        :before-close="cancelPwd"
        class="import-dialog"
        center>
        <el-form label-width="100px" :style="{'width': '300px', 'margin': '0px auto'}" :rules="modifyPsswordRule" :model="passwordForm" ref="passwordForm" size="mini">
          <el-form-item label="原密码" prop="password">
            <el-input name="a" type="text" v-model="passwordForm.password" auto-complete="new-password"  placeholder="请输入原密码"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input :type="type" v-model="passwordForm.newPassword" auto-complete="new-password" placeholder="请输入新密码" @focus="type='password'"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input :type="type" v-model="passwordForm.confirmPassword" auto-complete="new-password" placeholder="请输入确认密码" @focus="type='password'"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelPwd">取 消</el-button>
          <el-button type="primary" @click="doChangePwd('passwordForm')">确 定</el-button>
        </div>
      </el-dialog>


    </div>
</template>

<script>
    export default {
        name: 'userInfoManager',
        data() {
          var validatePass2 = (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.passwordForm.newPassword) {
              callback(new Error('两次输入密码不一致!'))
            } else {
              callback()
            }
          }
            return {
                formSearch: { //表单查询
                    username: '',
                    acctName: ''
                },
                passwordDialog: false,
                selectListId: [],
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                },
                rulesAdd: {
                    username: [
                        {required: true, message: "请输入用户名称", trigger: "blur"},
                        {max: 15, message: '最大长度 15 个字符', trigger: 'blur' }
                    ],
                    acctName:[ {required: true, message: "请输入用户账号", trigger: "blur"},
                      {max: 15, message: '最大长度 15 个字符', trigger: 'blur' }],
                    phoneNo: [
                      { required: true, message: '请输入手机号', trigger: 'blur' },
                      { pattern: /^1[3456789]\d{9}$/, message: '目前只支持中国大陆的手机号码', trigger: 'blur' }],
                    email: [{message: "请输入邮箱", trigger: "blur"},
                      { pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, message: '请输入正确邮箱格式' }],
                    status: [{required: true, message: "请选择状态", trigger: "blur"}],
                    remark: [{required: true, message: "请输入备注信息", trigger: "blur"},
                      {max: 100, message: '最大长度 100 个字符', trigger: 'blur' }
                    ]
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                // 角色列表数据
                roleTableData: [],
                // 已选中的角色ridList
                hasuserIds: [],
                hasuserIdsBack: [],
                // 当前选中的用户ID
                checkedUserId: '',
                // 当前用户已拥有的角色
                userHasRoleList: [],
                roleIndexArr: [],
                relDialog: false,
                // 组织数据
                diningTreeList: [],
                hasGetList: [],// 已获得的组织
                diningRoomIds:[],//一选择的餐厅id
                showPwd: false,
                uid:'',
                passwordForm: {
                  password: '',
                  newPassword: '',
                  confirmPassword: ''
                },
                type: 'text',
                modifyPsswordRule: {
                  password: [
                    { required: true, message: '请输入原密码', trigger: 'blur' },
                    { pattern: /^\d+$/, message: '用户只支持数字类型', trigger: 'blur' }
                  ],
                  newPassword: [
                    { required: true, message: '请输入新密码', trigger: 'blur' },
                    { pattern: /^\d+$/, message: '用户只支持数字类型', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
                  ],
                  confirmPassword: [
                    { required: true, message: '请输入确认密码', trigger: 'blur' },
                    { pattern: /^\d+$/, message: '用户只支持数字类型', trigger: 'blur' },
                    { validator: validatePass2, trigger: 'blur' }
                  ]
                },
            };
        },
        mounted() {
            this.findDiningUserPage()
        },
        methods: {
            handleChange(value) {
            },
          // 取消授权
          handleClose3() {
            this.relDialog = false
            this.hasGetList = []
          },
          // 打开分配权限窗口
          empowerMenue(val) {
            this.userId = val.uid
            this.relDialog = true
            this.getDiningTreeList()
          },
          // 获取菜单列表
          getDiningTreeList() {
            this.$api.getDiningTreeList().then(res => {
              this.diningTreeList = res.data
            })
            // 获取已关联的餐厅数据
            this.getUserRelDingRoom()
          },
          getUserRelDingRoom() {
            let params = {
              uid: this.userId
            }
            this.$api.getUserRelDingRoom(params).then(res => {
              if (res.code === 0) {
                res.data.forEach(item => {
                  this.hasGetList.push(item.diningRoomId)
                });
                this.$refs.tree.setCheckedKeys(this.hasGetList)
              } else {
                this.$message.error(res.msg)
              }
            })
          },
            // 获取选中的数据
            getThisTree(data, node) {
              console.log(node.checkedKeys)
            },
            // 确定授权
            submitMenu() {
              let nodes = this.$refs.tree.getCheckedNodes(true,false);
              if (nodes.length>0) {
                for ( var i = 0; i < nodes.length; i++ ) {
                  this.diningRoomIds.push(nodes[i].code)
                }
                let diningRoomIds =this.diningRoomIds.join(',')
                let uid = this.userId
                let params = {
                  diningRoomIds: diningRoomIds,
                  uid: uid
                }
                this.$api.updateUserDiningRoomRel(params).then(res => {
                  this.diningTreeList = res.data
                  this.$message.success('修改成功')
                })
                this.diningRoomIds=[]
                this.relDialog = false
              } else {
                this.$message.error('不能为空!')
              }
            },
            findDiningUserPage() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    username: this.formSearch.username,
                    acctName: this.formSearch.acctName,
                }
                this.$api.findDiningUserPage(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },
            changePwd(data){
              console.log("data==" + data)
              this.showPwd = true
              this.uid = data.uid
            },
            doChangePwd(){
              let params = {
                uid: this.uid,
                isUpdate : true,
                oldPwd: this.passwordForm.password,
                newPwd: this.passwordForm.newPassword,
              }
              this.$refs['passwordForm'].validate((valid) => {
                if (valid) {
                  this.$api.changeDiningUserPwd(params).then(res => {
                    if (res.code == 0) {
                      this.$message.success("修改成功")
                      this.cancelPwd()
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                }
              })
            },
            resetPwd(){
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                this.$confirm('确定要重置密码吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  let params = {
                    uid: this.selectListId.join(','),
                    isUpdate : false
                  }
                  this.$api.changeDiningUserPwd(params).then(res => {
                    if (res.code == 0) {
                      this.$message.success("修改成功")
                      this.cancelPwd()
                    } else {
                      this.$message.error(res.msg)
                    }
                  })
                })
              }
            },
            search() {
                this.pageInfo.currentPage = 1
                this.findDiningUserPage()
            },
            reset() {
                this.formSearch.username = ''
                this.formSearch.acctName = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.findDiningUserPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.findDiningUserPage()
            },
            addSaveUser() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addDiningUser(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.findDiningUserPage()
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
                    this.addSaveUser()
                } else {
                    this.editSaveUser()
                }
            },
            openAdd() {
                this.openType = 'add'
                this.dialogAddVisible = true
            },
            cancel() {
                this.findDiningUserPage()
                this.dialogAddVisible = false
                this.formAdd = {}
                if(this.openType === 'add'){
                  this.$refs['formAdd'].resetFields();//取消后清除input值
                }
            },
            cancelPwd() {
              this.$refs['passwordForm'].resetFields()
              this.showPwd = false
            },
            getDetail(data) {
                let params = {
                    uid: data.uid
                }
                this.$api.getUserDetails(params).then(res => {
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
            editSaveUser() {
                delete this.formAdd.createDate
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.editSaveUser(this.formAdd).then(res => {
                    if (res.code === 0) {
                      this.cancel()
                      this.findDiningUserPage()
                      this.$message.success('修改成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                }
              })
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.uid)
                });
            },
            change(status) {
                let params = {
                    uids: this.selectListId.join(','),
                    status: status
                }
              if(this.selectListId.length==0){
                this.$message.error("请至少选择一条数据")
              }else{
                this.$api.modifyUserStatus(params).then(res => {
                  if (res.code === 0) {
                    this.findDiningUserPage()
                    this.$message.success('修改成功')
                  } else {
                    // 失败提示
                    this.$message.error(res.msg)
                  }
                })
              }
            },
            deleteUser(type, id) {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        uids: ''
                    }
                    if (type == 'all') {
                        params.uids = this.selectListId.join(',')
                    } else {
                        params.uids = id
                    }
                    this.$api.deleteUser(params).then(res => {
                        if (res.code === 0) {
                            this.findDiningUserPage()
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

    .container {
        .btn-size {
            padding: 4px 5px;
        }

        .el-button + .el-button {
            margin-left: 5px;
        }
    }
</style>
