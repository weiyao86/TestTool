Ext.define('SPDM.store.master.TreeMenu', {
	extend: 'Ext.data.TreeStore',
	model: 'SPDM.model.master.Menu',
	proxy: {
		type: 'ajax',
		url: '/web-inf/mocks/__files/menu-data.json',
		reader: {
			type: 'json',
			root: 'children'
		}
	}
});