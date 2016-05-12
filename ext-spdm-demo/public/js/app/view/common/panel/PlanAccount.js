Ext.define('SPDM.view.common.panel.PlanAccount', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.commonpanelplanaccount',
	border: false,
	padding: '0 5 0 0',
	addItems: function(rowNum) {
		var me = this,
			rows = me.buildItems(rowNum),
			body = me.down("panel[itemId=body]");

		me.removeItems();
		body.add(rows);
	},

	removeItems: function() {
		var me = this,
			body = me.down("panel[itemId=body]");

		body.removeAll();
	},

	buildItems: function(rowNum) {
		var me = this,
			rows = [];

		for (var i = 0; i < rowNum; i++) {
			rows.push({
				defaults: {
					margin: '0 10 0 0',
					xtype: 'label'
				},
				items: [{
					xtype: 'basecombo',
					name: 'customerIds',
					fieldLabel: '账号' + (i + 1),
					url: SPDM.globalConfig.restpath + '/organization/{organizationId}/customer',
					storeAutoLoad: false,
					labelWidth: 55,
					width: 180,
					isEdit: true,
					allowBlank: false,
					blankText: '账号不能为空',
					extraFields: ['remark'],
					queryCaching: false,
					listeners: {
						expand: function() {
							var store = this.getStore();

							me.loadUser(store);
						},
						change: function() {
							var row = this.up(),
								valueModels = this.valueModels;

							me.loadUserExpire(row, valueModels);
						}
					}
				}, {
					name: "userExpire",
					width: 340,
					height: 20,
					style: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
					setToolTip: function(tipText) {
						this.getEl().dom.setAttribute("title", tipText);
					}
				}, {
					name: "userRemark",
					width: 180,
					height: 20,
					style: 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;',
					setToolTip: function(tipText) {
						this.getEl().dom.setAttribute("title", tipText);
					}
				}]
			});
		}

		return rows;
	},

	loadUser: function(store) {
		var me = this,
			url = store.proxy.url,
			form = me.up("form").getForm(),
			organizationId = form.findField("organizationId").getValue();

		store.proxy.url = url.replace(/{organizationId}/, organizationId);
	},

	loadUserExpire: function(row, valueModels) {
		var me = this,
			selectRecord, userCode;

		if (valueModels.length > 0) {
			selectRecord = valueModels[0];
			userCode = selectRecord.get("code");
			remark = selectRecord.get("remark");

			Ext.util.ajax({
				url: SPDM.globalConfig.restpath + '/service/customer/' + userCode,
				success: function(root) {
					me.fillCellsText(row, remark, root);
				}
			});
		}
	},

	fillCellsText: function(row, remark, root) {
		var me = this,
			lbUserExpire = row.down("[name=userExpire]"),
			lbUserRemark = row.down("[name=userRemark]");

		lbUserExpire.setText(root.result || '');
		lbUserExpire.setToolTip(root.result || '');
		lbUserRemark.setText(remark || '');
		lbUserRemark.setToolTip(remark || '');
	},

	items: [{
		xtype: 'panel',
		itemId: 'header',
		bodyStyle: "text-align:center;",
		defaults: {
			xtype: 'label',
			margin: "0 2 0 2"
		},
		layout: {
			align: 'middle',
			pack: 'center',
			type: 'hbox'
		},
		border: false,
		height: 24,
		items: [{
			text: '用户',
			width: 200
		}, {
			text: '现有商品及其到期时间',
			width: 340
		}, {
			text: '用户备注',
			width: 180
		}]
	}, {
		xtype: 'panel',
		itemId: 'body',
		layout: 'vbox',
		height: 150,
		border: 1,
		autoScroll: true,
		bodyStyle : 'overflow-x:hidden;',
		border: false,
		margin: '0 0 0 0',
		defaults: {
			height: 28,
			border: false,
			xtype: 'panel',
			itemsId: 'row',
			layout: {
				align: 'middle',
				pack: 'center',
				type: 'hbox'
			}
		},
		items: []
	}]
});