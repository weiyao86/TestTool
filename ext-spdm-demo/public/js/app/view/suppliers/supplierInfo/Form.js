Ext.define('HPSPDM.view.suppliers.supplierInfo.Form', {
	extend: 'Ext.ux.component.filter.Query',
	alias: 'widget.supplierInfoForm',
	requires: ['Ext.ux.component.combo.BaseCombo'],
	items: [{
		xtype: 'form',
		items: [{
			fieldLabel: '供应商编号',
			name: ''
		}, {
			fieldLabel: '供应商名称',
			name: ''
		}, {
			xtype: 'basecombo',
			fieldLabel: '状态',
			name: '',
			value: '2',
			displayFormat: '',
			localData: [{
				name: '全部',
				code: '2'
			}, {
				name: '正常',
				code: '1'
			}, {
				name: '无效',
				code: '0'
			}]
		}]
	}]
});