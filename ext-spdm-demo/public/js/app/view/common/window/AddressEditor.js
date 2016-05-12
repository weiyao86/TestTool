Ext.define('SPDM.view.common.window.AddressEditor', {
	extend: 'Ext.window.Window',
	requires: [
		'Ext.ux.plugin.LabelRequired',
		'Ext.ux.component.field.AddressField'
	],
	title: '编辑地址',
	closable: true,
	modal: true,
	resizable: false,
	constrainHeader: true,
	layout: 'fit',
	closeAction: 'destroy',
	width: 540,
	height: 320,
	initEvents: function(argument) {
		var me = this,
			form = me.down('form').getForm(),
			btnSave = me.down('[itemId=save]'),
			btnCancel = me.down('[itemId=cancel]'),
			pcaField = me.down('[itemId=pca]');

		btnSave.on('click', function() {
			if (form.isValid()) {
				me.doSave();
			}
		});
		btnCancel.on('click', function() {
			me.doCancel();
		});
		pcaField.on('selectionchange', function() {
			me.setPCA(this);
		});
	},

	setPCA: function(that) {
		var me = this,
			form = me.down('form').getForm(),
			values = that.getSelectionValues();

		form.setValues({
			provinceCode: values.province,
			cityCode: values.city,
			areaCode: values.area
		});
	},

	doCancel: function() {
		var me = this,
			btnPcaField = me.down('[itemId=pca]');

		btnPcaField.selectionAddress = null;
		me.close();
	},

	doSave: function() {
		var me = this,
			controller = me.getController(),
			organizationId = controller.getOrganizationId(),
			form = me.down('form').getForm(),
			values = form.getFieldValues(),
			params = me.getParams(),
			method = (me.mode === 'add' ? 'POST' : 'PUT');

		Ext.util.ajax({
			url: SPDM.globalConfig.restpath + '/organization-profile/' + organizationId + '/address-book/' + values.id,
			method: method,
			jsonData: params,
			beforerequest: function() {
				me.setLoading('保存中,请稍候...');
			},
			callback: function() {
				me.setLoading(false);
			},
			success: function(root) {
				me.saveFinish(root);
			}
		});
	},

	getParams: function() {
		var me = this,
			form = me.down('form').getForm(),
			params = form.getFieldValues();

		return {
			provinceCode: params.provinceCode,
			cityCode: params.cityCode,
			areaCode: params.areaCode,
			address: params.address,
			contactPeople: params.contactPeople,
			phone: params.phone,
			postCode: params.postCode,
			isDefault: (me.mode == 'add' ? true : params.isDefault)
		};
	},

	saveFinish: function(root) {
		var me = this;

		me.addressList.load();
		me.doCancel();
		if (me.mode == 'add') {
			me.invoiceWindow.addressId = root.result;
		}
		Ext.Msg.alert('提示', '保存成功');
	},

	setAddress: function() {
		var me = this,
			data = me.data,
			form = me.down('form').getForm(),
			pcaField = me.down('[itemId=pca]');

		if (me.mode == 'update') {
			form.setValues(me.data);

			pcaField.selectionAddress = {
				province: {
					code: data.provinceCode,
					name: data.provinceName
				},
				city: {
					code: data.cityCode,
					name: data.cityName
				},
				area: {
					code: data.areaCode,
					name: data.areaName
				}
			};

			pcaField.setValue(data.provinceName + '/' + data.cityName + '/' + data.areaName);
		}
	},

	getController: function() {
		return SPDM.app.getController('salesOrder.OrderEditor');
	},

	listeners: {
		afterrender: function() {
			this.setAddress();
		}
	},
	items: [{
		xtype: 'form',
		bodyPadding: 10,
		border: false,
		plugins: ['formlabelrequired'],
		defaults: {
			margin: '0 0 5 0',
			border: false,
			layout: {
				type: 'hbox',
				align: 'middle'
			},
			defaults: {
				width: '100%',
				labelWidth: 65,
				labelPad: 5,
				allowBlank: false
			}
		},
		items: [{
			items: [{
				fieldLabel: '省市区:',
				xtype: 'addressfield',
				itemId: 'pca'
			}, {
				xtype: 'hiddenfield',
				name: 'id'
			}, {
				xtype: 'hiddenfield',
				name: 'provinceCode'
			}, {
				xtype: 'hiddenfield',
				name: 'cityCode'
			}, {
				xtype: 'hiddenfield',
				name: 'areaCode'
			}, {
				xtype: 'hiddenfield',
				name: 'isDefault',
				value: true
			}]
		}, {
			items: [{
				xtype: 'textareafield',
				name: 'address',
				fieldLabel: '详细地址',
				height: 80
			}]
		}, {
			items: [{
				xtype: 'textfield',
				fieldLabel: '联系人',
				name: 'contactPeople'
			}]
		}, {
			items: [{
				xtype: 'textfield',
				fieldLabel: '电话',
				name: 'phone',
				regex: /(^(\d{3,4}-)?\d{7,8})$|(1[3|5][0-9]{9})$/i,
				regexText: '格式有误'
			}]
		}, {
			items: [{
				xtype: 'textfield',
				name: 'postCode',
				fieldLabel: '邮编',
				regex: /[1-9]{1}(\d+){5}/,
				regexText: '格式有误',
				allowBlank: true
			}]
		}]
	}],
	dockedItems: [{
		xtype: 'toolbar',
		dock: 'bottom',
		ui: 'footer',
		defaults: {
			margins: '0 10 0 10'
		},
		layout: {
			align: 'middle',
			pack: 'center',
			type: 'hbox'
		},
		items: [{
			xtype: 'button',
			itemId: 'save',
			text: '保存',
			iconCls: 'icon-save'
		}, {
			xtype: 'button',
			itemId: 'cancel',
			text: '取消',
			iconCls: 'icon-cancel'
		}]
	}]
});