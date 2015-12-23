	var gu = require("guthrie"),
		fs = require("fs"),
		nodeExcel = require('excel-export'),
		commonfun = require(__appRoot + "/lib/commonfun").commonfun,
		filters = require(__appRoot + '/lib/filters'),
		user = require(__appRoot + "/lib/user").user,
		baseController = require("./mybaseController"),
		userController = gu.controller.inherit(baseController);

	var multer = require('multer');
	var uploadF = multer({
		dest: __appRoot + '/tempFile'
	}).array("example");

	userController.actions = {
		index: {
			GET: function(req, res) {
				//watchTest();
				res.view();
			}
		},
		queryAll: {
			filters: [filters.userfilter],
			POST: function(req, res) {

				var condition = this.condition,
					filters = this.filters;
				commonfun.watchFile('/areas/test-2');
				commonfun.queryAll(res, user, condition, filters);
			}
		},

		upload: {
			POST: function(req, res) {
				var response = {},
					folderPath = __appRoot + '/tempFile';

				uploadF(req, res, function(err) {
					if (err) commonfun.handlerError(err, res);
					var des_file = __appRoot + '/data/photo/' + req.files[0].originalname;
					fs.readFile(req.files[0].path, function(err0, data) {
						if (err0) commonfun.handlerError(err0, res);
						fs.writeFile(des_file, data, function(err1) {
							if (err1) commonfun.handlerError(err1, res);
							else {
								response = {
									msg: "File uploaded successfully",
									filename: req.files[0].originalname
								}
							}

							//remove cache file
							commonfun.recursiveDelFile(folderPath);
							//IE下返回值 会被当作文件来下载
							res.set('Content-Type', 'text/html;charset=utf-8');
							res.json(response);
						});
					});
				});
			}
		},

		export: {
			GET: function(req, res) {
				var filepath = __appRoot + '/areas/test-2/t12.js';
				fs.exists(filepath, function(exists) {
					if (exists) {

						var scripts = fs.createReadStream(filepath);
						var filename = "中文.js";
						commonfun.garbled(res, req, filename);

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
					commonfun.garbled(res, req, filename);
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
					len = 1500,
					names = ["john", "jack", "shiry", "lilei", "hameimei"],
					idx;
				for (var i = len; i > 0; i--) {
					idx = Math.floor(Math.random() * 5);
					arr.push({
						email: "w@" + i + ".com",
						nickname: names[idx],
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
					content = {
						email: model.email,
						password: model.password
					};
				commonfun.insert(req, res, user, {
					email: model.email
				}, content);
			}
		},

		updateUser: {
			POST: function(req, res) {
				var model = req.body,
					id = model._id,
					condiction;
				delete model["_id"];
				condiction = {
					"_id": id
				};

				commonfun.update(req, res, user, condiction, model);
			}
		},

		deleteUserByEmail: {
			POST: function(req, res) {
				var model = req.body,
					condiction = {
						"_id": model._id
					};
				console.log(model)

				commonfun.destory(req, res, user, condiction);
			}
		}
	};

	module.exports = userController;