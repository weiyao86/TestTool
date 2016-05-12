Ext.define('SPDM.view.standardName.partStructureStandardName.drawing.DrawingRow', {
	extend: 'Ext.form.Panel',
	alias: 'widget.drawingviewrow',
	border: false,
	requires: [
		'Ext.ux.component.window.ImageViewer',
		'Ext.ux.component.field.ImageField',
		'Ext.ux.plugin.ImageViewer'
	],
	itemflag: 'imgViewFormPanel',
	items: [{
		layout: 'column',
		border: false,
		items: [{
			layout: {
				type: 'hbox',
				pack: 'center',
				align: 'middle'
			},
			items: [{
				xtype: 'imagefield',
				name: 'filename',
				cdnPath: SPDM.globalConfig.cdnPath,
				cdnFolder: SPDM.globalConfig.referenceImageFolder,
				nopicPath: SPDM.globalConfig.nopicPath,
				noImgFile: SPDM.globalConfig.nopicName,
				plugins: ['imageviewer']
			}],
			margin: 10,
			height: 135,
			width: 150,
			columnWidth: 0.30
		}, {
			xtype: 'panel',
			layout: 'column',
			columnWidth: 0.70,
			border: false,
			style: 'border-width:0 0 1px 0;border-style:solid;padding-bottom:10px;',
			defaults: {
				xtype: 'displayfield',
				margin: 10,
				labelWidth: 70,
				columnWidth: 0.50
			},
			items: [{
				xtype: 'hiddenfield',
				name: 'parentId'
			}, {
				xtype: 'hiddenfield',
				name: 'id'
			}, {
				fieldLabel: '维护备注',
				name: 'remark',
				columnWidth: 1
			}, {
				fieldLabel: '创建时间',
				name: 'createdDate'
			}, {
				fieldLabel: '创建者',
				name: 'createdBy'
			}, {
				fieldLabel: '修改时间',
				name: 'modifiedDate'
			}, {
				fieldLabel: '修改者',
				name: 'modifiedBy'
			}],
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				defaults: {
					margins: "0 10 0 10"
				},
				layout: {
					align: 'middle',
					pack: 'center',
					type: 'hbox'
				},
				items: [{
					xtype: 'button',
					action: "up",
					text: "上移",
					handler: function() {
						var me = this,
							panel = me.up('[itemflag=imgViewFormPanel]'),
							parentPanel = me.up('[itemId=standardDrawingview]');

						parentPanel.fireEvent('upmove', panel);
					}
				}, {
					xtype: 'button',
					action: "down",
					text: "下移",
					handler: function() {
						var me = this,
							panel = me.up('[itemflag=imgViewFormPanel]'),
							parentPanel = me.up('[itemId=standardDrawingview]');

						parentPanel.fireEvent('downmove', panel);
					}
				}, {
					xtype: 'button',
					action: "update",
					text: "修改",
					handler: function() {
						var me = this,
							panel = me.up('[itemflag=imgViewFormPanel]'),
							parentPanel = me.up('[itemId=standardDrawingview]');
						parentPanel.fireEvent('update', panel);
					}
				}, {
					xtype: 'button',
					action: "del",
					text: "删除",
					handler: function() {
						var me = this,
							panel = me.up('[itemflag=imgViewFormPanel]'),
							parentPanel = me.up('[itemId=standardDrawingview]');
						parentPanel.fireEvent('del', panel);
					}
				}, {
					xtype: 'button',
					action: "bigview",
					text: "大图",
					handler: function() {
						var me = this,
							img = me.up('form').down("[name=filename]"),
							config = {
								cdnPath: SPDM.globalConfig.cdnPath, //SPDM.globalConfig.path,
								cdnFolder: SPDM.globalConfig.referenceImageFolder,
								nopicPath: SPDM.globalConfig.nopicPath,
								noImgFile: SPDM.globalConfig.nopicName,
								value: img.lastValue
							};

						Ext.create('Ext.ux.component.window.ImageViewer', config).show();
					}
				}]
			}]
		}]
	}]
});