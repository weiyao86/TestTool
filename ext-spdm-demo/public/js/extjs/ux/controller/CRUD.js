Ext.define('Ext.ux.controller.CRUD', {
	extend: 'Ext.ux.controller.Base',
	editMode: ["create", "update"],
	editView: null,
	actions: {
		'read': '读取',
		'create': '创建',
		'update': '更新',
		'destroy': '删除'
	},
	advancedQueryParams: [],

	viewportReady: function() {
		var me = this;

		me.createControl();
		me.initStoreEvent();
		me.createExportForm();

		if (Ext.isFunction(me.controllerReady)) {
			me.controllerReady.apply(me, []);
		}
	},

	createControl: function() {
		var me = this,
			selectors = {},
			viewportId = me.getViewportId();

		selectors["#" + viewportId + " > form[itemId=query-form]"] = {
			queryRecord: function() {

				me.readRecord();
			},
			advancedQuery: function() {
				me.openAdvancedQueryWindow();
			}
		};

		selectors["#" + viewportId + " > grid[itemId=grid-list]"] = {
			createRecord: function() {
				me.onCreateRecord();
			},
			updateRecord: function() {
				me.onUpdateRecord();
			},
			destroyRecord: function(params) {
				me.destroyRecord(params);
			},
			exportRecord: function(that) {
				me.exportRecord(that);
			}
		};

		me.control(selectors);
	},

	initStoreEvent: function() {
		var me = this,
			store = me.getGrid().getStore();

		store.on("beforeload", function(that) {
			me.addStoreFilters(that);
		});
		store.on("aftersuccess", function(operation) {
			me.handlerSuccess(operation);
		});
		store.on("aftererror", function(operation, response) {
			me.handlerError(operation, response);
		});
	},

	addStoreFilters: function(store) {
		var me = this,
			queryForm = me.getQuery(),
			params = queryForm.getFilters();

		store.proxy.extraFilters = params;
	},

	onCreateRecord: function() {
		var me = this;

		me.openEditWindow(me.editMode[0]);
	},

	onUpdateRecord: function() {
		var me = this;

		me.openEditWindow(me.editMode[1]);
	},

	openEditWindow: function(editMode) {
		var me = this,
			selection = me.getGridSelection(),
			record = selection.length > 0 ? selection[0] : {};

		me.createEditWindow(editMode);
		me.setEditFormRecord(editMode);
		me.initEditWindowEvent();
		me.editWindow.show();
	},

	createEditWindow: function(editMode) {
		var me = this,
			className;

		if (Ext.isString(me.editView)) {
			className = me.editView;
		} else {
			className = me.getViewClassPath() + ".Edit";
		}

		me.editWindow = Ext.create(className, {
			editMode: editMode
		});
	},

	setEditFormRecord: function(editMode) {
		var me = this,
			selection = me.getGridSelection(),
			record = selection.length > 0 ? selection[0] : {};

		if (editMode === "update") {
			if (me.editWindow.setRecord) {
				me.editWindow.setRecord(record);
			}
		}
	},

	initEditWindowEvent: function() {
		var me = this;

		me.editWindow.on("dosave", function(params) {
			me.doSave(params);
		});
	},

	openAdvancedQueryWindow: function() {
		var me = this,
			config = me.config.advancedSearch,
			advancedQuery = Ext.create("Ext.ux.component.filter.AdvancedQuery", {
				propertyUrl: config.propertyUrl,
				operatorUrl: config.operatorUrl,
				advancedQueryParams: me.advancedQueryParams,
				listeners: {
					doQuery: function(params) {
						me.doAdvancedQuery(params);
					}
				}
			});

		advancedQuery.show();
	},

	doAdvancedQuery: function(params) {
		var me = this;

		me.advancedQueryParams = params;
		me.readRecord(params);
	},

	doSave: function(params) {
		var me = this,
			editMode = me.editWindow.editMode;

		switch (editMode) {
			case me.editMode[0]:
				me.createRecord(params);
				break;
			case me.editMode[1]:
				me.updateRecord(params);
				break;
			default:
				break;
		}
	},

	readRecord: function() {
		var me = this,
			grid = me.getGrid(),
			store = grid.getStore();

		me.clearGridSelection(grid);
		store.loadPage(1);
	},

	createRecord: function(params) {
		var me = this,
			value,
			store = me.getGrid().getStore(),
			form = me.editWindow.down("form"),
			values = form.getValues();

		store.proxy.extraJsonData = params;
		store.add(values);
	},

	updateRecord: function(params) {
		var me = this,
			store = me.getGrid().getStore(),
			form = me.editWindow.down("form"),
			record = form.getRecord();

		store.proxy.extraJsonData = params;
		record.set(params);

		if (!record.dirty) {
			Ext.Msg.alert('提示', '您没有对表单做任何修改, 无需保存');
			me.editWindow.setLoading(false);
		}
	},

	destroyRecord: function(params) {
		var me = this,
			grid = me.getGrid(),
			store = grid.getStore(),
			selection = me.getGridSelection();

		store.proxy.extraJsonData = params;
		store.remove(selection);
		me.deselectAll();
	},

	exportRecord: function(that) {
		var me = this,
			grid = me.getGrid(),
			url = that.exportUrl,
			exportParams = me.getExportParams();

		me.exportForm.submit({
			url: url,
			method: 'get',
			params: {
				"parameters": Ext.encode(exportParams)
			},
			standardSubmit: true
		});
	},

	handlerSuccess: function(operation) {
		var me = this,
			grid = me.getGrid(),
			store = grid.getStore(),
			queryForm = me.getQuery(),
			action = operation.action;

		switch (action) {
			case "create":
			case "update":
				me.editWindow.setLoading(false);
				me.editWindow.close();
				me.clearGridSelection(grid);
				Ext.Msg.alert("提示", "保存成功");
				break;
			case "destroy":
				Ext.Msg.alert("提示", "删除成功");
				grid.setLoading(false);
				break;
			default:
				break;
		}

		queryForm.doQuery();
	},

	clearGridSelection: function(that) {
		var me = this;

		that.getSelectionModel().clearSelections();
		that.controlToolbarStatus(that, []);
	},

	handlerError: function(operation, response) {
		var me = this,
			grid = me.getGrid(),
			store = grid.getStore();

		if (Ext.Array.contains(me.editMode, operation.action)) {
			me.editWindow.setLoading(false);
		} else {
			grid.setLoading(false);
		}
		Ext.util.errorHandler(response);
		store.rejectChanges();
	},

	deselectAll: function() {

		this.getGrid().getSelectionModel().deselectAll();
	},

	getGrid: function() {

		return this.viewport.down("grid");
	},

	getQuery: function() {

		return this.viewport.down("[itemId=query-form]");
	},

	getGridSelection: function() {

		return this.getGrid().getSelectionModel().getSelection();
	},

	getExportParams: function() {
		var me = this,
			queryForm = me.getQuery(),
			filters = queryForm.getFilters();

		return {
			args: filters
		};
	}
});