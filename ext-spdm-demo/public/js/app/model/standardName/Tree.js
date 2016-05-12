Ext.define('SPDM.model.standardName.Tree', {
	extend: 'Ext.data.Model',
	fields: [{
		name: 'id'
	},{
		name: 'type'
	},  {
		name: 'text'
	}, {
		name: 'url'
	}, {
		name: 'children'
	}, {
		name: 'leaf'
	}, {
		name: 'expanded'
	},{
		name: 'checked',
		mapping:function(){return false;}
	}]
});