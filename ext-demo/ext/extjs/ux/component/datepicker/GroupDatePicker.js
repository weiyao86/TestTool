Ext.define('Ext.ux.component.datepicker.GroupDatePicker', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.groupdatepicker',
    layout: 'hbox',
    border: 0,
    allowBlank: true,
    initComponent: function() {
        var me = this;

        me.setConfig();
        me.buildDateRange();
        me.callParent(arguments);
    },
    setConfig: function() {
        var me = this,
            fieldWidth = 190,
            labelWidth = 60,
            autoId = me.getAutoId(),
            startDateId = me.name + "_start_" + autoId,
            endDateId = me.name + "_end_" + autoId,
            endBoxWidth = (me.fieldWidth || fieldWidth) - (me.labelWidth || labelWidth);

        me.items[0].id = startDateId;
        me.items[0].name = me.startName;
        me.items[0].endDateField = endDateId;
        me.items[0].width = me.fieldWidth || fieldWidth;
        me.items[0].labelWidth = me.labelWidth || labelWidth;
        me.items[0].allowBlank = me.allowBlank;
        me.items[0].fieldLabel = me.fieldLabel;

        me.items[2].id = endDateId;
        me.items[2].name = me.endName;
        me.items[2].width = endBoxWidth;
        me.items[2].allowBlank = me.allowBlank;
        me.items[2].startDateField = me.startDateId;
    },

    buildDateRange: function() {

        Ext.apply(Ext.form.VTypes, {
            daterange: function(val, field) {
                var date = field.parseDate(val);

                if (!date) {
                    return;
                }
                if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
                    var start = Ext.getCmp(field.startDateField);
                    start.setMaxValue(date);
                    start.validate();
                    this.dateRangeMax = date;
                } else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
                    var end = Ext.getCmp(field.endDateField);
                    end.setMinValue(date);
                    end.validate();
                    this.dateRangeMin = date;
                }
                return true;
            }
        });
    },
    defaults: {
        enableKeyEvents: true
    },
    items: [{
        vtype: 'daterange',
        xtype: 'datefield',
        format: 'Y-m-d',
        range: 'start'
    }, {
        xtype: 'label',
        text: '-',
        width: 5
    }, {
        vtype: 'daterange',
        xtype: 'datefield',
        format: 'Y-m-d',
        labelWidth: 0,
        range: 'end',
        getValue: function() {
            if (this.value) {
                return Ext.Date.add(this.value, Ext.Date.DAY, 1);
            }
        }
    }]
});