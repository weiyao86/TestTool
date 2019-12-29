/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('et6.view.main.Main', {
	extend: 'Ext.tab.Panel',
	xtype: 'app-main',

	requires: [
		'Ext.plugin.Viewport',
		'Ext.window.MessageBox',

		'et6.view.main.MainController',
		'et6.view.main.MainModel',
		'et6.view.main.List',
		'et6.view.main.Group',
		'et6.view.main.User',
		'et6.view.main.Settings'
	],

	controller: 'main',
	viewModel: 'main',

	ui: 'navigation',

	tabBarHeaderPosition: 1,
	titleRotation: 0,
	tabRotation: 0,

	header: {
		layout: {
			align: 'stretchmax'
		},
		title: {
			bind: {
				text: '{name}'
			},
			flex: 0
		},
		iconCls: 'fa-th-list'
	},

	tabBar: {
		flex: 1,
		layout: {
			align: 'stretch',
			overflowHandler: 'none'
		}
	},

	responsiveConfig: {
		tall: {
			headerPosition: 'top'
		},
		wide: {
			headerPosition: 'left'
		}
	},

	defaults: {
		bodyPadding: 20,
		tabConfig: {
			plugins: 'responsive',
			responsiveConfig: {
				wide: {
					iconAlign: 'left',
					textAlign: 'left'
				},
				tall: {
					iconAlign: 'top',
					textAlign: 'center',
					width: 120
				}
			}
		}
	},

	items: [{
		title: 'Home',
		iconCls: 'fa-home',
		// The following grid shares a store with the classic version's grid as well!
		items: [{
			xtype: 'mainlist'
		}]
	}, {
		title: 'Users',
		iconCls: 'fa-user',
		layout: 'fit',
		items: {
			xtype: 'user'
		}
	}, {
		title: 'Groups',
		iconCls: 'fa-users',
		layout: 'fit',
		items: {
			xtype: 'group'
		}
	}, {
		title: 'Settings',
		iconCls: 'fa-cog',
		layout: 'fit',
		items: {
			xtype: 'settings'
		}
	}]
});