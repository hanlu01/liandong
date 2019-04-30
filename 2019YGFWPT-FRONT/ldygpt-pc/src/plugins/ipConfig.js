var baseURL = {
    basicApi: ''
}
switch (process.env.srconfig) {
    case 'testing': //测试环境
        // 基础服务
        baseURL.basicApi = 'http://47.95.240.73:8080'
        break;
    case 'production': //生产环境
        // 基础服务
        baseURL.basicApi = 'http://storeserver.muyusi.com:1026'
        break;
    default:
        // 基础服务
        // baseURL.basicApi = 'http://47.95.240.73:8080'
        baseURL.basicApi = 'http://127.0.0.1:80'
        break;
}
module.exports = baseURL;
