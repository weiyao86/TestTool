Ext.define('SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBasicPS', {
	extend: 'Ext.form.Panel',
	alias: 'widget.partstructurestandardnamepropertybasicpropertybasicps',
	requires: ['SPDM.view.common.combo.ExtendBaseCombo', 'Ext.ux.plugin.LabelRequired'],
	plugins: ['formlabelrequired'],
	border: false,
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},

	afterRender: function() {
		var me = this;

		me.controller = me.getController('modelRelate.ModelManage');

		me.callParent(arguments);
	},
	load: function(id) {
		var me = this;

		Ext.util.ajax({
			url: me.controller.baseDomainUrl + 'node/basic/info',
			params: {
				id: id
			},
			disableCaching: true,
			beforerequest: function() {
				me.up().setLoading(true);
			},
			callback: function() {
				me.up().setLoading(false);
			},
			success: function(root) {
				me.getForm().setValues(root.result);
			}
		});
	},
	save: function(callback) {
		var me = this,
			form = me.getForm(),
			params = form.getFieldValues();
		if (form.isValid()) {
			Ext.util.ajax({
				url: me.controller.baseDomainUrl + 'node/basic/edit',
				method: 'POST',
				jsonData: params,
				beforerequest: function() {
					me.up().setLoading(true);
				},
				callback: function() {
					me.up().setLoading(false);
				},
				success: function(rpt) {
					if (typeof callback === 'function') {
						callback.apply();
					}
					Ext.Msg.alert('提示', "保存成功!");
				}
			});
		}
	},
	width: '100%',
	defaults: {
		layout: 'column',
		defaultType: 'textfield',
		margin: '0 0 10 0',
		bodyPadding: '10 10 5 10',
		defaults: {
			xtype: 'displayfield',
			columnWidth: 0.50,
			margin: '0 0 5 0',
			labelAlign: 'right',
			disabled: false,
			labelPad: 25
		}
	},
	items: [{
		title: '基本属性',
		items: [{
			fieldLabel: 'ID',
			name: 'id',
			value: ''
		}, {
			fieldLabel: '顺序',
			name: 'sort',
			value: ''
		}, {
			xtype: 'textfield',
			fieldLabel: '名称(中文)',
			name: 'namezh',
			allowBlank: false,
			value: ''
		}, {
			xtype: 'textfield',
			fieldLabel: '名称(英文)',
			name: 'nameen',
			value: ''
		}, {
			xtype: 'textfield',
			fieldLabel: '首字母(中文)',
			name: 'initiazh',
			value: ''
		}, {
			xtype: 'textfield',
			fieldLabel: '首字母(英文)',
			name: 'initiaen',
			value: ''
		}, {
			xtype: 'textfield',
			fieldLabel: '备注(中文)',
			name: 'notezh',
			value: ''
		}, {
			xtype: 'textfield',
			fieldLabel: '备注(英文)',
			name: 'noteen',
			value: ''
		}, {
			xtype: 'textfield',
			fieldLabel: '维护备注',
			name: 'remark',
			columnWidth: 1,
			value: ''
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '关注级别',
			name: 'attlevId',
			url: '{domainUrl}attlev/list'

		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '单位',
			name: 'unitId',
			allowBlank: false,
			url: '{domainUrl}unit/list'
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '开发属性',
			name: 'devattId',
			allowBlank: false,
			url: '{domainUrl}devatt/list'
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '是否保养件',
			name: 'mapa',
			allowBlank: false,
			localData: [{
				name: '是',
				code: '1'
			}, {
				name: '否',
				code: '0'
			}],
			allText: '空',
			allValue: '',
			withAll: true
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '是否事故件',
			name: 'acpa',
			allowBlank: false,
			localData: [{
				name: '是',
				code: '1'
			}, {
				name: '否',
				code: '0'
			}],
			allText: '空',
			allValue: '',
			withAll: true
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '是否维修件',
			name: 'sepa',
			allowBlank: false,
			localData: [{
				name: '是',
				code: '1'
			}, {
				name: '否',
				code: '0'
			}],
			allText: '空',
			allValue: '',
			withAll: true
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '是否易损件',
			name: 'edpa',
			allowBlank: false,
			localData: [{
				name: '是',
				code: '1'
			}, {
				name: '否',
				code: '0'
			}],
			allText: '空',
			allValue: '',
			withAll: true
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '是否快流件',
			name: 'ffpa',
			allowBlank: false,
			localData: [{
				name: '是',
				code: '1'
			}, {
				name: '否',
				code: '0'
			}],
			allText: '空',
			allValue: '',
			withAll: true
		}]
	}, {
		title: '本体相关',
		items: [{
			fieldLabel: '创建时间',
			name: 'createdDate',
			value: ''
		}, {
			fieldLabel: '创建者',
			name: 'createdBy',
			value: ''
		}, {
			fieldLabel: '修改时间',
			name: 'modifiedDate',
			value: ''
		}, {
			fieldLabel: '修改者',
			name: 'modifiedBy',
			value: ''
		}]
	}, {
		title: '关联相关',
		items: [{
			fieldLabel: '创建时间',
			name: 'refCreatedDate',
			value: ''
		}, {
			fieldLabel: '创建者',
			name: 'refCreatedBy',
			value: ''
		}, {
			fieldLabel: '修改时间',
			name: 'refModifiedDate',
			value: ''
		}, {
			fieldLabel: '修改者',
			name: 'refModifiedBy',
			value: ''
		}]
	}]
});