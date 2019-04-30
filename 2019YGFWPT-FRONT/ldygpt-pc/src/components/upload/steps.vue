<template>
  <div class="steps">
    <el-steps :active="active" finish-status="success" align-center>
      <el-step title="下载模板"></el-step>
      <el-step title="上传文件"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
    <div class="step-list">
      <div class="step-item filedown" v-show="active===1">
        <div class="down-block">
          <div class="item-bg">
            <a :href="tempUrl" :download="tempName"><img src="../../../static/img/icon-filedown.png" alt="" class="icon-filedown"></a>
          </div>
          <p>模版下载</p>
        </div>
      </div>
      <div class="step-item fileup" v-show="active===2">
        <el-upload
            class="upload-block"
            drag
            :limit="1"
            action="#"
            :on-progress="upProgress"
            :before-upload= "beforeAvatarUpload">
            <div v-show="!fileName">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                <p class="up-tips">点击或将文件拖拽到这里上传</p>
                <p>支持扩展名：<span class="red-text">.xls .xslx</span></p>
                </div>
            </div>
            <div v-show="fileName">
                <p class="up-tips" style="margin-top: 60px;">{{fileName}}</p>
            </div>
        </el-upload>
        <div class="progres-bar" v-show="progressBar">
            <el-progress :text-inside="true" :stroke-width="18" :percentage="percentage" status="success"></el-progress>
        </div>
      </div>
      <div class="step-item compass" v-show="active===3">
        <p v-html="result"></p>
      </div>
    </div>
    <div class="foot-tips">
      <div class="tips">
        <p v-show="active===1">若已有模板，可直接点击【下一步】，跳过此步骤</p>
        <p v-show="active===2">注意：只能上传一个文件</p>
      </div>
      <el-button @click="next" v-show="active==1">下一步</el-button>
      <el-button @click="submit" v-show="active==2">上传</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      file: '',
      fileName: ''
    }
  },
  props: ['uploadType', 'tempUrl', 'tempName', 'progressBar', 'percentage', 'result', 'active'],
  mounted () {
    this.initData()
  },
  methods: {
    next () {
        this.active++
    },
    submit () {
      if (this.file === '') {
        this.$message.error('请选择导入的文件')
      } else {
        // this.active++
        // this.getImportParameter()
        this.$emit('upLoad', this.file)
      }
    },
    upProgress () {
      // this.isprogress = true
    },
    back () {
      // this.$emit('refresh')
      this.active = 1
    },
    initData () {
      //this.active = 1
      //this.progressBar = false
    },
    // 验证上传文件
    beforeAvatarUpload (file) {
      let Xls = file.name.split('.');
      if(Xls[1] === 'xls'|| Xls[1] === 'xlsx'){
          this.fileName = file.name
          this.file = file
          return file
      }else {
      this.$message.error('上传文件只能是 xls/xlsx 格式!')
          return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.steps {
  margin-top: 30px;
  .foot-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 40px;
    padding: 0 20px;
    .tips {
      p {
        font-size: 14px;
      }
    }
  }
  .step-list {
    padding: 40px 140px;
    display: flex;
    align-items: center;
    .step-item {
      height: 100%;
      flex: 1;
      text-align: center;
      .icon-filedown {
        cursor: pointer;
        width: 60px;
      }
      .item-bg {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        a {
          width: 100px;
          height: 100px;
          background-image: linear-gradient(
            180deg,
            rgba(218, 234, 245, 0.8),
            rgba(183, 211, 232, 1)
          );
          border-radius: 4px;
          img {
            margin-top: 26px;
          }
        }
      }
      p {
        font-size: 14px;
        // color: $text-gray-color;
        text-align: center;
      }
      &.fileup {
        .icon-fileup {
          // @include icon(63px, 50px, 'static/img/icon-fileup.png');
        }
        .up-tips {
          // color: $text-main-color;
        }
        .red-text {
          // color: $main-color;
        }
      }
      &.filedown {
        display: flex;
        justify-content: center;
        align-items: center;
        .down-block {
          p {
            margin-top: 6px;
          }
        }
      }
      &.compass {
        .failure-view {
          .failure-tips {
            display: flex;
            justify-content: space-between;
            padding: 14px 20px;
            border: 1px solid #ffab00;
            border-radius: 4px;
            background-color: #fdf8f3;
            align-items: center;
            .left {
              position: relative;
              p {
                text-align: left;
                padding-left: 30px;
                &:nth-child(1) {
                  // font-size: $xs-size;
                  // color: $text-main-color;
                }
                .el-icon-warning {
                  font-size: 18px;
                  color: #ffab00;
                  position: absolute;
                  left: 0;
                  top: 5px;
                }
              }
            }
            .right {
              .view-btn {
                // background: $yello-color;
                // border-color: $yello-color;
                color: #fff;
                &:hover {
                  // background: lighten($yello-color, 6%);
                  // border-color: lighten($yello-color, 6%);
                }
              }
            }
          }
          .failure-comm {
            .top-tips {
              height: 30px;
              margin: 4px 0;
            }
          }
        }
        .success-view {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          .el-icon-success {
            font-size: 40px;
            // color: $main-color;
          }
          .text-tips {
            margin: 20px 0;
            // color: $text-main-color;
            // font-size: $md-size;
          }
          .btn-view {
            border-color: #6fadec;
            color: #fff;
            background-color: #6fadec;
            padding: 8px 18px;
            &:hover {
              border-color: lighten(#6fadec, 6%);
              background-color: lighten(#6fadec, 6%);
            }
          }
        }
      }
    }
  }
}
</style>
