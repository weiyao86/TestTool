Ext.define('HPSPDM.view.suppliers.supplierInfoPart.Grid', {
	extend: 'Ext.ux.component.grid.Grid',
	alias: 'widget.supplierInfoPartGrid',
	store: 'HPSPDM.store.suppliers.SupplierInfoPart',
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
	}, '-', {
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