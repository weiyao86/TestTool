Ext.define('HPSPDM.controller.master.Frame', {
	extend: 'Ext.app.Controller',
	model: ['master.Menu'],
	requires: [
		'Ext.util.common',
		'Ext.util.pingyin',
		'Ext.ux.plugin.TabCloseMenu'
	],
	stores: [
		'master.CascadingMenu',
		'master.TreeMenu'
	],
	views: [
		'master.Viewport',
		'master.Header',
		'master.CascadingMenu',
		'master.TreeMenu'
	],
	isLoaded: true,

	init: function() {
		var me = this;

		me.control({
			"viewport": {
				afterrender: function() {
					me.addTab('home', '首&nbsp;&nbsp;页', false);
				}
			},
			"#header-panel": {
				afterrender: me.headerRender
			},
			"#cascading-menu": {
				render: me.loadCascadingMenu
			},
			"#tree-menu": {
				render: me.loadTreeMenu,
				fastOpen: function(tree, codes) {
					var result = me.getFastRecords(tree, codes);

					if (result.records.length > 0) {
						me.loadMultiplePage(result.records, 0);
					}
					if (result.notExistCodes.length) {
						Ext.Msg.alert('提示', '您选择的菜单编码: ' + result.notExistCodes.join(',') + '未能找到对应的模块!');
					}
				}
			},
			"treepanel[action=main-menu]": {
				itemclick: function(that, record) {
					me.loadPage(record);
				},
				cellkeydown: function(that, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (e.getKey() === e.ENTER) {
						me.loadPage(record);
					}
				}
			},
			"#tabs": {
				remove: function(that, tab, eOpts) {
					me.closeTab(tab);
				}
			}
		});
	},

	headerRender: function(that) {
		var me = this;

		that.mon(
			that.el, 'click',
			function(event, target) {
				var action = target.getAttribute('data-action');

				switch (action) {
					case 'change-password':
						me.showChangePassword();
						break;
					case 'logout':
						me.logoutSys();
						break;
					case 'epc-index':
						me.toEpcIndex();
						break;
					default:
						break;
				}
			},
			that, {
				delegate: 'a'
			}
		);
	},

	getFastRecords: function(tree, codes) {
		var me = this,
			records = [],
			notExistCodes = [],
			arrCodes = codes.split(',');

		Ext.each(arrCodes, function(code) {
			var record = tree.getRootNode().findChild('code', code, true);
			if (record) {
				records.push(record);
			} else {
				notExistCodes.push(code);
			}
		});

		return {
			notExistCodes: notExistCodes,
			records: records
		};
	},

	logoutSys: function() {
		var me = this;

		Ext.Msg.confirm('提示', '您确认退出系统?', function(btn) {
			if (btn === 'yes') {
				Ext.util.ajax({
					url: HPSPDM.globalConfig.path + '/logout',
					method: 'POST',
					disableCaching: true,
					success: function(res) {
						window.location.href = res.result;
					},
					failure: function(res) {
						Ext.Msg.alert('提示', res.message);
					}
				})
			}
		});
	},

	toEpcIndex: function() {
		var win = window.open('/');

		Ext.util.ajax({
			url: HPSPDM.globalConfig.path + '/logout/toEpc',
			method: 'POST',
			disableCaching: true,
			success: function(res) {
				win.location.href = res.result ? res.result : HPSPDM.globalConfig.path + '/epcError';
			},
			failure: function(res) {
				Ext.Msg.alert('提示', res.message);
			}
		})
	},

	showChangePassword: function() {
		var me = this,
			changePwdWindow = Ext.create('HPSPDM.view.account.changePassword.Form');

		changePwdWindow.show();
	},

	loadCascadingMenu: function() {
		var me = this,
			data = [],
			treePanel = Ext.getCmp('cascading-menu'),
			store = me.getMasterCascadingMenuStore();

		treePanel.setLoading(true, true);
		store.load(function(records, op, success) {
			if (success) {
				me.buildCascadingMenu(treePanel, records);
			}
			treePanel.setLoading(false);
		});
	},

	loadTreeMenu: function() {
		var me = this,
			treePanel = Ext.getCmp('tree-menu'),
			store = me.getMasterTreeMenuStore();

		treePanel.setLoading(true, true);

		store.load({
			callback: function(data) {
				treePanel.setLoading(false);
			}
		});
		treePanel.bindStore(store);
	},

	buildCascadingMenu: function(treePanel, records) {
		Ext.each(records, function(item) {
			var store = Ext.create('Ext.data.TreeStore', {
				autoSync: true,
				fields: ['id', 'text', 'url', 'children'],
				root: item.data
			});
			var tree = Ext.create('Ext.tree.Panel', {
				title: item.get("text"),
				store: store,
				useArrows: true,
				border: 0,
				action: 'main-menu',
				autoDestroy: true,
				autoScroll: false,
				rootVisible: false
			});

			treePanel.add(tree);
		});
	},

	loadMultiplePage: function(records, index) {
		var me = this;

		if (index < records.length) {
			me.loadPage(records[index], function() {
				index++;
				me.loadMultiplePage(records, index);
			});
		}
	},

	loadPage: function(record, callback) {
		if (!record.get('leaf')) return;

		var me = this,
			id = record.get('id'),
			text = record.get('text'),
			url = record.get("url");

		if (Ext.isString(url) && url.length > 0) {
			me.openWindow(url);
		} else if (me.isExistConfig(id)) {
			me.addTab(id, text, true, callback);
		}
	},

	addTab: function(id, title, closable, callback) {
		var me = this,
			tabs = Ext.getCmp('tabs'),
			tab = Ext.getCmp("tab_" + id),
			pageConfig = me.getTabPage(id);

		// 当前模块已经打开, 则激活
		if (tab) {
			tabs.setActiveTab(tab);
			if (typeof callback === 'function') {
				callback.apply();
			}
			return;
		}

		if (me.isLoaded) {
			me.isLoaded = false;
			tabs.add({
				title: title,
				id: "tab_" + id,
				items: [],
				layout: "fit",
				closable: closable,
				closeAction: "destroy",
				listeners: {
					afterrender: function() {
						var tab = this;

						me.loadTabFinish(pageConfig, tab, function() {
							me.isLoaded = true;
							tab.setLoading(false);
							if (typeof callback === 'function') {
								callback.apply();
							}
						});
					}
				}
			}).show();
		}
	},

	isExistConfig: function(id) {
		var me = this,
			pageConfig = me.getTabPage(id);

		if (typeof pageConfig === "undefined") {
			if (console && console.log) {
				console.log("未配置page 信息, 请到extjsConfig 配置controller view, id:" + id);
			}
			return false;
		}
		return true;
	},

	loadTabFinish: function(pageConfig, tab, callback) {
		var me = this;

		tab.setLoading(tab.title + ', 加载中...');

		setTimeout(function() {
			me.loadController(pageConfig, tab, callback);
		}, 10);
	},

	loadController: function(pageConfig, tab, callback) {
		var me = this,
			viewportName = pageConfig.viewport,
			controllerName = pageConfig.controller,
			viewport = me.createViewport(viewportName, controllerName),
			controllerClassName = HPSPDM.app.getModuleClassName(controllerName, "controller");

		Ext.require(controllerClassName, function() {
			var controller = me.getController(controllerName);
			tab.controllerId = controller.id;
			tab.add(viewport);
			if (typeof callback === 'function') {
				callback.apply();
			}
		});
	},

	createViewport: function(viewportName, controllerName) {
		var me = this,
			viewportId = me.buildViewportId(controllerName),
			viewportClassName = HPSPDM.app.getModuleClassName(viewportName, "view");

		return Ext.create(viewportClassName, {
			id: viewportId
		});
	},

	openWindow: function(url) {
		var me = this;

		window.open(url, "_blank");
	},

	closeTab: function(tab) {
		var me = this,
			controllerId = me.getControllerId(tab);

		me.destroyController(controllerId);
	},

	destroyController: function(controllerId) {
		var me = this;

		HPSPDM.app.eventbus.unlisten(controllerId);
		HPSPDM.app.controllers.remove({
			id: controllerId
		});
	},

	getTabPage: function(id) {
		var me = this;

		return HPSPDM.extjsConfig.pages[id];
	},

	getController: function(controllerName) {
		var me = this;

		return HPSPDM.app.getController(controllerName);
	},

	getControllerId: function(component) {
		var me = this;

		return component.controllerId;
	},

	buildViewportId: function(controllerName) {
		var me = this,
			name = controllerName.toLowerCase().replace(/\./g, "-");

		return Ext.String.format("viewport-" + name);
	}
});