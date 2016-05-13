Ext.define('HPSPDM.view.account.userManage.Edit', {
	extend: 'Ext.ux.component.edit.Edit',
	title: '用户管理',
	items: [{
		items: [{
			fieldLabel: '用户名'
		}, {
			fieldLabel: '用户描述',
			allowBlank: true
		}, {
			xtype: 'radiogroup',
			fieldLabel: '状态',
			columns: 2,
			allowBlank: false,
			blankText: '必须选择一个',
			items: [{
				name: 'r1',
				boxLabel: '启用',
				inputValue: 1
			}, {
				name: 'r1',
				boxLabel: '禁用',
				inputValue: 2
			}],
			listeners: {
				change: function(that, newval, oldval, opts) {
					alert(newval.r1)
				}
			}
		}, {
			xtype: 'fieldset',
			title: '权限分配'
		}]
	}]
});