Ext.define('HPSPDM.view.suppliers.supplierInfo.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'HPSPDM.view.suppliers.supplierInfo.Edit',
		'HPSPDM.view.suppliers.supplierInfo.Form',
		'HPSPDM.view.suppliers.supplierInfo.Grid'
	],
	defaults: {
		border: false
	},
	items: [{
		region: 'north',
		xtype: 'supplierInfoForm',
		overflowX: 'auto',
		width: '100%',
		border: false,
		minHeight: 70,
		split: true
	}, {
		region: 'center',
		xtype: 'supplierInfoGrid'
	}]

});