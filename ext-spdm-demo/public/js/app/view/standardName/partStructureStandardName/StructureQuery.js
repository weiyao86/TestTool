Ext.define('SPDM.view.standardName.partStructureStandardName.StructureQuery', {
	extend: 'Ext.ux.component.filter.Query',
	alias: 'widget.partstructurestandardnamestructurequery',
	requires: [
		'SPDM.view.common.combo.ExtendBaseCombo',
		'Ext.ux.component.button.LinkButton'
	],
	autoScroll: null,
	autoLabelWidth: false,
	width: "100%",
	bodyPadding: '5px 5px 0 5px',
	border: true,
	dockedItems: null,
	layout: 'vbox',
	defaults: {
		width: '100%',
		layout: 'hbox',
		margin: '0 0 5px 0',
		border: false,
		defaults: {
			flex: 1,
			border: false,
			enableKeyEvents: true
		}
	},
	items: [{
		items: [{
			xtype: 'textfield',
			name: 'name',
			emptyText: '请输入节点描述'
		}]
	}, {
		items: [{
			xtype: 'extendBaseCombo',
			url: '{domainUrl}attlev/list',
			name: 'attlevId',
			margin: '0 5px 0 0',
			emptyText: '请选择关注级别',
			withAll: false
		}, {
			xtype: 'extendBaseCombo',
			emptyText: '请选择呈现范围',
			name: 'scope',
			localData: [{
				code: 'PS',
				name: '仅呈现配件标准名称'
			}, {
				code: 'AS',
				name: '仅呈现装配图标准名称'
			}],
			withAll: false
		}]
	}, {
		items: [{
			xtype: 'extendBaseCombo',
			url: '{domainUrl}devatt/list',
			name: 'devattId',
			emptyText: '请选择开发属性',
			margin: '0 5px 0 0',
			withAll: false
		}, {
			xtype: 'extendBaseCombo',
			url: '{domainUrl}mapaat/list',
			name: 'maitypId',
			emptyText: '请选择保养属性',
			withAll: false
		}]
	}, {
		items: [{
			items: [{
				xtype: 'linkbutton',
				action: 'advancedQuery',
				text: '高级查询'
			}]
		}, {
			layout: {
				type: "hbox",
				pack: "end"
			},
			items: [{
				xtype: 'button',
				text: '查询',
				action: 'query',
				margin: '0 5px 0 0'
			}, {
				xtype: 'button',
				action: 'reset',
				text: '清空',
			}]
		}]
	}]
});