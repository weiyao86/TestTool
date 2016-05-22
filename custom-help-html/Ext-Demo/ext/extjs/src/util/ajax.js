Ext.util.ajax = function(config) {
	var defaultOpts = {
			url: null,
			timeout: 30000,
			method: "GET",
			params: null,
			jsonData: null,
			disableCaching: false,
			beforerequest: null,
			requestcomplete: null,
			callback: null
		},
		opts = Ext.apply(defaultOpts, config);

	Ext.Ajax.request({
		url: opts.url,
		method: opts.method,
		params: opts.params,
		jsonData: opts.jsonData,
		disableCaching: opts.disableCaching,
		beforerequest: opts.beforerequest,
		requestcomplete: opts.requestcomplete,
		callback: opts.callback,
		timeout: opts.timeout,
		success: function(response) {
			var root;

			if (response.responseText.length > 0) {
				root = Ext.decode(response.responseText);
			}
			if (typeof opts.success == 'function') {
				opts.success.apply(this, [root]);
			}
		},
		failure: function(response) {
			Ext.util.errorHandler(response, opts.failure);
		}
	});
};

// 请求服务端错误统一处理
Ext.util.errorHandler = function(response, callback) {
	var error,
		responseText = response.responseText;

	switch (response.status) {
		case 401:
			error = Ext.decode(responseText);

			Ext.Msg.alert('错误', error.message, function() {
				location.href = location.href;
			});
			break;
		case 404:
			Ext.Msg.alert('错误', response.statusText);
			break;
		default:
			error = Ext.decode(responseText || '{message: "未知错误"}');

			if (typeof callback == 'function') {
				callback.apply(this, [response]);
			} else {
				Ext.Msg.alert('错误', error.message);
			}
			break;
	}
}

Ext.Ajax.on('requestcomplete', function(conn, response, options) {
	if (typeof options.requestcomplete === 'function') {
		return options.requestcomplete.apply(this, [response])
	}
});

Ext.Ajax.on('beforerequest', function(conn, options) {
	if (typeof options.beforerequest === 'function') {
		return options.beforerequest.apply(this, [options])
	} else {
		return true;
	}
});

// 重写ext json encodeDate方法
Ext.JSON.encodeDate = function(o) {
	return '"' + Ext.Date.format(o, 'c') + '"';
}