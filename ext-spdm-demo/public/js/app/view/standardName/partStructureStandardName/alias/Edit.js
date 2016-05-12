Ext.define('SPDM.view.standardName.partStructureStandardName.alias.Edit', {
	extend: 'Ext.ux.component.edit.Edit',
	alias: 'widget.aliasedit',
	requires: ['Ext.ux.component.combo.BaseCombo', 'Ext.util.ajax'],
	title: '别名',
	items: [{
		items: [{
			xtype: 'displayfield',
			name: 'nodeType',
			fieldLabel: '类型',
			allowBlank: true
		}, {
			xtype: 'displayfield',
			fieldLabel: '名称',
			name: 'nodeDesc',
			allowBlank: true
		}, {
			xtype: 'hiddenfield',
			name: 'nodeId'
		}, {
			xtype: 'hiddenfield',
			name: 'id'
		}, {
			fieldLabel: '别名(中文)',
			name: 'namezh'
		}, {
			fieldLabel: '别名(英文)',
			name: 'nameen',
			allowBlank: true
		}, {
			fieldLabel: '首字母(中文)',
			name: 'initiazh',
			allowBlank: true
		}, {
			fieldLabel: '首字母(英文)',
			name: 'initiaen',
			allowBlank: true
		}, {
			xtype: 'textareafield',
			fieldLabel: '维护备注',
			name: 'remark',
			allowBlank: true,
			anchor: '100%'
		}]
	}]
});