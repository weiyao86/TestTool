Ext.define('SPDM.model.master.Menu', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'id' },
        { name: 'url'},
        { name: 'text'},
        { name: 'children'},
        { name: 'pingyin', mapping:function (data) {
        	return Ext.util.pingyin.getFullChars(data.text);
        }},
        {name: 'py', mapping:function(data){
        	return Ext.util.pingyin.getCamelChars(data.text);
        }}
    ]
});