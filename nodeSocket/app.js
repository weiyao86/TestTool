var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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


var server = require('http').Server(app);
var io = require('socket.io')(server);
server.listen(8005, function() {
	console.log("app start:8005 success!");
});


var clientList = {};
io.of('index').on("connection", function(s) {

	var call = ["你好", "你说什么？", "见你到很高兴", "时候不早了", "赶紧回家吃饭吧", "下班了", "你是谁？"];
	console.log(s.client.conn.remoteAddress);
	clientList[s.client.conn.remoteAddress] = s;


	s.on('say', function(data) {
		var ip = 'ip--' + s.client.conn.remoteAddress.replace(/(\:)?.+(\:)/, '');

		for (var key in clientList) {
			console.log(key + "说:---" + ip)
			clientList[key].emit('message', {
				title: ip + "说:",
				content: data.content
			});
		}
		// setTimeout(function() {
		// 	s.emit('servercall', {
		// 		title: "服务端说:",
		// 		content: (function() {
		// 			var ran = Math.floor(Math.random() * 7);
		// 			return call[ran];
		// 		})()
		// 	});
		// }, 2 * 1000);
	});
});
module.exports = app;