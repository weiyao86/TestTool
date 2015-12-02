Ext.define('DEMO.store.tree.tree', {
	extend: 'Ext.data.TreeStore',
	model: 'DEMO.model.tree.tree',
	autoLoad: true,
	proxy: {
		type: 'ajax',
		url: DEMO.globalConfig.path + '/standardname/2/menu',
		render: {
			type: 'json',
			root: 'children'
		}
	},
	listeners: {
		beforeload: function(store, operation, ops) {
			var me = this;
			//store.proxy.url = DEMO.globalConfig.path + '/standardname/2/menu';
		}
	},
	root: {
		expanded: true,
		text: "Root"
	}

});