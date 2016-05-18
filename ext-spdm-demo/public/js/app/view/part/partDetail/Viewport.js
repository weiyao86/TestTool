Ext.define('HPSPDM.view.part.partDetail.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: ['HPSPDM.view.part.partDetail.headerDetail'],
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	border: false,
	minWidth: 980,
	overflowX: 'auto',
	id: 'part_detail',
	items: [{
		xtype: 'headerDetail'
	}]
});