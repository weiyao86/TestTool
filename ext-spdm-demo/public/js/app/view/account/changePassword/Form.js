Ext.define('HPSPDM.view.account.changePassword.Form', {
	extend: 'Ext.window.Window',
	alias: 'widget.changepasswordform',
	title: '密码修改',
	frame: true,
	closable: true,
	modal: true,
	resizable: false,
	layout: 'fit',
	closeAction: 'destroy',
	width: 420,
	bodyPadding: 2,
	defaults: {
		border: 0
	},

	initEvents: function() {
		var me = this,
			btnSave = Ext.ComponentQuery.query("[itemId=btn-save]", me)[0], // me.getCmp('xx').getComponent("btn-save") | me.down('[itemId=btn-save]') 
			btnCancel = me.down('[itemId=btn-cancel]');

		btnSave.on('click', function() {
			// TODO
			me.doSave();
		});

		btnCancel.on('click', function() {
			me.doCancel();
		})

		this.callParent(arguments);
	},

	doSave: function() {
		var me = this,
			params = me.getParams();

		Ext.util.ajax({
			url: HPSPDM.globalConfig.path + '/account/change-pwd',
			method: 'POST',
			jsonData: params,
			beforerequest: function() {
				me.setLoading('修改中,请稍候...');
			},
			callback: function() {
				me.setLoading(false);
			},
			success: function() {
				me.saveFinish();
			}
		});
	},
	saveFinish: function() {
		var me = this;

		window.location.href = '';
	},

	doCancel: function() {
		var me = this;

		me.close();
	},

	getParams: function() {
		var me = this;

	},

	items: [{
		xtype: 'form',
		id: "login-form",
		defaultType: 'textfield',
		defaults: {
			width: 280,
			height: 22,
			margin: '15 0 15 40',
			labelWidth: 80,
			labelPad: 10,
			enableKeyEvents: true
		},
		items: [{
			allowBlank: false,
			fieldLabel: '原始密码',
			itemId: 'old-password',
			name: 'old-password',
			blankText: '原始密码不能以为空',
			inputType: 'password'
		}, {
			allowBlank: false,
			fieldLabel: '新&nbsp; 密&nbsp; 码',
			itemId: 'new-password',
			name: 'new-password',
			blankText: '新密码不能以为空',
			inputType: 'password'
		}, {
			allowBlank: false,
			fieldLabel: '确认密码',
			itemId: 'confirm-password',
			name: 'confirm-password',
			blankText: '确认密码不能以为空',
			inputType: 'password'
		}]
	}],
	dockedItems: [{
		xtype: 'toolbar',
		ui: "footer",
		dock: 'bottom',
		defaults: {
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
			itemId: "btn-save",
			text: "修改",
			iconCls: 'icon-save'
		}, {
			xtype: 'button',
			itemId: "btn-cancel",
			text: "取消",
			iconCls: 'icon-cancel'
		}]
	}]
});