Ext.define('HPSPDM.view.part.partDetail.headerDetail', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.headerDetail',
	requires: ['HPSPDM.view.part.partDetail.headerUp.headerImg', 'HPSPDM.view.part.partDetail.headerUp.partInfo'],
	border: false,
	items: [{
		xtype: 'panel',
		itemId: 'detail_item',
		border: false,
		defaults: {
			border: false
		},
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		items: [{
			title: '配件详情',
			border: false
		}, {
			layout: 'hbox',
			items: [{
				itemId: 'header_img_operator',
				flex: 1,
				xtype: 'headerUpHeaderImgOperator'

			}, {
				itemId: 'detail_data',
				xtype: 'headerUpPartInfo',
				border: false,
				style: 'border:1px solid #ddd;',
				flex: 1
			}]
		}]
	}]
});