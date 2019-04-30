var baseURL = {
  basicApi: ''
}
switch (process.env.NODE_ENV) {
  case 'testing': // 测试环境
    // 基础服务
    baseURL.basicApi = 'http://csld.liando.cn:8081'
    // baseURL.basicApi = 'http://192.168.128.141:8080'
    break
  case 'production': // 生产环境
    // 基础服务
    // baseURL.basicApi = 'http://storeserver.muyusi.com:1026'
    baseURL.basicApi = 'http://csld.liando.cn:8081'
    break
  default:
    // 基础服务
    // baseURL.basicApi = 'http://csld.liando.cn:8081'
    // baseURL.basicApi = 'http://192.168.128.141:8080'
    // baseURL.basicApi = 'http://csld.liando.cn:8081'
    baseURL.basicApi = 'http://192.168.128.220:8080'
    // baseURL.basicApi = 'http://192.168.128.220:8080'
    // baseURL.basicApi = 'http://192.168.128.204:80'
    // baseURL.basicApi = 'http://258nm8.natappfree.cc'
    // baseURL.basicApi = 'http://ip5nw5.natappfree.cc'
    // baseURL.basicApi = 'http://s45j9s.natappfree.cc'
    break
}
module.exports = baseURL
