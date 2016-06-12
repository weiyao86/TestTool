var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('come in');
	res.render('index', {
		title: 'Express'
	});
});

router.get('/master', function(req, res, next) {
	console.log('come in master');
	res.render('master');
});

module.exports = router;