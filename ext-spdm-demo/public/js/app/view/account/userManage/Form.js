Ext.define('SPDM.view.account.userManage.Form', {
	extend: 'Ext.ux.component.filter.Query',
	alias: 'widget.userForm',
	requires: ['Ext.ux.component.combo.BaseCombo'],
	items: [{
		xtype: 'form',
		items: [{
			fieldLabel: '用户名',
			name: ''
		}, {
			fieldLabel: '用户描述',
			name: ''
		}, {
			xtype: 'basecombo',
			fieldLabel: '状态',
			name: '',
			value: '2',
			localData: [{
				name: '全部',
				code: '2'
			}, {
				name: '启用',
				code: '1'
			}, {
				name: '禁用',
				code: '0'
			}]
		}]
	}]
});