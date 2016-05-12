Ext.define('SPDM.view.common.panel.AddressList', {
	extend: 'Ext.panel.Panel',
	requires: ['Ext.ux.component.button.LinkButton'],
	alias: 'widget.commonpaneladdresslist',
	initEvents: function(argument) {
		var me = this,
			btnAdd = me.down('[itemId=add]');

		btnAdd.on('click', function() {
			me.addAddress();
		});
	},

	load: function() {
		var me = this,
			organizationId = me.getOrganizationId();

		Ext.util.ajax({
			url: SPDM.globalConfig.restpath + '/organization-profile/' + organizationId + '/address-book',
			disableCaching: true,
			beforerequest: function() {
				me.up('window').setLoading('加载中, 请稍候...');
			},
			callback: function() {
				me.up('window').setLoading(false);
			},
			success: function(root) {
				me.removeAddress();
				me.createAddressList(root.result || []);
				me.surplusAddressPrompt(root.result || []);
				me.fireEvent('loaded', me);
			}
		});
	},

	createAddressList: function(result) {
		var me = this,
			i = 0,
			item, detail,
			addressList = me.down('[itemId=addressList]');

		for (; i < result.length; i++) {
			item = result[i];
			detail = Ext.String.format('{0} {1}{2}{3}{4} {5} {6}',
				item.contactPeople || '',
				item.provinceName || '',
				item.cityName || '',
				item.areaName || '',
				item.address || '',
				item.phone || '',
				item.postCode || '');

			addressList.add({
				data: item,
				items: [{
					xtype: 'radiofield',
					flex: 2,
					name: 'addressId',
					boxLabel: detail,
					boxLabelCls: 'address-label',
					boxLabelAttrTpl: 'title="' + detail + '"',
					inputValue: item.id
				}, {
					xtype: 'linkbutton',
					text: '修改',
					title: '修改',
					handler: function() {
						me.updateAddress(this);
					}
				}, {
					xtype: 'linkbutton',
					text: '删除',
					title: '删除',
					handler: function() {
						me.deleteAddress(this);
					}
				}]
			});
		}
	},

	surplusAddressPrompt: function(result) {
		var me = this,
			maxCount = 5,
			minCount = 5 - result.length,
			surplusAddress = me.down('[itemId=surplusAddress]');
		text = minCount > 0 ? '(最多可以添加' + maxCount + '个地址, 您还可以添加' + minCount + '个)' : '(最多可以添加' + maxCount + '个地址)';

		surplusAddress.setText(text);
	},

	removeAddress: function() {
		var me = this,
			addressList = me.down('[itemId=addressList]');

		addressList.removeAll();
	},

	addAddress: function() {
		var me = this,
			addressList = me.down('[itemId=addressList]');

		if (addressList.items.length < 5) {
			me.openAddressEditor('add');
		} else {
			Ext.Msg.alert('提示', '最多只能添加5个地址');
		}
	},

	updateAddress: function(that) {
		var me = this,
			data = that.up().data;

		me.openAddressEditor('update', data);
	},

	deleteAddress: function(that) {
		var me = this,
			data = that.up().data,
			organizationId = me.getOrganizationId();

		Ext.Msg.confirm('提示', '确认删除当前地址?', function(btn) {
			if (btn === 'yes') {
				Ext.util.ajax({
					url: SPDM.globalConfig.restpath + '/organization-profile/' + organizationId + '/address-book/' + data.id,
					method: 'DELETE',
					beforerequest: function() {
						me.up('window').setLoading('删除中,请稍候...');
					},
					callback: function() {
						me.up('window').setLoading(false);
					},
					success: function() {
						me.deleteAddressFinish(that);
					}
				});
			}
		});
	},

	deleteAddressFinish: function(that) {
		var me = this,
			row = that.up(),
			addressList = me.down('[itemId=addressList]');

		addressList.remove(row);
		me.surplusAddressPrompt(addressList.items);
	},

	openAddressEditor: function(mode, data) {
		var me = this,
			dialog = Ext.create('SPDM.view.common.window.AddressEditor', {
				mode: mode,
				data: data,
				addressList: me,
				invoiceWindow: me.up('window')
			});

		dialog.show();
	},

	getOrganizationId: function() {
		var me = this,
			controller = me.getController(),
			organizationId = controller.getOrganizationId();

		return organizationId;
	},

	getController: function() {
		return SPDM.app.getController('salesOrder.OrderEditor');
	},

	listeners: {
		afterrender: function() {
			this.load();
		}
	},

	layout: {
		type: 'vbox'
	},
	border: false,
	defaults: {
		border: false
	},
	width: '100%',
	items: [{
		layout: {
			type: 'hbox',
			align: 'top'
		},
		items: [{
			flex: 1,
			border: false,
			defaults: {
				border: false,
				layout: {
					type: 'hbox',
					align: 'middle'
				},
				defaults: {
					margin: '0 5 0 0'
				}
			},
			itemId: 'addressList',
			items: []
		}]
	}, {
		defaults: {
			labelPad: 5
		},
		layout: {
			type: 'hbox',
			align: 'middle'
		},
		width: '100%',
		items: [{
			itemId: 'add',
			xtype: 'linkbutton',
			text: '使用新地址',
			margin: '0 10 0 0'
		}, {
			itemId: 'surplusAddress',
			xtype: 'label',
			style: 'color:red;'
		}]
	}]
});