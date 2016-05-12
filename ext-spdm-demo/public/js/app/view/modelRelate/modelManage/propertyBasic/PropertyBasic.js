Ext.define('SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBasic', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.partstructurestandardnamepropertybasicpropertybasic',
	requires: [
		'SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBasicPG',
		'SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBasicPS',
		'SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBasicAS',
		'SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBaseReference',
		'SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBaseReport'
	],
	border: false,
	bodyPadding: 15,
	autoScroll: true,
	layout: 'vbox',
	initEvents: function() {
		var me = this,
			btnAdd = me.down('[itemId=add]'),
			btnUpdate = me.down('[itemId=update]'),
			btnDelete = me.down('[itemId=delete]'),
			btnDelReference = me.down('[itemId=delReference]'),
			btnReference = me.down('[itemId=reference]');

		btnAdd.on('click', function() {
			me.fireEvent('addNode');
		});

		btnUpdate.on('click', function() {
			me.updateNode();
		});

		btnDelete.on('click', function() {
			me.fireEvent('deleteNode');
		});

		btnDelReference.on('click', function() {
			me.fireEvent('deleteRefenceNode');
		});

		btnReference.on("click", function() {
			me.fireEvent('referenceNode');
		});
	},
	load: function(params) {
		var me = this,
			id = params.id,
			type = params.type,
			activePanel = me.getActivePanel(type);

		me.hidePropertyPanels();
		me.params = params;
		me.controlToolbar(false);
		activePanel.load(id);
		activePanel.show();
	},
	updateNode: function() {
		var me = this,
			activePanel = me.getActivePanel(me.params.type);

		activePanel.save && activePanel.save(function() {
			me.fireEvent('finishUpdate')
		});
	},
	getActivePanel: function(type) {
		var me = this,
			activePanel;

		switch (type) {
			case 'PG':
				activePanel = me.down('[itemId=propertyPG]');
				break;
			case 'PS':
				activePanel = me.down('[itemId=propertyPS]');
				break;
			case 'AS':
				activePanel = me.down('[itemId=propertyAS]');
				break;
			default:
				activePanel = me.down('[itemId=propertyPG]');
				break;
		}

		return activePanel;
	},
	hidePropertyPanels: function() {
		var me = this,
			propertyPanels = me.query('[actionClass=property]');

		Ext.each(propertyPanels, function(item) {
			item.hide();
		});
	},
	resetProperty: function() {
		var me = this,
			activePanel = me.getActivePanel(me.params ? me.params.type : '');

		me.controlToolbar(true);
		activePanel.getForm().reset();
	},
	controlToolbar: function(disabled) {
		var me = this,
			buttons = me.query('toolbar > button[singleSelectEnable]');

		Ext.each(buttons, function(btn) {
			btn.setDisabled(disabled);
		});
	},
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'top',
		items: [{
			text: '新增子节点',
			iconCls: 'icon-min-add',
			itemId: 'add',
			disabled: true,
			singleSelectEnable: true
		}, {
			text: '保存',
			iconCls: 'icon-save',
			itemId: 'update',
			disabled: true,
			singleSelectEnable: true
		}, {
			text: '删除本体',
			iconCls: 'icon-min-delete',
			itemId: 'delete',
			disabled: true,
			singleSelectEnable: true
		}, {
			text: '删除关联',
			iconCls: 'icon-min-delete',
			itemId: 'delReference',
			disabled: true,
			singleSelectEnable: true
		}, {
			text: '关联',
			iconCls: 'icon-reference',
			itemId: 'reference',
			disabled: true,
			singleSelectEnable: true
		}]
	}],
	items: [{
		itemId: 'propertyPG',
		xtype: 'partstructurestandardnamepropertybasicpropertybasicpg',
		hidden: false,
		actionClass: 'property'
	}, {
		itemId: 'propertyPS',
		xtype: 'partstructurestandardnamepropertybasicpropertybasicps',
		hidden: true,
		actionClass: 'property'
	}, {
		itemId: 'propertyAS',
		xtype: 'partstructurestandardnamepropertybasicpropertybasicas',
		hidden: true,
		actionClass: 'property'
	}]
});