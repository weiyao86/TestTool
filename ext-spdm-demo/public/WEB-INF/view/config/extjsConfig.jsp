
<%
	String pageCode = (String) request.getAttribute("pageCode");
%>

<!-- extjs page config -->

<script type="text/javascript">
	Ext.define("SPDM.extjsConfig", {
		statics : {
			pageCode : "${pageCode}",
			appFolder : "${path}/js/app",
			uxFolder : "${path}/js/extjs/ux",
			pages : {
				"login" : {
					controller : "account.Login",
					viewport : "account.login.Viewport"
				},
				"master" : {
					controller : "master.Frame",
					viewport : "master.Viewport"
				},
				//标准名称管理
				"f88763e6-2c88-6c04-11a6-13bba955d6a4" : {
					controller : "standardName.StandardName",
					viewport : "standardName.Viewport"
				},
				//车型管理 
				"车型管理" : {
					controller : "modelRelate.ModelManage",
					viewport : "modelRelate.modelManage.Viewport"
				},

				// 配件结构标准名称定义
				"modelname" : {
					controller : "standardName.PartStructureStandardName",
					viewport : "standardName.partStructureStandardName.Viewport"
				}

			}
		}
	});
</script>
