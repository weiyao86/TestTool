Ext.define('SPDM.view.standardName.partStructureStandardName.Viewport', {
	extend: 'Ext.ux.component.viewport.Base',
	requires: [
		'SPDM.view.standardName.partStructureStandardName.StructModel',
		'SPDM.view.standardName.partStructureStandardName.StructureQuery',
		'SPDM.view.standardName.partStructureStandardName.StructureTree',
		'SPDM.view.standardName.partStructureStandardName.Navigation',
		'SPDM.view.standardName.partStructureStandardName.PropertyTabs'
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