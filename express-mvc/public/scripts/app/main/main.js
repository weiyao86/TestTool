require(["ajax", "globalConfig", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig) {
	var initBootstrap = {
			init: function() { //init bootstrap reference
				$("[data-toggle='popover']").popover();
			}
		},
		main = {
			init: function() {
				var self = this;
				self.buildDom();
				self.bindEvent();
				self.activeMenuByCtrl();
			},

			buildDom: function() {
				var self = this;
				self.$navPanel = $("#nav_panel");
				self.$menu = $("#menu_left");
				self.$globalSearch = $("#global_search");
			},

			bindEvent: function() {
				var self = this;
				$(document).on('scroll', function(e) {
					if ($(this).scrollTop() > 100) {
						self.$navPanel.addClass("nav-custom");
					} else
						self.$navPanel.removeClass("nav-custom");
				});
			},

			activeMenuByCtrl: function() {
				var self = this,
					ctrls = [],
					url = window.location.href;
				self.$menu.find("a").each(function(idx, val) {
					var src = $(val).attr("href");
					if (url.match(src)) {
						$(val).closest("li").addClass("bg-active");
					}
				});

			}
		};

	initBootstrap.init();

	main.init();
});