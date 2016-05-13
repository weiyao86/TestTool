Ext.define('HPSPDM.view.account.userManage.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'HPSPDM.view.account.userManage.Edit',
		'HPSPDM.view.account.userManage.Form',
		'HPSPDM.view.account.userManage.Grid'
	],
	defaults: {
		border: false
	},
	items: [{
		region: 'north',
		xtype: 'userForm',
		overflowX: 'auto',
		width: '100%',
		border: false,
		minHeight: 70,
		split: true
	}, {
		region: 'center',
		xtype: 'userGrid'
	}]

});