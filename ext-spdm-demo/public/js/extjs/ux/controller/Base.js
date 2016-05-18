Ext.define('Ext.ux.controller.Base', {
	extend: 'Ext.app.Controller',

	init: function() {
		var me = this;

		me.initEvents();
		me.callParent(arguments);
	},

	initEvents: function() {
		var me = this,
			selectors = me.createControlSelector();

		me.control(selectors);
	},

	createControlSelector: function() {
		var me = this,
			selectors = {},
			viewportId = me.getViewportId();

		selectors["#" + viewportId] = {
			afterrender: me.viewportAfterRender
		};

		return selectors;
	},

	viewportAfterRender: function(that) {
		var me = this;

		me.viewport = that;

		if (Ext.isFunction(me.viewportReady)) {
			me.viewportReady.apply(me, [that]);
		}
	},

	createExportForm: function() {
		var me = this;

		me.exportForm = Ext.create("Ext.form.Panel", {
			hidden: true,
			strandardSubmit: true
		});

		me.viewport.add(me.exportForm);
	},

	getViewport: function() {
		var viewportId = this.getViewportId();

		return Ext.getCmp(viewportId);
	},

	getViewportId: function() {
		var id = this.id.toLowerCase().replace(/\./g, "-");

		return "viewport-" + id;
	},

	getViewClassPath: function() {
		var me = this,
			className = me.viewport.$className,
			lastIndex = className.lastIndexOf(".");

		return Ext.util.Format.substr(className, 0, lastIndex);
	}
});