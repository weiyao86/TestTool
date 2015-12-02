var express = require('express');
var app = express();
var user = require("../models/user").user;
var router = express.Router();
var mongoose = require('mongoose');
var uri = ('mongodb://localhost:27017/demo');

mongoose.connect(uri);
var db = mongoose.connection;
db.on('error', function() {
	console.log('connection error');
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});
router.get('/login/read', function(req, res, next) {

	user.find({}, '-_id').exec(function(err, rst) {
		if (err) return console.log(err);
		rst = rst.map(function(tag) {
			return tag.toJSON();
		});
		res.render('login', {
			title: 'Express',
			data: rst,
			page: {
				curidx: 1,
				total: 1
			}
		});
	});
});

module.exports = router;