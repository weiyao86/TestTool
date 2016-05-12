Ext.define('SPDM.view.standardName.partStructureStandardName.propertyBasic.PropertyBasicAS', {
	extend: 'Ext.form.Panel',
	alias: 'widget.partstructurestandardnamepropertybasicpropertybasicas',
	requires: ['SPDM.view.common.combo.ExtendBaseCombo', 'Ext.ux.plugin.LabelRequired'],
	plugins: ['formlabelrequired'],
	border: false,
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},

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
			name: 'initiazh'
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
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '关注级别',
			name: 'attlevId',
			url: '{domainUrl}/attlev/list'
		}]
	}, {
		title: '本体相关',
		items: [{
			xtype: 'displayfield',
			fieldLabel: '创建时间',
			name: 'createdDate'
		}, {
			xtype: 'displayfield',
			fieldLabel: '创建者',
			name: 'createdBy'
		}, {
			xtype: 'displayfield',
			fieldLabel: '修改时间',
			name: 'modifiedDate'
		}, {
			xtype: 'displayfield',
			fieldLabel: '修改者',
			name: 'modifiedBy'
		}]
	}, {
		title: '关联相关',
		items: [{
			xtype: 'displayfield',
			fieldLabel: '创建时间',
			name: 'refCreatedDate'
		}, {
			xtype: 'displayfield',
			fieldLabel: '创建者',
			name: 'refCreatedBy'
		}, {
			xtype: 'displayfield',
			fieldLabel: '修改时间',
			name: 'refModifiedDate'
		}, {
			xtype: 'displayfield',
			fieldLabel: '修改者',
			name: 'refModifiedBy'
		}]
	}]
});