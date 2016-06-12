Ext.define('DEMO.view.tree.viewport', {
	extend: 'Ext.container.Viewport',
	requires: ['DEMO.view.tree.tree', 'DEMO.view.tree.login', 'Ext.util.MD5'],
	layout: {
		type: 'border'
	},
	defaults: {
		width: "100%"
	},
	items: [{
		region: 'north',
		border: true,
		title: 'Header',
		items: [{
			xtype: 'loginForm',
			id: 'login-form-panel'
		}]
	}, {
		region: 'west',
		split: true,
		title: "Tree",
		width: "30%",
		height: '100%',
		layout: 'fit',
		items: [{
			xtype: 'treeDemo',
			itemId: 'tree'
		}]
	}, {
		region: "center",
		title: "center",
		collapsible: false,
		border: true,
		items: []
	}]
});