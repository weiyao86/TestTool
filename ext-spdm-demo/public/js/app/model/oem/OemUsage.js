Ext.define('HPSPDM.model.oem.OemUsage', {
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