require(["globalConfig", "ajax", "catalogMain", "crumbs", "tree", "usage", "infoQuery", "initMasterCmp", "track", "mustache", "jqExtend", "uniqueLogin", "amplify", "jquery", "domReady!"],
	function(globalConfig, ajax, CatalogMain, Crumbs, Tree, Usage, InfoQuery, master, track, Mustache) {

		//abc
		var trans = globalConfig.trans;

		var main = {

			init: function() {
				var self = this;

				self.bindDomEls();
				self.getHeight();
				self.setLayout();
				self.bindEvent();
				self.initComponent();
				self.noticeTip();
				self.commonSearchInterface();
			},

			bindDomEls: function() {
				var self = this;

				self.$head = $("#page_header");
				self.$crumbs = $("#epc-bar");
				self.$content = $("[data-content='main']");
				self.$navCrumbs = $("#crumbs_wrap");

				self.$userContent = $("#user_content");
				self.userContentTemplate = $("#user_content_template").html();
				self.tipStepStatus = null;
			},

			getHeight: function() {
				var self = this;

				self.headHeight = self.$head.height();
				self.crumbsHeight = self.$crumbs.outerHeight(true);
			},

			bindEvent: function() {
				var self = this;

				$(window).resize(self.debounce(function() {
					self.setLayout();
					self.tipResize();
				}));


				$.moveBox("online_service");

				master.shoppingCart.on({
					'afterDestroy': function(params, ret) {
						self.usage.sltRowByPartNum(false, params[0]);
						track.publish("buy-layout", "删除", "click", "delete", params[0]);
					},
					'afterQtyChange': function(params, ret) {
						self.usage.sltRowByPartNum(true, params.PartNumber || '', params.Qty || '');
					},
					'afterAddToShoppingCart': function(params, ret) {
						if (ret.Data && ret.Data.Code == 3) self.usage.toggleShopIcon(true, ret.Data.PartQty);
					},
					'afterQtyChange': function(params, flag) {
						var targetName = '数量增加';
						if (flag == 'del') {
							targetName = '数量减少';
						}
						track.publish("buy-layout", targetName, "click", "view", params);
					}
				});
			},

			initOpts: function() {
				var self = this;

				self.catalogMainOpts = {
					urlParams: self.getUrlParams(),
					callbacks: {
						onClickNode: function(params) {
							self.crumbs.setNodeText(params);
						}
					}
				};

				self.crumbsOpts = {
					callbacks: {
						onAddFavorites: function(params) {
							master.bookmark.openFavorites(params);
						},
						onClickVin: function(vin) {
							self.defaultAction("vin");

							self.infoQuery.vin.$vinCondition.val(vin);
							self.infoQuery.vin.filterValidate();
						},
						onClickVsn: function(vsn) {
							self.defaultAction("vsn");

							self.infoQuery.vsn.$vsnCondition.val(vsn);
							self.infoQuery.vsn.filterValidate();
						},
						onClickPartNumber: function(partNo) {
							self.defaultAction("pn");

							var params = {
								PartNumber: partNo
							};
							self.infoQuery.part.fillFilter(params);
						},
						onClickPartDesc: function(partDesc) {
							self.defaultAction("as");

							var params = {
								PartDesc: partDesc
							};
							self.infoQuery.advancedSearch.grid.clear();
							self.infoQuery.advancedSearch.$filter.loadAppointScope(params);
							self.infoQuery.advancedSearch.doSearch();
						}
					}
				};

				self.treeOpts = {

					urlParams: self.getUrlParams(),

					callbacks: {

						oneLoad: function(treeNode) {
							var params = {},
								data = self.tree.ztreeData,
								urlParams = self.tree.opts.urlParams;

							params = $.extend({}, urlParams, {
								"GroupCode": treeNode.id
							});

							data = $.grep(data, function(val, idx) {
								return val.pId == treeNode.id;
							});

							self.usage.initImgList(params, data);
						},

						onLoadByParam: function() {
							self.usage.show(self.tree.opts.urlParams);
						},

						onClickNode: function(rtParams) {
							var data = rtParams.data,
								params = rtParams.params,
								treeNode = rtParams.treeNode;
							if (treeNode.level == 0) {
								self.usage.initImgList(params, data);
							} else {
								self.usage.show(params);
							}

						},
						onClickArrow: function() {
							self.usage.resize();
						}
					}
				};

				self.usageOpts = {
					urlParams: self.getUrlParams(),
					callbacks: {
						onToolbarClick: function(action) {
							self.tree.triggerNode(action);
						},
						afterImgClick: function(params) {
							self.tree.toLegend(params);
						},
						afterShowLegend: function(params) {
							self.crumbs.showBtnBookmark(params);
							master.history.addHistory(params);
						},
						onLeaveLegend: function() {
							self.crumbs.hideBtnBookmark();
						}
					}
				};

				self.infoQueryOpts = {
					callbacks: {
						onVsnAndVinToCatalog: function(nodes) {
							self.onGoToUsage(nodes, {
								isToGroup: true
							});
						},
						onGoToUsage: function(nodes, partNumber) {
							self.onGoToUsage(nodes, {
								partNumber: partNumber
							});
						}
					}
				};

			},

			initComponent: function() {
				var self = this;

				self.initOpts();

				self.crumbs = new Crumbs(self.crumbsOpts);

				if (self.getUrlParams()["Home"] == "1" || window.location.search.indexOf("ImageCode") > -1) {

					self.tree = new Tree(self.treeOpts);

				} else {
					self.catalogMain = new CatalogMain(self.catalogMainOpts);
				}

				self.usage = new Usage(self.usageOpts);

				self.infoQuery = new InfoQuery(self.infoQueryOpts);
			},

			setLayout: function() {
				var self = this,
					windowHeight = $(window).height(),
					contentHeight = (windowHeight - self.headHeight - self.crumbsHeight - 1);

				self.$content.css("height", contentHeight + "px");
			},

			noticeTip: function() {
				var self = this,
					contentHtm, data;
				if (self.tipStepStatus == null) {
					ajax.invoke({
						url: globalConfig.context.stepsUrl,
						data: [],
						type: "GET",
						cache: false,
						success: function(root) {
							if (root) {
								data = root.Data;
								self.tipStepStatus = data.IsOpen;

								contentHtm = Mustache.render(self.userContentTemplate, {
									UserContent: data.UserContent
								});
								//IE7 初始加载时会触发window.resize
								self.$userContent.html(contentHtm).children(":last").attr("data-field", "last-tip").end().children(":first").css("z-index", 1);

								self.tipStepStatus && self.showTipStep();
							}
						},
						failed: function() {}
					});
				} else {
					self.tipStepStatus && self.showTipStep();
				}
			},

			showTipStep: function() {
				var self = this,
					$tip = $("#notice_top"),
					evts;

				if (!$tip.size()) return;
				self.tipResize();
				$tip.show();
				evts = $._data($tip.get(0), "events");

				if (!$.isEmptyObject(evts) && evts.click) return;

				$tip.on("click", "ul>li", function() {
					var field = $(this).attr("data-field");
					if (field === "last-tip") {
						$tip.remove();
					} else {
						$(this).animate({
								"opacity": 0
							}).css("z-index", 0)
							.next().animate({
								"opacity": 1
							}).css("z-index", 1);
					}
				});
			},

			tipResize: function() {
				var self = this,
					$tip = $("#notice_top"),
					w = Math.max($(window).width(), $(document.body).width()),
					h = $(window).height();

				if (!$tip.size()) return;

				$tip.css({
					"width": w,
					"height": h
				});
			},

			defaultAction: function(action) {
				var self = this;

				switch (action) {
					case "as":
						self.infoQuery.slideOut("advanced-search");
						break;
					case "vin":
						self.infoQuery.slideOut("vin-search");
						break;
					case "vsn":
						self.infoQuery.slideOut("vsn-search");
						break;
					case "pn":
						self.infoQuery.slideOut("part-number-search");
						break;
					case "lg":
						self.infoQuery.slideOut("legend-search");
						break;
					case "ss":
						self.infoQuery.slideOut("super-session-search");
						break;
					case "is":
						self.infoQuery.slideOut("info-search");
						break;
					default:
						break;
				}
			},

			onGoToUsage: function(nodes, params) {
				var self = this,
					ret = {
						"Home": "1"
					},
					hasHome = self.getUrlParams(),
					variableField, code;

				if (!nodes.length) return;
				$.each(nodes, function(idx, val) {
					code = val.code;
					switch (val.type) {
						case "brand":
							variableField = "BrandCode";
							break;
						case "series":
							variableField = "CatalogCode";
							break;
						case "year":
							variableField = "Year";
							break;
						case "model":
							variableField = "ModelCode";
							break;
						case "group":
							variableField = "GroupCode";
							break;
						case "image":
							variableField = "ImageCode";
							break;
						default:
							variableField = "Home";
							code = 1;
							break;
					}
					ret[variableField] = code;
					ret[variableField + "Desc"] = val.text;
				});
				ret["PartNumber"] = params.partNumber;
				!ret.GroupCode && (ret.GroupCode = "");
				!ret.ImageCode && (ret.ImageCode = "");
				if (hasHome.Home == "1") {

					self.setCrumbs(ret);
					self.tree.load(ret);

				} else {
					var arr = [],
						href = window.location.href;
					for (var key in ret) {
						if (key.indexOf("Desc") > -1) continue;
						arr[arr.length] = key + "=" + ret[key];
						href = $.redirectLink(href, ret[key], key, 'no');
					}
					window.location.href = href;
				}
			},

			//set nav text
			setCrumbs: function(ret) {
				var self = this,
					retObj = {
						BrandCode: "brand",
						CatalogCode: "catalog",
						Year: "year",
						ModelCode: "model"
					},
					ids = {};
				for (var item in retObj) {
					ids[item] = ret[item];
					self.crumbs.setNodeText({
						id: ret[item],
						name: retObj[item],
						text: ret[item + "Desc"],
						keys: ids
					});
				}
			},

			commonSearchInterface: function() {
				var self = this,
					params = {
						commonSearch: $.getParameterByName("search"),
						suppersision: $.getParameterByName("supersession")
					};
				if (params.commonSearch)
					self.crumbs.interfaceSearch(params.commonSearch);
				else if (params.suppersision) {
					self.defaultAction('ss');
					//self.infoQuery.supperSession.interfaceSearch(params.suppersision);
				}
			},

			debounce: function(func, wait, immediate) {
				var timeout;
				return function() {
					var context = this,
						args = arguments;
					var later = function() {
						timeout = null;
						if (!immediate) func.apply(context, args);
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) func.apply(context, args);
				};
			},

			getUrlParams: function() {
				var self = this;
				if (self.urlVal && self.urlVal["BrandCode"]) return self.urlVal;

				self.urlVal = {
					BrandCode: $.getParameterByName("BrandCode"),
					CatalogCode: $.getParameterByName("CatalogCode"),
					Year: $.getParameterByName("Year"),
					ModelCode: $.getParameterByName("ModelCode"),
					GroupCode: $.getParameterByName("GroupCode"),
					ImageCode: $.getParameterByName("ImageCode"),
					PartNumber: $.getParameterByName("PartNumber"),
					Home: $.getParameterByName("Home")
				};
				return self.urlVal;
			}
		};

		main.init();
	})