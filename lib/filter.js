'use strict';
const cheerio = require('cheerio');
const fs = require("fs")
const path_module = require('path');

const flag = 1
function write_file_lzj(path,flag) {
  console.log("path1-->" + path);
  // 检查文件是否存在于当前目录中。 
  // fs.access(path, fs.constants.F_OK, (err) => {
  //   if (err) {
  //     console.log("ppppppp");
  //     return path;
  //   } else {
      // var file = readFile(path); // {"isFulfilled":false,"isRejected":false}
      // console.log("readFile: "+JSON.stringify(file));
      // 将图片文件写入到assets  在public下面创建assets/img文件

      // 判断文件是否存在
      if(flag!=1){
        return path;
      }

      // 同步读取
      var data = fs.readFileSync(path);
      // console.log("同步读取: " + data.toString());
      // 异步读取
      // var data = "";
      // var FLAG=1;
      // fs.readFile(path, function (err, tmp) {
      // if (err) {
      //     // console.error("pppppppppppp"+err);
      //     FLAG=0;
      //     return "";
      // }
      // data = tmp
      // // console.log("异步读取: " + data.toString());
      // });
      // if(!FLAG){
      //   return path;
      // }

      // 创建文件 assets/img 获取当前的路径，然后创建，拼接文件夹，写入文件
      // console.log("path_module:"+path_module.basename(path)); 1.jpg
      var file_name = path_module.basename(path);
      // console.log("path_module:"+path_module.dirname(path)); 文件存在的目录，绝对地址
      var file_d1 = path_module.dirname(path);
      // console.log("获取当前执行node命令的目录"+process.cwd()); /path_module/workspaces/hexo/t1
      var root_path = process.cwd(); // /path_module/workspaces/hexo/t1 + /public/assets/ + path
      var tmp_d1 = root_path + "/public/assets" + file_d1;
      console.log("创建的文件夹：" + tmp_d1);
      var dest_file = tmp_d1 + "/" + file_name
      console.log("dest_file " + dest_file);
      fs.mkdir(tmp_d1, { recursive: true }, function (err) {
        if (err) {
          return console.error(err);
        }
        console.log("目录创建成功。");

        const opt = {
          flag: 'w', // a：追加写入；w：覆盖写入
        }

        fs.writeFile(dest_file, data, opt, (err, fd) => {
          if (err) {
            console.error(err)
          }

        })

      });
      
      console.log("dest_file------: "+dest_file.split("public")[1]);
      path = dest_file.split("public")[1];
      return path;
    }

  // });

  // return path;
// }

module.exports = function (str, data) {
  const $ = cheerio.load(str);
  const { url, absolute } = data.config;
  // console.log("url---"+url);https://lizeju.github.io/hexo_blog
  // console.log("absolute---"+JSON.stringify(absolute));
  const { tagName, attribute } = absolute;
  const obj = {};
  let host = url;
  host = host.endsWith('/') ? host : host + '/';
  // console.log("hexo-absolute:"+host);hexo-absolute:http://example.com/
  // todo: less iteration
  tagName.forEach(t => {
    attribute.forEach(a => {
      $(t).each(function () {
        let ans;
        const res = $(this).attr(a);
        // if(res.endsWith("png")){
          // console.log("res---->"+JSON.stringify(res));
        // }
        // console.log("hexo-absolute: "+res); a链接标签的属性
        // console.log("hexo-absolute: "+$(this));
        if (res) {
          if (obj[res]) {
            ans = obj[res];
            // console.log("hexo-absolute: "+ans);
          } else {
            ans = convert(res, host);
            // console.log("hexo-absolute2: "+ans);
            obj[res] = ans;
          }
          $(this).attr(a, ans);
        }
      });
    });
  });

  str = $.html();
  // console.log("hexo-absolute: "+str) 静态页面的内容
  return str;
};
// 对于a标签的属性进行转换 src
function convert(path, host) {
  let ans;
  // console.log("33333->"+path,host); https://lizeju.github.io/hexo_blog   path  local file + /hexo_blog
  //  C:\Users\l\AppData\Roaming\Typora\typora-user-images\image-20221216060114889.png
  // /home/l/1.jpg
  // todo: combine more Protocol
  // todo: force http to https
  if (path.startsWith('http') || path.startsWith('ftp') || path.startsWith('mailto')) {
    ans = path;
  } else if (path.startsWith('#')) {
    ans = host + path;
  } else if (path.startsWith('/')) {
    // /home/l/1.jpg
    // 获取文件的路径，类型,判断文件是不是图片文件
    // 将文件写入到静态文件目录
    // 修改ans的值
    if(path.indexOf("hexo_blog") != -1){
      path = path.split("hexo_blog")[1]
    }
    console.log("res--------"+path);
    // 获取文件的扩展名
    if (path.endsWith(".png")||path.endsWith(".jpg")) {
      console.log("22222222222222->"+path);
      path = write_file_lzj(path,flag);
      console.log("22222222222222->"+path);
    }


    ans = host + path.replace('/', '');
    // console.log("path---->"+ans);
  } else {
    // C:\Users\l\AppData\Roaming\Typora\typora-user-images\image-20221216060114889.png
    // 操作步骤
    // 获取文件的路径，类型
    // 将文件写入到静态文件目录
    // 修改ans的值
    // console.log("path2-->"+path);
    if (path.endsWith(".png")||path.endsWith(".jpg")) {
      
      path = write_file_lzj(path,0);
      console.log("path----1>" + path);
    }
    ans = host + path.replace('/', '');
  }
  return ans;
}
