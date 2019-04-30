<template>
  <div id="edit">
          <el-upload
              class="avatar-uploader"
              :action="$config().uploadUrl"
              :show-file-list="false"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :before-upload="beforeUpload" v-show="false">
      </el-upload>
      <!--富文本编辑器组件-->
      <el-row v-loading="uillUpdateImg">
      <quill-editor
              v-if="status"
              disabled
              v-model="content"
              ref="myQuillEditor"
              :options="editorOption"
              @change="onChange($event)"
      >
      </quill-editor>
      <quill-editor
              v-else
              v-model="content"
              ref="myQuillEditor"
              :options="editorOption"
              @change="onChange($event)"
      >
      </quill-editor>
       <!-- @ready="onEditorReady($event)" -->
      </el-row>
  </div>
</template>
<script>
/* eslint-disable*/
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
var image = Quill.import('formats/image')
class Myimage extends image {
  static create(value) {
    let node = super.create(value)
    node.setAttribute('width', '100%')
    return node
  }
}
Quill.register(Myimage)
// 工具栏配置
const toolbarOptions = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote", "code-block"],
  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: "ordered" }, { list: "bullet" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["link", "image"]
];
export default {
  components: { quillEditor },
  props: ["oldcontent","status"],
  data() {
    return {
      content: "",
      uillUpdateImg: false,
      editorOption: {
        placeholder: "",
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector(".avatar-uploader input").click();
                } else {
                  this.quill.format("image", false);
                }
              }
            }
          }
        }
      }
    };
  },
  methods: {
    onChange() {
      this.$emit("newCont", this.content);
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 5MB!');
        return false
      }
      // 显示loading动画
      this.quillUpdateImg = true;
    },
    uploadSuccess(res, file) {
      // res为图片服务器返回的数据
      // 获取富文本组件实例
      let quill = this.$refs.myQuillEditor.quill;
      // 如果上传成功
      if (res.code === 0) {
        // 获取光标所在位置
        let length = quill.getSelection().index;
        // 插入图片  res.info为服务器返回的图片地址
        quill.insertEmbed(length, "image", res.data.filePath);
        let imgs = document.getElementById("edit").getElementsByTagName("img");
        for (var item of imgs) {
          // item.style.width = "100%";
        }
        // 调整光标到最后
        quill.setSelection(length + 1);
      } else {
        this.$message.error("图片插入失败");
      }
      // loading动画消失
      this.quillUpdateImg = false;
    },

    // 富文本图片上传失败
    uploadError() {
      // loading动画消失
      this.quillUpdateImg = false;
      this.$message.error("图片插入失败");
    }
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  mounted() {
    this.content = this.oldcontent;
  },
  watch: {
    oldcontent(newVal, oldVal) {
      if (this.editor) {
        if (newVal !== this.content) {
          this.content = newVal;
        }
      }
    }
  }
};
</script>
