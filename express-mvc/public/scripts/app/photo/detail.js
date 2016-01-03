require(["ajax", "globalConfig", "mustache", "grid", "jqExtend", "imageLoaded", "jqform", "fader", "tabPanel", "blockUI", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig, Mustache, Grid) {
	var Main = function() {
		this.init();
	};
	Main.prototype = {
		init: function() {
			var self = this;
			self.firstLoad();
			self.buildDom();
			self.bindEvent();
			self.load();
		},

		buildDom: function() {
			var self = this;
			self.$carousel = $("#carousel");
			self.carouselHtml = $("#carousel_template").html();
			self.$thumbnailModal = $("#thumbnail_modal");
			self.$modalImg = self.$thumbnailModal.find("[data-field='modal-img']");
			self.$waterFall = $("#waterfull_content");
			self.waterFallTemplate = $("#waterfull_content_template").html();

			self.page = {
				limit: 10,
				pageIndex: 1,
				isFocusPhoto: false,
				hasRecords: true
			};
			//图片是否加载完成
			self.loadGlobalFlag = false;

		},

		bindEvent: function() {
			var self = this,
				timer;

			self.$thumbnailModal.on("show.bs.modal", function(e) {
				var $target = $(e.relatedTarget).closest("[data-field='idx']").find("img[data-field='content']"),
					src = $target.attr("src");
				self.$modalImg.attr("src", $.dataBase64Img);
				self.$modalImg.attr("src", src);
			});


			$(window).on("resize", $.debounce(function() {
				self.initWaterFall();
			}, 300));

			$(window).on("scroll", function() {
				self.scrollload(timer);
			});
		},

		load: function() {
			var self = this;
			self.carousel();
			self.mainContent(self.page);
		},

		carousel: function() {
			var self = this;

			ajax.invoke({
				url: globalConfig.paths.loadPhotoDetail,
				contentType: 'application/json',
				data: JSON.stringify({
					isFocusPhoto: true
				}),
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


		mainContent: function(params) {

			var self = this;
			ajax.invoke({
				url: globalConfig.paths.loadPhotoDetail,
				data: params,
				beforeSend: function() {
					self.$waterFall.block({
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
					self.$waterFall.unblock();
				},
				success: function(rst) {
					self.renderMaincontent(rst);
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

			//焦点图取前10张
			data.length = data.length > 10 ? 10 : data.length;

			data = data.sort(function() {
				return Math.random() > 0.6 ? 1 : -1;
			});

			for (; i < data.length; i++) {
				arr.push({
					"idx": i,
					"cls": cls
				});
				data[i]["cls"] = cls;
				cls = "";
			}
			arr.length = data.length;
			rst["list"] = arr;
			rst.data = data;

			tempHtml = Mustache.render(self.carouselHtml, {
				Data: rst
			});

			self.$carousel.append(tempHtml);
			self.preLoad(self.$carousel.find("img[data-field='content']"));
		},

		renderMaincontent: function(rst) {
			var self = this,
				data = rst.data,
				lastImgIdx = self.$waterFall.find("[data-field='idx']").last().index(),
				$panel,
				tempHtml;

			self.page.hasRecords = rst.hasRecords;

			tempHtml = Mustache.render(self.waterFallTemplate, {
				Data: rst
			});
			self.$waterFall.append(tempHtml);

			if (lastImgIdx < 0) {
				$panel = self.$waterFall.find("[data-field='idx']");
			} else {
				$panel = self.$waterFall.find("[data-field='idx']:gt(" + (lastImgIdx - 1) + ")");
			}
			self.preLoad($panel.find("img[data-field='content']"), undefined, function() {
				self.initWaterFall();
			});

		},

		firstLoad: function() {
			var self = this,
				progess = self.createProgress();
			self.preLoad($("img"), progess);
		},


		scrollload: function(timer) {
			var self = this,
				winH = $(window).height(),
				scrHeight = $(window).scrollTop(),
				docHeight = $(document).height();
			if (winH + scrHeight == docHeight) {
				if (timer) {
					clearTimeout(timer);
				}
				var later = function() {
					if (!self.page.hasRecords) {
						self.loadGlobalFlag = true;
						return $.messageAlert("It's last page and not records");
					}
					self.page.pageIndex++;
					self.mainContent(self.page);
				};
				if (!self.loadGlobalFlag) {
					setTimeout(later, 300);
				}
			}
		},

		preLoad: function($img, progess, fun) {
			var self = this,
				speed, counter = 0,
				timer = null;


			$img.imagesLoaded({
				progress: function(isbroker, $images, $proper, $broker) {
					speed = ($proper.length + $broker.length) / $images.length * 100;
					var len = $proper.length + $broker.length;
					console.log("共" + $images.length + "张图片，正在加载第" + len + "张" + $images[len - 1].src);
				},
				done: function($that) {
					// console.log("success");
				},
				always: function(isbroker, $images, $proper, $broker) {
					if (typeof fun === "function" && $img.size()) {
						fun.call(self);
					}
					if (progess == undefined) return;

					var clear = setInterval(function() {

						if (speed == undefined) return;
						if (counter <= speed) {
							progess.$barpanel.width((counter++) + "%");
						} else if (speed == 100) {
							progess.$modal.fadeOut(function() {
								progess.$barpanel.parent().remove();
								$(this).remove();
							});
							counter = 0;
							clearInterval(clear);

						} else clearInterval(clear);
					}, 30);
				},
				fail: function($that, $proper, $broken) {
					var arr = [];
					$broken.each(function(idx, val) {
						arr.push(val.src);
						$(val).attr("src", $.dataBase64Img);
						$(val).attr("src", "/res/images/car1.gif");
					});
					console.log(arr.join("\n\t"));

				}
			});
		},

		createProgress: function() {
			var self = this,
				$progess = $("<div><div id='rect' style='background:#ccc; height: 30%; width: 0%;overflow:hidden;color:white;border-radius:4px;text-align:center;box-shadow:0 0 20px;'></div></div>");
			$progess.css({
				width: "100%",
				height: "20px",
				position: "fixed",
				top: "70%",
				left: 0,
				"border-radius": "4px",
				"z-index": 10000
			}).appendTo("body");


			var $modal = $("<div></div>");
			$modal.css({
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				background: "#000",
				opacity: ".95",
				position: "fixed",
				"z-index": 9999
			}).appendTo("body");

			return {
				$modal: $modal,
				$barpanel: $progess.children()
			}
		},

		initWaterFall: function() {
			var self = this;
			self.$waterFall.waterfall();
		}
	}

	new Main();
});