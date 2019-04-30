<template>
    <div class="menu-manage">
        <div class="left-tree">
            <el-tree
                    class="org-tree"
                    :data="groupTreeList"
                    @node-click='getThisTree'
                    :expand-on-click-node="false">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ data.name }}</span>
                    <span>
                    <el-button
                            type="primary"
                            size="mini"
                            class="menu-btn"
                            v-if="showBtn('新增')"
                            @click.stop="() => append(data)">
                    新增子组织
                    </el-button>
                </span>
                </div>
            </el-tree>
        </div>
        <div class="tree-detail" v-if="groupDetail.groupParentId">
            <el-form label-position="right" label-width="80px" :model="groupDetail" class="tree-form" :rules="rules"
                     ref="ruleForm">
                <el-form-item label="组织名称" prop="label">
                    <el-input v-model="groupDetail.label"></el-input>
                </el-form-item>
                <el-form-item label="组织编号" prop="groupCode">
                    <el-input v-model="groupDetail.groupCode"></el-input>
                </el-form-item>
                <el-form-item label="租户编码" prop="tenementCode">
                    <el-input v-model="groupDetail.tenementCode"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="groupDetail.remark"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="groupType">
                    <el-radio-group v-model="groupDetail.groupType">
                        <el-radio label="zy">自营</el-radio>
                        <el-radio label="jfx">经分销</el-radio>
                        <el-radio label="sys">基础节点</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-radio-group v-model="groupDetail.status">
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
        name: 'orgGroupManage',
        data() {
            return {
                pageBtns: [],
                groupTreeList: [],
                groupDetail: {},
                rules: {
                    label: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'}
                    ],
                    groupCode: [
                        {required: true, message: '请输入组织编号', trigger: 'blur'}
                    ],
                    status: [
                        {required: true, message: '请选择组织状态', trigger: 'blur'}
                    ],
                    groupType: [
                        {required: true, message: '请选择组织类型', trigger: 'blur'}
                    ]
                },
                type: 0 //0修改 1新增
            }
        },
        created() {
            this.getTreeList()
        },
        mounted() {
            console.log(this.$common.getSessionStorage('buttons'))
            this.pageBtns = JSON.parse(this.$common.getSessionStorage('buttons'))
        },
        methods: {
            showBtn(name) {
                this.pageBtns.forEach(item => {
                    // console.log(item.title)
                    if (item.title.indexOf(name) > -1) {
                        return true
                    } else {
                        return false
                    }
                })
            },
            append(data) {
                this.groupDetail = {
                    groupCode: '',
                    groupParentId: data.id,
                    groupType: 'zy',
                    label: '',
                    remark: '',
                    status: 'A',
                    tenementCode: ''
                }
                this.type = 1
                console.log(this.groupDetail)
            },
            submit() {
                if (this.type == 0) {
                    // 修改
                    this.modifyTreeList()
                } else {
                    // 新增
                    this.addNemGroup()
                }
            },
            addNemGroup() {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            id: this.groupDetail.id,
                            groupCode: this.groupDetail.groupCode,
                            groupName: this.groupDetail.label,
                            groupParentId: this.groupDetail.groupParentId,
                            status: this.groupDetail.status,
                            groupType: this.groupDetail.groupType,
                            tenementCode: this.groupDetail.tenementCode,
                            remark: this.groupDetail.remark,
                            managerName: this.groupDetail.managerName,
                            managerNo: this.groupDetail.managerNo
                        }
                        this.$api.addGroupTrees(params).then(res => {
                            if (res.code === 0) {
                                this.getTreeList()
                                this.$message.success('新增组织成功')
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
                    ids: data.id
                }
                this.$api.deleteTreeList(params).then(res => {
                    if (res.code === 0) {
                        this.getTreeList()
                        this.$message.success('删除成功')
                    } else {
                        // 失败提示
                        this.$message.error(res.msg)
                    }
                })
            },
            getThisTree(data, node, item) {
                this.groupDetail = data
                this.type = 0
                console.log(data)
            },
            getTreeList() {
                this.$api.getEnterpriseTrees().then(res => {
                    this.groupTreeList = res.data
                    //   this.groupDetail = {}
                })
            },
            deleteTreeList() {
                this.$confirm('确定要删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        ids: this.groupDetail.id
                    }
                    this.$api.deleteGroupTrees(params).then(res => {
                        if (res.code === 0) {
                            this.getTreeList()
                            this.$message.success('删除成功')
                            this.groupDetail = {}
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
                            id: this.groupDetail.id,
                            groupCode: this.groupDetail.groupCode,
                            groupName: this.groupDetail.label,
                            groupParentId: this.groupDetail.groupParentId,
                            status: this.groupDetail.status,
                            groupType: this.groupDetail.groupType,
                            tenementCode: this.groupDetail.tenementCode,
                            remark: this.groupDetail.remark,
                            managerName: this.groupDetail.managerName,
                            managerNo: this.groupDetail.managerNo
                        }
                        this.$api.updateGroupTrees(params).then(res => {
                            if (res.code === 0) {
                                this.getTreeList()
                                this.groupDetail = {}
                                this.$message.success('修改成功')
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
                margin: 5px 10px;
                padding: 3px 4px;
            }
        }

        .tree-detail {
            flex: 1;

            .tree-form {
                width: 400px;
                margin: 20px auto 0;
            }
        }
    }
</style>


