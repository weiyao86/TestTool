// app.js
Ext.onReady(function() {
	var extjsConfig = SPDM.extjsConfig,
		namespace = SPDM.globalConfig.namespace,
		startPage = extjsConfig.pages[extjsConfig.pageCode];

	Ext.QuickTips.init();

	Ext.Loader.setConfig({
		enabled: true,
		paths: {
			'Ext.ux': extjsConfig.uxFolder
		}
	});

	Ext.application({
		name: namespace,
		appFolder: extjsConfig.appFolder,
		controllers: [startPage.controller],
		launch: function() {

			Ext.create(namespace + ".view." + startPage.viewport);
		}
	});
});