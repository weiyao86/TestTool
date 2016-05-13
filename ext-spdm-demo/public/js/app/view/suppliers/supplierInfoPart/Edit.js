Ext.define('HPSPDM.view.suppliers.supplierInfoPart.Edit', {
	extend: 'Ext.ux.component.edit.Edit',
	title: '供应商',
	items: [{
		items: [{
			fieldLabel: '供应商编号'
		}, {
			fieldLabel: '供应商名称'
		}, {
			xtype: 'fieldcontainer',
			fieldLabel: '所在地区',
			layout: 'hbox',
			defaults: {
				type: 'basecombo',
				margin: '0 5 0 0'
			},
			allowBlank: true,
			items: [{
				xtype: 'basecombo',
				name: 'a',
				flex: 1,
				emptyText: '选择省份',
				displayFormat: '',
				clearFields: ['b', 'c'],
				localData: [{
					name: '上海',
					code: '2'
				}, {
					name: '北京',
					code: '1'
				}, {
					name: '重庆',
					code: '0'
				}]
			}, {
				xtype: 'basecombo',
				name: 'b',
				flex: 1,
				emptyText: '选择城市',
				displayFormat: '',
				dependField: 'a',
				clearFields: ['c'],
				localData: [{
					name: '上海',
					code: '2'
				}, {
					name: '北京',
					code: '1'
				}, {
					name: '重庆',
					code: '0'
				}]
			}, {
				xtype: 'basecombo',
				name: 'c',
				flex: 1,
				emptyText: '选择区域',
				dependField: 'b',
				displayFormat: '',
				margin: 0,
				localData: [{
					name: '上海',
					code: '2'
				}, {
					name: '北京',
					code: '1'
				}, {
					name: '重庆',
					code: '0'
				}]
			}]
		}, {
			fieldLabel: '详细地址',
			allowBlank: true,
			name: ''
		}, {
			fieldLabel: '联系人',
			allowBlank: true,
			name: ''
		}, {
			fieldLabel: '联系方式',
			allowBlank: true,
			name: ''
		}, {
			fieldLabel: '负责人',
			allowBlank: true,
			name: ''
		}, {
			xtype: 'textareafield',
			allowBlank: true,
			fieldLabel: '备注',
			anchor: '100%',
			name: ''
		}, {
			fieldLabel: '维护人员',
			xtype: 'basecombo',
			name: 'ac',
			displayFormat: '',
			localData: [{
				name: '钉',
				code: '2'
			}, {
				name: '北京',
				code: '1'
			}, {
				name: '重庆',
				code: '0'
			}]
		}, {
			xtype: 'radiogroup',
			fieldLabel: '状态',
			columns: 2,
			allowBlank: false,
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