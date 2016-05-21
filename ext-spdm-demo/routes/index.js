var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
	res.render('login', {
		title: 'Login'
	});
});

router.get('/master', function(req, res, next) {
	res.render('master', {
		title: 'master'
	});
});

router.get('/partDetail', function(req, res, next) {
	res.render('detail', {
		title: 'detail'
	});
});



router.get('/', function(req, res, next) {
	res.render('index', {
		title: 'Express'
	});
});

module.exports = router;