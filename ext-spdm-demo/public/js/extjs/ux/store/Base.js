Ext.define('Ext.ux.store.Base', {
    extend: 'Ext.data.Store',
    autoLoad: false,
    autoSync: true,
    autoDestroy: true,
    remoteSort: true,
    pageSize: 20,
    requires: ['Ext.ux.proxy.Ajax'],
    constructor: function(config) {
        var me = this,
            config = config || me;

        me.buildProxy(config);
        me.callParent(arguments);
    },

    buildProxy: function(config) {
        var me = this,
            api = typeof config.proxyAPI === "function" ? config.proxyAPI.call(me) : config.proxyAPI;

        me.proxy = Ext.create("Ext.ux.proxy.Ajax", {
            reader: {
                method: 'get',
                type: 'json',
                root: 'list',
                totalProperty: "total"
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            api: api,
            noCache: true,
            listeners: {
                exception: function(that, response, operation, eOpts) {
                    me.handlerException(operation, response);
                }
            }
        });
    },

    handlerException: function(operation, response) {
        var me = this,
            error = operation.getError();

        if (Ext.isObject(error)) {
            switch (status) {
                case 301:
                case 401:
                    Ext.Msg.alert("错误", "被请求的地址已过期，请重新登录");
                    window.location.href = window.location.href;
                    break;
                default:
                    me.fireEvent("aftererror", operation, response);
                    break;
            }
        }
    },

    listeners: {
        write: function(store, operation) {
            var me = this;

            me.fireEvent("aftersuccess", operation);
        }
    }
});