/**
 * [http description] nodejs无express实现服务启动
 * @type {[type]}
 */
var http = require("http");
var url = require("url");
var fs = require("fs");
var path = require("path");
var mine = require("./mine").types;

var server = http.createServer(function(req, res) {

	var reurl = url.parse(req.url).pathname;
	pathname = __dirname + reurl;
	var ext = path.extname(pathname);
	ext = ext ? ext.slice(1) : '';

	if (fs.existsSync(pathname)) {
		var contentType = mine[ext] || "text/plain";
		res.writeHead(200, {
			'Content-Type': contentType
		});
		var data = fs.readFileSync(pathname);
		console.log(reurl)
		res.write(data);
	} else {
		res.writeHead(404, {
			'Content-Type': 'text/plain'
		});
	}
	res.end();
});
server.listen(8050, function(req, res) {

	console.log("start port 8050!");

});
module.exports = server;