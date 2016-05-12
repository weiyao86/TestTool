Ext.define('SPDM.view.common.class.Base', {
	getUrlParams: function() {
		var me = this,
			urlParams = Ext.Object.fromQueryString(window.location.search);

		return urlParams;
	},

	getMainController: function(){

		if (SPDM.app.controllers.items.length > 0){
			return SPDM.app.controllers.items[0];
		};
	},

	getController: function(controllerPath) {
		return SPDM.app.getController(controllerPath);
	}
});