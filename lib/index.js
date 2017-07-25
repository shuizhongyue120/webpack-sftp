var path = require('path');
var fs = require('fs');
var scp2 = require("scp2");
var findFile = require('./getFiles.js');

var colors = require('colors');
colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

/**
 * [sftpFile description]
 * @param  {[type]} opt [description]
 * @return {[type]}     [description]
 */
function sftpFile(opt) {
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
        scp2.upload(arr[i], _to, function(err) {
            if (err) {
                console.error("\n " + err);
            } else {
                console.log((arr[i] + ' is uploaded! \n').info);
                if (arr[i + 1]) {
                    upload(arr, i + 1);
                } else {
                    scp2.close();
                    console.log((arr.length + " files uploaded success!").silly);
                }
            }
        });
    }

    console.log("\n webpack-sftp begin upload".warn);
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
