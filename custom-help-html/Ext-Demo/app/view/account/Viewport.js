Ext.define('DEMO.view.account.Viewport', {
	extend: 'Ext.container.Viewport',
	alias: 'widget.login',
	layout: {
		type: 'vbox',
		align: "center",
		pack: 'center'
	},
	border: false,
	id: 'viewport-login',
	items: [{
		width: 500,
		height: 400,
		border: true,
		style: 'border:3px solid #fff',
		items: [{
			xtype: 'form',
			defaults: {
				xtype: 'textfield',
				style: 'text-align:center;'
			},
			fieldDefaults: {
				labelWidth: 100,
				labelSeparator: ":"
			},
			bbar: [{
				xtype: 'buttongroup',
				columns: 3,
				title: 'Clipboard',
				items: [{
					text: 'Paste',
					scale: 'large',
					rowspan: 3,
					iconCls: 'add',
					iconAlign: 'top',
					cls: 'btn-as-arrow'
				}, {
					xtype: 'splitbutton',
					text: 'Menu Button',
					scale: 'large',
					rowspan: 3,
					iconCls: 'add',
					iconAlign: 'top',
					arrowAlign: 'bottom',
					menu: [{
						text: 'Menu Item 1'
					}]
				}, {
					xtype: 'splitbutton',
					text: 'Cut',
					iconCls: 'add16',
					menu: [{
						text: 'Cut Menu Item'
					}]
				}, {
					text: 'Copy',
					iconCls: 'add16'
				}, {
					text: 'Format',
					iconCls: 'add16'
				}]
			}],
			items: [{
				fieldLabel: '登录名',
				allowBlank: false,
				// blankText: 'Viewport.js',
				msgTarget: 'side'
			}, {
				xtype: 'button',
				arrowAlign: 'right',
				text: 'menu',
				menu: [{
					text: 'Item 1'
				}, {
					text: 'Item 2'
				}, {
					text: 'Item 3',
					checked: true
				}, {
					text: 'Item 4',
					handler: function() {
						console.log(arguments)
					}

				}],
				draggable: true,
				listeners: {
					click: function() {
						console.log('click' + arguments);
					},
					toggle: function() {
						console.log('toggle' + arguments);
					},
					menutriggerout: function() {
						console.log('menutriggerout' + arguments);
					}
				}
			}, {
				xtype: 'cycle',
				showText: true,
				prependText: 'View as',
				menu: {
					items: [{
						text: 'text only',
						checked: true
					}, {
						text: 'HTML'
					}, {
						text: 'HTML-1'
					}, {
						text: 'HTML-2'
					}, {
						text: 'HTML-3'
					}]
				}
			}, {
				xtype: 'text',
				text: 'split button',
				degrees: 120
			}]
		}]
	}]
});