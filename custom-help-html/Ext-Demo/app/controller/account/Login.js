Ext.define('DEMO.controller.account.Login', {
	extend: 'Ext.app.Controller',
	refs: [{
		ref: 'list',
		selector: 'grid'
	}],
	views: ['account.Viewport'],
	requires: ['Ext.util.JSONP'],
	init: function() {
		var me = this;
		me.initEvents();
	},
	initEvents: function() {
		var me = this;
		me.control({
			'viewport': {
				afterrender: function() {
					console.log('viewport afterrender')
					var dropdown = Ext.create('Ext.button.Split', {
						renderTo: Ext.getBody(),
						text: 'Options',
						// handle a click on the button itself
						handler: function() {
							alert("The button was clicked");
						},
						arrowHandler: function() {
							alert("arrowHandler");
						},
						menu: {
							items: [
								// these will render as dropdown menu items when the arrow is clicked:
								{
									text: 'Item 1',
									handler: function() {
										alert("Item 1 clicked");
										console.log(this)
									}
								}, {
									text: 'Item 2',
									handler: function() {
										alert("Item 2 clicked");
									}
								}
							]
						}
					});
					Ext.getCmp("viewport-login").down('form').add(dropdown);

					me.testAjax();
				}
			}
		});
	},

	testAjax: function() {
		var me = this;

		Ext.data.JsonP.request({
			url: 'http://lookup.servision.com.cn/location/provinces', // 'http://lookup.servision.com.cn/location/provinces',
			timeout: 300000,
			params: {
				format: 'json',
				tags: 'ExtJS, Screenshot',
				tagmode: 'all',
				lang: 'en-us'
			},
			callbackKey: "jsoncallback",
			success: function(result) {
				debugger;
				if (result.rettype == 'true') {
					me.Comet.privateToken = result.msg;
					me.RegisterComet();
				} else {
					alert(result.msg);
				}
			},
			failure: function(result) {
				debugger;
				alert(result);
			}
		});

		// Ext.Ajax.request({
		// 	url: 'http://lookup.servision.com.cn', // 'http://localhost/tool/custom-help-html/Ext-Demo/db/user.json',
		// 	cors: true,
		// 	timeout: 30 * 1000,
		// 	success: function(ret) {
		// 		console.log(Ext.decode(ret.responseText));

		// 	},
		// 	failure: function() {}
		// });
		// 


		//debugger;
		//引用JSONP.js
		// Ext.util.JSONP.request('http://api.flickr.com/services/feeds/photos_public.gne', {
		// 	callbackKey: 'jsoncallback',
		// 	params: {
		// 		format: 'json',
		// 		tags: 'ExtJS, Screenshot',
		// 		tagmode: 'all',
		// 		lang: 'en-us'
		// 	},
		// 	callback: function() {
		// 		console.log(arguments)
		// 	}
		// });

	}
});