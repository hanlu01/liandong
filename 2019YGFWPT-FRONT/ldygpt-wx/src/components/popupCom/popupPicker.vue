<template>
  <div class="popupPicker">
    <!-- 底部弹层 -->
    <van-popup v-model="gardenPopupProStart" position="bottom" :overlay="true">
      <!-- 弹层 选择器 -->
      <van-picker
        show-toolbar
        title=""
        :columns="columns"
        @cancel="onCancel"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>
<script>
export default {
  props: {
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    gardenPopupPro: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      gardenPopupProStart: ''
    }
  },
  mounted () {
    this.gardenPopupProStart = this.gardenPopupPro
  },
  watch: {
    gardenPopupPro (val) {
      this.gardenPopupProStart = val
    }
  },
  methods: {
    onCancel () {
      this.gardenPopupProStart = false
    },
    // 弹层 选择器
    onConfirm (value, index) {
      // this.$toast(`当前值：${value}, 当前索引：${index}`)
      this.gardenPopupProStart = false
      this.$emit('gardenPopupEmit', value)
    }
  }
}
</script>
<style  lang="less" scoped>
.popupPicker{
}
</style>
