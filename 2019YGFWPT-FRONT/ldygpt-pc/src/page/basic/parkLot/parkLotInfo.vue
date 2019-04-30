<template>
    <div class="container">
        <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
                 :model="formSearch" class="demo-form-inline">
              <el-form-item label="所属项目" prop="projectId" >
                  <el-select v-model="formSearch.projectId" filterable class="el-select">
                      <el-option
                      v-for="item in projectList"
                      :key="item.projectId"
                      :label="item.projectName"
                      :value="item.projectId">
                      </el-option>
                  </el-select>
              </el-form-item>
            <el-form-item label="停车场名称" prop="parkLotName">
                <el-input v-model="formSearch.parkLotName" placeholder="停车场名称"></el-input>
            </el-form-item>
            <el-form-item label="有无充电桩" prop="isChargingPile">
                  <el-select v-model="formSearch.isChargingPile" class="el-select">
                      <el-option
                      v-for="item in isChargingPileList"
                      :key="item.id"
                      :label="item.dname"
                      :value="item.dcode">
                      </el-option>
                  </el-select>
            </el-form-item>
            <el-form-item label="是否有地下车位" prop="isUnderSpace">
              <el-select v-model="formSearch.isUnderSpace" class="el-select">
                  <el-option
                  v-for="item in isUnderSpaceList"
                  :key="item.id"
                  :label="item.dname"
                  :value="item.dcode">
                  </el-option>
              </el-select>
            </el-form-item>
             <el-form-item label="是否对外开放" prop="isOpen">
                <el-select v-model="formSearch.isOpen" class="el-select">
                    <el-option
                    v-for="item in isOpenList"
                    :key="item.dcode"
                    :label="item.dname"
                    :value="item.dcode">
                    </el-option>
                </el-select>
              </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search">查询</el-button>
                <el-button type="warning" plain @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 操作区----start -->
        <el-row class="mgb15">
            <el-row class="mgb15">
                <el-button size="small" round type="primary" @click="openAdd">新增</el-button>
                <el-button size="small" round type="danger" @click="deleteParkLots('all')">批量删除</el-button>
            </el-row>
        </el-row>
        <!-- 操作区----end -->
        <!-- 表格---start -->
        <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="60">
            </el-table-column>
            <el-table-column prop="projectName" label="所属项目" align="center">
            </el-table-column>
            <el-table-column prop="parkLotName" label="停车场名称" align="center">
            </el-table-column>
            <el-table-column prop="parkLotAddress" label="停车场地址" align="center">
            </el-table-column>
            <el-table-column prop="parkLotNum" label="车位数量" align="center">
            </el-table-column>
            <el-table-column prop="isOpen" label="是否对外开放" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.isOpen==0 ?'是':'否' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isChargingPile" label="有无充电桩" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.isChargingPile==0 ?'有':'无' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="isUnderSpace" label="有无地下车位" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.isUnderSpace==0 ?'有':'无' }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="chinaPayKjCode" label="支付分账号" align="center">
            </el-table-column>
            <el-table-column label="操作" fixed="right" align="center">
                <template slot-scope="scope">
                    <el-button class="btn-size" size="mini" @click="getDetail(scope.row)">编辑</el-button>
                    <el-button size="mini" plain type="danger" @click="deleteParkLots('one', scope.row.id)">删除</el-button>
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
        <el-dialog :title="openType == 'add'? '新增': '修改 '" :visible.sync="dialogAddVisible" width="700px">
             <el-form :label-position="labelPosition" :label-width="labelWidth" :rules="rulesAdd" :model="formAdd"
                     ref='formAdd' class="add-dialog-form">
                 <el-form-item label="所属项目" prop="projectId" >
                     <el-select v-model="formAdd.projectId" filterable class="el-select">
                         <el-option
                         v-for="item in projectList"
                         :key="item.projectId"
                         :label="item.projectName"
                         :value="item.projectId">
                         </el-option>
                     </el-select>
                 </el-form-item>
                <el-form-item label="支付分账号" prop="chinaPayKjCode">
                    <el-input v-model="formAdd.chinaPayKjCode" placeholder="支付分账号" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="停车场名称" prop="parkLotName">
                    <el-input v-model="formAdd.parkLotName" placeholder="停车场名称" maxlength="20"></el-input>
                </el-form-item>
                <el-form-item label="停车场地址" prop="parkLotAddress">
                    <el-input v-model="formAdd.parkLotAddress" placeholder="停车场地址" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item label="车位数量" prop="parkLotNum">
                  <el-input-number v-model="formAdd.parkLotNum" :min="0" :max="1000000" :step="100" placeholder="车位数量"></el-input-number>
                </el-form-item>
                <el-form-item label="是否对外开放" prop="isOpen">
                    <el-select v-model="formAdd.isOpen" class="el-select">
                        <el-option
                        v-for="item in isOpenList"
                        :key="item.id"
                        :label="item.dname"
                        :value="item.dcode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有无充电桩" prop="isChargingPile">
                    <el-select v-model="formAdd.isChargingPile" class="el-select">
                        <el-option
                        v-for="item in isChargingPileList"
                        :key="item.id"
                        :label="item.dname"
                        :value="item.dcode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有无地下车位" prop="isUnderSpace">
                    <el-select v-model="formAdd.isUnderSpace" class="el-select">
                        <el-option
                        v-for="item in isUnderSpaceList"
                        :key="item.id"
                        :label="item.dname"
                        :value="item.dcode">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="停车场位置图片"　v-model="formAdd.addressPicUrl" prop="addressPicUrl">
                      <el-upload
                          class="avatar-uploader"
                          :action="$config().uploadUrl"
                          name="file"
                          :data="{
                            bid:uuid,
                            id:uid,
                            fileType:'picture'
                          }"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload">
                          <img v-if="imageUrl" :src="imageUrl" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                      </el-upload>
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
        name: "parkLotInfo",
        data() {
            return {
                selectValue: [],
                formSearch: { //表单查询
                    projectId:'',
                    parkLotName: '',
                    isChargingPile: '',
                    isUnderSpace: '',
                    isOpen: ''
                },
                dialogAddVisible: false,    //添加弹框显示
                selectListId: [],
                listLoading: false,//
                openType: 'add', //add新增 mof修改
                pageInfo: { //分页
                    currentPage: 1,
                    pageSize: 10,
                    pageTotal: 0
                },
                formAdd: { //表单添加
                                },
                uuid:'',
                uid:'',

                 imageUrl: '',
                 projectList:[],
                 isChargingPileList:[],
                 isUnderSpaceList:[],
                 isOpenList:[],
                tableData: [],
                labelPosition: 'right', //lable对齐方式
                labelWidth: '120px', //lable宽度
                rulesAdd: {
                    parkLotName: [
                        {required: true, message: "请输入停车场名称", trigger: "blur"}
                    ],
                    projectId: [{required: true, message: "请选择所属项目", trigger: "blur"}],
                    parkLotAddress: [{required: true, message: "请输入停车场地址", trigger: "blur"}],
                    chinaPayKjCode: [{required: true, message: "请输入支付分账号", trigger: "blur"}],
                    isOpen: [{required: true, message: "请选择是否对外开放", trigger: "blur"}],
                    isChargingPile: [{required: true, message: "请选择有无充电桩", trigger: "blur"}],
                    isUnderSpace: [{required: true, message: "请选择有无地下车位", trigger: "blur"}],
                    parkLotNum: [{required: true, message: "请输入车位数量", trigger: "blur"}]
                }

            };
        },
        mounted() {
            this.getParkLotInfoList()
            this.getProjectList ()
            this.getIsChargingPileList ()
            this.getIsUnderSpaceList ()
            this.getIsOpenList ()
        },
        methods: {

            handleAvatarSuccess(res, file) {
              this.imageUrl = URL.createObjectURL(file.raw);
              this.formAdd.addressPicUrl = res.data.filePath;
              this.uid = res.data.id;
              console.log(res.data);
            },
            beforeAvatarUpload(file) {
              const isJPG = file.type === 'image/jpeg';
              const isLt2M = file.size / 1024 / 1024 < 2;

              if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
              }
              if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
              }

              return isJPG && isLt2M;
            },

            getParkLotInfoList() {
                let params = {
                    page: this.pageInfo.currentPage,
                    limit: this.pageInfo.pageSize,
                    parkLotName: this.formSearch.parkLotName,
                    isChargingPile: this.formSearch.isChargingPile,
                    isUnderSpace: this.formSearch.isUnderSpace,
                    isOpen: this.formSearch.isOpen,
                    projectId: this.formSearch.projectId
                }
                this.$api.getParkLotInfoList(params).then(res => {
                    if (res.code == 0) {
                        this.pageInfo.pageTotal = res.count
                        this.tableData = res.data
                      console.log(res.data)
                    } else {
                        this.$message.error(res.msg)
                    }
                })
            },

            search() {
                this.pageInfo.currentPage = 1
                this.getParkLotInfoList()
            },
            reset() {
                this.formSearch.projectId = ''
                this.formSearch.parkLotName = ''
                this.formSearch.isChargingPile = ''
                this.formSearch.isUnderSpace = ''
                this.formSearch.isOpen = ''
            },
            handleSizeChange(size) {
                this.pageInfo.currentPage = 1
                this.pageInfo.pageSize = size
                this.getParkLotInfoList()
            },
            handleCurrentChange(currentPage) {
                this.pageInfo.currentPage = currentPage
                this.getParkLotInfoList()
            },
            handleSelectionChange(val) {
                this.selectListId = []
                val.forEach(item => {
                    this.selectListId.push(item.id)
                });
            },
            submit() {
                if (this.openType == 'add') {
                    this.addSaveLdParkLotInfo()
                } else {
                    this.editSaveLdParkLotInfo()
                }
            },
            addSaveLdParkLotInfo() {
                this.$refs['formAdd'].validate((valid) => {
                    if (valid) {
                        this.$api.addSaveLdParkLotInfo(this.formAdd).then(res => {
                            if (res.code === 0) {
                                this.cancel()
                                this.getParkLotInfoList()
                                this.$message.success('新增成功')
                            } else {
                                // 失败提示
                                this.$message.error(res.msg)
                            }
                        })
                    }
                })
            },
            editSaveLdParkLotInfo() {
              this.$refs['formAdd'].validate((valid) => {
                if (valid) {
                  this.$api.editSaveLdParkLotInfo(this.formAdd).then(res => {
                      if (res.code === 0) {
                          this.cancel()
                          this.getParkLotInfoList()
                          this.$message.success('修改成功')
                      } else {
                          // 失败提示
                          this.$message.error(res.msg)
                      }
                  })
                }
              })
            },
            openAdd() {
                this.formAdd = {}
                this.openType = 'add'
                this.imageUrl=''
                this.dialogAddVisible = true
            },
            cancel() {
                this.dialogAddVisible = false
            },
            getProjectList () {
                let params = {
                }
                this.$api.getProjectList(params).then(res => {
                   if (res.code === 0) {
                      console.log(res.data);
                      this.projectList = res.data
                  } else {
                      // 失败提示
                      this.$message.error(res.msg)
                  }
              })
            },
            getIsChargingPileList () {
                let params = {
                }
                this.$api.getIsChargingPileList(params).then(res => {
                   if (res.code === 0) {
                      console.log(res.data);
                      this.isChargingPileList = res.data
                  } else {
                      // 失败提示
                      this.$message.error(res.msg)
                  }
              })
            },
            getIsUnderSpaceList () {
                let params = {
                }
                this.$api.getIsUnderSpaceList(params).then(res => {
                   if (res.code === 0) {
                      console.log(res.data);
                      this.isUnderSpaceList = res.data
                  } else {
                      // 失败提示
                      this.$message.error(res.msg)
                  }
              })
            },
            getIsOpenList () {
                let params = {
                }
                this.$api.getIsOpenList(params).then(res => {
                   if (res.code === 0) {
                      console.log(res.data);
                      this.isOpenList = res.data
                  } else {
                      // 失败提示
                      this.$message.error(res.msg)
                  }
              })
            },
            deleteParkLots(type, id) {
              let params = {
                ids: ''
              }
              if (type == 'all') {
                params.ids = this.selectListId.join(',')
              } else {
                params.ids = id
              }
              if(params.ids==null || params.ids==''){
                this.$message.error("请先选择要操作的选项")
              }else{
                this.$confirm('确定要删除吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$api.deleteParkLots(params).then(res => {
                    if (res.code === 0) {
                      this.getParkLotInfoList()
                      this.$message.success('删除成功')
                    } else {
                      // 失败提示
                      this.$message.error(res.msg)
                    }
                  })
                })
              }
            },

            getDetail(data) {
                let params = {
                    id: data.id
                }
                this.$api.getParkLotDetails(params).then(res => {
                    if (res.code === 0) {
                        this.openType = 'mof'
                        this.dialogAddVisible = true
                        this.formAdd = res.data
                        this.formAdd.isOpen = res.data.isOpen+''
                        this.formAdd.isChargingPile = res.data.isChargingPile+''
                        this.formAdd.isUnderSpace = res.data.isUnderSpace+''
                        this.uuid = res.data.id
                        this.imageUrl = res.data.addressPicUrl
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

        .sys-transfer {
            width: 500px;
            margin: 0 auto;
        }


    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width:100%;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 100%;
        height: 100%;
        display: block;
      }

    .el-select {
        display: inline-block;
        position: relative;
        width: 100%;
    }
</style>
