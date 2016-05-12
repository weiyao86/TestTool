Ext.define('SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBaseReference', {
	extend: 'Ext.ux.component.edit.Edit',
	title: '添加关联',
	alias: 'widget.basereference',
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},

	afterRender: function() {
		var me = this;

		me.controller = me.getController('modelRelate.ModelManage');

		me.callParent(arguments);
	},
	initEvents: function(argument) {
		var me = this;

		me.on('dosave', function(params) {
			me.save(params);
		});

		me.callParent(arguments);
	},

	save: function() {
		var me = this,
			form = me.down('form'),
			values = form.getForm().getFieldValues(),
			params = {
				"nodeId": values.nodeId,
				"parentIds": values.reference ? values.reference.split(',') : []
			};

		Ext.util.ajax({
			url: me.controller.baseDomainUrl + 'node/add-relations',
			method: 'POST',
			jsonData: params,
			beforerequest: function() {
				me.setLoading(true);
			},
			callback: function() {
				me.setLoading(false);
			},
			success: function(root) {
				me.finishSaved(root);
			}
		});
	},

	finishSaved: function(root) {
		var me = this;

		if (root.list && root.list.length) {
			var list = Ext.Array.map(root.list, function(val, idx) {
				return val.parentId;
			});
			me.showErrorReport({
				failurecodes: list.join(',')
			});
		} else {
			Ext.Msg.alert('提示', "添加成功!", function() {
				me.close();
			});
		}
	},

	showErrorReport: function(data) {
		var me = this,
			reportWin = Ext.create('SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBaseReport').show(),
			form = reportWin.down('form');

		form.getForm().setValues(data);
	},

	items: [{
		items: [{
			xtype: 'hiddenfield',
			name: 'nodeId'
		}, {
			xtype: 'displayfield',
			name: 'nodeType',
			fieldLabel: '类型',
			allowBlank: true
		}, {
			xtype: 'displayfield',
			name: 'nodeDesc',
			fieldLabel: '名称',
			allowBlank: true
		}, {
			xtype: 'textareafield',
			fieldLabel: '关联编码',
			emptyText: '输入编码以逗号分隔, 最多输入50个编码',
			name: 'reference'
		}, {
			xtype: 'displayfield',
			fieldLabel: '说明',
			allowBlank: true,
			value: '1. 把当前节点挂载到对应节点下. <br>2. 关联编码 为节点基本属性中的ID字段.'
		}]
	}]

});