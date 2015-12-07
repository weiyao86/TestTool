require(["ajax", "globalConfig", "mustache", "jqExtend", "fader", "tabPanel", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig, Mustache) {
	var initBootstrap = {
			init: function() { //init bootstrap reference
				$("[data-toggle='popover']").popover();
				$("[data-toggle='tooltip']").tooltip({
					placement: 'top'
				});
			}
		},
		main = {
			init: function() {
				var self = this;
				self.buildDom();
				self.bindEvent();
				self.load();
			},

			buildDom: function() {
				var self = this;

				self.$modalEdit = $("#modal_edit");
				self.$modalAlert = $("#modal_alert");
				self.$userList = $("#user_list");
				self.$userAdd = $("#user_add");
				self.$tbody = $("#tbody_user");
				self.template = $("#tbody_user_template").html();

				self.$email = self.$modalEdit.find("[data-field='email']");

				self.$modalSuccess = $("#modal_success");
				self.$globalSearch = $("#global_search");
			},

			bindEvent: function() {
				var self = this;

				self.$userList.on("click", "[data-field='update'],[data-field='del']", function() {

					var field = $(this).attr("data-field"),
						email = $(this).closest("tr").find("[data-field='email']").html();
					switch (field) {
						case "update":
							self.$modalEdit.prop("model", {
								"name": "update",
								"idx": $(this).closest("tr").index()
							}).modal({
								backdrop: true, //默认,是否显示背景,值为static时点击背景无效
								keyboard: true, //默认,点击esc消失
								show: true //默认,模态框初始化之后就立即显示出来。
							});
							break;
						case "del":
							self.$modalAlert.data("id", email).modal({
								backdrop: 'static'
							});
							break;
						default:
							break;
					}


				});

				self.$email.on("blur keyup propertychange", function() {
					$(this).popover("hide");
				})

				self.$userList.on("click", "tbody tr", function() {
					self.toggleActive($(this));
				});

				self.$modalEdit.on("click", "[data-field='save']", function() {
					self.save();
				});

				self.$modalAlert.on('click', "[data-field='del_sure']", function() {
					self.delUerInfo();
				});

				self.$userAdd.on('click', function() {
					self.$modalEdit.prop("model", {
						"name": "create"
					}).modal("show");
				});

				self.$modalEdit.on("show.bs.modal", function() {
					self.$globalSearch.val("edit show before");
				});

				self.$modalEdit.on("shown.bs.modal", function(evt) {
					self.$globalSearch.val("edit show after");
					var model = $(this).prop("model"),
						$tr;
					if (model.name === "update") {
						$tr = self.$userList.find(">tbody>tr:eq(" + model.idx + ")");
						var rst = $tr.selectedAllAppointScope();
						self.$modalEdit.loadAppointScope(rst);
					}
				});
				self.$modalEdit.on("hide.bs.modal", function() {
					self.$globalSearch.val("edit hide before");
				});

				self.$modalEdit.on("hidden.bs.modal", function() {
					self.$globalSearch.val("edit hide after");
					self.$modalEdit.clearAllAppointScope();
					self.showTipSuccess();
				});
			},

			load: function() {
				var self = this;
				ajax.invoke({
					url: globalConfig.paths.loadUser,
					success: function(rst) {
						self.render(rst.data);
					},
					failed: function(err) {
						alert(err.reason);
					}
				});
			},

			render: function(data) {
				var self = this,
					tempHtml = Mustache.render(self.template, {
						User: data
					});
				self.$tbody.html(tempHtml);
			},

			save: function() {
				var self = this,
					model = self.$modalEdit.prop("model");
				model && self[model.name].call(self, self.$modalEdit);
			},

			update: function($that) {
				var self = this,
					params = $that.selectedAllAppointScope();
				ajax.invoke({
					url: globalConfig.paths.updateUser,
					contentType: "application/json",
					data: JSON.stringify(params),
					success: function(rst) {
						self.load();
						self.showTipSuccess("保存成功!");
					},
					failed: function(err) {
						alert(err.reason);
					}

				});
			},

			create: function($that) {
				var self = this,
					params = $that.selectedAllAppointScope();

				ajax.invoke({
					url: globalConfig.paths.createUser,
					contentType: "application/json",
					data: JSON.stringify(params),
					success: function(rst) {
						if (rst.data) {
							self.load();
							self.showTipSuccess("保存成功!");
						} else {
							self.$email.attr("data-content", "此条记录已存在").popover("show");
						}

					},
					failed: function(err) {
						alert(err.reason);
					}

				});
			},

			delUerInfo: function() {
				var self = this,
					email = self.$modalAlert.data("id");

				ajax.invoke({
					url: globalConfig.paths.delUserUrl,
					contentType: "application/json",
					data: JSON.stringify({
						email: email
					}),
					success: function(rst) {
						self.load();
						self.showTipSuccess("保存成功!");
					},
					failed: function(err) {
						alert(err.reason);
					}

				});
			},

			toggleActive: function($target) {
				var self = this;
				$target.siblings(".bg-active").removeClass("bg-active").end().addClass("bg-active");
			},

			showTipSuccess: function(msg) {
				var self = this;
				self.$modalAlert.modal("hide");
				self.$modalEdit.modal("hide");
				self.$modalSuccess.modal("show").find("[data-field='tip_info']").html(msg);
				self.$email.popover("hide");
			}


		};

	initBootstrap.init();

	main.init();
});