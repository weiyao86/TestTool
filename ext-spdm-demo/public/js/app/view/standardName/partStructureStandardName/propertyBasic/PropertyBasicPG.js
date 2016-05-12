Ext.define('SPDM.view.standardName.partStructureStandardName.propertyBasic.PropertyBasicPG', {
	extend: 'Ext.form.Panel',
	alias: 'widget.partstructurestandardnamepropertybasicpropertybasicpg',
	border: false,
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},
	requires: ['Ext.ux.plugin.LabelRequired'],
	plugins: ['formlabelrequired'],
	afterRender: function() {
		var me = this;

		me.controller = me.getController('standardName.PartStructureStandardName');

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
			name: 'id'
		}, {
			xtype: 'textfield',
			fieldLabel: '名称(中文)',
			allowBlank: false,
			name: 'namezh'
		}, {
			xtype: 'textfield',
			fieldLabel: '名称(英文)',
			name: 'nameen'
		}, {
			xtype: 'textfield',
			fieldLabel: '首字母(中文)',
			name: 'initiazh',
		}, {
			xtype: 'textfield',
			fieldLabel: '首字母(英文)',
			name: 'initiaen'
		}, {
			xtype: 'textfield',
			fieldLabel: '备注(中文)',
			name: 'notezh'
		}, {
			xtype: 'textfield',
			fieldLabel: '备注(英文)',
			name: 'noteen'
		}, {
			xtype: 'textfield',
			fieldLabel: '维护备注',
			columnWidth: 1,
			name: 'remark'
		}]
	}, {
		title: '本体相关',
		items: [{
			fieldLabel: '创建时间',
			name: 'createdDate'
		}, {
			fieldLabel: '创建者',
			name: 'createdBy'
		}, {
			fieldLabel: '修改时间',
			name: 'modifiedDate'
		}, {
			fieldLabel: '修改者',
			name: 'modifiedBy'
		}]
	}, {
		title: '关联相关',
		items: [{
			fieldLabel: '创建时间',
			name: 'refCreatedDate'
		}, {
			fieldLabel: '创建者',
			name: 'refCreatedBy'
		}, {
			fieldLabel: '修改时间',
			name: 'refModifiedDate'
		}, {
			fieldLabel: '修改者',
			name: 'refModifiedBy'
		}]
	}]
});