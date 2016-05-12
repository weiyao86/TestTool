Ext.define('SPDM.store.account.Users', {
    extend: 'Ext.ux.store.Base',
    model: 'SPDM.model.account.Users',
    isUpload:true,
    proxyAPI:{
        read: 'account/read',
        create: 'account/create',
        update: 'account/update',
        destroy: 'account/destroy'
    }
});