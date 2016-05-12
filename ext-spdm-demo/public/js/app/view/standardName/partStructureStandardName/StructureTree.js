Ext.define('SPDM.view.standardName.partStructureStandardName.StructureTree', {
	extend: 'Ext.tree.Panel',
	alias: 'widget.partstructurestandardnamestructuretree',
	mixins: {
		viewBase: 'SPDM.view.common.class.Base'
	},
	store: Ext.create('SPDM.store.standardName.Tree'),
	width: "100%",
	viewConfig: {
		plugins: {
			ptype: 'treeviewdragdrop',
			dragText: '',
			containerScroll: true,
			nodeHighlightOnDrop: true,
			allowParentInsert: false
		},
		listeners: {
			beforedrop: function(node, data, overModel, dropPosition, dropHandler, eOpts) {
				var me = this.up("panel");
				me.dragdropNode(data, overModel, dropHandler);
			}
		}
	},
	afterRender: function() {
		var me = this;

		me.controller = me.getController('standardName.PartStructureStandardName');

		me.callParent(arguments);
	},
	dockedItems: [{
		xtype: 'toolbar',
		layout: {
			align: 'middle',
			type: 'hbox'
		},
		defaults: {
			xtype: 'button'
		},
		items: [{
			itemId: 'refresh',
			iconCls: 'icon-refresh',
			text: "刷新",
			action: 'refresh'
		}, {
			itemId: 'up',
			iconCls: 'icon-arrow-up',
			text: "上移",
			disabled: true,
			action: 'up',
			singleSelectEnable: true
		}, {
			itemId: 'down',
			iconCls: 'icon-arrow-down',
			text: "下移",
			disabled: true,
			action: 'down',
			singleSelectEnable: true
		}]
	}],
	initEvents: function() {
		var me = this,
			btnUp = me.down('[itemId=up]'),
			btnDown = me.down('[itemId=down]'),
			btnRefresh = me.down('[itemId=refresh]');

		btnUp.on('click', function() {
			me.nodeMoveUp();
		});

		btnDown.on('click', function() {
			me.nodeMoveDown();
		});

		btnRefresh.on('click', function() {
			me.refreshTree();
		});

		me.on('selectionchange', function() {
			me.controlToolbar();
		});

		me.on('checkchange', function(node, checked) {
			me.recursiveCk(node, checked);
		});

		me.on('itemcontextmenu', function(tree, record, item, index, e) {
			me.showContextMenu(tree, record, e);
		});
	},
	controlToolbar: function() {
		var me = this,
			depth,
			buttons = me.query('toolbar > button[singleSelectEnable]'),
			selectionNodes = me.getSelectionModel().getSelection();

		if (selectionNodes.length > 0) {
			depth = selectionNodes[0].get('depth');
			Ext.each(buttons, function(btn) {
				if (depth > 0 && (btn.action === 'up' || btn.action === 'down')) {
					btn.setDisabled(false);
				} else {
					btn.setDisabled(true);
				}
			});
		} else {
			Ext.each(buttons, function(btn) {
				btn.setDisabled(true);
			});
		}
	},

	dragdropNode: function(data, overModel, dropHandler) {
		var me = this,
			curNode = data.records[0],
			curPid = curNode.get("parentId"),
			targetPid = overModel.get("parentId"),
			diffParentNode = curPid != targetPid ? true : false,
			params;

		if (diffParentNode) return false;

		dropHandler.wait = true;

		Ext.MessageBox.confirm("提示", "是否移动到当前节点后", function(success) {
			params = {
				curId: curNode.get("id"),
				targetId: overModel.get("id"),
				parentId: curPid
			};

			if (success == "yes") {
				Ext.util.ajax({
					url: me.controller.baseDomainUrl + 'node/move',
					params: params,
					disableCaching: true,
					success: function(root) {
						dropHandler.processDrop();
						me.refreshNode(params.parentId, function() {
							me.selectionNode(params.curId);
						});
					},
					failure: function(res) {
						dropHandler.cancelDrop();
					}
				});
			}
		});
	},

	recursiveCk: function(node, ckd) {
		var me = this,
			parentNode = null;
		node.cascade(function(n) {
			n.set("checked", ckd);
		});

		node.bubble(function(n) {
			n.set("checked", ckd);
			parentNode = n.parentNode;
			if (parentNode && parentNode.childNodes.length) {
				for (var i = 0, item; item = parentNode.childNodes[i]; i++) {
					ckd = item.get("checked");
					if (!ckd) break; //如果此节点未选中状态不触发cascade事件
				}
			}
		});
	},
	showContextMenu: function(tree, record, e) {
		var me = this,
			depth = record.get('depth'),
			active = me.isPropertyBasicActive(),
			params = me.getSelectionNodeParams(['id', 'parentId']),
			contextMenu = new Ext.menu.Menu({
				items: [{
					iconCls: 'icon-min-add',
					text: '新增子节点',
					disabled: !active,
					handler: function() {
						me.addNode(params.id);
					}
				}, {
					iconCls: 'icon-min-delete',
					text: '删除本体',
					disabled: !active,
					handler: function() {
						me.deleteNode(params)
					}
				}, {
					iconCls: 'icon-min-delete',
					text: '删除关联',
					disabled: !active,
					handler: function() {
						me.deleteReferenceNode(params);
					}
				}, {
					iconCls: 'icon-reference',
					text: '关联',
					disabled: !active,
					handler: function() {
						var params = me.getSelectionNodeParams(['id', 'type', 'text']);

						me.openReference(params);
					}
				}, {
					iconCls: 'icon-refresh',
					text: '刷新子节点',
					handler: function(tree, e) {
						me.refreshNode(params.id);
					}
				}]
			});

		contextMenu.showAt(e.xy);
		e.stopEvent();
	},
	addNode: function(id) {
		var me = this;

		me.openAddNodeValidate(id, function(success) {
			if (success) {
				me.openAddNode(id);
			} else {
				Ext.Msg.alert('提示', '您当前选择节点无法添加子节点');
			}
		});
	},
	openAddNode: function(id) {
		var me = this,
			editWindow = Ext.create('SPDM.view.standardName.partStructureStandardName.propertyBasic.PropertyBasicEdit', {
				editMode: 'create'
			});

		editWindow.down('form').getForm().setValues({
			id: id
		});
		editWindow.show();
	},
	openAddNodeValidate: function(id, callback) {
		var me = this;

		Ext.util.ajax({
			url: me.controller.baseDomainUrl + 'node/addable-types',
			params: {
				id: id
			},
			disableCaching: true,
			success: function(root) {
				var list = root.list || [];

				if (typeof callback === 'function') {
					if (list.length > 0) {
						callback.apply(me, [true]);
					} else {
						callback.apply(me, [false]);
					}
				}
			}
		});
	},
	deleteNode: function(params) {
		var me = this;

		Ext.Msg.confirm('提示', '您确认要删除当前选中节点?', function(btn) {
			if (btn === 'yes') {
				Ext.util.ajax({
					url: me.controller.baseDomainUrl + 'node/del',
					method: "POST",
					params: params,
					beforerequest: function() {
						me.setLoading(true);
					},
					callback: function() {
						me.setLoading(false);
					},
					success: function() {
						me.finishDeleted(params.parentId);
					}
				});
			}
		});
	},
	deleteReferenceNode: function(params) {
		var me = this;

		Ext.Msg.confirm('提示', '您确认要删除当前选中节点引用?', function(btn) {
			if (btn === 'yes') {
				Ext.util.ajax({
					url: me.controller.baseDomainUrl + 'node/del-relations',
					method: "POST",
					params: params,
					beforerequest: function() {
						me.setLoading(true);
					},
					callback: function() {
						me.setLoading(false);
					},
					success: function() {
						me.finishDeleted(params.parentId);
					}
				});
			}
		});
	},
	finishDeleted: function(parentId) {
		var me = this;

		me.refreshNode(parentId, function() {
			var node = me.controller.structureTree.getNode(parentId);

			if (node.childNodes.length === 0) {
				me.refreshNode(node.get('parentId'));
			}
		});

		me.fireEvent('finishDeleted');
	},
	openReference: function(params) {
		var me = this,
			editWindow = Ext.create('SPDM.view.standardName.partStructureStandardName.propertyBasic.PropertyBaseReference', {
				editMode: 'create'
			});

		editWindow.down('form').getForm().setValues({
			nodeId: params.id,
			nodeType: params.type,
			nodeDesc: params.text
		});
		editWindow.show();
	},
	nodeMoveUp: function() {
		var me = this,
			node = me.getSelectionNode(),
			url = me.controller.baseDomainUrl + 'node/up';

		if (!node.isFirst()) {
			me.submitNodeMove(url, 'up')
		} else {
			Ext.Msg.alert('提示', '已经移到最前');
		}
	},
	nodeMoveDown: function() {
		var me = this,
			node = me.getSelectionNode(),
			url = me.controller.baseDomainUrl + 'node/down';

		if (!node.isLast()) {
			me.submitNodeMove(url, 'down')
		} else {
			Ext.Msg.alert('提示', '已经移到最后');
		}
	},
	submitNodeMove: function(url, dir) {
		var me = this,
			params = me.getMoveNodeParams(dir);

		Ext.util.ajax({
			url: url,
			method: 'GET',
			params: params,
			beforerequest: function() {
				me.setLoading(true);
			},
			callback: function() {
				me.setLoading(false);
			},
			success: function(root) {
				me.refreshNode(params.parentId, function() {
					me.selectionNode(params.id);
				});
			}
		});
	},
	refreshTree: function() {
		var me = this;

		me.fireEvent("refreshTree", me);
	},
	refreshNode: function(id, callback) {
		var me = this,
			node = me.getNode(id),
			store = me.getStore();

		store.load({
			node: node,
			callback: function(records, operation, success) {
				node = me.getNode(id);
				if (success) {
					node.expand();
				}
				if (typeof callback === 'function') {
					callback.apply();
				}
			}
		});
	},
	getMoveNodeParams: function(dir) {
		var me = this,
			node = me.getSelectionNode(),
			prevNode, nextNode, curNode, siblingId;

		if (node) {
			if (dir == "up") {
				curNode = node.previousSibling;
			} else {
				curNode = node.nextSibling;
			}
			if (curNode) {
				siblingId = curNode.get("id");
			}
			return {
				id: node.get('id'),
				parentId: node.get('parentId'),
				siblingId: siblingId
			};
		}
	},
	getNode: function(id) {
		var me = this,
			store = me.getStore(),
			node = store.getNodeById(id);

		return node;
	},
	getSelectionNode: function() {
		var me = this,
			selectionNodes = me.getSelectionModel().getSelection();

		if (selectionNodes.length > 0) {
			return selectionNodes[0];
		} else {
			return null;
		}
	},
	getSelectTracks: function(node) {
		var me = this,
			tracks = [];

		while (node) {
			tracks.push(node.get('text'));

			node = node.parentNode.isRoot() ? null : node.parentNode;
		}

		return tracks;
	},
	getSelectionNodeParams: function(fields) {
		var me = this,
			params = {},
			node = me.getSelectionNode();

		if (fields) {
			Ext.each(fields, function(field) {
				params[field] = node ? node.get(field) : '';
			});
		} else {
			params = node.data;
		}

		return params;
	},
	selectionNode: function(id) {
		var me = this,
			node = me.getNode(id);

		me.getSelectionModel().select(node);
	},
	clearSelectionNode: function() {
		var me = this;

		me.getSelectionModel().deselectAll();
	},
	filterNode: function(params, callback) {
		var me = this,
			store = me.getStore();

		me.params = params;
		me.setLoading(true);
		me.clearSelectionNode();
		me.controlToolbar();

		store.load({
			params: {
				args: Ext.encode(params)
			},
			callback: function(records, operation, success) {
				me.setLoading(false);
				if (success) {
					if (typeof callback === 'function') {
						callback.apply();
					}
					me.getView().refresh();
				}
			}
		});
	},
	isPropertyBasicActive: function() {
		var me = this,
			controller = me.getController('standardName.PartStructureStandardName');

		return controller.isPropertyBasicActive();
	},
	autoDestroy: true,
	useArrows: true,
	rootVisible: true
});
