require(["ajax", "globalConfig", "mustache", "grid", "jqExtend", "jqform", "fader", "tabPanel", "blockUI", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig, Mustache, Grid) {
	var Main = function() {
		this.init();
	};
	Main.prototype = {
		init: function() {
			var self = this;
			self.buildDom();
			self.bindEvent();
			self.initComponent();
		},

		buildDom: function() {
			var self = this;

			self.$filtersScope = $("#filters_scope");
			self.$editPanel = $("#modal_edit");
			self.$edit = self.$editPanel.children();

			self.$btnUpload = self.$edit.find("[data-action='upload_photo']");

			self.$photo = self.$edit.find("[data-field='file']");

			self.$isFocus = $("#focus_photo");

			self.$progressPhoto = self.$edit.find("[data-field='progress_photo']");

			//upload form
			self.$uploadForm = $("#uploadPhoto");

			self.$dropdownSort = $("#sort_photo");
			self.dropdownTemplate = $("#sort_photo_template").html();
			self.timer = null;
			self.dataSort = {};

		},

		bindEvent: function() {
			var self = this,
				isUploadProperty = $.ajaxSettings.xhr().upload; //support h5 upload pertotype

			self.$uploadForm.ajaxForm({
				url: globalConfig.paths.uploadPhoto,
				resetForm: false,
				type: 'POST',
				dataType: 'json',
				beforeSend: function() {
					self.$edit.block({
						css: {
							border: "none",
							left: "50%",
							width: 50,
							height: 50,
							background: "transparent"
						},
						message: $.initBlockMsg()
					});

					self.$progressPhoto.show().children().css({
						"width": 0
					});

					if (!isUploadProperty) {
						self.listenerUpload();
					}
				},
				uploadProgress: function(event, position, total, percentComplete) {
					var percentVal = percentComplete + '%';
					self.$progressPhoto.children().css({
						"width": percentVal
					}).html(percentVal);
				},
				complete: function() {
					self.$progressPhoto.hide();
				},

				success: function(rst) {
					var fileSrc = "/" + rst[0].filename;
					self.$edit.unblock();
					self.$photo.attr("src", fileSrc);
				}
			});

			self.$btnUpload.on({
				"click": function() {
					$(this).val("");
				},
				"change": function(e) {

					var reg = new RegExp(/\\(\w+\.\w+)$/);

					var filename = (this.files && this.files[0].name) || $(this).val().match(reg)[1];

					self.$edit.find("[data-field='filename']").val(filename);

					self.$uploadForm.submit();
				}
			});

			self.$isFocus.on("click", "li a", function(e) {
				var $btn = $(this).closest("ul").prev();
				$btn.find("[data-val]").html($(this).html());
				$btn.find("[data-field='isFocusPhoto']").html($(this).attr("data-val"));
			});

		},

		initComponent: function() {
			var self = this;
			self.grid = new Grid({
				"gridPanel": "gridpanel",
				"filter": "filters_scope",
				"grid": "user_list",
				"gBody": "tbody_user",
				"template": "tbody_user_template",
				"edit": "modal_edit",
				"limitList": 10, //显示10个页码标签
				"limit": 5, //每页显示10条记录
				callbacks: {
					beforeSend: null,
					beforeRender: null,
					afterRender: function(rst) {
						self.dataSort = $.map(rst.data, function(val, idx) {
							return [idx];
						});
						self.loadSort();
					},
					complete: null,
					beforeModalShown: function(that, name, rowData) {
						if (name === "update") {
							var path = "/data/photo/" + rowData.filename;
							if (rowData.isFocusPhoto == true || rowData.isFocusPhoto == "true") {
								path = "/data/focus/" + rowData.filename;
							}
							that.$edit.find("img[data-field='file']").attr("src", rowData && path);
						}
						self.loadSort();
					},
					afterModalHidden: function() {

					},
					operatorError: function(action, msg) {
						switch (action) {
							case "create":
								$.messageAlert(msg);
								break;
							case "update":
								$.messageAlert(msg);
								break;
							case "destroy":
								break;
							default:
								break;
						}
					}
				},
				/*paging*/
				paging: "paging",
				pagingTemplate: "paging_template",
				urls: {
					read: globalConfig.paths.loadPhoto,
					create: globalConfig.paths.insertPhoto,
					update: globalConfig.paths.updatePhoto,
					destroy: globalConfig.paths.destroyPhoto
				},
				operator: {
					addBtn: "addModal"
				},
				/*modal*/
				modalConfirm: "modal_confirm",
				modalAlert: "modal_alert"
			});
			self.grid.load();
		},

		loadSort: function() {
			var self = this;

			ajax.invoke({
				type: "POST",
				url: globalConfig.paths.loadPhoto,
				success: function(rst) {
					self.renderSort(rst);
				},
				failed: function(err) {
					alert(err.reason);
				}
			});
		},

		renderSort: function(rst) {
			var self = this,
				arr = [],
				maxSort,
				template;

			$.each(rst.data, function(idx, val) {
				arr.push(val.sort);
			});

			$.uniqueArr(arr);
			console.log(arr);

			rst["maxSort"] = arr[arr.length - 1] + 1;
			rst["data"] = arr;

			template = Mustache.render(self.dropdownTemplate, {
				Data: rst
			});

			self.$dropdownSort.html(template);
		},

		listenerUpload: function() {
			var self = this;

			ajax.invoke({
				type: "POST",
				url: globalConfig.paths.getFileProgess,
				data: {
					uploadFile: 'photo'
				},
				success: function(rst) {
					if (rst.progress == 100) {
						self.$progressPhoto.hide();
						clearTimeout(self.timer);
					} else {
						self.timer = setTimeout(function() {
							self.listenerUpload();
						}, 1 * 500);
					}
					self.$progressPhoto.children().css({
						"width": rst.progress + '%'
					}).html(rst.progress + '%');
				},
				failed: function(err) {
					alert(err.reason);
				}
			});
		}
	};

	new Main();
});