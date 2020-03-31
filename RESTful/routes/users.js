var express = require('express');
var Client = require('ftp');
var fs = require('fs');
var router = express.Router();

let connection = {
  host: "10.0.0.164",
  port: "21"
};

router.get('/', function (req, res, next) {
  res.render('user', {
    title: 'Ftp文件的上传与下载',
    msg: ''
  })
});


/* GET users listing. */
router.get('/download', function (req, res, next) {
  var c = new Client();

  //get a directory list
  c.on('ready', function () {
    console.log('开始下载');
    // c.list(function (err, list) {
    //   if (err) {
    //     throw err;
    //   }
    //   console.log(list);
    //   c.end();
    // });

    c.get('te.txt', function (err, stream) {
      if (err) throw err;
      stream.once('close', function () { c.end(); });
      stream.pipe(fs.createWriteStream('public/download.te.txt'));
      res.json({
        msg: 'Ftp文件的下载'
      });
    });
  });

  c.on('error', function (msg) {
    console.log('error');
  });

  console.log('start connect')

  c.connect(connection);

});



router.get('/upload', function (req, res, next) {
  var c = new Client();

  c.on('ready', function () {
    console.log('开始上传');
    c.put('download.te.txt', 'foo.remote-copy.txt', function (err) {
      if (err) throw err;
      c.end();
      res.json({
        msg: err || 'Ftp文件的上传'
      });

    });
  });

  c.on('error', function (msg) {
    console.log('error');
  });

  console.log('start connect')

  c.connect(connection);

});

module.exports = router;
