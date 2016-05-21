Ext.define('HPSPDM.view.part.partManage.Grid', {
	extend: 'Ext.ux.component.grid.Grid',
	alias: 'widget.partManageGrid',
	store: 'HPSPDM.store.part.PartManage',
	requires: ['Ext.ux.component.button.LinkButton'],
	rownumberer: true,
	tbar: [{
		xtype: 'button',
		text: '添加',
		action: 'create',
		iconCls: 'icon-min-add',
		handler: function(that) {
			this.up("grid").toolbarButtonsClick(that);
		}
	}, '-', {
		xtype: 'button',
		text: '发布',
		action: 'publish',
		disabled: true,
		singleSelectEnable: true,
		iconCls: 'icon-min-edit',
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
			return '<a href="' + url + '" target="_blank">详情</a>'
		}
	}, {
		text: '配件浩配编号',
		dataIndex: '',
		locked: true,
		width: 260
	}, {
		text: '配件名称',
		dataIndex: '',
		locked: true,
		width: 120
	}, {
		text: '配件供应商编号',
		dataIndex: '',
		width: 120
	}, {
		text: '供应商编号',
		dataIndex: '',
		width: 120
	}, {
		text: '供应商名称',
		dataIndex: '',
		width: 120
	}, {
		text: '配件厂家编号',
		dataIndex: '',
		width: 120
	}, {
		text: '配件品牌',
		dataIndex: '',
		width: 120
	}, {
		text: '单位',
		dataIndex: '',
		width: 120
	}, {
		text: '备注',
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