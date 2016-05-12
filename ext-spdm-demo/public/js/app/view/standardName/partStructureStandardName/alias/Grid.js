Ext.define('SPDM.view.standardName.partStructureStandardName.alias.Grid', {
    extend: 'Ext.ux.component.grid.Grid',
    alias: 'widget.partstructurestandardnamealiasgrid',
    store: 'SPDM.store.standardName.partStructureStandardName.alias.Alias',
    destroyKeys: ["id"],
    rownumberer: true,
    tbar: [{
        xtype: 'button',
        text: '添加',
        action: 'create',
        iconCls: 'icon-min-add',
        disabled:true,
        handler: function(that) {
            this.up("grid").fireEvent("createRecord");
        }
    }, '-', {
        xtype: 'button',
        text: '修改',
        action: 'update',
        disabled: true,
        singleSelectEnable: true,
        iconCls: 'icon-min-edit',
        handler: function(that) {
            this.up("grid").fireEvent("updateRecord");
        }
    }, '-', {
        xtype: 'button',
        text: '删除',
        disabled: true,
        action: 'destroy',
        iconCls: 'icon-min-delete',
        handler: function(that) {
            this.up("grid").fireEvent("deleteRecord");
        }
    }],
    columns: [{
        header: '别名(中文)',
        dataIndex: 'namezh',
        locked: true
    }, {
        header: '别名(英文)',
        dataIndex: 'nameen',
        locked: true
    }, {
        header: '首字母(中文)',
        dataIndex: 'initiazh'
    }, {
        header: '首字母(英文)',
        dataIndex: 'initiaen'
    }, {
        header: '维护备注',
        dataIndex: 'remark'
    }, {
        header: '创建人',
        dataIndex: 'createdBy'
    }, {
        header: '创建时间',
        dataIndex: 'createdDate'
    }, {
        header: '修改人',
        dataIndex: 'modifiedBy'
    }, {
        header: '修改时间',
        dataIndex: 'modifiedDate'
    }]
});