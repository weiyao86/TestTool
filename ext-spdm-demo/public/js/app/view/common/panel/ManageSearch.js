Ext.define('SPDM.view.common.panel.ManageSearch', {
	extend: 'Ext.form.Panel',
	alias: 'widget.commonpanelmanagesearch',
	requires: [
		'Ext.ux.component.combo.BaseCombo',
		'Ext.ux.component.button.LinkButton'
	],
	itemId: 'managesearch',
	width: "100%",
	bodyPadding: 5,
	layout: 'vbox',
	defaults: {
		width: "100%",
		margin: '5 0 0 0',
		border: false
	},

	constructor: function(config) {
		var me = this;

		me.initConfig(config);
		me.callParent(arguments);
	},

	initComponent: function() {
		var me = this;

		me.callParent(arguments);
	},

	initEvents: function() {
		var me = this,
			btnClear = me.down("[itemId=clear]"),
			btnSearch = me.down("[itemId=search]"),
			btnAdvancedSearch = me.down("[itemId=advanced_search]");

		btnClear.on('click', function() {
			me.reset();
		});

		btnSearch.on('click', function() {
			me.fireEvent('onSearch', me);
		});

		btnAdvancedSearch.on('click', function() {
			me.fireEvent('onAdvancedSearch', me);
		});

		me.callParent(arguments);
	},

	initConfig: function(config) {
		var me = this,
			type = 'trigger',
			comboConfig = config.comboConfig,
			comboFirst = me.items[1].items[0],
			comboSecond = me.items[1].items[1],
			comboThird = me.items[2].items[0],
			comboFourth = me.items[2].items[1];

		if (comboConfig.type1 == type && comboConfig.url1) {
			me.setType(comboFirst, comboConfig.emptyText1);
		} else {
			me.setData(comboFirst, comboConfig.url1, comboConfig.localData1,comboConfig.emptyText1);
		}
		if (comboConfig.type2 == type && comboConfig.url2) {
			me.setType(comboSecond, comboConfig.emptyText2);
		} else {
			me.setData(comboSecond, comboConfig.url2, comboConfig.localData2,comboConfig.emptyText2);
		}
		if (comboConfig.type3 == type && comboConfig.url3) {
			me.setType(comboThird, comboConfig.emptyText3);
		} else {
			me.setData(comboThird, comboConfig.url3, comboConfig.localData3,comboConfig.emptyText3);

		}
		if (comboConfig.type4 == type && comboConfig.url4) {
			me.setType(comboFourth, comboConfig.emptyText4);
		} else {
			me.setData(comboFourth, comboConfig.url4, comboConfig.localData4,comboConfig.emptyText4);
		}

	},

	setType: function(cmp, text) {
		var me = this;
		cmp.xtype = "trigger";
		cmp.triggerCls = 'x-form-clear-trigger';
		cmp.emptyText = text;
		cmp.onTriggerClick = function() {
			this.reset();
		};
	},

	setData: function(cmp, url,localData,text) {
		var me = this;
		if (url) {
			cmp.url = url;
		} else {
			cmp.localData = localData;
		}
		cmp.allText=text;
		cmp.emptyText=text;
	},

	reset: function() {
		var me = this;

		me.getForm().reset();
	},

	items: [{
		layout: 'hbox',
		items: [{
			xtype: 'trigger',
			itemId: 'like_search',
			name: 'name',
			triggerCls: 'x-form-clear-trigger',
			emptyText: "节点名称快速查找...",
			flex: 1,
			onTriggerClick: function() {
				this.reset();
			}
		}]
	}, {
		layout: 'hbox',
		items: [{
			xtype: 'basecombo',
			name: 'attlevId',
			margin: '0 10 0 0',
			emptyText: '',
			allText:'',
			allValue:'',
			withAll: true,
			flex: 1
		}, {
			xtype: 'basecombo',
			name: 'scope',
			emptyText: '',
			withAll: true,
			flex: 1
		}]

	}, {
		layout: 'hbox',
		items: [{
			xtype: 'basecombo',
			name: 'devattId',
			margin: '0 10 0 0',
			emptyText: '',
			allText:'',
			allValue:'',
			withAll: true,
			flex: 1
		}, {
			xtype: 'basecombo',
			name: 'maitypCode',
			emptyText: '',
			allText:'',
			allValue:'',
			withAll: true,
			flex: 1
		}]

	}, {
		layout: 'hbox',
		defaults: {
			border: false
		},
		items: [{
			items: [{
				xtype: 'linkbutton',
				itemId: "advanced_search",
				text: '高级查询',
				style: "line-height:22px;"
			}],
			flex: 1
		}, {
			width: 100,
			layout: {
				type: 'hbox',
				pack: 'end'
			},
			items: [{
				xtype: 'button',
				itemId: 'search',
				text: '查询',
				margin: '0 10 0 0'
			}, {
				xtype: 'button',
				itemId: 'clear',
				text: '清空'
			}]
		}]
	}]
});