Ext.define('SPDM.view.master.TreeMenu', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.mastertreemenu',
    border: 0,
    iconCls: 'icon-tree-menu',
    requires: ['Ext.ux.plugin.TreeFilter'],
    plugins: [{
        ptype: 'treefilter',
        allowParentFolders: true
    }],
    useArrows: true,
    dockedItems: [{
        xtype: 'toolbar',
        dock: 'top',
        items: [{
            xtype: 'trigger',
            triggerCls: 'x-form-clear-trigger',
            emptyText: "快速查找...",
            enableKeyEvents: true,
            flex:2,
            onTriggerClick: function () {
                this.reset();
                this.focus();
            },
            listeners: {
                change: function (field, newVal) {
                    var tree = field.up('treepanel'),
                        selectionModel = tree.getSelectionModel();

                    if (selectionModel.hasSelection()) {
                        selectionModel.deselectAll();
                    }

                    tree.filter(newVal);
                },
                keyup: function (field, e, eOpts) {
                    var tree = field.up("treepanel");

                    if (e.getKey() === e.DOWN) {
                        if (tree.visibleNodes && tree.visibleNodes.length > 2) {
                            tree.getSelectionModel().select(tree.visibleNodes[1]);
                        }
                    }
                },
                buffer: 800
            }
        }, '-', {
            tooltip: "全部收起",
            iconCls: 'icon-collapse-all',
            width: 22,
            listeners: {
                click: function (field) {
                    var tree = field.up('treepanel');

                    tree.collapseAll();
                }
            }
        }, '-', {
            tooltip: "全部展开",
            iconCls: 'icon-expand-all',
            width: 22,
            listeners: {
                click: function (field) {
                    var tree = field.up('treepanel');

                    tree.expandAll();
                }
            }
        }]
    }],
    autoDestroy: true,
    autoScroll: false,
    rootVisible: false
});