'use strict'
var buildtype = process.argv.slice(2)[0]
console.log('-----start build----' + buildtype)
var obj = {
  NODE_ENV: '"production"'
}
switch (buildtype) {
  case 'pro': //生产
    process.env.srconfig = 'pro'
    obj.srconfig = '"pro"'
    break;
  case 'test': //测试
    process.env.srconfig = 'test'
    obj.srconfig = '"test"'
    break;
  case 'dev': //开发
    process.env.srconfig = 'dev'
    obj.srconfig = '"dev"'
    break;
  default:
    process.env.srconfig = ''
    obj.srconfig = '""'
    break;
}
module.exports = obj;
