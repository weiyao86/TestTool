Ext.define('SPDM.controller.master.Frame', {
	extend: 'Ext.app.Controller',
	model: ['master.Menu'],
	requires: [
		'Ext.util.ajax',
		'Ext.util.pingyin',
		'Ext.ux.plugin.TabCloseMenu',
		'SPDM.view.account.changePassword.Form'
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
			"#header-panel": {
				afterrender: me.headerRender
			},
			"#cascading-menu": {
				render: me.loadCascadingMenu
			},
			"#tree-menu": {
				render: me.loadTreeMenu
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
					default:
						break;
				}
			},
			that, {
				delegate: 'a'
			}
		);
	},

	logoutSys: function() {
		var me = this;

		Ext.Msg.confirm('提示', '您确认退出当前系统?', function(btn) {
			if (btn === 'yes') {
				Ext.util.ajax({
					url: SPDM.globalConfig.path + '/account/logout',
					success: function(root) {
						window.location.href = SPDM.globalConfig.path;
					}
				})
			}
		});
	},

	showChangePassword: function() {
		var me = this,
			changePwdWindow = Ext.create('SPDM.view.account.changePassword.Form');

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

	loadPage: function(record) {
		if (!record.get('leaf')) return;

		var me = this,
			url = record.get("url");

		if (Ext.isString(url) && url.length > 0) {
			me.openWindow(url);
		} else {
			me.addTab(record);
		}
	},

	addTab: function(record) {
		var me = this,
			id = record.get("id"),
			title = record.get('text'),
			tabs = Ext.getCmp('tabs'),
			tab = Ext.getCmp("tab_" + id),
			pageConfig = me.getTabPage(id);

		if (typeof pageConfig === "undefined") {
			if (console && console.log) {
				console.log("未配置page 信息, 请到extjsConfig 配置controller view, id:" + id);
			}
			return;
		}

		if (tab) {
			tabs.setActiveTab(tab);
			return;
		}

		if (!me.isLoaded) return;

		me.isLoaded = false;

		tabs.add({
			title: title,
			id: "tab_" + id,
			controllerId: '11',
			items: [],
			layout: "fit",
			closable: true,
			closeAction: "destroy",
			listeners: {
				afterrender: function() {
					me.loadTabFinish(pageConfig, this);
				}
			}
		}).show();
	},

	loadTabFinish: function(pageConfig, tab) {
		var me = this;

		tab.setLoading(tab.title + ', 加载中...');

		setTimeout(function() {
			me.loadController(pageConfig, tab);
		}, 10);
	},

	loadController: function(pageConfig, tab) {
		var me = this,
			viewportName = pageConfig.viewport,
			controllerName = pageConfig.controller,
			viewport = me.createViewport(viewportName, controllerName),
			controllerClassName = SPDM.app.getModuleClassName(controllerName, "controller");

		Ext.require(controllerClassName, function() {
			var controller = me.getController(controllerName);
			tab.controllerId = controller.id;
			tab.add(viewport);
			tab.setLoading(false);
			me.isLoaded = true;
		});
	},

	createViewport: function(viewportName, controllerName) {
		var me = this,
			viewportId = me.buildViewportId(controllerName),
			viewportClassName = SPDM.app.getModuleClassName(viewportName, "view");

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

		SPDM.app.eventbus.unlisten(controllerId);
		SPDM.app.controllers.remove({
			id: controllerId
		});
	},

	getTabPage: function(id) {
		var me = this;

		return SPDM.extjsConfig.pages[id];
	},

	getController: function(controllerName) {
		var me = this;

		return SPDM.app.getController(controllerName);
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