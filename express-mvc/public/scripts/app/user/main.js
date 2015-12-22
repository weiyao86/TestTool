require(["ajax", "globalConfig", "mustache", "grid", "jqExtend", "jqform", "fader", "tabPanel", "blockUI", "jquery", "bootstrap", "domReady!"], function(ajax, globalConfig, Mustache, Grid) {
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

			self.$email = $("#filters_scope").find("[data-field='email']");

			self.$btnUpload = $("#gridpanel [data-action='upload']");

			self.$globalSearch = $("#global_search");

		},

		bindEvent: function() {
			var self = this;

			self.$email.on("blur keyup propertychange", function() {
				$(this).popover("hide");
			});

			self.$btnUpload.on({
				"click": function() {
					$(this).val("");
					console.log("click");
				},
				"change": function(e) {
					console.log($(this).val());
					$("#uploadForm").ajaxSubmit({
						url: globalConfig.paths.upload,
						resetForm: false,
						type: 'POST',
						dataType: 'json',
						iframe: true,
						beforeSubmit: function() {
							$.blockUI({
								css: {
									border: "none",
									left: "50%",
									width: 50,
									height: 50,
									background: "transparent"
								},
								message: $.initBlockMsg()
							});
							return true;
						},
						success: function(rst) {
							$.unblockUI();
							$.messageAlert(rst.msg + " : " + rst.filename);
						},
					});
				}
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
					afterRender: null,
					complete: null,
					afterModalHidden: function() {

						self.$email.popover("hide");
					},
					operatorError: function(action, msg) {
						switch (action) {
							case "create":
								self.$email.attr("data-content", msg).popover("show");
								break;
							case "update":
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
					read: globalConfig.paths.loadUser,
					create: globalConfig.paths.createUser,
					update: globalConfig.paths.updateUser,
					destroy: globalConfig.paths.delUserUrl
				},
				operator: {
					addBtn: "user_add"
				},
				/*modal*/
				modalConfirm: "modal_confirm",
				modalAlert: "modal_alert"
			});
			self.grid.load();
		}
	};

	initBootstrap.init();

	new Main();
});