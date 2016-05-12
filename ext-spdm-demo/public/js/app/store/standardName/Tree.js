Ext.define('SPDM.store.standardName.Tree', {
    extend: 'Ext.data.TreeStore',
    model: 'SPDM.model.standardName.Tree',
    autoLoad: false,
    mixins: {
        viewBase: 'SPDM.view.common.class.Base'
    },
    proxy: {
        type: 'ajax',
        url: SPDM.globalConfig.path + '/standardname/menu',
        reader: {
            type: 'json',
            root: 'children'
        }
    },
    
    listeners: {
        beforeload: function(store, operation, ops) {
            var me = this,
                controller = me.getController('standardName.PartStructureStandardName');

            store.proxy.url = controller.baseDomainUrl + 'menu';
        }
    },
    
    root:{
    	expanded:true,
    	text:'配件结构标准名称'
    }
});