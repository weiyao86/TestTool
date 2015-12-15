require(["ajax", "globalConfig", "mustache", "grid", "jqExtend", "fader", "tabPanel", "blockUI", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig, Mustache, Grid) {
	var initBootstrap = {
			init: function() { //init bootstrap reference
				$("[data-toggle='popover']").popover();
				$("[data-toggle='tooltip']").tooltip({
					placement: 'bottom'
				});
			}
		},
		Main = function() {
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

			self.$modalEdit = $("#modal_edit");
			self.$modalAlert = $("#modal_alert");
			self.$userList = $("#user_list");
			self.$userAdd = $("#user_add");

			self.$email = self.$modalEdit.find("[data-field='email']");

			self.$modalSuccess = $("#modal_success");
			self.$globalSearch = $("#global_search");

		},

		bindEvent: function() {
			var self = this;

			// self.$userList.on("click", "[data-field='update'],[data-field='del']", function() {

			// 	var field = $(this).attr("data-field"),
			// 		email = $(this).closest("tr").find("[data-field='email']").html();
			// 	switch (field) {
			// 		case "update":
			// 			self.$modalEdit.prop("model", {
			// 				"name": "update",
			// 				"idx": $(this).closest("tr").index()
			// 			}).modal({
			// 				backdrop: true, //默认,是否显示背景,值为static时点击背景无效
			// 				keyboard: true, //默认,点击esc消失
			// 				show: true //默认,模态框初始化之后就立即显示出来。
			// 			});
			// 			break;
			// 		case "del":
			// 			self.$modalAlert.data("id", email).modal({
			// 				backdrop: 'static'
			// 			});
			// 			break;
			// 		default:
			// 			break;
			// 	}
			// });

			self.$email.on("blur keyup propertychange", function() {
				$(this).popover("hide");
			});

			// self.$userList.on("click", "tbody tr", function() {
			// 	self.toggleActive($(this));
			// });

			// self.$modalEdit.on("click", "[data-field='save']", function() {
			// 	self.save();
			// });

			// self.$modalAlert.on('click', "[data-field='del_sure']", function() {
			// 	self.delUerInfo();
			// });

			self.$userAdd.on('click', function() {
				self.$modalEdit.prop("model", {
					"name": "create"
				}).modal("show");
			});

			// self.$modalEdit.on("show.bs.modal", function() {
			// 	self.$globalSearch.val("edit show before");
			// });

			// self.$modalEdit.on("shown.bs.modal", function(evt) {
			// 	self.$globalSearch.val("edit show after");
			// 	var model = $(this).prop("model"),
			// 		$tr;
			// 	if (model.name === "update") {
			// 		$tr = self.$userList.find(">tbody>tr:eq(" + model.idx + ")");
			// 		var rst = $tr.selectedAllAppointScope();
			// 		self.$modalEdit.loadAppointScope(rst);
			// 	}
			// });

			// self.$modalEdit.on("hide.bs.modal", function() {
			// 	self.$globalSearch.val("edit hide before");
			// });

			// self.$modalEdit.on("hidden.bs.modal", function() {
			// 	self.$globalSearch.val("edit hide after");
			// 	self.$modalEdit.clearAllAppointScope();
			// 	self.showTipSuccess();
			// });
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
					afterRender: null,
					complete: null,
					afterModalHidden: function() {
						self.showTipSuccess();
						self.$email.popover("hide");
					},
					operatorError: function(action, msg) {
						switch (action) {
							case "create":
								self.$email.attr("data-content", msg).popover("show");
								break;
							case "update":
								break;
							case "delete":
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
					read: globalConfig.paths.loadUser,
					create: globalConfig.paths.createUser,
					update: globalConfig.paths.updateUser,
					delete: globalConfig.paths.delUserUrl
				}
			});
			self.grid.load();
		}
	};

	initBootstrap.init();

	new Main();
});