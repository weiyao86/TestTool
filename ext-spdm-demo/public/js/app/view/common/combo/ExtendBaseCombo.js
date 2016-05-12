Ext.define('SPDM.view.common.combo.ExtendBaseCombo', {
	extend: 'Ext.ux.component.combo.BaseCombo',
	alias: 'widget.extendBaseCombo',
	queryCaching: false,
	noCache: true,
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},
	initComponent: function() {
		var me = this;
		me.controller = me.getController('standardName.PartStructureStandardName');
		me.callParent(arguments);
	},

	buildUrl: function() {
		var me = this,
			store = me.getStore(),
			form,
			id,
			url;

		if (me.dependField !== null) {
			form = me.up("form").getForm();
			id = form.findField(me.dependField).getValue();
		}

		if (!me.noComboUrl)
			url = me.controller.baseComboDomainUrl;
		else
			url = me.controller.baseDomainUrl;

		url = me.url.replace(/{domainUrl}/, url).replace(/{id}/, id);
		store.proxy.url = url;
	}

});