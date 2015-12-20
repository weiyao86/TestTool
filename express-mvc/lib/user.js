var mongoose = require("mongoose"),
	schema = new mongoose.Schema({
		email: {
			type: String
		},
		password: {
			type: String
		},
		name: {
			type: String
		}
	}, {
		versionKey: "__someElse"
	}),
	collectionName = "user";

//verify user sign in 
schema.statics.verify = function(params, cb) {
	return this.model("user").findOne(params, cb);
};



exports.user = mongoose.model("user", schema, collectionName);