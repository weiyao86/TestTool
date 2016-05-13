Ext.define('HPSPDM.store.suppliers.SupplierInfoPart', {
	extend: 'Ext.ux.store.Base',
	model: 'HPSPDM.model.suppliers.SupplierInfoPart',
	proxyAPI: {
		read: 'suppliers/read',
		create: 'suppliers/create',
		update: 'suppliers/update',
		destroy: 'suppliers/destroy'
	}
});