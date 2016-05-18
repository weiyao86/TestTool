Ext.define('HPSPDM.model.part.PartManage', {
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