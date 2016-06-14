Ext.define('DEMO.view.tree.login', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.loginForm',
	width: '100%',
	items: [{
		xtype: 'form',
		id: "login-form",
		defaultType: 'textfield',
		bodyStyle: "background-color:#F1F1F1;",
		defaults: {
			width: 280,
			margin: '5 0 5 40',
			labelWidth: 50,
			labelPad: 10,
			enableKeyEvents: true
		},
		layout: {
			align: 'middle',
			pack: 'center',
			type: 'hbox'
		},
		items: [{
			allowBlank: false,
			fieldLabel: '账 &nbsp;&nbsp;号',
			id: 'tb-name',
			name: 'name',
			regex: /[a-zA-Z0-9]+/,
			blankText: '账号不能为空'
		}, {
			allowBlank: false,
			fieldLabel: '密 &nbsp;&nbsp;码',
			id: 'tb-password',
			name: 'password',
			blankText: '密码不能为空',
			inputType: 'password'
		}, {
			xtype: 'checkbox',
			fieldLabel: '记住我',
			inputValue: "true",
			name: 'rememberMe'
		}]
	}],
	dockedItems: [{
		xtype: 'toolbar',
		ui: "footer",
		dock: 'bottom',
		defaults: {
			width: 70,
			height: 22,
			margin: '0 10 15 0'
		},

		layout: {
			align: 'middle',
			pack: 'center',
			type: 'hbox'
		},
		items: [{
			xtype: 'button',
			id: "btn-login",
			text: "登录"
		}, {
			xtype: 'button',
			id: "btn-reset",
			text: "重置"
		}]
	}]
});