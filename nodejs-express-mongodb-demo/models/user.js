//一般我们不直接用MongoDB的函数来操作MongoDB数据库 Mongoose就是一套操作MongoDB数据库的接口.
var mongoose = require("mongoose"),
	validationError = mongoose.Error.ValidationError,
	validatorError = mongoose.Error.ValidatorError,
	schema = new mongoose.Schema({
		userid: {
			type: String,
			required: true //非空
		},
		password: {
			type: String
				//validate:
		},
		query: {
			type: String
		},
		age: {
			type: Number,
			min: 18,
			max: 38
		},
		studentName: {
			type: String
		}
	}, {
		versionKey: false
	});

schema.statics.findQuery = function(cb) {
	return this.model('user').find({}, cb);
};

schema.pre('validate', function(next) {
	console.log('into validate pre')
		// var error = new validationError(this);
		// error.errors.email = new validatorError({
		// 	message: "显示错误消息",
		// 	type: "notvalid",
		// 	path: "age",
		// 	value: this.age
		// });
	next();
});

schema.pre('save', function(next) {
	console.log('into save pre')
	next();
});

exports.user = mongoose.model("user", schema, "usered");

// required 非空验证
// min/max 范围验证（边值验证）
// enum/match 枚举验证/匹配验证
// validate 自定义验证规则