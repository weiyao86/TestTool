Ext.define('HPSPDM.view.oem.oemUsage.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'HPSPDM.view.oem.oemUsage.Form',
		'HPSPDM.view.oem.oemUsage.Grid'
	],
	defaults: {
		border: false
	},
	items: [{
		region: 'north',
		xtype: 'oemUsageForm',
		overflowX: 'auto',
		width: '100%',
		border: false,
		minHeight: 70,
		split: true
	}, {
		region: 'center',
		xtype: 'oemUsageGrid'
	}]

});