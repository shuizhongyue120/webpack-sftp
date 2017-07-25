var path = require('path');
var fs = require('fs');
/**
 * 递归找出目录下的所有文件并返回
 * @param  {[type]} _path [路径]
 * @param  {[type]} arr   [description]
 */
function recursionFile(_path, arr) {
    var type = fs.statSync(_path);//路径类型
    if (type.isDirectory()) { //目录
        var list = fs.readdirSync(_path);
		//console.log(list);
        list.forEach(function(item, index, array) {
            recursionFile(path.resolve(_path,item), arr);
        });
    } else if (type.isFile()) {//文件
        arr.push(_path);
    } else {
        console.log("recursionFile invalid!");
    }
    return arr;
}

module.exports = recursionFile;