Ext.define('HPSPDM.view.home.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	border: false,
	layout: 'fit',
	items: [{
		layout: {
			type: 'vbox',
			align: 'stretch',
			pack: 'center'
		},
		width: '100%',
		items: [{
			border: false,
			style: 'text-align:center;',
			html: '<h2>欢迎使用浩配贸易主数据管理系统，请选择左侧菜单栏的相应功能！</h2>'
		}]
	}]

});