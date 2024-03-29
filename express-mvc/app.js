global.__appRoot = __dirname;

// require express & guthrie
var express = require('express');

var ejs = require('ejs');

// require middleware
var favicon = require('serve-favicon');

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var session = require('express-session');

var controllerRouter = require('./controllerRouter');
// other requires
var path = require('path');

//upload file
// var multer = require('multer');

var app = express();

var log4js = require('./lib/log4js.js');

var loggerFile = log4js.use(app);
// configure middleware
app.set('views', __dirname + '/views');
app.set('rootDir', __dirname);

//通过ejs来解析后缀为html的文件
app.engine(".html", ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');

// app.use(multer({
// 	dest: '/temp/'
// }).array("file"));


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

//将public目录作为静态目录
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'resource')));
app.use(express.static(path.join(__dirname, 'tempFile')));

app.use(session({
	secret: "nodeMvc",
	resave: true,
	saveUninitialized: true
}));
app.use(cookieParser());

app.use(function(req, res, next) {

	if (typeof req.cookies["account"] != "undefined" || req.url.indexOf("/login") > -1) {
		next();
	} else {
		res.redirect("/login");
	}
});

//set router for controller
controllerRouter.routerMap(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

//捕获所有的异常
process.on('uncaughtException', function(err) {
	loggerFile.info('uncaughtException:-----' + err);
	console.log('uncaughtException:-----' + err);
});

app.use(function(err, req, res, next) {

	res.status(err.status || 500);

	//过滤静态文件
	if (/data|res|scripts|styles/.test(req.originalUrl)) {
		loggerFile.info("过滤静态文件,此处错误忽略！" + '-----' + err + "-----" + req.originalUrl);
		return next();
	}
	//暴露错误信息
	loggerFile.info(err);
	//res.redirect('/noexist');
});


// Fire up server 监听端口
// app.listen(8002, function() {
// 	console.log('Express server listening on port: ' + 8002);
// });


//socket.io
var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8002, function() {
	loggerFile.info("app start:8002 success!");
});

io.on("connection", function(s) {
	s.emit('news', {
		hello: 'world--' + (Math.random() * (100 - 20 + 1) - 20)
	});
	s.on('myEvent', function(data) {
		console.log(data);
	});
});