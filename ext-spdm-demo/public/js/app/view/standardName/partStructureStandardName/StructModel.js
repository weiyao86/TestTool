Ext.define('SPDM.view.standardName.partStructureStandardName.StructModel', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.structmodel',
	requires: ['SPDM.view.common.combo.ExtendBaseCombo'],
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	defaults: {
		margin: "0 10px"
	},
	margin: '5px 0',
	border: false,
	items: [{
		xtype: 'extendBaseCombo',
		itemId: 'structmodel-model',
		fieldLabel: '领域',
		labelWidth: 50,
		name: 'area',
		url: SPDM.globalConfig.path + '/combo/domain/list',
		value: '2'
	}
	// , {
	// 	xtype: 'button',
	// 	itemId: 'structmodel-btn',
	// 	text: '刷新',
	// 	padding: "0 10px",
	// 	name: ''
	// }

	// ,{
	// 	xtype: 'displayfield',
	// 	value: '当前区域:',
	// 	padding: "0 10px",
	// 	name: ''
	// },{
	// 	xtype: 'displayfield',
	// 	itemId:'struct-cur-txt',
	// 	value: '乘用车',
	// 	padding: "0 10px",
	// 	name: ''
	// }
	],
	listeners: {
		afterrender: function() {
			var me = this,
				model = me.down("[itemId=structmodel-model]"),
				btn = me.down("[itemId=structmodel-btn]");
			model.on("change", function() {
				me.fireEvent("refreshBymodel",model);
			});
			// btn.on("click", function() {
			// 	me.fireEvent("refreshBymodel", model);
			// });
		}
	}

});