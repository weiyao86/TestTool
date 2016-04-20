var server = require('http').createServer();
var io = require('socket.io')(server);

/**/

var clientList = {};
io.on("connection", function(s) {
	clientList[s.client.conn.remoteAddress] = s;

	s.on('say', function(data) {
		var ip = 'ip--' + s.client.conn.remoteAddress.replace(/(\:)?.+(\:)/, '');
		console.log(ip);
		for (var key in clientList) {
			console.log(key + "说:---" + ip);
			clientList[key].emit('message', {
				title: ip + "说:",
				content: data.content
			});
		}
	});

	//photo
	s.on('sayphoto', function(data) {
		console.log(data);
		s.emit('messagephoto', {
			filename: "server.js"
		});
	});

	process.on("message",function(m,socket){
		console.log('sssssssssssssssssssss')
		socket.emit("sayphoto",{filename:"index.js"});
	})

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