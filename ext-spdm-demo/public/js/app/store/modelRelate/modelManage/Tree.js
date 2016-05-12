Ext.define('SPDM.store.modelRelate.Tree', {
	extend: 'Ext.data.TreeStore',
	model: 'SPDM.model.modelRelate.Tree',
	autoLoad: false,
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},
	proxy: {
		type: 'ajax',
		url: SPDM.globalConfig.path + '/standardname/menu',
		reader: {
			type: 'json',
			root: 'children'
		}
	},
	listeners: {
		beforeload: function(store, operation, ops) {
			var me = this,
				controller = me.getController('modelRelate.ModelManage');

			store.proxy.url = controller.baseDomainUrl + 'menu';
		}
	},

	root: {
		expanded: true,
		text: '配件结构标准名称'
	}
});