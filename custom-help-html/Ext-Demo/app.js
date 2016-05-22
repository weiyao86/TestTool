Ext.onReady(function() {
	var gconfig = DEMO.globalConfig,
		extconfig = DEMO.extjsConfig,
		pageConfig = extconfig.pages[pageCode];

	Ext.application({
		name: gconfig.namespace,
		appFolder: './app/',
		controllers: [pageConfig.controller],
		launch: function() {
			Ext.create(gconfig.namespace + ".view." + pageConfig.viewport)
		}
	});
});