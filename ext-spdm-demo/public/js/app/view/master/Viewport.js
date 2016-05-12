Ext.define('SPDM.view.master.Viewport', {
	extend: 'Ext.container.Viewport',
	layout: 'border',
	border: true,
	items: [{
		id: 'header-panel',
		region: 'north',
		xtype: 'masterheader',
		bodyStyle: "background-color:  #015c9a; color: #fff; ",
		height: 60
	}, {
		id: 'menu-panel',
		xtype: 'tabpanel',
		title: "功能菜单",
		iconCls: 'icon-navigation-menu',
		region: 'west',
		width: 220,
		collapsible: true,
		split: true,
		margins: '0 3 0 0',
		tabPosition: 'bottom',
		items: [{
			id: 'cascading-menu',
			title: '层叠菜单',
			xtype: "mastercascadingmenu"
		}, {
			id: 'tree-menu',
			title: "树状菜单",
			height: 500,
			action: 'main-menu',
			xtype: "mastertreemenu"
		}]
	}, {
		id: "tabs",
		region: 'center',
		xtype: 'tabpanel',
		margins: '0 0 5 0',
		items: [],
		plugins: Ext.create('Ext.ux.plugin.TabCloseMenu')
	}]
});