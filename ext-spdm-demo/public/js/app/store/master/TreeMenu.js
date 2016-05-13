Ext.define('HPSPDM.store.master.TreeMenu', {
	extend: 'Ext.data.TreeStore',
	model: 'HPSPDM.model.master.Menu',
	proxy: {
		type: 'ajax',
		url: '/web-inf/mocks/__files/menu-data.json',
		reader: {
			type: 'json',
			root: 'children'
		}
	}
});