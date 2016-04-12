require(["ajax", "globalConfig", "jquery", "bootstrap", "domReady!"], function(o, n) {
	var a = {
			init: function() {
				$("[data-toggle='popover']").popover(), $("[data-toggle='tooltip']").tooltip({
					placement: "bottom"
				})
			}
		},
		t = {
			init: function() {
				var o = this;
				o.buildDom(), o.bindEvent(), o.activeMenuByCtrl()
			},
			buildDom: function() {
				var o = this;
				o.$navPanel = $("#nav_panel"), o.$menu = $("#menu_left"), o.$scrollTop = $(".scroll-top"), o.$dropDown = $(".dropdown-menu"), o.$globalSearch = $("#global_search")
			},
			bindEvent: function() {
				var o = this;
				$(window).on("scroll", function(n) {
					$(this).scrollTop() > 100 ? o.$navPanel.addClass("nav-custom") : o.$navPanel.removeClass("nav-custom"), o.showScrollGlyph()
				}), o.$scrollTop.on("click", function() {
					$("html,body").animate({
						scrollTop: 0
					})
				}), o.$dropDown.on("click", "li", function() {
					var o = $(this),
						n = o.find("[data-val]"),
						a = o.closest(".dropdown-menu").siblings("[data-toggle='dropdown']"),
						t = a.find("span[data-val]");
					t.size() && (t.html(n.html()), t.siblings("[data-field].sr-only").html(n.attr("data-val")))
				})
			},
			showScrollGlyph: function() {
				var o = this,
					n = $(window).scrollTop();
				n > 200 ? o.$scrollTop.show() : o.$scrollTop.hide()
			},
			activeMenuByCtrl: function() {
				var o = this,
					n = window.location.href;
				o.$menu.find("a").each(function(o, a) {
					var t = $(a).attr("href");
					n.match(t) && $(a).closest("li").addClass("bg-active")
				})
			}
		};
	a.init(), t.init()
}), define("app/master/main", ["ajax", "globalConfig", "jquery", "bootstrap", "domReady!"], function() {});