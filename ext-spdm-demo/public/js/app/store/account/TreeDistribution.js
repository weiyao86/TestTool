Ext.define('HPSPDM.store.account.TreeDistribution', {
	extend: 'Ext.data.TreeStore',
	model: 'HPSPDM.model.master.Menu',
	proxy: {
		type: 'ajax',
		url: '/web-inf/mocks/__files/tree.json',
		reader: {
			type: 'json',
			root: 'children'
		}
	}
});