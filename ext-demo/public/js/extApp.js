Ext.onReady(function() {
	var globalConfig = DEMO.globalConfig,
		extjsConfig = DEMO.extjsConfig,
		startCtrol = extjsConfig.pages[extjsConfig.pageCode];

	Ext.Loader.setConfig({
		enabled: true,
		paths: {
			"Ext.ux": extjsConfig.uxFolder
		}
	});

	Ext.application({
		name: globalConfig.namespace,
		appFolder: extjsConfig.appFolder,
		controllers: [startCtrol.controller],
		launch: function() {
			Ext.create(globalConfig.namespace + ".view." + startCtrol.viewport);
		}
	});
});