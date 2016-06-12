Ext.define('DEMO.view.tree.tree', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.treeDemo',
	store: Ext.create('DEMO.store.tree.tree'),
	width: '100%',
	dockedItems: [{
		xtype: 'toolbar',
		layout: {
			align: 'middle',
			type: 'hbox'
		},
		defaults: {
			xtype: 'button'
		},
		items: [{
			itemId: 'refresh',
			iconCls: 'icon-refresh',
			text: "刷新",
			action: 'refresh'
		}, {
			itemId: 'search',
			iconCls: 'icon-refresh',
			text: "查询",
			action: 'refresh'
		}]
	}],
	initEvents: function() {
		var me = this,
			btnRefresh = me.down('[itemId=refresh]'),
			btnSearch = me.down('[itemId=search]');

		btnRefresh.on('click', function() {
			me.filterNode({
				filters: {
					"name": "后保险杠护板"
				},
				sorts: [],
				paging: {}
			});
		});
		btnSearch.on('click', function() {
			me.filterNode({
				filters: {},
				sorts: [],
				paging: {}
			});
		});
	},
	filterNode: function(params, callback) {
		var me = this,
			store = me.getStore();

		me.setLoading(true);
		store.load({
			params: {
				args: Ext.encode(params)
			},
			callback: function(records, operation, success) {
				me.setLoading(false);
				if (success) {
					if (typeof callback === 'function') {
						callback.apply();
					}
				}
				me.getView().refresh();
			}
		});
	},
	autoDestroy: true,
	useArrows: true,
	rootVisible: true
});