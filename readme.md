sftp plugin for webpack
===================

this is a sftp-webpack-plugin and can upload files a remote server

----------

- how to use
-----------
install this npm package
  

      npm i webpack-sftp

use it in webapck configfile with follow:

    var sftpFile = require("webpack-sftp");
    var sftp = new sftpFile({
        port: "xx",
        host: "xxx",
        username: "xxxx",
        password: "xxxx",
        from: xxx,
        to: "xxx/"
    });

