Ext.define('SPDM.view.master.Header', {
	extend: 'Ext.panel.Panel',
	region: 'north',
	alias: 'widget.masterheader',
	height: 60,
	width: 'auto',
	border: false,
	html: '<h1 class="header-logo">浩配主数据管理系统</h1>' +
		'<ul class="header-userinfo">' +
		'<li><span>登录时间：</span><label>' + new Date().getTime() + '</label></li>' +
		'<li><span>用户：</span><label> SPDM.header.data.username</label></li>' +
		'<li><span>角色：</span><label>管理员、文件工具员</label></li>' +
		'</ul>' +
		'<ol class="header-operation">' +
		'<li><a data-action="change-password"><s class="operation-lock"></s><span>修改密码</span></a></li>' +
		'<li><a data-action="logout"><s class="operation-logout"></s><span>退出</span></a></li>' +
		'</ol>'
});