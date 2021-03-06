//jQuery mthod extend

(function($) {

	// Extend jquery object method
	$.fn.extend({

		// Extend jquery 'realVal' method
		realVal: function() {
			var tagType = (this.attr("type") || "").toUpperCase(),
				tagName = this.prop("tagName").toUpperCase();

			if ((tagName === "INPUT") && (tagType === "CHECKBOX" || tagType === "RADIO")) {
				return this.prop("checked");
			}
			if (this.attr("data-value")) {
				return this.attr("data-value");
			}

			return this.val();
		},

		// Get tag object value
		getVal: function() {
			var tagType,
				tagName = this.prop("tagName").toUpperCase();

			if (tagName === "SELECT") {
				return this.val();
			}
			if (tagName === "SPAN" || tagName === "LABEL") {
				return this.text();
			}
			if (tagName === "INPUT") {
				tagType = this.attr("type").toUpperCase();
				if (tagType === "TEXT" || tagType === "HIDDEN") {
					return this.val();
				}
				if (tagType === "CHECKBOX" || tagType === "RADIO") {
					return this.prop("checked");
				}
			}
			if (tagName === "TEXTAREA") {
				return this.val();
			}
		},

		// Set tag object value
		setVal: function(value) {
			var tagType,
				tagName = this.prop("tagName").toUpperCase();

			if (tagName === "SELECT") {
				this.val(value);
			}
			if (tagName === "SPAN" || tagName === "LABEL") {
				this.text(value);
			}
			if (tagName === "INPUT") {
				tagType = this.attr("type").toUpperCase();
				if (tagType === "TEXT" || tagType === "HIDDEN") {
					return this.val(value);
				}
				if (tagType === "CHECKBOX" && $.inArray(parseInt(this.val()), value) > -1) {
					this.attr("checked", true);
				}
			}
			if (tagName === "TEXTAREA") {
				return this.val(value);
			}
		},

		// Clear tag object value
		clearVal: function() {
			var tagType;
			var tagName = this.prop("tagName").toUpperCase();

			if (tagName === "SELECT") {
				this.get(0).selectedIndex = 0;
			}
			if (tagName === "SPAN" || tagName === "LABEL") {
				this.text("");
			}
			if (tagName === "INPUT") {
				tagType = this.attr("type").toUpperCase();
				if (tagType === "TEXT" || tagType === "HIDDEN") {
					return this.val("");
				}
				if (tagType === "CHECKBOX" || tagType === "RADIO") {
					this.attr("checked", false);
				}
			}
			if (tagName === "TEXTAREA") {
				return this.val("");
			}
		},

		building: function(params) {
			var $select = this,
				val, data, rule = {};

			rule[params.text] = "text";
			rule[params.value] = "value";

			$select.on("change", function() {
				val = $(this).getVal();
				data = $.mappingJSON(params.data[val] || [], rule, []);
				params.el.bindSelectOption(data);
				if (typeof params.changed === "function") params.changed.apply(this, [val]);
			});
		},

		bindSelectOption: function(data) {
			var $select = this,
				$options;

			$select.find("option").remove();

			$.each(data, function(index, item) {
				$("<option/>").appendTo($select)
					.prop({
						"text": item.text,
						"value": item.value
					});
			});

			$select.get(0).selectedIndex = 0;

			return this;
		},

		loadAppointScope: function(data) {

			this.find("input,select,a,span,div,textarea,img").each(function(index, element) {
				var type, key = $(element).attr("data-field");
				if (key == undefined)
					return;
				var tagN = element.tagName.toUpperCase();
				if (tagN == "INPUT") {
					type = $(element).attr("type");

					switch (type) {
						case "text":
							$(element).val(data[key]);
							break;
						case "checkbox":
							$(element).prop("checked", data[key]);
							break;
						case "hidden":
							$(element).val(data[key]);
							break;
						default:
							break;
					};
				} else if (tagN == "SELECT") {
					$(element).val(data[key]);
				} else if (tagN == "A") {
					$(element).text(data[key]);
				} else if (tagN == "DIV" || element.tagName == "SPAN") {
					$(element).html(data[key]);
				} else if (tagN == "TEXTAREA") {
					$(element).text(data[key]);
				} else if (tagN == "IMG") {
					$(element).attr("src", data[key]);
				}

			});
		},

		// return selected object list
		selectedAllAppointScope: function() {

			var resultObj = {};
			this.find("input,select,a,span,div,textarea,img").each(function(index, element) {
				var type, $el = $(element),
					key = $(element).attr("data-field");

				if (key == undefined)
					return;
				var html = $el.html(),
					val = $el.val();
				html == "true" && (html = true);
				html == "false" && (html = false);
				val == "true" && (val = true);
				val == "false" && (val = false);

				var tagN = element.tagName.toUpperCase();
				if (tagN == "INPUT") {
					type = $el.attr("type");

					switch (type) {
						case "text":
							resultObj[key] = val;
							break;
						case "checkbox":
							resultObj[key] = $el.is(":checked");
							break;
						case "hidden":
							resultObj[key] = val;
							break;
						default:
							break;
					};
				} else if (tagN == "SELECT") {
					if ($el.val().length == 0)
						resultObj[key] = "";
					else
						resultObj[key] = val; // { "text": $el.find("option:selected").text(), "value": $el.val() };
				} else if (tagN == "A") {
					resultObj[key] = html;
				} else if (tagN == "DIV" || tagN == "SPAN") {
					resultObj[key] = html;
				} else if (tagN == "TEXTAREA") {
					resultObj[key] = val || $el.text();
				} else if (tagN == "IMG") {
					resultObj[key] = $el.attr("src");
				}
			});
			return resultObj;
		},

		// return selected object list
		clearAllAppointScope: function() {

			return this.find("input,select,a,span,div,textarea,img").each(function(index, element) {
				var type, $el = $(element),
					key = $el.attr("data-field");
				if (key == undefined)
					return;
				var tagN = element.tagName.toUpperCase();
				if (tagN == "INPUT") {
					type = $el.attr("type");

					switch (type) {
						case "text":
						case "hidden":
							$el.val("");
							break;
						case "checkbox":
							$el.prop("checked", false);
							break;
						default:
							$el.val("");
							break;
					};
				} else if (tagN == "SELECT") {
					$el.val("")
				} else if (tagN == "DIV") {
					$el.html("");
				} else if (tagN == "SPAN") {
					$el.html("");
				} else if (tagN == "TEXTAREA") {
					$el.text("").val("");
				} else if (tagN == "IMG") {
					$el.attr("src", "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==");
				}
			});
		},

		adaptive: function(opts) {
			//#region 自适应图片
			if (this.each) {
				return this.each(function(index, val) {
					var self = $(val),
						nativeImg = new Image(),
						curWidth = self.parent().width() || self.width(),
						curHeight = self.parent().height() || self.height();

					// 去掉时间截
					nativeImg.src = self.attr("src");

					$(nativeImg).load(function() {
						var nativeWidth = nativeImg.width,
							nativeHeight = nativeImg.height,
							wRatio = curWidth / nativeWidth,
							hRatio = curHeight / nativeHeight,
							Ratio = 1;
						if (!opts.isAdaptive) return;
						if (curWidth == 0 && curHeight == 0)
							Ratio = 1;
						else if (curWidth == 0) {
							if (hRatio < 1)
								Ratio = hRatio;
						} else if (curHeight == 0) {
							if (wRatio < 1)
								Ratio = wRatio;
						} else if (wRatio < 1 || hRatio < 1) {
							Ratio = wRatio <= hRatio ? wRatio : hRatio;
						}
						if (Ratio < 1) {
							nativeWidth = nativeWidth * Ratio;
							nativeHeight = nativeHeight * Ratio;
						}
						$(val).width(nativeWidth || curWidth);
						$(val).height(nativeHeight || curHeight);

						if ($(val).parent()) {
							var l = ($(val).parent().width() - $(val).width()) / 2,
								t = ($(val).parent().height() - $(val).height()) / 2;
							if ($(val).css("position") == 'static') {
								$(val).css({
									marginLeft: l,
									marginTop: t
								});
							} else {
								$(val).css({
									left: l,
									top: t
								});
							}
						}
						if (typeof opts.callback.success === "function") {
							opts.callback.success.apply(this, [self]);
						}
					}).error(function() {
						if (typeof opts.callback.error === "function") {
							opts.callback.error.apply(this, [self]);
						}
					});
				});
			}
			//#endregion
		},


		initPlaceholder: function(opts) {
			var defaults = {
				lfdistance: 10
			};
			defaults = $.extend({}, defaults, opts);
			if (!("placeholder" in document.createElement("input"))) {
				this.each(function(idx, val) {

					var $el = $(this),
						placeholder = $el.attr('placeholder'),
						_resetPlaceHolder = null,
						elId, $label;
					if (placeholder) {
						elId = $el.attr("id");
						if (!elId) {
							var now = new Date();
							elId = 'lbl_placeholder' + now.getSeconds() + now.getMilliseconds();
							$el.attr("id", elId);
						}
						$label = $('<label>', {
							html: $el.val() ? '' : placeholder,
							'for': elId,
							css: {
								position: 'absolute',
								left: $el.position().left + defaults.lfdistance,
								top: $el.position().top,
								height: $el.outerHeight(true),
								lineHeight: $el.outerHeight(true) + 'px',
								color: "#C3C3C3",
								cursor: 'text'
							}
						}).insertAfter($el);
						_resetPlaceHolder = function(e) {
							if ($el.val()) {
								$label.html('');
							} else
								$label.html(placeholder);
						};

						$el.on('focus blur input keyup propertychange', _resetPlaceHolder);
						_resetPlaceHolder();
					}

				});
			}
		},

		/**
		 * [waterfall description]瀑布流布局
		 * @return {[type]} [description] height list
		 */
		waterfall: function(opts) {
			var opts = $.extend(true, {
				isAdaptiveWidth: true
			}, opts);
			//一：按索引排列图片
			// var $children = this.find(".col-for-rowpanel"),
			// 	w = $children.outerWidth(true),
			// 	col = Math.ceil(this.outerWidth(true) / $children.outerWidth(true)),
			// 	case_h = [],
			// 	sum = [],
			// 	row;

			// console.log(this.outerWidth(true) + '===' + $children.outerWidth(true));

			// for (var i = 0; i < col; i++) {
			// 	case_h.push([]);
			// 	sum.push(0);
			// }

			// $.each($children, function(i) {
			// 	var m = i % col;
			// 	row = Math.floor(i / col);
			// 	$(this).css("left", w * m + "px");
			// 	try {
			// 		case_h[m].push($(this).outerHeight(true));
			// 	} catch (e) {
			// 		console.log('error');
			// 	}
			// 	if (!row) {
			// 		$(this).css("top", "0");
			// 	} else {
			// 		var num = 0;
			// 		for (var n = 0; n < row; n++) {
			// 			num += case_h[m][n];
			// 		}
			// 		$(this).css("top", num + "px");
			// 	}
			// });

			// $(case_h).each(function(i) {
			// 	$(case_h[i]).each(function(j) {
			// 		sum[i] += case_h[i][j];
			// 	});
			// });
			// $children.parent().css({
			// 	"height": sum.sort(function(a, b) {
			// 		return a < b ? a : -1
			// 	})[0] + "px"
			// });


			//二：按照一行图片中高度最低的图片依次往下排，在bootstrap中使用会破坏原有的媒体查询设置\
			//?现在可以了？why?"left": li_w * m 试下来是left定位不准 造成，看后续效果
			var contentW = this.outerWidth(true),
				$cases = this.find(".col-for-rowpanel"),
				li_w = $cases.outerWidth(true),
				cell = Math.ceil(contentW / li_w);
			var step, rows_h = [];
			$.each($cases, function(i) {
				var $that_li = $(this),
					m = i % cell,
					li_h = $that_li.outerHeight(true);
				step = Math.floor(i / cell);

				!opts.isAdaptiveWidth && $that_li.css({
					"width": li_w
				});
				if (!step) {
					$that_li.animate({
						"top": "0",
						"left": li_w * m
					});
					rows_h.push(li_h);
				} else {
					//取上一行图片的最小高度
					var min_height = Math.min.apply(rows_h, rows_h);
					//取出最小高度的图片索引
					var min_index = rows_h.indexOf(min_height);

					$that_li.animate({
						"top": min_height,
						"left": li_w * min_index
					});
					rows_h[min_index] = min_height + li_h;
				}
			});


			var rst_height = rows_h.sort(function(a, b) {
				return a < b ? a : -1;
			});

			$cases.parent().css("height", rst_height[0]);
			return {
				shortHeight: $cases.parent().offset().top + rst_height[rst_height.length - 1]
			};

		}
	});

	// Extend jquery 'mappingJSON' function
	$.extend({

		/** "mappingJSON"
		 * data: need to mapping of the original data
		 * rule: mapping rule
		 * container: store mapping after data
		 **/
		mappingJSON: function(data, rule, container) {

			for (var i = 0; i < data.length; i++) {
				var temp = {};
				var item = data[i];

				for (var key in item) {
					var newKey = rule[key] || key;

					if ($.type(item[key]) === "array" && item[key].length > 0) {
						temp[newKey] = [];
						this.mappingJSON(item[key], rule, temp[newKey]);
					} else {
						temp[newKey] = item[key];
					}
				}
				container.push(temp);
			}

			return container;
		},

		/** "escapeSpecialChars"
		 * str: need to convert char
		 **/
		escapeSpecialChars: function(str) {
			return str.replace(/[\\]/g, '\\\\');
		},

		// Validate is integer
		isInteger: function(val) {
			return /^[1-9]*[1-9][0-9]*$/.test(val);
		},

		// Validate is float
		isFloat: function(val, decimalLength) {
			decimalLength = decimalLength || "1";

			var pattern = "^-?\\d+(\\.\\d{1," + decimalLength + "})$";

			return (new RegExp(pattern)).test(val);
		},

		getParameterByName: function(name) {
			name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
			var regexS = "[\\?&]" + name + "=([^&#]*)";
			var regex = new RegExp(regexS);
			var results = regex.exec(window.location.search);
			if (results == null)
				return "";
			else
				return decodeURIComponent(results[1].replace(/\+/g, " "));
		},

		downloadFileByUrl: function(url) {
			var frameId = 'frameId_download_' + (new Date()).getTime(),
				iframeSrc = /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',
				$iframe = $('<iframe name="' + frameId + '" id="' + frameId + '" src="' + iframeSrc + '" style="display:none;"></iframe>'),
				iform = '<form action="' + url + '" method="POST" target="' + frameId + '"></form>',
				$form = $(iform);
			$("body").append($iframe);
			var idoc = $iframe.get(0).contentDocument || $iframe.get(0).contentWindow.document;
			idoc.open();

			try {
				idoc.appendChild($form.get(0));
			} catch (e) {
				//for lte ie8
				iform = idoc.createElement(iform);
				idoc.appendChild(iform);
			}
			idoc.close();
			$iframe.on('load', function() {
				alert('file download error');
				$iframe.remove();
			});

			$(idoc).find("form").submit();

			window.setTimeout(function() {
				$iframe.remove();
			}, 2000);

		},

		isExistScroll: function($sourceScope, $targetScope) {
			var self = this,
				$scrollDiv = $("<div></div>"),
				scrollW = $sourceScope.outerWidth(true) - $sourceScope.find("table:first").outerWidth(true),
				wrapW = $targetScope.outerWidth(true),
				tableW = (wrapW - scrollW) / wrapW * 100,
				percent = '100%',
				isFloat = 'none';

			if (scrollW) {
				percent = tableW + '%';
				isFloat = 'left';
				$targetScope.append($scrollDiv.css({
					"width": scrollW,
					"height": 1,
					"float": isFloat
				}));
			} else {
				$targetScope.find($scrollDiv).remove();
			}
			$targetScope.find("table:first").css({
				"width": percent,
				"float": isFloat
			});
		},

		/*
		 * [ATTRIBUTE]
		 * link:链接
		 * arr:数组或字符串
		 * key:参数名
		 * comma:分隔符
		 * single:是否为单个参数中间无任何分隔
		 * 
		 * */
		redirectLink: function(link, arr, key, comma, single) {
			var self = this,
				isExistReg = new RegExp("[?&]" + key + "=([^&]*)", "i"),
				reg = new RegExp("([?&])" + key + "=([^&]*)(&?)", "i"),
				symbol = /\?/.test(link),
				comma = comma || ',',
				ret = {},
				arrStr = "";
			if (arr == undefined) return link;
			arrStr = ($.type(arr) == "array") ? arr.join(',') : arr;

			if (isExistReg.test(link)) {
				link = link.replace(reg, function(str, firstComma, subStr, lastComma) {
					var prevStr = subStr + comma,
						keyStr = firstComma + key,
						replaceCommaAndKey = function() {
							//key不存在值时清除参数返回特殊字符
							if (firstComma == "&") return lastComma;
							else {
								return lastComma ? "?" : "";
							}
						};

					if (single) {
						var retStr = arrStr ? keyStr + '=' + arrStr + lastComma : replaceCommaAndKey();
						return retStr;
					}
					if (comma == ",") {
						var strArr = subStr.split(','),
							tmepArr = arrStr.split(','),
							strSingle = "";
						for (var i = 0; i < strArr.length; i++) {
							strSingle = strArr[i];
							for (var j = 0; j < tmepArr.length; j++) {
								if (strSingle == tmepArr[j]) strArr.splice(i, 1);
							}
						}
						subStr = strArr.join(',');
						if (subStr) {
							prevStr = subStr + comma;
						} else {
							prevStr = "";
						}
						return (arrStr || arrStr.length) ? keyStr + "=" + prevStr + arr + lastComma : replaceCommaAndKey();
					} else {
						return keyStr + "=" + arr + lastComma;
					}
				});
			} else {
				if (symbol) {
					link = link + "&" + key + "=" + arrStr;
				} else {
					link = link + "?" + key + "=" + arrStr;
				}
			}
			return link;
		},

		moveBox: function(selector) {
			var $this = $("#" + selector);
			if (!$this.size()) return;
			var w = $this.width(),
				h = $this.height(),
				top = 0,
				maxY = $(window).height() - h;
			$this.on("mousedown", function(e) {
				top = e.pageY - $(this).offset().top,
					move($(this));
				e.preventDefault();
			});

			function move($box) {
				var moveY;
				$(document).on({
					"mousemove.online": function(e) {
						moveY = e.pageY - top;
						moveY < 0 && (moveY = 0);
						moveY > maxY && (moveY = maxY);
						$box.css("top", moveY);
					},
					"mouseup.online": function() {
						$(document).off(".online");
					}
				});
			}
		},

		moveTips: function($parentEl, selector, $imgTipsScope, config) {
			var clearTimer = null,
				clearOut = null,
				c = 0,
				posConfig, $arrow = $imgTipsScope.find(".tip-arrow");


			$parentEl.on("mouseenter mouseleave", selector, function(e) {
				var eventType = e.type,
					that = this,
					evt = e;



				$(that).removeProp("title").removeAttr("title");
				if (eventType === "mouseenter") {
					window.clearTimeout(clearOut);
					$(that).append($imgTipsScope);
					clearTimer = window.setTimeout(function() {
						var context = $(that).attr("data-content");
						if (!context) {
							window.clearTimeout(clearTimer);
							$imgTipsScope.hide();
							return;
						}
						$imgTipsScope.find("[data-field='content']").html(context);
						setPosition(that, evt, config);
					}, 500);
				} else {
					window.clearTimeout(clearTimer);
					clearOut = window.setTimeout(function() {
						$imgTipsScope.hide();
					}, 800);
				}
				e.stopPropagation();
			});

			$imgTipsScope.on("mouseenter", function(e) {
				window.clearTimeout(clearOut);
				e.stopPropagation();
			});

			function setPosition(sender, e, config) {
				var $that = $(sender),
					position = $that.position(),
					tipH2 = $imgTipsScope.height() / 2,
					$parentOffset = $that.offsetParent(),
					top = position.top - tipH2 + $parentOffset.scrollTop(),
					left = position.left + $that.width(),
					maxW = $parentOffset.width(),
					w = $imgTipsScope.outerWidth(true);

				if (config && config.isTitle) {
					top = top + $that.height() + tipH2;
					left = left - $that.width() + 50;
					$arrow.hide();
					$imgTipsScope.addClass("move-tip-append");
				} else {
					top = top + ($that.height()) / 2;
					$imgTipsScope.removeClass("move-tip-append");
					$arrow.show();
				}



				if (maxW - left < w)
					left = maxW - w;
				if (w > maxW) {
					$imgTipsScope.width(maxW - 50);
				}
				$imgTipsScope.animate({
					left: left,
					top: top
				}, function() {
					if (config && config.callback && config.callback.afterStopMove) {
						config.callback.afterStopMove.apply(null, [$that]);
					}
				}).show();
			}
		},

		messageAlert: function(msg) {
			var $taget = $("#modal_alert");
			$taget.modal({
				backdrop: 'static'
			}).find("[data-field='tip_info']").html(msg);
		},

		messageConfirm: function(msg, fun) {
			var $taget = $("#modal_custom_confirm");
			$taget.modal({
				backdrop: 'static'
			}).find("[data-field='tip_info']").html(msg);
			$taget.find("[data-field='sure']").click(function() {
				if (typeof fun === "function") {
					if (fun.call($taget) === false) {
						return;
					}
				}
				$taget.modal("hide");
			});
		},

		initBlockMsg: function(init) {
			var $blockMsg = $("<div class='loading'><p class='text-center'>Loading...</p></div>");
			var arr = [];
			for (var i = 1; i <= 12; i++) {
				var divStr = '<div class="loading-c-' + i + ' loading-child"></div>';
				arr.push(divStr);
			}
			$blockMsg.append(arr.join(''));
			return $blockMsg;

		},

		debounce: function(fun, wait, immediate) {
			var timer;
			return function() {
				var context = this,
					args = arguments;
				var later = function() {
					timer = null;
					if (!immediate) {
						fun.call(context, args);
					}
				}
				var callNow = immediate && !timer;
				clearTimeout(timer);
				timer = setTimeout(later, wait);
				if (callNow) {
					fun.call(context, args);
				}
			};
		},

		dataBase64Img: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",

		uniqueArr: function(result) {
			var arr = [],
				i = 1,
				j = 0,
				el;
			result.sort(function(a, b) {
				return a - b;
			});
			for (; el = result[i]; i++) {
				if (el === result[i - 1]) {
					j = arr.push(i);
				}
			}
			while (j--) {
				result.splice(arr[j], 1);
			}
		}
	});

})(jQuery);


