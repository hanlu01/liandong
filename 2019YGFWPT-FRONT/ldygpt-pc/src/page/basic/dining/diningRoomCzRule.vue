<template>
  <div class="container">
    <el-form :label-position="labelPosition" :label-width="labelWidth" :inline="true" ref="formSearch"
             :model="formSearch" class="demo-form-inline">
      <el-form-item label="所属园区" prop="projectId" >
        <el-select v-model="formSearch.projectId" filterable class="el-select" @change="findDiningRoomInfoList" >
          <el-option
            v-for="item in projectInfoList"
            :key="item.projectId"
            :label="item.projectName"
            :value="item.projectId">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属餐厅" prop="diningRoomId" >
        <el-select v-model="formSearch.diningRoomId" filterable class="el-select">
          <el-option
            v-for="item in diningRoomInfoList"
            :key="item.id"
            :label="item.diningRoomName"
            :value="item.id">
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
        <el-button size="small" round type="danger" @click="deleteByDiningRoomId()">批量删除</el-button>
      </el-row>
    </el-row>
    <!-- 操作区----end -->
    <!-- 表格---start -->
    <el-table :data="tableData" v-loading="listLoading" border stripe style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="60">
      </el-table-column>
      <el-table-column prop="diningRoomName" label="所属餐厅" align="center">
      </el-table-column>
      <el-table-column prop="ruleName" label="规则名称" align="center">
      </el-table-column>
      <el-table-column prop="creator" label="创建人" align="center">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" :formatter="dateFormat"  align="center">
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center">
        <template slot-scope="scope">
          <el-button class="btn-size" size="mini" @click="getDetail(scope.$index)">配置充值规则</el-button>
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
        <el-form-item label="所属园区" prop="projectId" >
          <el-select v-model="formAdd.projectId" filterable class="el-select" :disabled="openType =='add'?false:true" @change="findDiningRoomInfoList">
            <el-option
              v-for="item in projectInfoList"
              :key="item.projectId"
              :label="item.projectName"
              :value="item.projectId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属餐厅" prop="diningRoomId" >
          <el-select v-model="formAdd.diningRoomId" filterable class="el-select" :disabled="openType =='add'?false:true">
            <el-option
              v-for="item in diningRoomInfoList"
              :key="item.id"
              :label="item.diningRoomName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值规则名称" prop="ruleName">
          <el-input v-model="formAdd.ruleName"  placeholder="充值规则名称" maxlength="20" ></el-input>
        </el-form-item>
        <div>
          <div class="diningInput" v-for="(item,index) in diningDataArr" :key="index">
            <el-form-item label="积分区间">
              <el-input  disabled v-model="item.startNum"></el-input>
            </el-form-item>
            <el-form-item label="-" class="interval">
              <el-input  v-model="item.endNum" v-if="index === diningDataArr.length-1"></el-input>
              <el-input  v-model="item.endNum" v-else disabled></el-input>
            </el-form-item>
            <el-form-item label="对应折扣" class="discountInput">
              <el-input  v-model="item.discount" v-if="index === diningDataArr.length-1"></el-input>
              <el-input  v-model="item.discount" v-else disabled></el-input>
            </el-form-item>
            <p v-if="index === diningDataArr.length-1">
              <img class="img1" src="../../../../static/img/add.png" alt="" @click="addData()" v-if="endState">
              <img class="img2" src="../../../../static/img/del.png" alt="" @click="cancleData(index)" v-if="index>0">
            </p>
          </div>
        </div>
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
    name: "diningRoomCzRule",
    data() {
      return {
        selectValue: [],
        formSearch: { //表单查询
        },
        endState:true,
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
          ruleName:''
        },
        diNingRoom_id:'',
        diningDataArr: [{
          startNum:'0',
          endNum:'',
          discount:''
        }],
        projectInfoList:[],
        diningRoomInfoList:[],
        tableData: [],
        labelPosition: 'right', //lable对齐方式
        labelWidth: '120px', //lable宽度
        rulesAdd: {
          /*diningRoomId: [{required: true, message: "请选择所属餐厅", trigger: "blur"}],
          startNum: [{required: true, message: "积分区间start不能为空", trigger: "blur"}],
          endNum: [{required: true, message: "请输入积分区间end数值，最大积分为100", trigger: "blur"}],
          discount: [{required: true, message: "请输入积分区间对应折扣，值为0-100", trigger: "blur"}]*/

        },
        arg1:'',
        arg2:''
      };
    },
    mounted() {
      this.findPage()
      //this.getDiningRoomList()
      this.findProjectInfoList()
      this.accAdd(this.arg1, this.arg2)
    },
    methods: {
      //分页查询
      findPage() {
        let params = {
          page: this.pageInfo.currentPage,
          limit: this.pageInfo.pageSize,
          diningRoomId: this.formSearch.diningRoomId,
          projectId:this.formSearch.projectId
        }
        this.$api.getDiningRoomCzRuleList(params).then(res => {
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
        this.findPage()
      },
      reset() {
        this.formSearch.projectId = ''
        this.formSearch.diningRoomId = ''
      },
      handleSizeChange(size) {
        this.pageInfo.currentPage = 1
        this.pageInfo.pageSize = size
        this.findPage()
      },
      handleCurrentChange(currentPage) {
        this.pageInfo.currentPage = currentPage
        this.findPage()
      },
      handleSelectionChange(val) {
        this.selectListId = []
        val.forEach(item => {
          this.selectListId.push(item.diningRoomId)
        });
      },

      dateFormat(row, column, cellValue, index){
        var t=new Date(row.updateTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds();

      },
      //获取园区列表
      findProjectInfoList(){
        this.$api.findProjectInfoList().then(res=>{
          if (res.code === 0){
            this.projectInfoList = res.data
          }
        })
      },

      //通过项目id获取餐厅列表
      findDiningRoomInfoList(val){
        let params = {
          projectId: val
        }
        this.formAdd.diningRoomId = ''
        this.formSearch.diningRoomId = ''

        this.$api.getDiningRoomListByProjectId(params).then(res=>{
          if (res.code === 0) {
            this.formAdd = {
              diningRoomId:'',
              projectId :this.formAdd.projectId,
              ruleName:this.formAdd.ruleName
            }
            this.formSearch = {
              diningRoomId:'',
              projectId :this.formSearch.projectId
            }

            this.diningRoomInfoList = res.data
          } else {
            this.$message.error(res.msg)
          }
        })
      },
      //添加积分区间及对应的折扣项
      addData(){
        let r = /^\+?[1-9][0-9]*$/;
        let d = /^(\d|[1-9]\d|100)(\.\d{1})?$/;
        if (!this.diningDataArr[this.diningDataArr.length-1].endNum) {
          this.$alert('请输入积分区间')
        } else if (!this.diningDataArr[this.diningDataArr.length-1].discount){
          this.$alert("请输入折扣值")
        } else if (!r.test(this.diningDataArr[this.diningDataArr.length-1].discount)) {
          this.$alert("请输入大于1,小于或等于100的整数折扣值")
        }else if (Number(this.diningDataArr[this.diningDataArr.length-1].discount)>100) {
          this.$alert("请输入小于或者等于100的整数折扣值")
        /*} else if (!r.test(endNum)) {
          this.$alert("请输入大于1的整数数值区间")*/
        } else if (Number(this.diningDataArr[this.diningDataArr.length-1].endNum)<=this.diningDataArr[this.diningDataArr.length-1].startNum) {
          this.$alert("请输入大于"+this.diningDataArr[this.diningDataArr.length-1].startNum+"的积分区间")
        }else if(Number(this.diningDataArr[this.diningDataArr.length-1].endNum)>100){
          this.$alert('请输入小于或者等于100的积分区间')
        } else if (!d.test(this.diningDataArr[this.diningDataArr.length-1].endNum)) {
          this.$alert("积分区间只能保留一位小数，请重新输入")
        } else if (Number(this.diningDataArr[this.diningDataArr.length-1].endNum) === 100){
          this.endState = false
        } else {

          //给Number类型增加一个add方法，调用起来更加方便。
          let num = this.accAdd(this.diningDataArr[this.diningDataArr.length-1].endNum , 0.1)
          console.log("stats======"+num)
          this.diningDataArr.push({
            startNum:num,
            endNum:'',
            discount:''
          })
        }
      },
      accAdd(arg1, arg2) {
        var r1, r2, m, c;
        try {
          r1 = arg1.toString().split(".")[1].length;
        }
        catch (e) {
          r1 = 0;
        }
        try {
          r2 = arg2.toString().split(".")[1].length;
        }
        catch (e) {
          r2 = 0;
        }
        c = Math.abs(r1 - r2);
        m = Math.pow(10, Math.max(r1, r2));
        if (c > 0) {
          var cm = Math.pow(10, c);
          if (r1 > r2) {
            arg1 = Number(arg1.toString().replace(".", ""));
            arg2 = Number(arg2.toString().replace(".", "")) * cm;
          } else {
            arg1 = Number(arg1.toString().replace(".", "")) * cm;
            arg2 = Number(arg2.toString().replace(".", ""));
          }
        } else {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", ""));
        }
        return (arg1 + arg2) / m;
      },


      cancleData(index){
        this.diningDataArr.splice(index,1)
        this.endState = true
      },

      // 保存
      addSaveDiningRoomCzRule(params) {
            this.$api.addSaveDiningRoomCzRule(params).then(res => {
              if (res.code === 0) {
                this.cancel()
                this.findPage()
                this.$message.success('新增成功')
              } else {
                // 失败提示
                this.$message.error(res.msg)
              }
            })
      },
      // 修改
      editSaveDiningRoomCzRule(params) {
        this.$api.editSaveDiningRoomCzRule(params).then(res => {
          if (res.code === 0) {
            this.cancel()
            this.findPage()
            this.$message.success('修改成功')
          } else {
            // 失败提示
            this.$message.error(res.msg)
          }
        })
      },

      submit() {
        let d = /^(\d|[1-9]\d|100)(\.\d{1})?$/;
        let r = /^\+?[1-9][0-9]*$/;
        if (!this.formAdd.projectId){
          this.$alert('请选择园区')
        } else if (!this.formAdd.diningRoomId) {
          this.$alert('请选择餐厅')
        } else if (!this.formAdd.ruleName) {
          this.$alert('请输入规则名称')
        } else if (!this.diningDataArr[this.diningDataArr.length-1].endNum) {
          this.$alert('请输入积分区间')
        } else if (!this.diningDataArr[this.diningDataArr.length-1].discount){
          this.$alert("请输入折扣值，如：50%则输入50即可")
        } else if (!r.test(this.diningDataArr[this.diningDataArr.length-1].discount)) {
          this.$alert("请输入大于1,小于或等于100的整数折扣值")
        }else if (Number(this.diningDataArr[this.diningDataArr.length-1].discount)>100) {
          this.$alert("请输入小于或者等于100的整数折扣值")
          /*} else if (!r.test(this.diningDataArr[this.diningDataArr.length-1].endNum)) {
            this.$alert("请输入大于1的数值区间")*/
        } else if (Number(this.diningDataArr[this.diningDataArr.length-1].endNum)<=this.diningDataArr[this.diningDataArr.length-1].startNum) {
          this.$alert("请输入大于"+this.diningDataArr[this.diningDataArr.length-1].startNum+"的积分区间")
        }else if(Number(this.diningDataArr[this.diningDataArr.length-1].endNum)>100){
          this.$alert('请输入小于或者等于100的积分区间')
        } else if (!d.test(this.diningDataArr[this.diningDataArr.length-1].endNum)) {
          this.$alert("积分区间只能保留一位小数，请重新输入")
        }else{

          if (Number(this.diningDataArr[this.diningDataArr.length-1].endNum) === 100){
            this.endState = false
          }

          let diningDataArr1 = []
          let diningDataString = ''
          let diningDataString1 = ''
          this.diningDataArr.forEach((item,index)=>{
            diningDataString = `${item.startNum}-${item.endNum}-${item.discount}`
            diningDataArr1.push(diningDataString)
          })
          diningDataString1 = diningDataArr1.join()
          let integralDiscount1 = {
            projectId:this.formAdd.projectId,
            diningRoomId:this.formAdd.diningRoomId,
            ruleName:this.formAdd.ruleName,
            integralDiscount:diningDataString1
          }
          console.log(integralDiscount1);


          if (this.openType == 'add') {
            this.addSaveDiningRoomCzRule(integralDiscount1)
          } else {
            integralDiscount1.diningRoomId = this.diNingRoom_id
            this.editSaveDiningRoomCzRule(integralDiscount1)
          }
        }

      },
      openAdd() {
        this.endState = true
        this.formAdd = {
          ruleName :''
        }
        this.diningDataArr= [{
          startNum:'0',
          endNum:'',
          discount:''
        }],
        this.openType = 'add'
        this.dialogAddVisible = true
      },
      cancel() {
        this.dialogAddVisible = false
      },
      // 批量删除
      deleteByDiningRoomId() {

          let ids = this.selectListId.join(',')
          if(ids==null || ids==''){
            //alert("请先选择要操作的选项");
            this.$message.error("请先选择要操作的选项");
          }else{
            this.$confirm('确定要删除选中餐厅下所有充值积分规则吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let params = {
                diningRoomIds: this.selectListId.join(',')
              }
              this.$api.deleteByDiningRoomIds(params).then(res => {
                if (res.code === 0) {
                  this.findPage()
                  this.$message.success('删除成功')
                } else {
                  // 失败提示
                  this.$message.error(res.msg)
                }
              })
            })
          }

      },

      // 获取详情
      getDetail(index) {
        let params = {
          uid:this.tableData[index].diningRoomId
        }
        this.$api.getDiningRoomCzRuleInfo(params).then(res => {
          if (res.code === 0) {
            this.openType = 'mof'
            this.endState = true
            this.dialogAddVisible = true
            this.diningDataArr = res.data


            //this.findDiningRoomInfoList(res.data[0].projectId)
            //this.formAdd = res.data[0]
            this.diNingRoom_id = ''
            this.diNingRoom_id =res.data[0].diningRoomId
            this.formAdd.diningRoomId =res.data[0].diningRoomName
            this.formAdd.projectId =res.data[0].projectId
            this.formAdd.ruleName=res.data[0].ruleName

            console.log(res.data[0])
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

  .diningInput{
    display:flex;
    p{
      position: relative;
      .img1{
        width: 22px;
        position: absolute;
        right:-16px;
        bottom:29px
      }
      .img2{
        position: absolute;
        right:-44px;
        bottom:28px
      }
    }
  }
</style>
