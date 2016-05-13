Ext.define('HPSPDM.view.account.userManage.Grid', {
	extend: 'Ext.ux.component.grid.Grid',
	alias: 'widget.userGrid',
	store: 'HPSPDM.store.account.Users',
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
		text: '重置密码',
		action: 'resetpwd',
		iconCls: 'icon-min-edit',
		handler: function(that) {
			this.up("grid").toolbarButtonsClick(that);
		}
	}, '-', {
		xtype: 'button',
		text: '查看权限',
		action: 'view',
		iconCls: 'icon-find',
		handler: function(that) {
			this.up("grid").toolbarButtonsClick(that);
		}
	}],
	columns: [{
		text: '用户名',
		dataIndex: '',
		locked: true,
		width: 260
	}, {
		text: '用户描述',
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