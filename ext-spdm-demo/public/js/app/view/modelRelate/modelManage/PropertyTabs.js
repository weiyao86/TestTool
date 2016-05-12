Ext.define('SPDM.view.modelRelate.modelManage.PropertyTabs', {
	extend: 'Ext.tab.Panel',
	alias: 'widget.partstructurestandardnamepropertytabs',
	requires: [
		'SPDM.view.modelRelate.modelManage.propertyBasic.PropertyBasic',
		'SPDM.view.modelRelate.modelManage.specification.Specification',
		'SPDM.view.modelRelate.modelManage.drawing.Drawing'
	],
	width: "100%",
	height: '100%',
	border: false,
	bodyPadding: 0,
	activeTab: 0,
	afterRender: function() {
		var me = this;

		me.tabpropertyBasic = me.down("[itemId=tabPropertyBasic]");
		me.propertyBasic = me.down("[itemId=propertyBasic]");
		me.specification = me.down('[itemId=specification]');
		me.pssnDrawingPanel = me.down('[itemId=pssnDrawingPanel]');
		me.callParent(arguments);
	},

	loadContent: function(params) {
		var me = this;

		me.displaySpecificationTab(params.type);
		me.loadActiveTabContent(params);
	},

	displaySpecificationTab: function(type) {
		var me = this,
			activeTab = me.getActiveTab(),
			tabSpecification = me.down('[itemId=tabSpecification]');

		if (type.toUpperCase() === 'PS') {
			tabSpecification.tab.show();
		} else {
			tabSpecification.tab.hide();
			if (tabSpecification.tab.active) {
				me.setActiveTab(me.tabpropertyBasic);
				me.propertyBasic.getActivePanel(type).show();
			}
		}
	},

	loadActiveTabContent: function(params) {
		if (!params.id) return;

		var me = this,
			id = params.id,
			type = params.type,
			activeTab = me.getActiveTab(),
			panel = activeTab.down();

		//通过标记参数与上次参数相同则无需再次加载
		if (!me.tabField) me.tabField = {};

		if (me.tabField[panel.itemId] == id) return;

		panel.load && panel.load(params);

		me.tabField[panel.itemId] = id;
	},

	resetProperty: function() {
		var me = this;

		me.displaySpecificationTab('');
		me.propertyBasic.resetProperty();
		me.specification.resetSpecification();
		me.pssnDrawingPanel.resetDrawing();
		me.tabField = {};
	},

	defaults: {
		layout: 'vbox',
		defaults: {
			width: '100%',
			flex: 1
		}
	},
	items: [{
		itemId: "tabPropertyBasic",
		title: '基本属性',
		items: [{
			xtype: 'partstructurestandardnamepropertybasicpropertybasic',
			itemId: 'propertyBasic'
		}]
	}, {
		itemId: 'tabSpecification',
		title: '规格与规格值',
		hidden: true,
		items: [{
			xtype: 'partstructurestandardnamespecificationspecification',
			itemId: 'specification'
		}]
	}, {
		itemId: 'tabDrawing',
		title: '示意图',
		items: [{
			xtype: 'partstructurestandardnamedrawingdrawing',
			itemId: 'pssnDrawingPanel'
		}]
	}]
});