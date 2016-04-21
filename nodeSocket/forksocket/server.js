var server = require('http').createServer();
var io = require('socket.io')(server);
var reptile = require('../common/reptile.js').reptile;

/**/


io.on("connection", function(s) {
	//photo

	s.on('sayphoto', function(data) {
		reptile.callbacks.writedone = function(data) {
			s.emit('messagephoto', data);
		};
		reptile.start(function() {
			console.log("---------------success------------------");
			s.emit('end', "------complete------");
		});
	});
});

server.listen(8010, function() {
	console.log("socket start:8010 success!");
});

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