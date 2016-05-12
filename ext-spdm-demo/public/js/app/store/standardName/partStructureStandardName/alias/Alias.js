Ext.define('SPDM.store.standardName.partStructureStandardName.alias.Alias', {
	extend: 'Ext.ux.store.Base',
	model: 'SPDM.model.standardName.partStructureStandardName.alias.Alias',
	isUpload: true,
	proxyAPI: {
		read: SPDM.globalConfig.path + '/standardName/node/alias/list'
	},
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
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
			controller = me.getController('standardName.PartStructureStandardName');
		me.proxy.api.read = controller.baseDomainUrl + 'node/alias/list';
	}
});