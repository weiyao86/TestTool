Ext.define('DEMO.view.master.Viewport', {
	extend: 'Ext.container.Viewport',
	requires: ['DEMO.view.master.Headcontent'],
	layout: 'border',
	border: true,
	// width: '100%',
	// height: '100%',
	id: 'viewport',
	items: [{
		xtype: 'headcontent',
		region: 'north'
	}, {
		region: 'center',
		xtype: 'panel'
	}]
})