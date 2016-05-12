Ext.define('SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBaseReport', {
	extend: 'Ext.window.Window',
	title: '关联失败的编码',
	alias: 'widget.basereport',
	width: 450,
	maxHeight: 500,
	closable: true,
	modal: true,
	resizable: false,
	constrainHeader: true,
	layout: "fit",
	closeAction: 'destroy',
	width: 450,
	maxHeight: 500,
	bodyStyle: 'padding:20px;background:#fff;',
	items: [{
			xtype: 'form',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			bodyStyle: {
				background: '#fff'
			},
			bodyPadding: '10 10 5 10',
			autoScroll: true,
			border: false,
			items: [{
				xtype: 'textareafield',
				height: 130,
				readOnly: true,
				name: 'failurecodes'
			}]
		}]
		//dockedItems:[]
});