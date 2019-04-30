exports.install = function (Vue, options) {
  Vue.prototype.$config = function () {
    var config = {}
    let token = sessionStorage.getItem('token')
    switch (process.env.srconfig) {
      case 'testdev':
        // 文件上传地址
        config.uploadUrl = 'http://liando.ehuatek.com/ldygpt-pc-web/api/file/fileUpload?token=' + token
        break
      case 'pro':
        // 文件上传地址
        config.uploadUrl = 'http://liando.ehuatek.com/ldygpt-pc-web/api/file/fileUpload?token=' + token
        break
      default: // 开发环境 开发时各自配置下面地址
        // 文件上传地址
        config.uploadUrl = 'http://127.0.0.1:8080/ldygpt-pc-web/api/file/fileUpload?token=' + token
        break
    }
    return config
  }
}
