Ext.define('SPDM.view.standardName.partStructureStandardName.Navigation', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.partstructurestandardnamenavigation',
	width: "100%",
	border: false,
	bodyPadding: 5,
	tpl: '{desc} <a href="javascript:;" data-action="refQty" data-id="{id}" title="当前节点在整棵数的存在数量">[{m}]</a> <a href="javascript:;" data-action="useQty" title="当前节点关联到的OE件号数量">[{n}]</a>',

	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},

	afterRender: function() {
		var me = this;

		me.controller = me.getController('standardName.PartStructureStandardName');

		me.callParent(arguments);
	},

	initEvents: function() {
		var me = this;

		me.getEl().on('click', function(e) {
			var el = Ext.fly(e.target),
				id = el.getAttribute('data-id'),
				action = el.getAttribute('data-action');

			switch (action) {
				case 'refQty':
					me.findRefNode(id);
					break;
				case 'useQty':
					// TODO
					break;
				default:
					break;
			}
		});
	},

	findRefNode: function(id) {
		var me = this;

		me.fireEvent('findRefNode', id);
	},

	clearNavigationContent: function() {
		var me = this;

		me.update('');
	},

	setNavigationContent: function(id, desc) {
		var me = this;

		Ext.util.ajax({
			url: me.controller.baseDomainUrl + 'node/info?id=' + id,
			beforerequest: function() {
				me.setLoading('加载中, 请稍候...');
			},
			callback: function() {
				me.setLoading(false);
			},
			success: function(root) {
				var result = root.result || {},
					data = {
						desc: desc,
						m: result.m,
						n: result.n,
						id: id
					}
				me.update(data);
			}
		});
	}
});