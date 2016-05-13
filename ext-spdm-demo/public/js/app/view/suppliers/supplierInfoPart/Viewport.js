Ext.define('HPSPDM.view.suppliers.supplierInfoPart.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'HPSPDM.view.suppliers.supplierInfoPart.Edit',
		'HPSPDM.view.suppliers.supplierInfoPart.Form',
		'HPSPDM.view.suppliers.supplierInfoPart.Grid'
	],
	defaults: {
		border: false
	},
	items: [{
		region: 'north',
		xtype: 'supplierInfoPartForm',
		overflowX: 'auto',
		width: '100%',
		border: false,
		minHeight: 70,
		split: true
	}, {
		region: 'center',
		xtype: 'supplierInfoPartGrid'
	}]

});