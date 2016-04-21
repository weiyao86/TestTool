var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/photo', function(req, res, next) {
	res.render('photo', {
		title: 'Express'
	});
});

router.post('/photoStart', function(req, res) {
	res.json({
		"Success": []
	});
});


// var getIoclient = (function() {
// 	var ioclient, status = false;
// 	return function(fn) {
// 		var context = this;

// 		if (!status) {
// 			ioclient = clientIo.connect("http://localhost:8010", {
// 				forceNew: false
// 			});
// 			ioclient.on("connect", function() {
// 				console.log("connect success!");
// 				status = true;
// 				fn.call(context, ioclient);
// 			});

// 			ioclient.on('test-say', function(data) {
// 				console.log('end-test-say-client');
// 			});

// 		} else {
// 			fn.call(context, ioclient);
// 		}
// 	};
// })();

// clientSocket();

// function clientSocket(data) {
// 	getIoclient(function(ioclient) {
// 		console.log('test-say-server');
// 		//ioclient.emit("test-say", data);
// 	});
// }

module.exports = router;