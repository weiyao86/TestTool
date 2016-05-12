Ext.define('SPDM.view.account.userManage.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'SPDM.view.account.userManage.Form',
		'SPDM.view.account.userManage.Grid'
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