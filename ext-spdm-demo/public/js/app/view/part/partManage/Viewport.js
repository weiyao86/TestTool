Ext.define('HPSPDM.view.part.partManage.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'HPSPDM.view.part.partManage.Edit',
		'HPSPDM.view.part.partManage.Form',
		'HPSPDM.view.part.partManage.Grid'
	],
	defaults: {
		border: false
	},
	items: [{
		region: 'north',
		xtype: 'partManageForm',
		overflowX: 'auto',
		width: '100%',
		border: false,
		minHeight: 70,
		split: true
	}, {
		region: 'center',
		xtype: 'partManageGrid'
	}]

});