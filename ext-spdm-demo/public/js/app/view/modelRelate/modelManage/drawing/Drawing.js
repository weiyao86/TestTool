Ext.define('SPDM.view.modelRelate.modelManage.drawing.Drawing', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.partstructurestandardnamedrawingdrawing',
	requires: ['SPDM.view.modelRelate.modelManage.drawing.DrawingRow',
		'SPDM.view.modelRelate.modelManage.drawing.Edit',
		'SPDM.view.common.window.UploadFile'
	],
	bodyPadding: '5 10',
	overflowY: 'auto',
	border: false,
	treeParams: {},
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},

	afterRender: function() {
		var me = this;

		me.initCmp();

		me.callParent(arguments);
	},

	initCmp: function() {
		var me = this;
		me.controller = me.getController('modelRelate.ModelManage');
		me.drawingview = me.down('[itemId=standardDrawingview]');
	},

	initEvents: function() {
		var me = this;

		me.drawingview.on({
			upmove: function(panel) {
				me.movedirection(panel, 'previous');
			},

			downmove: function(panel) {
				me.movedirection(panel, 'next');
			},

			update: function(panel) {
				me.updateSketchMap('update', panel);
			},

			del: function(panel) {
				me.deleteSketchMap(panel);
			},

			viewImage: function(panel) {
				me.viewImgSketchMap(panel);
			}
		});
	},

	load: function(paramsObj) {
		var me = this,
			params;

		me.resetDrawing();

		me.treeParams = paramsObj;

		params = {
			filters: {
				nodeId: me.treeParams.id
			}
		};
		Ext.util.ajax({
			url: me.controller.baseDomainUrl + 'node/referenceimage/list',
			params: {
				args: Ext.encode(params)
			},
			method: 'POST',
			beforerequest: function() {
				me.setLoading('加载中, 请稍候...');
			},
			callback: function() {
				me.setLoading(false);
			},
			success: function(rpt) {
				me.buildRow(rpt);
			}
		});
	},

	resetDrawing: function() {
		var me = this;
		me.treeParams = {};
		me.drawingview && me.drawingview.removeAll();
	},

	buildRow: function(rpt) {
		var me = this,
			imgView;
		for (var i = 0; i < rpt.list.length; i++) {
			imgView = Ext.create('SPDM.view.modelRelate.modelManage.drawing.DrawingRow');
			me.drawingview.add(imgView);
			imgView.getForm().setValues(rpt.list[i]);
		}
	},

	updateSketchMap: function(mode, parentForm) {
		var me = this,
			objFlag = true;
		for (var name in me.treeParams) {
			if (me.treeParams.hasOwnProperty(name)) {
				objFlag = false;
				break;
			}
		}
		if (objFlag) return Ext.Msg.alert('提示', '请选择树节点!');

		var editWin = Ext.create('SPDM.view.modelRelate.modelManage.drawing.Edit', {
				editMode: mode
			}).show(),
			form = editWin.down("form");


		me.setEditFormTree(editWin);
		parentForm && form.getForm().setValues(parentForm.getForm().getFieldValues());

		//add upload img
		editWin.on("onAddUpload", function() {
			me.openUploadFile(form);
		});

		//delete upload img
		editWin.on("onDelUpload", function() {
			form.getForm().findField("filename").setValue("");
		});

		editWin.on("doSave", function(params) {
			var url = me.controller.baseDomainUrl + 'node/referenceimage/';
			if (mode == "create") {
				url += "save";
			} else {
				url += "edit";
			}

			Ext.util.ajax({
				url: url,
				method: 'POST',
				jsonData: params,
				beforerequest: function() {
					editWin.setLoading(true);
				},
				callback: function() {
					editWin.setLoading(false);
				},
				success: function(rpt) {
					Ext.Msg.alert("提示", "保存成功", function() {
						editWin.close();
						me.load(me.treeParams);
					});
				}
			});
		});
	},

	setEditFormTree: function(editWin) {
		var me = this,
			form = editWin.down("form"),
			node = me.treeParams,
			values = {
				nodeId: node.id,
				nodeType: node.type,
				nodeDesc: node.text
			};

		form.getForm().setValues(values);
	},

	openUploadFile: function(form) {
		var me = this,
			uploadFile = Ext.create('SPDM.view.common.window.UploadFile', {
				items: [{
					xtype: 'form',
					bodyPadding: 10,
					items: [{
						xtype: 'filefield',
						fieldLabel: '选择图片',
						name: 'file',
						labelWidth: 62,
						buttonText: '浏览',
						allowBlank: false,
						anchor: '100%',
						regex: /\.(gif|jpg|png)$/i,
						regexText: '上传文件后缀必须是(gif|jpg|png)'
					}]
				}],
				params: {
					functionCode: "referenceImage"
				},
				listeners: {
					'uploadsuccess': function(result) {
						form.getForm().setValues(result);
					}
				}
			}).show();
	},

	movedirection: function(panel, dir) {
		var me = this,
			next = panel.nextSibling(),
			previous = panel.previousSibling(),
			curidx = me.drawingview.items.indexOf(panel),
			nextidx = me.drawingview.items.indexOf(next),
			preidx = me.drawingview.items.indexOf(previous),
			params = {
				"nodeId": me.treeParams.id,
				"id": panel.getForm().findField("id").value
			},
			url, toidx;

		if (dir == 'next' && nextidx > -1) {
			url = me.controller.baseDomainUrl + 'node/referenceimage/movedown';
			toidx = nextidx;
		} else if (dir == 'previous' && preidx > -1) {
			url = me.controller.baseDomainUrl + 'node/referenceimage/moveup';
			toidx = preidx;
		}

		if (url) {
			Ext.util.ajax({
				url: url,
				method: "POST",
				params: params,
				beforerequest: function() {
					me.setLoading(true);
				},
				callback: function() {
					me.setLoading(false);
				},
				success: function() {
					me.drawingview.move(curidx, toidx);
				}
			});
		}
	},

	deleteSketchMap: function(panel) {
		var me = this;
		Ext.Msg.confirm("提示", "确认要删除吗?", function(optional) {
			if (optional == "yes") {
				var params = {
					"nodeId": me.treeParams.id,
					"ids": [panel.getForm().findField("id").value]
				};
				Ext.util.ajax({
					url: me.controller.baseDomainUrl + 'node/referenceimage/delete',
					method: "POST",
					jsonData: params,
					beforerequest: function() {
						me.drawingview.setLoading(true);
					},
					callback: function() {
						me.drawingview.setLoading(false);
					},
					success: function() {
						Ext.Msg.alert('提示', '删除成功');
						me.drawingview.remove(panel);
					}
				});
			}
		});
	},


	items: [{
		xtype: 'panel',
		border: false,
		itemId: 'standardDrawingview'
	}, {
		layout: 'column',
		border: false,
		items: [{
			itemId: 'addDrawing',
			xtype: 'image',
			border: true,
			src: SPDM.globalConfig.path + '/style/images/add-img.png',
			margin: 10,
			height: 135,
			columnWidth: 0.30,
			style: 'cursor:pointer;border:1px solid #d0d0d0;',
			listeners: {
				click: {
					element: 'el',
					fn: function() {
						var me = this;
						Ext.getCmp(me.id).up("[itemId=pssnDrawingPanel]").updateSketchMap("create");
					}
				}
			}
		}]
	}]
});