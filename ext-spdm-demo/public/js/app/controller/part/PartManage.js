Ext.define('HPSPDM.controller.part.PartManage', {
	extend: 'Ext.ux.controller.CRUD',
	init: function() {
		var me = this;

		me.callParent(arguments);
	},
	controllerReady: function() {
		var me = this;
		var grid = me.getGrid();
		grid.on({
			'toolbarclick': function(that) {
				alert(that.action);
			}
		});

	}
});