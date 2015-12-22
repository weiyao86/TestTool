var mongoose = require("mongoose"),
	schema = new mongoose.Schema({
		uid: {
			type: String //mongoose.Schema.Types.ObjectId
		},
		filename: {
			type: String
		},
		note: {
			type: String
		},
		createDate: {
			type: Date
		},
		createBy:{
			type:String
		},modifyDate: {
			type: Date
		},
		modifyBy:{
			type:String
		}

	}, {
		versionKey: "__someElse"
	}),
	collectionName = "photo";

//verify user sign in 
schema.statics.fun = function(params, cb) {
	return this.model("photo").findOne(params, cb);
};

exports.photo = mongoose.model("photo", schema, collectionName);