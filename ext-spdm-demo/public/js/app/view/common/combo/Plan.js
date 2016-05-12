Ext.define('SPDM.view.common.combo.Plan', {
  extend: 'Ext.ux.component.combo.BaseCombo',
  alias: 'widget.commoncomboplan',
  queryCaching: false,
  storeAutoLoad: false,
  noCache: true,
  url: SPDM.globalConfig.restpath + '/organization/{organizationId}/plan',
  allowBlank: false,
  blankText: '商品不能以为空',
  targetField: 'organizationId',
  initEvents: function() {
    var me = this;

    me.callParent(arguments);

    me.on('beforequery', function() {
      me.loadPlan();
    });
  },

  loadPlan: function() {
    var me = this,
      store = me.getStore(),
      form = me.up("form").getForm(),
      organizationId = form.findField(me.targetField).getValue();

    if (organizationId && Ext.util.Format.trim(organizationId).length > 0) {
      store.proxy.url = me.url.replace(/{organizationId}/, organizationId);
      return true;
    }

    return false;
  }

});