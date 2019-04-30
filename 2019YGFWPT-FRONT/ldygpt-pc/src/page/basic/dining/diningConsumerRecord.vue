<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">

            <el-form-item label="交易类型" prop="recType">
              <el-select v-model="formSearch.recType" placeholder="交易类型">
                <el-option label="充值" value="0"></el-option>
                <el-option label="消费" value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号" prop="userTel">
                <el-input v-model="formSearch.userTel" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="消费时间">
              <el-date-picker
                v-model="formSearch.consuleTimeStartVo"
                type="datetime"
                placeholder="选择消费开始时间"
                style="width:196px;">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="消费时间">
              <el-date-picker
                v-model="formSearch.consuleTimeEndVo"
                type="datetime"
                placeholder="选择消费结束时间"
                style="width:196px;">
              </el-date-picker>
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
            <el-table-column prop="userTel" label="手机号" align="center"></el-table-column>
            <el-table-column prop="consuleTime" label="消费时间" align="center" :formatter="this.$common.timestampToTime"></el-table-column>
            <el-table-column prop="amount" label="消费金额" align="center">
              <template slot-scope="scope">{{scope.row.amount}}元</template>
            </el-table-column>
            <el-table-column prop="recType" label="交易类型" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.recType=='0'">充值</span>
                <span v-if="scope.row.recType=='1'">消费</span>
              </template>
            </el-table-column>
            <el-table-column prop="projectName" label="所属园区" align="center"></el-table-column>
            <el-table-column prop="enterName" label="所属企业" align="center"></el-table-column>
            <el-table-column prop="diningRoomName" label="餐厅" align="center"></el-table-column>
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
        name: 'cardOrder',
        data() {
            return {
                formSearch: { //表单查询
                  userTel: '',
                  recType: '',
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
            this.findDiningConsumerRecordPage()
        },
        methods: {
            findDiningConsumerRecordPage() {
                let params = {
                  page: this.pageInfo.currentPage,
                  limit: this.pageInfo.pageSize,
                  userTel : this.formSearch.userTel,
                  recType : this.formSearch.recType,
                  consuleTimeStartVo : this.formSearch.consuleTimeStartVo,
                  consuleTimeEndVo : this.formSearch.consuleTimeEndVo,
                }
                this.$api.findDiningConsumerRecordPage(params).then(res => {
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
                this.findDiningConsumerRecordPage()
            },
            reset(formName) {
              this.formSearch.consuleTimeStartVo = ''
              this.formSearch.consuleTimeEndVo = ''
              this.$refs[formName].resetFields();
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.findDiningConsumerRecordPage()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.findDiningConsumerRecordPage()
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
