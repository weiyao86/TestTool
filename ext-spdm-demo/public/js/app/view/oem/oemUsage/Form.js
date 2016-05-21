Ext.define('HPSPDM.view.oem.oemUsage.Form', {
	extend: 'Ext.ux.component.filter.Query',
	alias: 'widget.oemUsageForm',
	requires: ['Ext.ux.component.combo.BaseCombo'],
	items: [{
		xtype: 'form',
		layout: 'column',
		defaults: {
			xtype: 'textfield',
			margin: '5 10 5 0'
		},
		items: [{
			fieldLabel: 'OEM主机厂',
			name: ''
		}, {
			fieldLabel: 'OEM配件编号',
			name: ''
		}, {
			fieldLabel: 'OEM配件名称',
			name: ''
		}, {
			fieldLabel: '状态',
			xtype: 'basecombo',
			name: '',
			value: '2',
			displayFormat: '',
			localData: [{
				name: '新件',
				code: '2'
			}, {
				name: '草稿',
				code: '1'
			}, {
				name: '已提交',
				code: '0'
			}]
		}]
	}]
});