Ext.define('HPSPDM.model.suppliers.SupplierInfoPart', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'usercode',
		type: 'varchar',
		mapping: 'UserCode'
	}, {
		name: 'username',
		type: 'varchar',
		mapping: 'UserName'
	}]
});