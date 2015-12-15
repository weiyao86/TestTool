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

			self.$email = $("#filters_scope").find("[data-field='email']");

			self.$globalSearch = $("#global_search");

		},

		bindEvent: function() {
			var self = this;

			self.$email.on("blur keyup propertychange", function() {
				$(this).popover("hide");
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
				},
				operator: {
					addBtn: "user_add",
					export: ""
				}
			});
			self.grid.load();
		}
	};

	initBootstrap.init();

	new Main();
});