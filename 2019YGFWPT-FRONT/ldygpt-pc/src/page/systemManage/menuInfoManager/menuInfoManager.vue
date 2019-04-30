<template>
    <div class="menu-manage">
        <div class="left-tree">
            <el-tree
                    class="org-tree"
                    :data="menuTreeList"
                    @node-click='getThisTree'
                    :expand-on-click-node="false">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.pname }}</span>
                    <span>
                    <el-button
                            type="primary"
                            size="mini"
                            class="menu-btn"
                            @click.stop="() => append(data)">
                    新增子菜单
                    </el-button>
                </span>
                </div>
            </el-tree>
        </div>
        <div class="tree-detail" v-if="menuDetail.parentId">
            <el-form label-position="right" label-width="80px" :model="menuDetail" class="tree-form" :rules="rules"
                     ref="ruleForm">
                <el-form-item label="菜单名称" prop="pname">
                    <el-input v-model="menuDetail.pname"></el-input>
                </el-form-item>
                <el-form-item label="路由路径" prop="permission">
                    <el-input v-model="menuDetail.permission"></el-input>
                </el-form-item>
                <el-form-item label="接口路径">
                    <el-input v-model="menuDetail.authUrl"></el-input>
                </el-form-item>
                 <el-form-item label="排序">
                <el-input v-model="menuDetail.sort"></el-input>
                </el-form-item>
                <el-form-item label="按钮类型">
                    <el-radio-group v-model="menuDetail.resourceType">
                        <el-radio label="model">菜单组</el-radio>
                        <el-radio label="menu">菜单</el-radio>
                        <el-radio label="button">按钮</el-radio>
                        <el-radio label="redirect">按钮跳转</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="menuDetail.status">
                        <el-radio label="A">生效</el-radio>
                        <el-radio label="D">失效</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">提交</el-button>
                    <el-button type="primary" @click="deleteTreeList">删除</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'menuInfoManager',
        data() {
            return {
                menuTreeList: [],
                menuDetail: {},
                rules: {
                    pname: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    permission: [
                        {required: true, message: '请输入路由路径', trigger: 'blur'}
                    ]
                },
                type: 0 //0修改 1新增
            }
        },
        created() {
            this.getTreeList()
        },
        methods: {
            append(data) {
                this.menuDetail = {
                    status: 'A',
                    pname: '新增菜单',
                    permission: '',
                    authUrl: '',
                    resourceType: 'menu',
                    ico: '',
                    parentId: data.pid,
                    level: '',
                    sort : ''
                }
                this.type = 1
                console.log(this.menuDetail)
            },
            submit() {
                if (this.type == 0) {
                    this.modifyTreeList()
                } else {
                    this.addNemMenu()
                }
            },
            addNemMenu() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            status: this.menuDetail.status,
                            pname: this.menuDetail.pname,
                            permission: this.menuDetail.permission,
                            authUrl: this.menuDetail.authUrl,
                            resourceType: this.menuDetail.resourceType,
                            ico: '',
                            pid: this.menuDetail.pid,
                            parentId: this.menuDetail.parentId,
                            sort: this.menuDetail.sort,
                        }
                        this.$api.addTreeMenus(params).then(res => {
                            if (res.code === 0) {
                                this.getTreeList()
                                this.$message.success('新增菜单成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                });
            },
            remove(node, data) {
                let params = {
                    menuId: data.id
                }
                this.$api.deleteTreeList(params).then(res => {
                    if (res.code === 0) {
                        this.getTreeList()
                        this.$message.success('删除菜单成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            getThisTree(data, node, item) {
                this.menuDetail = data
                this.type = 0
                console.log(data)
            },
            getTreeList() {
                this.$api.getTreeMenus().then(res => {
                    this.menuTreeList = JSON.parse(res.data)
                    //   this.menuDetail = {}
                })
            },
            deleteTreeList() {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        permissionPids: this.menuDetail.pid
                    }
                    this.$api.deleteTreeMenus(params).then(res => {
                        if (res.code === 0) {
                            this.getTreeList()
                            this.$message.success('删除菜单成功')
                            this.menuDetail = {}
                        } else {
                            // 失败提示
                            this.$message.error(res.msg)
                        }
                    })
                })
            },
            modifyTreeList() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            status: this.menuDetail.status,
                            pname: this.menuDetail.pname,
                            permission: this.menuDetail.permission,
                            authUrl: this.menuDetail.authUrl,
                            resourceType: this.menuDetail.resourceType,
                            ico: '',
                            pid: this.menuDetail.pid,
                            sort: this.menuDetail.sort
                        }
                        this.$api.modifyTreeMenus(params).then(res => {
                            if (res.code === 0) {
                                this.getTreeList()
                                this.menuDetail = {}
                                this.$message.success('修改菜单成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                });

            }
        }
    }
</script>
<style lang="scss" scoped>
    .menu-manage {
        display: flex;

        .left-tree {
            width: 500px;
            // border: 1px solid #E0E0E0;
            border-bottom: none;
            margin-right: 10px;

            .org-tree {
                background: #f0f0f0;
            }

            .custom-tree-node {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }

            .menu-btn {
                margin: 5px 0;
            }
        }

        .tree-detail {
            flex: 1;

            .tree-form {
                width: 460px;
                margin: 20px auto 0;
            }
        }
    }
</style>


