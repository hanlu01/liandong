<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="用户昵称" prop="nickName">
                <el-input v-model="formSearch.nickName" placeholder="用户昵称"></el-input>
            </el-form-item>
          <el-form-item label="是否绑定企业" prop="isEmployee">
            <el-select v-model="formSearch.isEmployee" placeholder="是否绑定企业">
              <el-option label="已绑定" value="1"></el-option>
              <el-option label="未绑定" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否绑定餐卡" prop="haveMealCar">
            <el-select v-model="formSearch.haveMealCar" placeholder="是否绑定餐卡">
              <el-option label="已绑定" value="1"></el-option>
              <el-option label="未绑定" value="0"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item label=" " style="margin-left:50px;">
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset('formSearch')">重置</el-button>
            </el-form-item>
        </el-form>

        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60"></el-table-column>
            <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
            <el-table-column prop="nickName" label="用户昵称" align="center"></el-table-column>
            <el-table-column prop="userTel" label="手机号" align="center"></el-table-column>
            <el-table-column prop="country" label="国家" align="center"></el-table-column>
            <el-table-column prop="province" label="省" align="center"></el-table-column>
            <el-table-column prop="city" label="市" align="center"></el-table-column>
            <el-table-column prop="isEmployee" label="是否绑定企业" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.isEmployee=='1'?'已绑定':'未绑定' }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="haveMealCar" label="是否绑定餐卡" align="center">
              <template slot-scope="scope">
                <span>{{ scope.row.haveMealCar=='1'?'已绑定':'未绑定' }}</span>
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

    </div>
</template>

<script>
    export default {
        name: 'wxAccount',
        data() {
            return {
                formSearch: { //表单查询
                  nickName: '',
                  isEmployee: '',
                  haveMealCar: '',
                },
                selectListId: [],
                openType: 'mof', //add新增 mof修改
                listLoading: false,
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                formLabelWidth: '120px',
            };
        },
        computed: {},
        created() {
        },
        mounted() {
            this.findWxAccountPage()
        },
        methods: {
            findWxAccountPage() {
                let params = {
                  page: this.pageInfo.currentPage,
                  limit: this.pageInfo.pageSize,
                  nickName: this.formSearch.nickName,
                  isEmployee: this.formSearch.isEmployee,
                  haveMealCar : this.formSearch.haveMealCar,
                }
                this.$api.findWxAccountPage(params).then(res => {
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
                this.findWxAccountPage()
            },
            reset(formName) {
              this.$refs[formName].resetFields();
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.findWxAccountPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.findWxAccountPage()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
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
