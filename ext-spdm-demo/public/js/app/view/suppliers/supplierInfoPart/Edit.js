Ext.define('HPSPDM.view.suppliers.supplierInfoPart.Edit', {
	extend: 'Ext.ux.component.edit.Edit',
	title: '供应商',
	items: [{
		items: [{
			fieldLabel: '配件浩配编号',
			name: '',
			readOnlyCls: 'disable-cls',
			readOnly: true,
			allowBlank: true
		}, {
			fieldLabel: '配件名称'
		}, {
			xtype: 'basecombo',
			fieldLabel: '供应商',
			name: '',
			displayFormat: '',
			localData: [{
				name: '供应商A',
				code: '2'
			}, {
				name: '供应商B',
				code: '1'
			}]
		}, {
			fieldLabel: '配件供应商编号',
			allowBlank: true,
			name: ''
		}, {
			fieldLabel: '配件厂家编号',
			allowBlank: true,
			name: ''
		}, {
			fieldLabel: '配件品牌',
			allowBlank: true,
			xtype: 'basecombo',
			name: '',
			displayFormat: '',
			localData: [{
				name: '配件品牌A',
				code: '2'
			}, {
				name: '配件品牌B',
				code: '1'
			}]
		}, {
			fieldLabel: '单位',
			allowBlank: true,
			name: ''
		}, {
			xtype: 'textareafield',
			allowBlank: true,
			fieldLabel: '备注',
			anchor: '100%',
			name: ''
		}, {
			xtype: 'radiogroup',
			fieldLabel: '状态',
			columns: 2,
			allowBlank: true,
			blankText: '必须选择一个',
			items: [{
				name: 'r1',
				boxLabel: '正常',
				inputValue: 1
			}, {
				name: 'r1',
				boxLabel: '无效',
				inputValue: 2
			}],
			listeners: {
				change: function(that, newval, oldval, opts) {
					alert(newval.r1);
				}
			}
		}]
	}]
});