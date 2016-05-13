Ext.define('HPSPDM.store.account.Users', {
	extend: 'Ext.ux.store.Base',
	model: 'HPSPDM.model.account.Users',
	isUpload: true,
	proxyAPI: {
		read: 'account/read',
		create: 'account/create',
		update: 'account/update',
		destroy: 'account/destroy'
	}
});