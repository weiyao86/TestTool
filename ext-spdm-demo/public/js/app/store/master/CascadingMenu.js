Ext.define('HPSPDM.store.master.CascadingMenu', {
	extend: 'Ext.data.Store',
	model: 'HPSPDM.model.master.Menu',
	proxy: {
		type: 'ajax',
		url: '/web-inf/mocks/__files/menu-data.json', // HPSPDM.globalConfig.path + '/main/menu',
		reader: {
			type: 'json',
			root: 'children'
		}
	}
});