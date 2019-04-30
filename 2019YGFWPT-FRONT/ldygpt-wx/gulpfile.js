var gulp = require('gulp');
var exec = require('child_process').exec;
const ftp = require('gulp-sftp')
const serverconfig = {
  remotePath: '/usr/local/dist/wx', //部署到服务器的路径
  host: '47.95.240.73', //ip地址
  user: 'root', //帐号
  pass: "liando@2019", //密码
  port: 22 //端口
}
gulp.task('default', ['upload'], function() {
  // 将你的默认的任务代码放在这
  console.log('## 部署完成')
});

// 上传到服务器
gulp.task('upload',['build'], function(cb) {
  console.log('## 正在部署到服务器上')
  gulp.src('./dist/**')
  .pipe(ftp(Object.assign(serverconfig, {cb})))
});

// 打包
gulp.task('build', function(cb) {
  console.log('## 正在编译项目')
  exec('npm run build', function(err) {
    if (err) return cb(err); // 返回 error
    cb(); // 完成 task
  });
});