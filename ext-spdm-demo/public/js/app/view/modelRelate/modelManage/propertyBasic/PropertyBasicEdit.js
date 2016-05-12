Ext.define('SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBasicEdit', {
	extend: 'Ext.ux.component.edit.Edit',
	requires: ['SPDM.view.common.combo.ExtendBaseCombo'],
	title: '新增子节点',
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},
	afterRender: function() {
		var me = this;

		me.controller = me.getController('modelRelate.ModelManage');

		me.callParent(arguments);
	},
	initEvents: function() {
		var me = this;

		me.on('dosave', function(params) {
			me.save(params);
		});

		me.callParent(arguments);
	},

	save: function(params) {
		var me = this;

		Ext.util.ajax({
			url: me.controller.baseDomainUrl + 'node/add',
			method: 'POST',
			params: params,
			beforerequest: function() {
				me.setLoading(true);
			},
			callback: function() {
				me.setLoading(false);
			},
			success: function() {
				me.finishSaved(params);
			}
		});
	},

	finishSaved: function(params) {
		var me = this,
			controller = me.getController('modelRelate.ModelManage'),
			selectionNode = controller.structureTree.getSelectionNode();

		if (controller) {
			if (selectionNode.get('leaf')) {
				controller.refreshParentNode(function() {
					selectionNode = controller.structureTree.getSelectionNode();
					selectionNode.expand();
				});
			} else {
				controller.structureTree.refreshNode(selectionNode.get('id'));
			}
		}
		Ext.Msg.alert('提示', '保存成功');
		me.close();
	},

	items: [{
		items: [{
			xtype: 'hiddenfield',
			name: 'id'
		}, {
			xtype: 'extendBaseCombo',
			name: 'type',
			fieldLabel: '类型',
			storeAutoLoad: false,
			dependField: 'id',
			queryCaching: false,
			noCache: true,
			noComboUrl: true,
			url: '{domainUrl}node/addable-types?id={id}'
		}, {
			fieldLabel: '名称',
			name: 'name'
		}]
	}]
});