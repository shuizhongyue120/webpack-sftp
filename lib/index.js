var path = require('path');
var fs = require('fs');
var scp2 = require("scp2");
var findFile = require('./findFile.js');

/**
 * webpack sftpFile插件 (使用前先安装 scp2)
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
function sftpFile(opt) {
    //console.log("\n webpack sftpFile init");
    this.from = opt.from; //webpack打包后的路径
    this.to = opt.to; //远程服务器主目录
    this.port = opt.port; //端口
    this.host = opt.host; //主机
    this.username = opt.username; //用户名
    this.password = opt.password; //密码
}

sftpFile.prototype.sftp = function(files) {
    var _this = this;
    scp2.defaults({
        port: _this.port,
        host: _this.host,
        username: _this.username,
        password: _this.password
    });

    function upload(arr, i) {
        var relative = path.relative(_this.from, arr[i]);
        var _to = path.join(_this.to, relative);
        //console.log("_to:" + _to);
        console.error("\n");
        scp2.upload(arr[i], _to, function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log(arr[i] + ' is uploaded!');
                if (arr[i + 1]) {
                    upload(arr, i + 1);
                } else {
                    scp2.close();
                    console.log("\n " + arr.length + " files uploaded success!");
                }
            }
        });
    }

    console.log("\n webpack sftpFile begin upload");
    upload(files, 0);
}


sftpFile.prototype.apply = function(compiler) {
    var filepath = compiler.options.output.path;
    var _this = this;
    compiler.plugin("done", function(compilation) {
        var filelist = findFile(filepath, []);
        _this.sftp(filelist);
    });
}

module.exports = sftpFile;
