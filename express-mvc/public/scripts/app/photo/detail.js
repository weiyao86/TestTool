require(["ajax", "globalConfig", "mustache", "grid", "jqExtend", "jqform", "fader", "tabPanel", "blockUI", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig, Mustache, Grid) {
	var Main = function() {
		this.init();
	};
	Main.prototype = {
		init: function() {
			var self = this;
			self.buildDom();
			self.bindEvent();
			self.load();
		},

		buildDom: function() {
			var self = this;
			self.$carousel = $("#carousel");
			self.carouselHtml = $("#carousel_template").html();

		},

		bindEvent: function() {},

		load: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.paths.loadPhotoDetail,
				beforeSend: function() {
					self.$carousel.block({
						css: {
							border: "none",
							width: 50,
							height: 50,
							background: "transparent"
						},
						message: $.initBlockMsg()
					});
				},
				complete: function() {
					self.$carousel.unblock();
				},
				success: function(rst) {
					self.render(rst);
				},
				failed: function(err) {
					$.messageAlert(err.reason);
				}
			});
		},

		render: function(rst) {
			var self = this,
				data = rst.data,
				i = 0,
				arr = [],
				cls = "active",
				tempHtml;

			for (; i < data.length; i++) {
				arr.push({
					"idx": i,
					"cls": cls
				});
				data[i]["cls"] = cls;
				cls = "";
			}
			rst["list"] = arr;

			tempHtml = Mustache.render(self.carouselHtml, {
				Data: rst
			});

			self.$carousel.html(tempHtml);
		},

		initComponent: function() {}
	};

	new Main();
});