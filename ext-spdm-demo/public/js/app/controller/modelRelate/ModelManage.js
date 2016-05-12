Ext.define('SPDM.controller.modelRelate.ModelManage', {
	extend: 'Ext.ux.controller.Base',
	baseDomainUrl: SPDM.globalConfig.path + '/standardname/2/',
	baseComboDomainUrl: SPDM.globalConfig.path + '/combo/2/',
	viewportReady: function() {
		var me = this;

		me.querystructmodePanel = me.viewport.down('[itemId=querystructmode]');
		me.drawingPanel = me.viewport.down('[itemId=pssnDrawingPanel]');
		me.propertyTabs = me.viewport.down('[itemId=propertyTabs]');
		me.structureQuery = me.viewport.down('[itemId=structureQuery]');
		me.structureTree = me.viewport.down('[itemId=structureTree]');
		me.navigation = me.viewport.down('[itemId=navigation]');
		me.initSubEvents();

		me.initBaseDomain(me.querystructmodePanel.down("[itemId=structmodel-model]"));
	},

	initBaseDomain: function(model) {
		var me = this,
			val = model.value;
		me.baseDomainUrl = SPDM.globalConfig.path + '/standardname/' + val + '/';
		me.baseComboDomainUrl = SPDM.globalConfig.path + '/combo/' + val + '/';

	},

	initSubEvents: function(viewport) {
		var me = this;

		me.querystructmodePanel.on({
			'refreshBymodel': function(model) {
				//set base url for standardname and combo component
				me.initBaseDomain(model);

				//clear filter condition
				me.structureQuery.doReset();

				//refresh tree
				me.filterTree({});
				//reset all property
				me.resetProperty();
			}
		});

		me.structureQuery.on('queryRecord', function(params) {
			me.filterTree(params);
			me.resetProperty();
		});

		me.navigation.on('findRefNode', function(id) {
			var node = me.structureTree.getSelectionNode(),
				type, parentId;

			if (node) {
				type = node.get('type');
				parentId = node.get('parentId');

				me.filterTree({
					id: id,
					scope: type
				}, function() {
					// TODO
					me.resetProperty();
				});
			}
		});

		me.structureTree.on({
			selectionchange: function(that, records, index, eOpts) {
				var rcd;
				if (records.length > 0) {
					rcd = records[0];
					if (rcd.isRoot()) {
						me.propertyTabs.resetProperty();
						me.navigation.clearNavigationContent();
					} else {
						me.setNavigationContent(rcd);
						me.setPropertyContent(rcd);
					}
				}

			},

			refreshTree: function() {
				me.structureQuery.doQuery();
			},
			finishDeleted: function() {
				me.resetProperty();
			}
		})

		me.propertyTabs.on({
			tabchange: function(tabpanel, newCard, oldCard, opts) {
				var params = me.structureTree.getSelectionNodeParams(['id', 'parentId', 'type']);

				me.propertyTabs.loadContent(params);
			}
		});

		me.propertyTabs.propertyBasic.on({
			addNode: function() {
				var params = me.structureTree.getSelectionNodeParams(['id']);

				me.structureTree.addNode(params.id);
			},
			deleteNode: function() {
				var params = me.structureTree.getSelectionNodeParams(['id', 'parentId']);

				me.structureTree.deleteNode(params);
			},
			deleteRefenceNode: function() {
				var params = me.structureTree.getSelectionNodeParams(['id', 'parentId']);

				me.structureTree.deleteReferenceNode(params);
			},
			referenceNode: function() {
				var params = me.structureTree.getSelectionNodeParams(['id', 'type', 'text']);

				me.structureTree.openReference(params);
			},
			finishUpdate: function() {
				me.refreshParentNode();
			}
		});
	},

	resetProperty: function() {
		var me = this;

		if (me.structureTree.getSelectionModel().getSelection().length === 0) {
			me.propertyTabs.resetProperty();

			me.navigation.clearNavigationContent();
		}
	},

	filterTree: function(params, callback) {
		var me = this,
			params = {
				filters: params,
				sorts: [],
				paging: {}
			};

		me.structureTree.filterNode(params, callback);
	},

	selectionTreeNode: function(record) {
		var me = this;

		me.setNavigationContent(record);
	},

	setNavigationContent: function(record) {
		var me = this,
			id = record.get('id'),
			tracks = me.structureTree.getSelectTracks(record).reverse().join(' → ');

		me.navigation.setNavigationContent(id, tracks);
	},

	setPropertyContent: function(record) {
		var me = this,
			params = me.structureTree.getSelectionNodeParams(['id', 'parentId', 'type']);

		me.propertyTabs.loadContent(params);
	},

	isPropertyBasicActive: function() {
		var me = this,
			activeTab = me.propertyTabs.getActiveTab();

		if (activeTab.itemId === 'tabPropertyBasic') {
			return true;
		} else {
			return false;
		}
	},

	refreshParentNode: function(callback) {
		var me = this,
			node = me.structureTree.getSelectionNode(),
			id = node.get('id'),
			parentId = node.get('parentId');

		me.structureTree.refreshNode(parentId, function() {
			me.structureTree.selectionNode(id);
			if (typeof callback === 'function') {
				callback.apply();
			}
		});
	}
});