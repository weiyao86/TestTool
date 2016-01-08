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
	secret: "nodeMvc"
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

app.use(function(err, req, res, next) {

	res.status(err.status || 500);

	//过滤静态文件
	if (/data|res|scripts|styles/.test(req.originalUrl)) {
		console.log("过滤静态文件,此处错误忽略！" + '-----' + err + "-----" + req.originalUrl)
		return next();
	}
	//暴露错误信息
	console.log(err);
	//res.redirect('/noexist');
});


// Fire up server 监听端口
app.listen(8002, function() {
	console.log('Express server listening on port: ' + 8002);
});