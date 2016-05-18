Ext.define('HPSPDM.view.oem.oemUsage.Grid', {
	extend: 'Ext.ux.component.grid.Grid',
	alias: 'widget.oemUsageGrid',
	store: 'HPSPDM.store.oem.OemUsage',
	requires: ['Ext.ux.component.button.LinkButton'],
	rownumberer: true,
	tbar: [{
		xtype: 'button',
		text: '导入',
		action: 'inport',
		disabled: true,
		singleSelectEnable: true,
		iconCls: 'icon-upload',
		handler: function(that) {
			this.up("grid").toolbarButtonsClick(that);
		}
	}, '-', {
		xtype: 'button',
		text: '导入模板下载',
		action: 'template-download',
		disabled: true,
		singleSelectEnable: true,
		iconCls: 'icon-arrow-down',
		handler: function(that) {
			this.up("grid").toolbarButtonsClick(that);
		}
	}],
	columns: [{
		text: '操作',
		dataIndex: 'code',
		width: 60,
		locked: true,
		renderer: function(data, metadata, record) {
			var url = '/partdetail?code=' + record.get('code');
			return '<a href="' + url + '" target="_blank">用法</a>';
		}
	}, {
		text: 'OEM主机厂',
		dataIndex: '',
		width: 260
	}, {
		text: 'OEM配件编号',
		dataIndex: '',
		width: 120
	}, {
		text: 'OEM配件名称',
		dataIndex: '',
		width: 120
	}, {
		text: '状态',
		dataIndex: '',
		width: 120
	}, {
		text: '创建人',
		dataIndex: '',
		width: 120
	}, {
		text: '创建时间',
		dataIndex: '',
		width: 120
	}, {
		text: '修改人',
		dataIndex: '',
		width: 120
	}, {
		text: '修改时间',
		dataIndex: '',
		width: 120
	}]
});