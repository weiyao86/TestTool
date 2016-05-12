Ext.define('SPDM.view.modelRelate.modelManage.drawing.Edit', {
	extend: 'Ext.ux.component.edit.Edit',
	title: '示意图',
	alias: 'widget.drawingedit',
	requires: [
		'Ext.ux.component.button.LinkButton',
		'Ext.ux.component.window.ImageViewer',
		'Ext.ux.component.field.ImageField',
		'Ext.ux.plugin.ImageViewer'
	],
	items: [{
		items: [{
			xtype: 'hiddenfield',
			name: 'id'
		}, {
			xtype: 'hiddenfield',
			name: 'nodeId'
		}, {
			xtype: 'displayfield',
			name: 'nodeType',
			fieldLabel: '类型',
			allowBlank: true
		}, {
			xtype: 'displayfield',
			fieldLabel: '名称',
			allowBlank: true,
			name: 'nodeDesc'
		}, {
			xtype: 'panel',
			border: false,
			layout: {
				type: 'hbox',
				align: 'middle'
			},
			height: 140,
			defaults: {
				border: false,
				height: '100%'
			},
			items: [{
				width: 80,
				layout: {
					type: 'hbox',
					align: 'middle'
				},
				items: [{
					xtype: 'label',
					text: '示意图'
				}]
			}, {
				flex: 1,
				layout: 'vbox',
				defaults: {
					margin: '0 0 0 10px',
					border: false
				},
				items: [{
					height: 20,
					defaults: {
						margin: '0 0 0 10px',
						width: '100%'
					},
					items: [{
							xtype: 'linkbutton',
							text: '添加',
							itemId: 'add-uplaod-img'

						}
						//					, {
						//						xtype: 'linkbutton',
						//						text: '删除',
						//						itemId: 'del-uplaod-img'
						//					}
					]
				}, {
					flex: 1,
					width: 200,
					items: [{
						xtype: 'imagefield',
						name: 'filename',
						cdnPath: SPDM.globalConfig.cdnPath,
						cdnFolder: SPDM.globalConfig.referenceImageFolder,
						nopicPath: SPDM.globalConfig.nopicPath,
						noImgFile: SPDM.globalConfig.nopicName,
						plugins: ['imageviewer']
					}]
				}]
			}]
		}, {
			xtype: 'textareafield',
			fieldLabel: '维护备注',
			name: 'remark',
			allowBlank: true,
			anchor: '100%'
		}]
	}],

	initEvents: function() {
		var me = this,
			btnAddUpload = me.down("[itemId=add-uplaod-img]"),
			btnDelUpload = me.down("[itemId=del-uplaod-img]");

		btnAddUpload.on('click', function() {
			me.fireEvent('onAddUpload', me);
		});

		//		btnDelUpload.on('click', function() {
		//			me.fireEvent('onDelUpload', me);
		//		});

		me.callParent(arguments);
	}
});