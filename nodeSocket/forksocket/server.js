var server = require('http').createServer();
var io = require('socket.io')(server);
var reptile = require('../common/reptile.js').reptile;
var reptile_1 = require('../common/reptile-1.js').reptile;
var reptile_2 = require('../common/reptile-2.js').reptile;

/**/

var clientList = {};
io.on("connection", function(s) {
	clientList[s.client.conn.remoteAddress] = s;

	//聊天室
	s.on('say', function(data) {
		var ip = 'ip--' + s.client.conn.remoteAddress.replace(/(\:)?.+(\:)/, '');
		for (var key in clientList) {
			console.log(key + "说:---" + ip);
			clientList[key].emit('message', {
				title: ip + "说:",
				content: data.content
			});
		}
	});

	//http://jandan.net/ooxx/page-" + i + "#comments"
	s.on('sayphoto', function(data) {
		// reptile.callbacks.writedone = function(data) {
		// 	s.emit('messagephoto', data);
		// };
		// reptile.outFolder(data);
		// reptile.start(function() {
		// 	console.log("---------------success------------------");
		// 	s.emit('end', "------complete------");
		// });


		//https://picjumbo.com/page
		// reptile_1.callbacks.writedone = function(data) {
		// 	s.emit('messagephoto', data);
		// };
		// reptile_1.outFolder(data);
		// reptile_1.start(function() {
		// 	console.log("---------------success------------------");
		// 	s.emit('end', "------complete------");
		// });

		//http://www.gratisography.com/
		reptile_2.callbacks.writedone = function(data) {
			s.emit('messagephoto', data);
		};
		reptile_2.outFolder(data);
		reptile_2.start(function() {
			console.log("---------------success------------------");
			s.emit('end', "------complete------");
		});
	});
});

server.listen(8010, function() {
	console.log("socket start:8010 success!");
});
module.exports = server;

// var server = require('http').createServer();
// var io = require('socket.io')(server);

// server.listen(8010, function() {
// 	console.log("socket start:8010 success!");
// });
// io.on('connection', function(socket) {
// 	socket.on('event', function(data) {});
// 	socket.on('disconnect', function() {});
// });


// module.exports = io;