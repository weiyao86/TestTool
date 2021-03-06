define(["ajax", "mustache", "jquery"], function(ajax, Mustache) {
	var defaults = {
		paging: "paging",
		pagingTemplate: "paging_template",
		callbacks: {
			fireLoad: null
		}
	};

	var Paging = function(opts) {

		this.opts = $.extend({}, defaults, opts);

		this.init(opts);
	};

	Paging.prototype = {
		init: function() {
			var self = this;
			self.buildDom();
			self.bindEvent();
		},

		buildDom: function() {
			var self = this;
			self.$paging = $("#" + self.opts.paging);
			self.template = $("#" + self.opts.pagingTemplate).html();

			self.curIdx = 1;
			self.pageCount = 0;
		},

		bindEvent: function() {
			var self = this,
				count = 0;
			self.$paging.on("click", "ul>li>a", function(e) {
				var actionPage = $(this).attr("data-action");
				self.load($(this), actionPage);
			});

			self.$paging.on("click", "[data-action='redirect_page']", function(e) {
				self.redirectByNum();
			});

			self.$paging.on("keyup", "[data-field='page_num']", function(e) {
				e.keyCode == 13 && self.redirectByNum();
			});

			self.$paging.on("focus blur", "[data-field='page_num']", function(e) {
				if (e.type === "focusin") {
					$.trim($(this).val()) && self.validateNum();
				} else
					$(this).popover('hide');
			});
		},

		render: function(rst) {
			var self = this,
				total = rst.total,
				limitList = self.opts.limitList,
				tempHtml;

			pageCount = 0;
			pageNums = [];
			if (total) {
				pageCount = Math.floor(total / self.opts.limit);
				if (rst.total % self.opts.limit > 0)
					pageCount += 1;
			}

			if (limitList) {
				var middle = Math.floor(limitList / 2);
				var max = pageCount;
				var min = 1;
				if (middle + self.curIdx < pageCount) {
					max = middle + self.curIdx;
				}
				if (self.curIdx - middle > 1) {
					min = self.curIdx - middle;
				}
				while (max - min < limitList - 1) {
					if (max < pageCount) max++;
					else if (max == pageCount && min > 1) min--;
					else break;
				}

				for (; min <= max; min++) {
					pageNums.push({
						cls: self.curIdx == min ? "active" : "",
						idx: min
					});
				}
			}

			rst["PageCount"] = self.pageCount = pageCount;
			rst["PageNums"] = pageNums;
			tempHtml = Mustache.render(self.template, {
				Paging: rst
			});
			self.$paging.html(tempHtml);
		},

		load: function($this, actionPage) {
			var self = this,
				curIdx = self.curIdx;
			if (actionPage === "prev") {
				curIdx--;
				if (curIdx < 1) return;
			} else if (actionPage === "next") {
				curIdx++;
				if (curIdx > self.pageCount) return;
			} else if (actionPage === "paging") {
				curIdx = parseInt($this.html());
			}
			self.curIdx = curIdx;

			self.fireLoad();

		},

		reload: function(curIdx) {
			var self = this;
			self.curIdx = parseInt(curIdx) || 1;
			self.fireLoad();
		},

		fireLoad: function() {
			var self = this;
			if ($.type(self.opts.callbacks.fireLoad) === "function") {
				self.opts.callbacks.fireLoad.call(self, {
					limit: self.opts.limit,
					pageIndex: self.curIdx
				});
			}
		},

		redirectByNum: function() {
			var self = this,
				rst = self.validateNum();

			if (rst.flag) {
				self.reload(rst.curIdx);
			}
		},

		validateNum: function() {
			var self = this,
				$go = self.$paging.find("[data-field='page_num']"),
				curIdx = $.trim($go.val()),
				flag = true;

			if (!curIdx || !/^[1-9][0-9]*$/.test(curIdx)) {
				flag = false;
			} else if (self.pageCount && (curIdx < 1 || curIdx > self.pageCount)) {
				flag = false;
			}!flag && $go.popover('show');

			return {
				flag: flag,
				curIdx: curIdx
			};
		}
	};

	return Paging;
});