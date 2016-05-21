Ext.define('HPSPDM.view.suppliers.supplierInfoPart.Form', {
	extend: 'Ext.ux.component.filter.Query',
	alias: 'widget.supplierInfoPartForm',
	requires: ['Ext.ux.component.combo.BaseCombo'],
	items: [{
		xtype: 'form',
		layout: 'column',
		defaults: {
			xtype: 'textfield',
			margin: '5 10 5 0'
		},
		items: [{
			fieldLabel: '供应商编号',
			name: ''
		}, {
			fieldLabel: '供应商名称',
			name: ''
		}, {
			fieldLabel: '配件浩配编号',
			name: ''
		}, {
			fieldLabel: '配件名称',
			name: ''
		}, {
			fieldLabel: '配件供应商编号',
			name: ''
		}, {
			fieldLabel: '配件厂家编号',
			name: ''
		}, {
			fieldLabel: '配件品牌',
			xtype: 'basecombo',
			name: '',
			value: '2',
			displayFormat: '',
			localData: [{
				name: '全部',
				code: '2'
			}, {
				name: '品牌A',
				code: '1'
			}, {
				name: '品牌B',
				code: '0'
			}]
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