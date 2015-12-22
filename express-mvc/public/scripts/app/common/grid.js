define(["paging", "ajax", "mustache", "blockUI", "jqExtend", "jquery"], function(Paging, ajax, Mustache) {
	var defaults = {
			"gridPanel": "gridPanel",
			"filter": "filterId",
			"grid": "grid",
			"gBody": "gridBodyId",
			"template": "template",
			"limitList": 10, //显示10个页码
			"limit": 10, //每页显示10条记录
			callbacks: {
				beforeSend: null,
				beforeRender: null,
				afterRender: null,
				complete: null,
				operatorError: null,
				afterModalHidden: null
			},
			"searchUrl": "",
			/*paging*/
			paging: "paging",
			pagingTemplate: "paging_template",
			urls: {
				read: '',
				update: '',
				destroy: '',
				create: ''
			},
			operator: {
				addBtn: "user_add"
			},
			/*modal*/
			modalConfirm: "modal_confirm",
			modalAlert: "modal_alert"

		},
		Grid = function(opts) {
			this.opts = $.extend({}, defaults, opts);
			this.init();
		};

	Grid.prototype = {
		init: function() {
			var self = this;
			self.buildDom();
			self.bindEvent();
			self.initComponent();
		},

		buildDom: function() {
			var self = this;
			self.$gridPanel = $("#" + self.opts.gridPanel);

			self.$grid = $("#" + self.opts.grid);
			/*search*/
			self.$filter = $("#" + self.opts.filter);
			/*result*/
			self.$gBody = $("#" + self.opts.gBody);
			self.template = $("#" + self.opts.template).html();
			/*edit*/
			self.$edit = $("#" + self.opts.edit);

			/*paging*/
			self.paging = null;

			/*urls*/
			self.createUser = self.$grid.attr("data-read-url") || self.opts.urls.create;
			self.updateUser = self.$grid.attr("data-update-url") || self.opts.urls.update;

			/*add operator*/
			self.$addBtn = $("#" + self.opts.operator.addBtn);

			/*modal*/
			self.$modalConfirm = $("#" + self.opts.modalConfirm);
			self.$modalAlert = $("#" + self.opts.modalAlert);

			//loading
			self.$blockMsg = $.initBlockMsg();
		},

		bindEvent: function() {
			var self = this;

			self.$filter.on("click", "[data-action]", function(e) {
				var field = $(this).attr("data-action");
				if (field === 'search')
					self.reload();
				else if (field === 'clear') {
					self.$filter.loadAppointScope({});
				}
			});

			self.$filter.on("keyup", "[data-field]", function(e) {
				if (e.keyCode === 13) {
					self.reload();
				}
			});

			self.$grid.on("click", "[data-field='update'],[data-field='del']", function() {
				var field = $(this).attr("data-field"),
					id = $(this).closest("tr").selectedAllAppointScope()["_id"];
				switch (field) {
					case "update":
						self.$edit.prop("model", {
							"name": "update",
							"idx": $(this).closest("tr").index()
						}).modal({
							backdrop: true, //默认,是否显示背景,值为static时点击背景无效
							keyboard: true, //默认,点击esc消失
							show: true //默认,模态框初始化之后就立即显示出来。
						});
						break;
					case "del":
						self.$modalConfirm.data("id", id).modal({
							backdrop: 'static'
						}).find("[data-field='tip_info']").html("Confirm delete the record?");
						break;
					default:
						break;
				}
			});

			self.$grid.on("click", "tbody tr", function() {
				self.toggleActive($(this));
			});

			self.$edit.on("click", "[data-field='save']", function() {
				self.save();
			});

			self.$edit.on("shown.bs.modal", function(evt) {
				var model = $(this).prop("model"),
					$tr;
				if (model.name === "update") {
					$tr = self.$grid.find(">tbody>tr:eq(" + model.idx + ")");
					var rst = $tr.selectedAllAppointScope();
					self.$edit.loadAppointScope(rst);
				}

			});

			self.$edit.on("hidden.bs.modal", function() {
				self.$edit.clearAllAppointScope().find("[data-img]").attr("src","");
				if ($.type(self.opts.callbacks.afterModalHidden === "function")) {
					self.opts.callbacks.afterModalHidden.call(self);
				}
			});

			self.$modalConfirm.on('click', "[data-field='sure']", function() {
				self.destroy();
			});

			self.$addBtn.on("click", function() {
				self.$edit.prop("model", {
					"name": "create"
				}).modal("show");
			});
		},

		initComponent: function() {
			var self = this;
			self.paging = new Paging({
				paging: self.opts.paging,
				pagingTemplate: self.opts.pagingTemplate,
				limitList: self.opts.limitList,
				limit: self.opts.limit,
				callbacks: {
					fireLoad: $.proxy(self.proxyLoad, self)
				}
			});
		},

		load: function() {
			var self = this;
			self.paging.load();
		},

		proxyLoad: function(pagingParams) {
			var self = this,
				condition = self.getCondition();
			//append paging condition to condition list
			condition = $.extend({}, condition, pagingParams || {});

			ajax.invoke({
				url: self.opts.urls.read,
				data: condition,
				beforeSend: function() {
					self.$gridPanel.block({
						css: {
							border: "none",
							width: 50,
							height: 50,
							background: "transparent"
						},

						message: self.$blockMsg
					});
					if (typeof self.opts.callbacks.beforeSend === "function") {
						self.opts.callbacks.beforeSend.call(self, condition);
					}
				},
				complete: function() {
					self.$gridPanel.unblock();
					if (typeof self.opts.callbacks.complete === "function") {
						self.opts.callbacks.complete.call(self);
					}
				},
				success: function(rst) {
					self.render(rst);
				},
				failed: function(err) {
					alert(err.reason);
				}
			});
		},

		reload: function(curIdx) {
			var self = this;
			self.paging.reload(curIdx);
		},

		render: function(rst) {
			var self = this,
				tempHtml;

			if (typeof self.opts.callbacks.beforeRender === "function") {
				self.opts.callbacks.beforeRender.call(self, rst);
			};

			tempHtml = Mustache.render(self.template, {
				Data: rst.data
			});

			self.$gBody.html(tempHtml);

			self.paging.render(rst);

			self.afterRender();
		},

		afterRender: function() {
			var self = this;
			if (typeof self.opts.callbacks.afterRender === "function") {
				self.opts.callbacks.afterRender.call(self);
			}
		},

		save: function() {
			var self = this,
				model = self.$edit.prop("model");
			model && self[model.name].call(self, self.$edit);
		},

		update: function($that) {
			var self = this,
				params = $that.selectedAllAppointScope();
			ajax.invoke({
				url: self.opts.urls.update,
				contentType: "application/json",
				data: JSON.stringify(params),
				success: function(rst) {
					if (rst.msg) {
						if ($.type(self.opts.callbacks.operatorError === "function")) {
							self.opts.callbacks.operatorError.call(self, "update", rst.msg);
						}
					} else {
						self.load();
						self.showTipSuccess("更新成功!");
					}
				},
				failed: function(err) {
					alert(err.reason);
				}

			});
		},

		create: function($that) {
			var self = this,
				params = $that.selectedAllAppointScope();

			ajax.invoke({
				url: self.opts.urls.create,
				contentType: "application/json",
				data: JSON.stringify(params),
				success: function(rst) {
					if (rst.msg) {
						if ($.type(self.opts.callbacks.operatorError === "function")) {
							self.opts.callbacks.operatorError.call(self, "create", rst.msg);
						}
					} else {
						self.load();
						self.showTipSuccess("创建成功!");
					}
				},
				failed: function(err) {
					alert(err.reason);
				}

			});
		},

		destroy: function() {
			var self = this,
				id = self.$modalConfirm.data("id");

			if (!id) return;

			ajax.invoke({
				url: self.opts.urls.destroy,
				contentType: "application/json",
				data: JSON.stringify({
					_id: id
				}),
				success: function(rst) {
					if (rst.msg) {
						if ($.type(self.opts.callbacks.operatorError === "function")) {
							self.opts.callbacks.operatorError.call(self, "destroy", rst.msg);
						}
					} else {
						self.load();
						self.showTipSuccess("删除成功!");
					}
				},
				failed: function(err) {
					alert(err.reason);
				}

			});
		},

		getCondition: function() {
			var self = this,
				condition = self.$filter.selectedAllAppointScope();
			return condition;
		},

		showTipSuccess: function(msg) {
			var self = this;
			self.$modalConfirm.modal("hide");
			self.$edit.modal("hide");
			msg && self.$modalAlert.modal("show").find("[data-field='tip_info']").html(msg);
		},

		toggleActive: function($target) {
			var self = this;
			$target.siblings(".bg-active").removeClass("bg-active").end().addClass("bg-active");
		}
	};
	return Grid;


	// /* Using require js AMD standard */
	//    if (typeof define === 'function' && define.amd && define.amd.jQuery) {

	//        var basePath = (function () {
	//            var splittedPath,
	//                config = require.s.contexts._.config,
	//                path = config.paths["hotpoint"];

	//            if (typeof path !== "undefined") {
	//                splittedPath = path.split(/\/+/g);
	//                return splittedPath.slice(0, splittedPath.length - 2).join("/") + "/";
	//            } else {
	//                alert("require config paths 'hotpoint' key not exist");
	//            }
	//        })();

	//        define(['text!' + basePath + 'template/assistive-template.htm',"paging", "ajax", "mustache", "blockUI", "jqExtend"],setup);
	//    } else {
	//        setup(jQuery);
	//    }

	// var gridInstance;
	// return {
	// 	init: function(opts) {
	// 		var self = this;
	// 		if (!gridInstance) {
	// 			gridInstance = new Grid(opts);
	// 		}
	// 		for (var key in gridInstance) {
	// 			if (gridInstance.hasOwnProperty(key)) {
	// 				self[key] = gridInstance[key];
	// 			}
	// 		}
	// 		self.init = null;
	// 		return self;
	// 	}
	// };
});