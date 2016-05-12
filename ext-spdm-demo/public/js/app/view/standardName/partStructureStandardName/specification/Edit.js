Ext.define('SPDM.view.standardName.partStructureStandardName.specification.Edit', {
	extend: 'Ext.ux.component.edit.Edit',
	title: '规格与规格值',
	alias: 'widget.specificationedit',
	requires: ['SPDM.view.common.combo.ExtendBaseCombo', 'Ext.util.ajax'],
	items: [{
		items: [{
			xtype: 'hiddenfield',
			name: 'id'
		}, {
			xtype: 'hiddenfield',
			name: 'nodeId'
		}, {
			xtype: 'displayfield',
			name: 'nodeDesc',
			fieldLabel: '配件标准名称',
			allowBlank: true
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '规格分组',
			name: 'specGroupId',
			clearFields: ['specId', 'specvalId'],
			url: '{domainUrl}spegro/list'
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '规格',
			name: 'specId',
			dependField: 'specGroupId',
			clearFields: ['specvalId'],
			queryCaching: false,
			url: '{domainUrl}specif/list?parentCode={id}'
		}, {
			xtype: 'extendBaseCombo',
			fieldLabel: '规格值',
			name: 'specvalId',
			dependField: 'specId',
			queryCaching: false,
			url: '{domainUrl}speval/list?parentCode={id}'
		}, {
			xtype: 'textareafield',
			fieldLabel: '维护备注',
			name: 'remark',
			allowBlank: true,
			anchor: '100%'
		}]
	}]

});