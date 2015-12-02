Ext.define('Ext.ux.component.combo.BaseCombo', {
    extend: 'Ext.form.ComboBox',
    alias: 'widget.basecombo',
    displayField: 'name',
    valueField: 'code',
    allText: '全部',
    allValue: '',
    withAll: false,
    storeAutoLoad: true,
    queryParam: '',
    extraFields: [],
    editable: false,
    dependField: null,
    clearFields: null,
    noCache: false,
    noComboUrl: null,
    initComponent: function() {
        var me = this;

        if (Ext.isString(me.url)) {
            me.loadRemoteData();
        }
        if (Ext.isArray(me.localData)) {
            me.loadLocalData();
        }

        me.callParent(arguments);
    },

    initEvents: function() {
        var me = this;

        if (me.clearFields !== null) {
            me.on('select', function() {
                me.clearTargetFields();
            });
        }
    },

    clearTargetFields: function() {
        var me = this,
            form = me.up("form").getForm();

        Ext.each(me.clearFields, function(name) {
            var field = form.findField(name);

            field.clearValue();
            field.clearInvalid();
            field.getStore().removeAll();
        });
    },

    loadLocalData: function() {
        var me = this;

        Ext.apply(me, {
            store: {
                fields: [me.valueField, me.displayField],
                data: me.localData
            }
        });
    },

    loadRemoteData: function() {
        var me = this,
            fields = me.getFields();

        Ext.apply(me, {
            store: {
                isLoad: true,
                autoLoad: me.storeAutoLoad,
                fields: fields,
                proxy: {
                    noCache: me.noCache,
                    pageParam: false,
                    startParam: false,
                    limitParam: false,
                    url: me.url,
                    type: 'ajax',
                    reader: {
                        type: 'json',
                        root: 'list'
                    }
                },
                listeners: {
                    load: function(store) {
                        me.addEmptyOption(store);
                    },
                    beforeload: function() {

                        me.buildUrl();
                        return true;
                    }
                }
            }
        });
    },

    getFields: function() {
        var me = this,
            fields = [me.valueField, me.displayField];

        return Ext.Array.merge(fields, me.extraFields);
    },

    addEmptyOption: function(store) {
        if (!this.withAll) return;

        var me = this,
            option = {};

        option[me.displayField] = me.allText;
        option[me.valueField] = me.allValue;
        store.insert(0, [option]);
    },

    buildUrl: function() {
        var me = this,
            store,
            form,
            id;

        if (me.dependField !== null) {
            store = me.getStore();

            form = me.up("form").getForm();

            id = form.findField(me.dependField).getValue();

            if (id === null || id === '') {
                return;
            }
            store.proxy.url = me.url.replace(/{id}/, id).replace(/{domain}/, id);
        }
    }
});