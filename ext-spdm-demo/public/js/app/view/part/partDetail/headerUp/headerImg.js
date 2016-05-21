Ext.define('HPSPDM.view.part.partDetail.headerUp.headerImg', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.headerUpHeaderImgOperator',
	border: false,
	items: [{
		height: 400,
		itemId: 'img_scope',
		tpl: new Ext.XTemplate(Ext.get('detail').getHTML(), {
			tempArray: function(a) {
				var arr = [],
					i = 0,
					len = 20,
					src = 'http://img.weiphone.net/1/h061/h18/57e66c00img201605142018080_306__220.jpg';
				for (; i < len && arr.push({
						title: 'title_' + i,
						src: i % 2 == 1 ? src : 'http://res2.dev.servision.com.cn/tis/epc/dfsk/legend/image/FG330-330-102.jpg'
					}); i++);
				return arr;
			}
		}),
		data: [],
		dockedItems: [{
			xtype: 'toolbar',
			dock: 'bottom',
			layout: {
				pack: 'end'
			},
			items: [{
				xtype: 'button',
				itemId: 'del_photo',
				text: '删除图片'
			}, {
				xtype: 'button',
				itemId: 'add_photo',
				text: '添加图片',
				handler: function() {

					var dh = Ext.DomHelper;
					var ul = Ext.fly(this.up('[itemId=img_scope]').el.query('ul')[0]);
					var tpl = dh.createTemplate('<li id="id_{xindex}"><a href="javascript:;" data-action="img-ck" class=""><img src="{src}" alt="{src}"></a></li>');
					//tpl = new Ext.XTemplate();
					var data = {
						title: 'title',
						src: 'http://res2.dev.servision.com.cn/tis/epc/dfsk/legend/image/FG330-330-102.jpg'
					};
					tpl.append(ul, data);
					ul.scroll('top', 9999);
				}
			}]
		}],
		listeners: {
			afterrender: function() {
				var me = this;

				me.el.on('click', function(e, that) {
					var lis = this.down('ul').select('li a.active').elements[0];
					lis && Ext.fly(lis).toggleCls('active');
					Ext.fly(that).toggleCls('active');

				}, me.el, {
					delegate: 'a[data-action=img-ck]'
				});
				//更新数据
				//var h = this.tpl.apply();
				//this.update(h)
			}
		}
	}]
});