var log4js = require('log4js');
log4js.configure({
	appenders: [{
		type: 'console'
	}, {
		type: 'dateFile', //文件输出
		filename: '../logs/access.log',
		maxLogSize: 1024, //当超过maxLogSize大小时，会自动生成一个新文件
		backups: 3,
		category: 'reptile'
	}],
	replaceConsole: true,
	levels: {
		normal: 'INFO'
	}
});
var loggerFile = log4js.getLogger('app');

exports.logger = loggerFile;
exports.logforName = function(name) {
	var log = log4js.getLogger(name);
	log.setLevel('INFO');
	return log;
};
exports.use = function(app) {
	app.use(log4js.connectLogger(loggerFile, {
		leval: 'INFO',
		format: ':method :url'
	}));
};