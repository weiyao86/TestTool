var express = require("express"),
	mongoose = require("mongoose"),
	user = require("../models/user").user,
	fs = require("fs"),
	app = express(),
	router = express.Router(),
	filterParams;

user.on("error", function(err) {
	console.log("user.error----" + err);
})

//search
router.post("/search", function(req, res) {

	user.find({}, '-_id').exec(function(err, rst) {
		if (err) return console.log(err);
		filter(res, rst, "SearchAll");
	});
});

router.post("/select", function(req, res) {
	//4.根据选择显示相应字段 
	var body = req.body,
		params = {};
	for (var i in body) {
		if (body.hasOwnProperty(i)) {
			var val = body[i];
			if (val) {
				if (user.schema.paths[i] && user.schema.paths[i].instance == "String") {
					params[i] = new RegExp(val, "ig")
				} else {
					params[i] = val;
				}
			}
		}
	}
	for (var key in params) {
		if (!user.schema.paths.hasOwnProperty(key)) {
			delete params[key];
		}
	}

	filterParams = params;

	var query = user.find(params, '-_id', {
		'sort': {
			"age": -1,
			"studentName": -1
		}
	});
	query.select('userid age studentName');
	query.exec(function(err, rst) {
		if (err) return console.log('error exec');
		filter(res, rst, "Login");
	});

});

//schema 静态方法查询所有
router.post("/schema/read", function(req, res) {
	user.findQuery(function(err, rst) {
		filter(res, rst, "Schema-Read");
	});
});


router.post("/submit", function(req, res) {
	var query_doc = {
		userid: req.body.userid,
		password: req.body.password,
		query: req.body.query,
		age: req.body.age,
		studentName: req.body.studentName
	};
	//1.create
	user.create(query_doc, function(err) {
		if (err) return handerError(err);
		console.log('create--success');
	});


	//2.query  返回单条记录
	user.findOne({
		userid: query_doc.query
	}, function(err, rst) {
		if (err) return console.log(err);
		if (rst)
			console.log('userid:%s password:%s query:%s', rst.userid, rst.password, query_doc.query);
	});

	user.find(function(err, rst) {
		filter(res, rst, "Save");
	});

	//3.不通过回调查询

	//5.remove   user.remove(condi)
	//6.select



	// user.find(function(err, person) {
	// 	for (var i = 0, item; item = person[i]; i++) {
	// 		console.log(item.userid);
	// 	}
	// });
	//res.redirect('/login/read');
});

router.post("/update", function(req, res) {


	var body = req.body,
		params = {};
	for (var i in body) {
		var val = body[i];
		if (val)
			params[i] = val;
	}
	user.update({
			userid: body.userid
		}, {
			$set: params
		}, {
			multi: true
		},
		function(err) {
			user.find(function(err1, rst) {
				filter(res, rst, "update-query");
			});
		});
});

router.post("/delete", function(req, res) {

	console.log("into");
	var params = {
		userid: req.body.userid
	};
	user.remove(params, function(err, doc) {
		if (err) return console.log('delete:' + err);
		user.find(function(err, rst) {
			filter(res, rst, "Delete");
		});
	});
});

router.post("/page", function(req, res) {
	var params = req.query,
		page = params.page,
		limit = parseInt(req.body.limit || 5),
		curIdx = parseInt(req.body.page_cur || 1),
		idx, total;
	filterParams = filterParams || {};
	user.count(filterParams, function(err, count) {
		if (err) return handerError(err);
		if (count) {
			if (count % limit > 0)
				total = Math.floor(count / limit) + 1;
			else
				total = Math.floor(count / limit);

			switch (page) {
				case 'first':
					idx = 1;
					break;
				case 'prev':
					idx = curIdx - 1;
					break;
				case 'next':
					idx = curIdx + 1;
					break;
				case 'last':
					idx = total;
					break;
				default:
					idx = 1;
					break;
			}


			var query = user.find(filterParams, '-_id', {
				'sort': {
					"age": -1
				}
			});
			query.skip(limit * (idx - 1)).limit(limit).exec(function(err, rst) {
				if (err) return handerError(err);
				filter(res, rst, "Login", {
					total: total,
					curidx: idx
				});
			});
		}
	});
});

//上传文件
router.post("/file_upload", function(req, res) {
	console.log(req.files[0]);
	var des_file = __dirname + '/' + req.files[0].originalname;
	fs.readFile(req.files[0].path, function(err, data) {
		fs.writeFile(des_file, data, function(err) {
			if (err) console.log(err);
			else {
				response = {
					msg: "File uploaded successfully",
					filename: req.files[0].originalname
				}
			}
			console.log(response);
			res.end(JSON.stringify(response));
		})
	});

});

function filter(res, rst, title, page) {
	if (user) {
		rst = rst.map(function(tag) {
			return tag.toJSON();
		});
		res.render('login', {
			title: title,
			data: rst,
			page: {
				curidx: (page && page.curidx) || 1,
				total: (page && page.total) || 1
			}
		});
	}
}

function handerError(err) {
	var errors = err.errors;
	for (var item in errors) {
		console.log(errors[item]);
	}
}

module.exports = router;