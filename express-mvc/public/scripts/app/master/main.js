require(["ajax", "globalConfig", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig) {
	var initBootstrap = {
			init: function() { //init bootstrap reference
				$("[data-toggle='popover']").popover();
				$("[data-toggle='tooltip']").tooltip({
					placement: 'bottom'
				});
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
				self.$scrollTop = $(".scroll-top");
				//global dropdown
				self.$dropDown = $(".dropdown-menu");
				self.$globalSearch = $("#global_search");
			},

			bindEvent: function() {
				var self = this;
				$(window).on('scroll', function(e) {
					if ($(this).scrollTop() > 100) {
						self.$navPanel.addClass("nav-custom");
					} else
						self.$navPanel.removeClass("nav-custom");
					self.showScrollGlyph();
				});

				self.$scrollTop.on("click", function() {
					$("html,body").animate({
						"scrollTop": 0
					});
				});

				self.$dropDown.on("click", "li", function() {
					var $this = $(this),
						$btnSelect = $this.closest(".dropdown-menu").siblings("[data-toggle='dropdown']"),
						$val = $btnSelect.find("span[data-val]");
					if ($val.size()) {
						var val = $this.find("[data-val]").html();
						$val.html(val);
					}
				});

			},


			showScrollGlyph: function() {
				var self = this,
					scrollTop = $(window).scrollTop();
				if (scrollTop > 200) {
					self.$scrollTop.show();
				} else {
					self.$scrollTop.hide();
				}
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