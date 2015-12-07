var commonfun = {
	handlerError: function(err, res) {
		return res.json({
			IsSuccess: false,
			msg: err
		});
	}
};

exports.commonfun = commonfun;