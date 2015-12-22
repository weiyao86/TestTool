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

			self.$editPanel = $("#modal_edit");
			self.$edit = self.$editPanel.children();

			self.$btnUpload = self.$edit.find("[data-action='upload_photo']");

			self.$photo = self.$edit.find("[data-filed='file']");

		},

		bindEvent: function() {
			var self = this;
			self.$btnUpload.on({
				"click": function() {
					$(this).val("");
					console.log("click");
				},
				"change": function(e) {
					self.$edit.find("[data-field='fileName']").val($(this).val());

					$("#uploadPhoto").ajaxSubmit({
						url: globalConfig.paths.uploadPhoto,
						resetForm: false,
						type: 'POST',
						dataType: 'json',
						iframe: true,
						beforeSubmit: function() {
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
							return true;
						},
						success: function(rst) {
							var fileSrc = rst.filename; // globalConfig.host+rst.filename;
							self.$edit.unblock();
							self.$photo.attr("src", fileSrc);
							// self.$editPanel.modal("hide");
							// $.messageAlert(rst.msg + " : " + rst.filename);
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
					read: globalConfig.paths.loadPhoto,
					create: globalConfig.paths.insertPhoto,
					update: globalConfig.paths.updatePhoto,
					destory: globalConfig.paths.destoryPhoto
				},
				operator: {
					addBtn: "addModal"
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