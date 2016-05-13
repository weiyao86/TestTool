Ext.define('HPSPDM.model.master.Menu', {
	extend: 'Ext.data.Model',
	statics: {
		startIndex: 10
	},
	fields: [{
		name: 'id'
	}, {
		name: 'code',
		mapping: function(data) {
			if (data.leaf) {
				return ++HPSPDM.model.master.Menu.startIndex;
			}
		}
	}, {
		name: 'url'
	}, {
		name: 'text'
	}, {
		name: 'children'
	}, {
		name: 'pingyin',
		mapping: function(data) {
			return Ext.util.pingyin.getFullChars(data.text);
		}
	}, {
		name: 'py',
		mapping: function(data) {
			return Ext.util.pingyin.getCamelChars(data.text);
		}
	}, {
		name: 'qtip',
		mapping: function(data) {
			if (data.leaf) {
				return HPSPDM.model.master.Menu.startIndex + ':' + data.text;
			}
		}
	}]
});