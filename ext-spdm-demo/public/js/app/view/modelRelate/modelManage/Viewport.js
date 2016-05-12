Ext.define('SPDM.view.modelRelate.modelManage.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'SPDM.view.modelRelate.modelManage.StructModel',
		'SPDM.view.modelRelate.modelManage.StructureQuery',
		'SPDM.view.modelRelate.modelManage.StructureTree',
		'SPDM.view.modelRelate.modelManage.Navigation',
		'SPDM.view.modelRelate.modelManage.PropertyTabs'
	],
	defaults: {
		border: false
	},
	items: [{
		region: 'north',
		border: false,
		items: [{
			xtype: 'structmodel',
			itemId: 'querystructmode'
		}]
	}, {
		region: 'west',
		layout: 'vbox',
		split: true,
		width: 300,
		minWidth: 250,
		defaults: {
			border: true
		},
		items: [{
			itemId: 'structureQuery',
			xtype: 'partstructurestandardnamestructurequery'
		}, {
			itemId: 'structureTree',
			xtype: 'partstructurestandardnamestructuretree',
			flex: 1
		}]
	}, {
		collapsible: false,
		region: 'center',
		layout: 'border',
		items: [{
			region: 'north',
			split: true,
			height: 50,
			minHeight: 50,
			items: [{
				itemId: "navigation",
				xtype: 'partstructurestandardnamenavigation'
			}]
		}, {
			collapsible: false,
			itemId: 'propertyTabs',
			region: 'center',
			xtype: 'partstructurestandardnamepropertytabs'
		}]
	}]
});