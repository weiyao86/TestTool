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
				complete: null
			},
			"searchUrl": "",
			/*paging*/
			paging: "paging",
			pagingTemplate: "paging_template"

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

			/*paging*/
			self.paging = null;
		},

		bindEvent: function() {
			var self = this;

			self.$filter.on("click", "[data-action='search']", function() {
				self.load();
			});

			self.$filter.on("keyup", "[data-field]", function(e) {
				if (e.keyCode === 13) {
					self.load();
				}
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
				url: self.opts.searchUrl,
				data: condition,
				beforeSend: function() {
					self.$gridPanel.block({
						css: {
							border: "none",
							width: 50,
							height: 50,
							background: "transparent",
						},
						message: "<div class='modal-center'><p class='text-center'>Loading...</p></div>"
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

		getCondition: function() {
			var self = this,
				condition = self.$filter.selectedAllAppointScope();
			return condition;
		}
	};
	return Grid;

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