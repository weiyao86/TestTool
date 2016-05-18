Ext.define('HPSPDM.controller.part.PartDetail', {
	extend: 'Ext.app.Controller',
	views: [
		'part.partDetail.Viewport'
	],
	init: function() {
		var me = this;
		me.initEvents();
		me.callParent(arguments);
	},
	initEvents: function() {
		var me = this;
		me.control({
			"viewport": {
				afterrender: function() {}
			},
			"#part_detail [itemId]": {
				click: function(that, e) {
					// var me = this;
					// var itemId = that.itemId;
					// if (itemId == "add_photo") {
					// 	me.appendPhoto(that);
					// } else if (itemId == "del_photo") {}
				}
			}
		});
	},

	appendPhoto: function(btn) {
		var me = this,
			panel = Ext.fly(btn.up('panel').el.dom).select('ul li').last();

		console.log(me);
	}
});