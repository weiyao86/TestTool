var express = require('express');
var router = express.Router();
var user = require('../lib/user.json');

/* GET home page. */
router.get('/index', function(req, res, next) {
	res.render('index', {
		title: 'Express',
		users: user
	});
});

router.post('/addUser', function(req, res, next) {
	var body = '';
	console.log('come in')

	req.on('data', function(data) {
		body += data;
		console.log(body);
	});

	req.on('end', function(data) {
		user['user4'] = {
			"id": 4,
			"name": 'wei',
			"password": "123",
			"profession": "know"
		};
		res.json({
			Message: 'User Added'
		});
	});
});

router.get('/:id', function(req, res, next) {
	var u = user['user' + req.params.id];
	res.render("index", {
		title: "user",
		users: u
	});
});


module.exports = router;