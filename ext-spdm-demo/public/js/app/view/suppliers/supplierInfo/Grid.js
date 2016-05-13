Ext.define('HPSPDM.view.suppliers.supplierInfo.Grid', {
	extend: 'Ext.ux.component.grid.Grid',
	alias: 'widget.supplierInfoGrid',
	store: 'HPSPDM.store.suppliers.SupplierInfo',
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
		text: '修改',
		action: 'update',
		disabled: true,
		singleSelectEnable: true,
		iconCls: 'icon-min-edit',
		handler: function(that) {
			this.up("grid").toolbarButtonsClick(that);
		}
	}],
	columns: [{
		text: '供应商编号',
		dataIndex: '',
		locked: true,
		width: 260
	}, {
		text: '供应商名称',
		dataIndex: '',
		width: 120
	}, {
		text: '维护人员',
		dataIndex: '',
		width: 120
	}, {
		text: '状态',
		dataIndex: '',
		width: 120
	}, {
		text: '省份',
		dataIndex: '',
		width: 120
	}, {
		text: '城市',
		dataIndex: '',
		width: 120
	}, {
		text: '区域',
		dataIndex: '',
		width: 120
	}, {
		text: '详细地址',
		dataIndex: '',
		width: 120
	}, {
		text: '联系人',
		dataIndex: '',
		width: 120
	}, {
		text: '联系方式',
		dataIndex: '',
		width: 120
	}, {
		text: '负责人',
		dataIndex: '',
		width: 120
	}, {
		text: '备注',
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