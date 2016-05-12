Ext.define('SPDM.view.standardName.partStructureStandardName.specification.Grid', {
    extend: 'Ext.ux.component.grid.Grid',
    alias: 'widget.partstructurestandardnamespecificationgrid',
    store: 'SPDM.store.standardName.partStructureStandardName.specification.Specification',
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
        header: '规格分组',
        dataIndex: 'specGroupName',
        locked: true
    }, {
        header: '规格',
        dataIndex: 'specName',
        locked: true
    }, {
        header: '规格值',
        dataIndex: 'specvalName',
        locked: true
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