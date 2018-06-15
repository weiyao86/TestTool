/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */
Ext.require([
	'Ext.chart.*',
	'Ext.data.*',
	'Ext.container.*',
	'Ext.Component'
]);
Ext.application({
	name: 'et6',

	appFolder: 'app',

	extend: 'et6.Application',

	requires: [
		'et6.view.main.Main'
	],

	// The name of the initial view to create. With the classic toolkit this class
	// will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
	// modern toolkit, the main view will be added to the Viewport.
	//
	mainView: 'et6.view.main.Main'

	//-------------------------------------------------------------------------
	// Most customizations should be made to et6.Application. If you need to
	// customize this file, doing so below this section reduces the likelihood
	// of merge conflicts when upgrading to new versions of Sencha Cmd.
	//-------------------------------------------------------------------------
});