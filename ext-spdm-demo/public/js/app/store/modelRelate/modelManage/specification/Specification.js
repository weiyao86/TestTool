Ext.define('SPDM.store.modelRelate.modelManage.specification.Specification', {
	extend: 'Ext.ux.store.Base',
	model: 'SPDM.model.modelRelate.modelManage.specification.Specification',
	isUpload: true,
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},

	proxyAPI: {
		read: SPDM.globalConfig.path + '/standardName/node/spec/list'
	},

	constructor: function() {
		var me = this;

		me.callParent(arguments);

		me.on('beforeload', function() {
			me.buildProxyAPI();
		});
	},


	buildProxyAPI: function() {
		var me = this,
			controller = me.getController('modelRelate.ModelManage');
		me.proxy.api.read = controller.baseDomainUrl + 'node/spec/list';
	}
});