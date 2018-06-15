function getStore() {
	// Reverse order data should get sorted by the MemoryProxy
	var myData = [
		['E.I. du Pont de Nemours and Company', 40.48, 0.51, 1.28, '9/1 12:00am'],
		['Citigroup, Inc.', 49.37, 0.02, 0.04, '9/1 12:00am'],
		['Caterpillar Inc.', 67.27, 0.92, 1.39, '9/1 12:00am'],
		['Boeing Co.', 75.43, 0.53, 0.71, '9/1 12:00am'],
		['AT&T Inc.', 31.61, -0.48, -1.54, '9/1 12:00am'],
		['American International Group, Inc.', 64.13, 0.31, 0.49, '9/1 12:00am'],
		['American Express Company', 52.55, 0.01, 0.02, '9/1 12:00am'],
		['Altria Group Inc', 83.81, 0.28, 0.34, '9/1 12:00am'],
		['Alcoa Inc', 29.01, 0.42, 1.47, '9/1 12:00am'],
		['3m Co', 71.72, 0.02, 0.03, '9/1 12:00am']
	];

	return Ext.create('Ext.data.ArrayStore', {
		fields: [{
			name: 'company'
		}, {
			name: 'price',
			type: 'float',
			convert: null
		}, {
			name: 'change',
			type: 'float',
			convert: null
		}, {
			name: 'pctChange',
			type: 'float',
			convert: null
		}, {
			name: 'lastChange',
			type: 'date',
			dateFormat: 'n/j h:ia'
		}],
		sorters: {
			property: 'company',
			direction: 'ASC'
		},
		data: myData,
		pageSize: 3
	});
}
Ext.define('et6.view.main.Store', {
	extend: 'Ext.data.Store',
	autoLoad: false,
	autoSync: true,
	autoDestroy: true,
	remoteSort: true,
	pageSize: 3,
	proxy: {
		type: 'ajax',
		url: './resources/data.json',
		reader: {
			type: 'json',
			rootProperty: 'data'
		},
		listeners: {
			write: function(store, operation) {
				var me = this;
				debugger;
				//me.fireEvent("aftersuccess", operation);
			},
			exception: function(that, request, operation, eOpts) {
				debugger;
			}
		}
	},
	fields: [{
		name: 'company'
	}, {
		name: 'price',
		type: 'float',
		convert: null
	}, {
		name: 'change',
		type: 'float',
		convert: null
	}, {
		name: 'pctChange',
		type: 'float',
		convert: null
	}, {
		name: 'lastChange',
		type: 'date',
		dateFormat: 'n/j h:ia'
	}],
	listeners: {
		write: function(store, operation) {
			var me = this;
			debugger;
			//me.fireEvent("aftersuccess", operation);
		},
		exception: function(that, request, operation, eOpts) {
			debugger;
		}
	}
});

var store = getStore(),
	pagingBar = Ext.widget('pagingtoolbar', {
		// store: store,
		displayInfo: true,
		displayMsg: 'Displaying topics {0} - {1} of {2}'
	});

Ext.define("et6.view.main.Settings", {
	extend: 'Ext.grid.Panel',
	xtype: 'gridpanel',
	title: 'GridPanel',
	collapsible: true,
	columnLines: true,
	border: true,
	alias: 'widget.settings',
	store: Ext.create('et6.view.main.Store'),
	columns: [{
		header: "Company",
		flex: 1,
		sortable: true,
		dataIndex: 'company'
	}, {
		header: "Price",
		width: 75,
		sortable: true,
		dataIndex: 'price'
	}, {
		header: "Change",
		width: 80,
		sortable: true,
		dataIndex: 'change'
	}, {
		header: "% Change",
		width: 95,
		sortable: true,
		dataIndex: 'pctChange'
	}, {
		header: "Last Updated",
		width: 110,
		sortable: true,
		xtype: 'datecolumn',
		dataIndex: 'lastChange'
	}],
	loadMask: true,

	bbar: pagingBar,
	tbar: [{
			text: 'Toolbar'
		},
		'->', {
			xtype: 'textfield',
			triggers: {
				foo: {
					cls: Ext.baseCSSPrefix + 'form-clear-trigger',
					weight: -1,
					handler: function() {
						console.log('foo trigger clicked');
					}
				},
				bar: {
					cls: Ext.baseCSSPrefix + 'form-search-trigger',
					weight: -1,
					handler: function() {
						console.log('bar trigger clicked');
					}
				}
			}
		}
	],
	listeners: {
		afterrender: function() {
			this.getStore().load();
		}
	},
	initComponent: function() {
		this.bbar.store = this.getStore();
		this.callParent(arguments);
	}
});