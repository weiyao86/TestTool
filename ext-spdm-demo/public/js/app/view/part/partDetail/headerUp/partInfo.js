Ext.define('HPSPDM.view.part.partDetail.headerUp.partInfo', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.headerUpPartInfo',
	requires: ['Ext.ux.plugin.LabelRequired', 'Ext.ux.component.combo.BaseCombo'],
	plugins: ['formlabelrequired'],
	border: false,
	layout: 'vbox',
	bodyPadding: '5 10',
	defaults: {
		border: false
	},
	items: [{
		xtype: 'form',
		layout: 'column',
		width: '100%',
		height: 388,
		defaults: {
			xtype: 'textfield',
			margin: '5',
			labelWidth: 100,
			columnWidth: 0.45
		},
		items: [{
			fieldLabel: '配件浩配编号',
			cls: 'disable-cls',
			readOnly: true,
			value: "show",
			name: ''
		}, {
			fieldLabel: '配件供应商编号',
			value: "show",
			name: ''
		}, {
			fieldLabel: '发布状态',
			cls: 'disable-cls',
			readOnly: true,
			value: "发布状态",
			allowBlank: false,
			name: ''
		}, {
			fieldLabel: '供应商编号',
			value: "",
			name: ''
		}, {
			fieldLabel: '配件状态',
			xtype: 'basecombo',
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
		}, {
			fieldLabel: '供应商名称',
			value: "",
			name: ''
		}, {
			fieldLabel: '配件名称',
			value: "",
			name: ''
		}, {
			fieldLabel: '配件厂家编号',
			value: "",
			name: ''
		}, {
			fieldLabel: '配件单位',
			value: "",
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
			fieldLabel: '长',
			value: "",
			name: ''
		}, {
			fieldLabel: '配件大组',
			xtype: 'basecombo',
			name: '',
			value: '2',
			displayFormat: '',
			localData: [{
				name: '全部',
				code: '2'
			}, {
				name: '组A',
				code: '1'
			}, {
				name: '组B',
				code: '0'
			}]
		}, {
			fieldLabel: '宽',
			value: "",
			name: ''
		}, {
			fieldLabel: '配件小组',
			xtype: 'basecombo',
			name: '',
			value: '2',
			displayFormat: '',
			localData: [{
				name: '全部',
				code: '2'
			}, {
				name: '组A',
				code: '1'
			}, {
				name: '组B',
				code: '0'
			}]
		}, {
			fieldLabel: '高',
			value: "",
			name: ''
		}, {
			fieldLabel: '标准名称',
			xtype: 'basecombo',
			name: '',
			value: '2',
			displayFormat: '',
			localData: []
		}, {
			fieldLabel: '重量',
			value: "",
			name: ''
		}, {
			fieldLabel: '备用字段1',
			value: "",
			name: ''
		}, {
			fieldLabel: '备用字段2',
			value: "",
			name: ''
		}, {
			xtype: 'panel',
			border: false,
			style: 'text-align:right;',
			items: [{
				xtype: 'button',
				text: "保存",
				width: 100,
				scale: 'medium',
				name: '',
				handler: function() {
					alert('save');
				}
			}]
		}, {
			xtype: 'panel',
			border: false,
			style: 'text-align:center;',
			columnWidth: 1,
			items: [{
				xtype: 'button',
				text: "保存并提交",
				scale: 'medium',
				name: '',
				handler: function() {
					alert('保存并提交');
				}
			}]
		}]
	}],

	constructor: function() {
		var me = this;
		me.callParent(arguments);
		// me.autoMetricsLabelWidth();
	},

	autoMetricsLabelWidth: function() {
		var me = this,
			boxWidth = 120,
			labelPad = 5,
			fields = me.query("field"),
			tm = new Ext.util.TextMetrics();

		Ext.each(fields, function(item) {
			var labelWidth = tm.getWidth(item.fieldLabel + '：*');
			console.log(labelWidth);
			if (item.range == 'end') {
				item.labelWidth = 0;
				item.width = boxWidth;
			} else {
				item.labelWidth = labelWidth;
				item.width = labelWidth + boxWidth + labelPad;
			}
		});
	}
});