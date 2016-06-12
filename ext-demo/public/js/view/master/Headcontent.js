Ext.define('DEMO.view.master.Headcontent', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.headcontent',
	id: 'header',
	height: 60,
	border: false,
	bodyStyle: 'background:rgba(70, 70, 70,1);color:#fff;',
	html: Ext.get("header").getHTML()
})