//跨浏览器实现backgroundPosition
(function($) {
	// if (!document.defaultView || !document.defaultView.getComputedStyle) {
	var oldCurCSS = $.css;
	$.css = function(elem, name, force) {

		if (name === 'background-position') {
			name = 'backgroundPosition';
		}
		if (name !== 'backgroundPosition' || !elem.currentStyle || elem.currentStyle[name]) {
			return oldCurCSS.apply(this, arguments);
		}
		var style = elem.style;
		if (!force && style && style[name]) {
			return style[name];
		}
		return oldCurCSS(elem, 'backgroundPositionX', force) + ' ' + oldCurCSS(elem, 'backgroundPositionY', force);
	};
	//}

	var oldAnim = $.fn.animate;
	$.fn.animate = function(prop) {
		if ('background-position' in prop) {
			prop.backgroundPosition = prop['background-position'];
			delete prop['background-position'];
		}
		if ('backgroundPosition' in prop) {
			prop.backgroundPosition = '(' + prop.backgroundPosition + ')';
		}
		return oldAnim.apply(this, arguments);
	};

	function toArray(strg) {
		strg = strg.replace(/left|top/g, '0px');
		strg = strg.replace(/center/g, '50%');
		strg = strg.replace(/right|bottom/g, '100%');
		strg = strg.replace(/([0-9\.]+)(\s|\)|$)/g, "$1px$2");
		var res = strg.match(/(-?[0-9\.]+)(px|\%|em|pt)\s(-?[0-9\.]+)(px|\%|em|pt)/);
		return [parseFloat(res[1], 10), res[2], parseFloat(res[3], 10), res[4]];
	}

	$.fx.step.backgroundPosition = function(fx) {
		if (!fx.bgPosReady) {
			var start = $.css(fx.elem, 'backgroundPosition');

			if (!start) { //FF2 no inline-style fallback
				start = '0px 0px';
			}

			start = toArray(start);

			fx.start = [start[0], start[2]];

			var end = toArray(fx.end);
			fx.end = [end[0], end[2]];

			fx.unit = [end[1], end[3]];
			fx.bgPosReady = true;
		}

		var nowPosX = [];
		nowPosX[0] = ((fx.end[0] - fx.start[0]) * fx.pos) + fx.start[0] + fx.unit[0];
		nowPosX[1] = ((fx.end[1] - fx.start[1]) * fx.pos) + fx.start[1] + fx.unit[1];
		fx.elem.style.backgroundPosition = nowPosX[0] + ' ' + nowPosX[1];
	};
})(jQuery);

window.console.prototype = {
	log: function(msg) {
		if (console.log) {
			console.log(msg);
		}
	}
}