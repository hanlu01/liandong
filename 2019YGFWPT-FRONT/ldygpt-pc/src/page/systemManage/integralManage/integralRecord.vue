<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
            <el-form-item label="创建时间" prop="timeInterval">
                <el-date-picker
                        v-model="formSearch.selectTime"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy年MM月dd日" value-format="yyyy-MM-dd"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">

            <el-table-column prop="userName" label="员工姓名" align="center">
            </el-table-column>
            <el-table-column prop="userNo" label="员工工号" align="center">
            </el-table-column>
            <el-table-column prop="integralValue" label="积分值" align="center">
            </el-table-column>
            <el-table-column prop="integralExplain" label="积分说明" align="center">
            </el-table-column>
            <el-table-column prop="wayType" label="积分来源" align="center">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center" :formatter="this.$common.timestampToDate">
            </el-table-column>
            <el-table-column prop="integralInvalidTime" label="失效时间" align="center"
                             :formatter="this.$common.timestampToDate">
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
        name: 'integralRecord',
        data() {
            return {
                formSearch: { //表单查询
                    selectTime: ''
                },
                selectListId: [],
                openType: 'add', //add新增 mof修改
                listLoading: false,//
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },

                tableData: [],
                dialogAddVisible: false,    //添加弹框显示
                labelPosition: 'right', //lable对齐方式
                labelWidth: '80px', //lable宽度
                formLabelWidth: '120px',
                userNo: '',
                tenementCode: ''
            };
        },
        activated: function () {
            this.userNo = this.$route.params.userNo;
            this.tenementCode = this.$route.params.tenementCode;
            this.getIntegerRecord()
        },
        methods: {
            getIntegerRecord() {
                let params = {
                    pageNo: this.pageInfo.currentPage,
                    pageSize: this.pageInfo.pageSize,
                    startTime: this.formSearch.selectTime[0],
                    endTime: this.formSearch.selectTime[1],
                    userNo: this.userNo,
                    tenementCode: this.tenementCode
                }
                this.$api.getIntegerRecord(params).then(res => {
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
                this.getIntegerRecord()
            },
            reset() {
                this.formSearch.selectTime = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getIntegerRecord()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getIntegerRecord()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
                console.log(this.selectListId)
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
