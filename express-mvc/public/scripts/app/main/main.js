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
				self.activeMenuByCtrl();
			},

			buildDom: function() {
				var self = this;
				self.$menu = $("#menu_left");
				self.$globalSearch = $("#global_search");
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
					console.log(url.match(src))
				});

			}
		};

	initBootstrap.init();

	main.init();
});