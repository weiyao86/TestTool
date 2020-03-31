/**
 * app.js
 */

global.__appRoot = __dirname;
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var photo = require('./routes/photo');
var domain = require('domain');
var log4js = require('./common/log4js.js');

var app = express();

var loggerFile = log4js.use(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resource')));

app.use('/', routes);
app.use('/', photo);


//捕获所有的异常
process.on('uncaughtException', function(err) {
	console.log('uncaughtException:-----' + err);
});
//try catch所无法做到的：捕捉异步回调中出现的异常
app.use(function(req, res, next) {
	var d = domain.create();
	d.on('error', function(err) {
		res.statusCode = 500;
		res.json({
			success: false,
			message: '服务器异常'
		});
		d.dispose();
	});
	d.add(req);
	d.add(res);
	d.run(next);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});

// app.listen(8005, function() {
// 	console.log("app start:8005 success!");
// });


//socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);


server.listen(8005, function() {
	console.log("app start:8005 success!");
});

var clientIo = require("socket.io-client");
//var clientList = {};

io.on("connection", function(s) {
	//clientList[s.client.conn.remoteAddress] = s;
	//方法－：8005 当前服务器聊天室
	// s.on('say', function(data) {
	// 	var ip = 'ip--' + s.client.conn.remoteAddress.replace(/(\:)?.+(\:)/, '');
	// 	for (var key in clientList) {
	// 		console.log(key + "说:---" + ip);
	// 		clientList[key].emit('message', {
	// 			title: ip + "说:",
	// 			content: data.content
	// 		});
	// 	}
	// });

	//方法二：8010 服务器  通过中转服务（端口8010）
	var ioclient = clientIo.connect("http://localhost:8010", {
		forceNew: true
	});

	ioclient.on("connect", function() {
		console.log("connect success!");
		// ioclient.emit("sayphoto", {});
	});

	//8005 ==> 8010  == > 8005  一个回路完成
	//begin
	s.on("sayphoto", function(data) {
		ioclient.emit("sayphoto", data);
	});

	ioclient.on("messagephoto", function(data) {
		s.emit("messagephoto", data);
	});
	//end
	ioclient.on("end", function(data) {
		s.emit("end", data);
	});
});


//启动服务 8010 socket.io
var serverfile = require('./forksocket/server.js');
loggerFile.info('启动服务 8010 socket.io');
module.exports = app;