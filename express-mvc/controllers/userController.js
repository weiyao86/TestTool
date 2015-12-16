	var gu = require("guthrie"),
		fs = require("fs"),
		nodeExcel = require('excel-export'),
		commonfun = require(__appRoot + "/lib/commonfun").commonfun,
		filters = require(__appRoot + '/lib/filters'),
		user = require(__appRoot + "/lib/user").user,
		baseController = require("./mybaseController"),
		userController = gu.controller.inherit(baseController);

	userController.actions = {
		index: {
			GET: function(req, res) {
				watchTest();
				res.view();
			}
		},
		queryAll: {
			filters: [filters.userfilter],
			POST: function(req, res) {

				var condition = this.condition,
					filters = this.filters;
				queryAll(res, condition, filters);
			}
		},

		export: {
			GET: function(req, res) {
				var filepath = __appRoot + '/areas/test-2/t12.js';
				fs.exists(filepath, function(exists) {
					if (exists) {

						var scripts = fs.createReadStream(filepath);
						var filename = "中文.js";
						garbled(res, req, filename);

						scripts.pipe(res);

						//express 下载根据文件名显示下载文件头
						//res.download(filepath);
					} else {
						res.write("file is not exist");
						res.end();
					}
				});
			}
		},

		exportExcel: {
			GET: function(req, res) {
				var conf = {};
				conf.stylesXmlFile = __appRoot + '/public/styles.xml';
				conf.cols = [{
					caption: 'Id',
					type: 'string',
					width: 30,
					beforeCellWrite: function(row, cellData, eOpt) {
						eOpt.styleIndex = 2;
						if (eOpt.rowNum % 2) {
							eOpt.styleIndex = 1;
						}
						return cellData;
					}
				}, {
					caption: 'Version Lock',
					type: 'string'
				}, {
					caption: 'Eamil',
					type: 'string'
				}, {
					caption: 'Password',
					type: 'string'
				}];

				user.find({}, '', {
					"sort": {
						"_id": -1
					}
				}, function(err, docs) {
					if (err) return commonfun.handlerError(err, res);
					var arr = [],
						temp;
					docs.map(function(tag) {
						var doc = tag.toJSON();
						temp = [];
						temp.push(doc._id, doc.__someElse.toString(), doc.email, doc.password);
						arr.push(temp);
						return doc;
					});
					conf.rows = arr;

					var result = nodeExcel.execute(conf);

					var filename = "用户帐号文件.xlsx";
					garbled(res, req, filename);
					res.end(result, 'binary');
				});
			}
		},


		invokeWebservice: {
			GET: function(req, res) {

				/**
				 * 1.原生http调用webservice
				 */

				// var options = {
				// 	host: 'wsf.cdyne.com',
				// 	port: '',
				// 	path: '/WeatherWS/Weather.asmx?wsdl',
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json; charset=utf-8',
				// 		'Content-Length': 0
				// 	}
				// };
				// console.log('into111');
				// var http = require('http');
				// var reqinner = http.request(options, function(resinner) {
				// 	var msg = '';
				// 	console.log('into');
				// 	resinner.setEncoding('utf8');
				// 	resinner.on('data', function(chunk) {
				// 		msg += chunk;
				// 		console.log(chunk);
				// 	});
				// 	resinner.on('end', function() {
				// 		console.log(msg);
				// 	});
				// });
				// reqinner.write('abc');
				// reqinner.end();

				/**
				 * 2.引用soap是成功的调到webservice
				 */
				// 
				var soap = require("soap");
				var url = 'http://wsf.cdyne.com/WeatherWS/Weather.asmx?wsdl'; //'http://service.sgmw.com.cn/webservice/SGMW_UserInfoVerify.asmx?wsdl'; 

				var args = {
					ZIP: req.body.ZIP
				};

				soap.createClient(url, function(err, client) {
					client.GetCityWeatherByZIP(args, function(err, result) {
						console.log(result);
						var response = {
							city: result.GetCityWeatherByZIPResult.City,
							state: result.GetCityWeatherByZIPResult.State,
							temp: result.GetCityWeatherByZIPResult.Temperature
						};
						res.send(response);
						res.end();
					});
				});
			}
		},

		insertTempData: {
			GET: function(req, res) {

				var arr = [],
					len = 1500;
				for (var i = len; i > 0; i--) {
					arr.push({
						email: "w@" + i + ".com",
						password: i

					});
				}
				user.remove({}, function(err) {
					user.create(arr, function(err) {
						if (err) return commonfun.handlerError(err, res);
						res.send("<p>" + len + "条数据插入成功<p>");
						res.end();
					});
				});
			}
		},

		createUser: {
			POST: function(req, res) {
				var model = req.body,
					params = {
						email: model.email,
						password: model.password
					};

				user.count({
					email: params.email
				}, function(err, count) {
					if (err) return commonfun.handlerError(err, res);
					if (count) {
						res.json({
							IsSuccess: true,
							data: [],
							msg: "此条记录已存在"
						});
					} else {
						user.create(params, function(err) {
							if (err) return commonfun.handlerError(err, res);
							res.json({
								IsSuccess: true,
								data: [],
								msg: ''
							});
						});
					}
				});
			}
		},

		updateUser: {
			POST: function(req, res) {
				var model = req.body,
					id = model._id;
				delete model["_id"];
				user.update({
					"_id": id
				}, {
					$set: model
				}, function(err) {
					if (err) return res.json({
						IsSuccess: false,
						msg: err
					});
					res.json({
						IsSuccess: true,
						data: "更新成功"
					});
				});
			}
		},

		deleteUserByEmail: {
			POST: function(req, res) {
				var model = req.body,
					id = model.id;

				user.remove({
					_id: id
				}, function(err) {
					if (err) return res.json({
						IsSuccess: false,
						msg: err
					});
					res.json({
						IsSuccess: true,
						data: "删除成功"
					});
				});
			}
		}
	};


	function queryAll(res, condition, filters) {
		var limit = (filters && filters.limit) || 0,
			idx = (filters && filters.pageIndex) || 1;

		user.count(condition || {}, function(err, count) {
			if (err) return handerError(err);

			limit === 0 && (limit = count);

			var query = user.find(condition || {}, '-__someElse', {
				'sort': {
					"_id": -1
				}
			});
			query.skip(limit * (idx - 1)).limit(limit).exec(function(err, users) {
				if (err) return commonfun.handlerError(err, res);
				users = users.map(function(tag) {
					return tag.toJSON();
				});
				return res.json({
					IsSuccess: true,
					data: users,
					total: count
				});
			});

		});
	}

	function watchTest() {
		console.log('start Watch');

		fs.watch(__appRoot + '/areas/test-2', function(event, filename) {
			console.log('event is: ' + event);
			if (filename) {
				console.log('filename provided: ' + filename);
			} else {
				console.log('filename not provided');
			}
		});
	}

	//解决各浏览器文件名中文乱码问题,自定义文件名
	function garbled(res, req, filename) {
		var userAgent = (req.headers['user-agent'] || '').toLowerCase();
		res.set('Content-Type', 'application/force-download;charset=utf-8');

		if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
			res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(filename));
		} else if (userAgent.indexOf('firefox') >= 0) {
			res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(filename) + '"');
		} else {
			res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(filename).toString('binary'));
		}
	}

	module.exports = userController;