Ext.define('HPSPDM.store.suppliers.SupplierInfo', {
	extend: 'Ext.ux.store.Base',
	model: 'HPSPDM.model.suppliers.SupplierInfo',
	proxyAPI: {
		read: 'suppliers/read',
		create: 'suppliers/create',
		update: 'suppliers/update',
		destroy: 'suppliers/destroy'
	}
});