require(["ajax", "globalConfig", "mustache", "grid", "imageviewer", "jqExtend", "imageLoaded", "jqform", "fader", "tabPanel", "blockUI", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig, Mustache, Grid) {

	console.log("win:domread")
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
			//self.initComponent();
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
			self.rotatePad = 0;

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

			self.$waterFall.on("click", "[data-action]", function() {
				var action = $(this).attr("data-action"),
					$img = $(this).closest("a").find("[data-field='content']");

				switch (action) {
					case "zhan":
						break;
					case "love":
						break;
					case "fullscreen":
						var highResolutionImage = $img.data('high-res-src');
						if (!self.viewer) self.viewer = ImageViewer();
						self.viewer.show($img.attr("src"), highResolutionImage);
						break;
					default:
						break;

				}
			});


			$(window).on("resize", $.debounce(function() {
				self.initWaterFall();
			}, 300));

			$(window).on("scroll", function() {
				self.scrollload(timer);
			});

			$(window).on("orientationchange", function(e) {
				var winH = $(window).height(),
					scrHeight = $(window).scrollTop(),
					docHeight = $(document).height();

				$("#global_search").val(winH + '---' + scrHeight + '---' + docHeight + '==' + $(document).width());
				// winH + scrHeight == docHeight
				switch (window.orientation) {
					case -90:
					case 90:
						self.rotatePad = 0;
						// alert($(window).width() + '=' + $(window).scrollTop() + $(document).height());
						break;
					case 0:
					case 180:
						// alert($(window).width() + '=' + $(window).scrollTop() + $(document).height());
						break;
					default:
						break;

				};
			})
		},

		load: function() {
			var self = this;
			self.carousel();
			self.mainContent(self.page);
		},

		initComponent: function() {
			var self = this;

			// $('.gallery-items').click(function() {
			// 	var imgSrc = this.src,
			// 		highResolutionImage = $(this).data('high-res-img');

			// 	viewer.show(imgSrc, highResolutionImage);
			// });
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
					$.blockUI({
						css: {
							border: "none",
							background: "transparent"
						},
						message: $.initBlockMsg()
					});
				},
				complete: function() {
					//self.$waterFall.unblock();
					$.unblockUI();
				},
				success: function(rst) {
					self.renderMaincontent(rst);
				},
				failed: function(err) {
					$.messageAlert(err.reason);
				}
			});

			//预请求下一组图片
			var prePhotos = $.extend({}, self.page, {
				pageIndex: self.page.pageIndex + 1
			});
			self.preMainPhoto(prePhotos);
		},

		preMainPhoto: function(params) {

			var self = this;
			ajax.invoke({
				url: globalConfig.paths.loadPhotoDetail,
				data: params,
				success: function(rst) {
					//var img;
					$.each(rst.data, function(idx, val) {
						var img = new Image();
						img.onload = function() {
							console.log('==========' + this.src);
						}
						img.src = '/data/photo/' + val.imgguid;
					});
				},
				failed: function(err) {
					consloe.log(err.reason)
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

			// data = data.sort(function() {
			// 	return Math.random() > 0.6 ? 1 : -1;
			// });

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
			self.preLoad($("img").filter("[src!='']"), progess);
		},


		scrollload: function(timer) {
			var self = this,
				winH = $(window).height(),
				scrTop = $(window).scrollTop(),
				docHeight = $(document).height();

			var str = winH + '=' + scrTop + '=' + docHeight;
			$("#global_search").val(str);
			if (scrTop + winH == docHeight) {
				var later = function() {
					if (!self.page.hasRecords) {
						self.loadGlobalFlag = true;
						return $.messageAlert("It's last page and not records");
					}
					self.page.pageIndex++;
					self.mainContent(self.page);

				};
				if (!self.loadGlobalFlag) {
					clearTimeout(timer);
					timer = setTimeout(later, 300);
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
					// console.log("共" + $images.length + "张图片，正在加载第" + len + "张" + $images[len - 1].src);
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

							progess.$barpanel.parent().fadeOut("slow", function() {
								$(this).remove();
								progess.$modal.remove();
								progess.$loading.hide();
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
						$(val).attr("src", "/res/images/nopic.jpg");
					});
					console.log("fail:" + arr.join("\n\t"));
				}
			});
		},

		createProgress: function() {
			var self = this,
				$progess = $("<div><div id='rect' style='background:#ccc; height: 5px; width: 0%;overflow:hidden;color:white;border-radius:4px;text-align:center;box-shadow:0 0 20px;'></div></div>");
			$progess.css({
				width: "100%",
				height: "5px",
				position: "fixed",
				top: "70%",
				left: 0,
				"border-radius": "4px",
				background: "#222",
				"z-index": 10000
			}).appendTo("body");


			var $modal = $("<div></div>"),
				$loading = $("[data-action='loading']");
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

			$loading.fadeIn();
			return {
				$modal: $modal,
				$barpanel: $progess.children(),
				$loading: $loading
			}
		},

		initWaterFall: function() {
			var self = this;
			self.$waterFall.waterfall();
		}
	}

	new Main();
});