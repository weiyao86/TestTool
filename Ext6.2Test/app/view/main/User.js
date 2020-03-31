Ext.define("et6.view.main.User", {
	extend: "Ext.panel.Panel",
	alias: 'widget.user',
	layout: 'fit',
	items: [{
		xtype: 'cartesian',
		itemId: 'user-chart',
		reference: 'chart',
		store: {
			type: 'climate'
		},
		insetPadding: {
			top: 40,
			bottom: 40,
			left: 20,
			right: 40
		},
		interactions: {
			type: 'itemedit'
				// tooltip: {
				// 	renderer: 'onEditTipRender'
				// }
				// renderer: 'onColumnEdit'
		},
		axes: [{
			type: 'numeric',
			position: 'left',
			minimum: 30,
			titleMargin: 20,
			title: {
				text: 'Temperature in °F'
			}
			// listeners: {
			//     rangechange: 'onAxisRangeChange'
			// }
		}, {
			type: 'category',
			position: 'bottom'
		}],
		animation: Ext.isIE8 ? false : true,
		series: [{
				type: 'bar',
				xField: 'month',
				yField: 'highF',
				style: {
					minGapWidth: 10
				},
				highlight: {
					strokeStyle: 'black',
					fillStyle: 'red' //gold
				},
				label: {
					field: 'highF',
					display: 'insideEnd'
						// renderer: 'onSeriesLabelRender'
				}
			}, {
				type: 'line',
				axis: 'right',
				xField: 'month',
				yField: 'highF',
				title: 'Smooth',
				label: { //显示柱上面的数字，并设置样式  
					display: 'insideEnd',
					'text-anchor': 'middle',
					field: ['month'],
					renderer: Ext.util.Format.numberRenderer('0'),
					orientation: 'vertical',
					color: '#f00'
				},
				markerConfig: {
					type: 'circle', //折线图“点”的样式  
					size: 4,
					radius: 4,
					'stroke-width': 0
				},
				style: {
					smooth: true,
					stroke: "#94ae0a",
					fillOpacity: 0.6,
					miterLimit: 3,
					lineCap: 'miter',
					lineWidth: 2
				}
			}
			// , {
			// 	type: 'line', //折线  
			// 	axis: 'right',
			// 	highlight: true,
			// 	label: { //显示柱上面的数字，并设置样式  
			// 		display: 'insideEnd',
			// 		'text-anchor': 'middle',
			// 		field: ['month'],
			// 		renderer: Ext.util.Format.numberRenderer('0'),
			// 		orientation: 'vertical',
			// 		color: '#f00'
			// 	},
			// 	listeners: { //点击时alert出横坐标的值(或者跳转到指定的页面)  
			// 		"itemclick": function(storeItem) {
			// 			alert(storeItem.storeItem.get('field0'));
			// 		}
			// 	},
			// 	markerConfig: {
			// 		type: 'circle', //折线图“点”的样式  
			// 		size: 4,
			// 		radius: 4,
			// 		'stroke-width': 0
			// 	},
			// 	xField: 'high',
			// 	yField: ['low'],
			// 	title: '合同数量' //自定义的图例名称  
			// }
		],
		sprites: {
			type: 'text',
			text: 'Redwood City Climate Data',
			fontSize: 22,
			width: 100,
			height: 30,
			x: 40, // the sprite x position
			y: 20 // the sprite y position
		}
	}]
});



Ext.define('et6.store.Climate', {
	extend: 'Ext.data.Store',
	alias: 'store.climate',

	fields: [
		'month',
		'high',
		'low', {
			name: 'highF',
			calculate: function(data) {
				return data.high * 1.8 + 32;
			}
		}, {
			name: 'lowF',
			calculate: function(data) {
				return data.low * 1.8 + 32;
			}
		}
	],
	data: [{
		month: 'Jan',
		high: 14.7,
		low: 5.6
	}, {
		month: 'Feb',
		high: 16.5,
		low: 6.6
	}, {
		month: 'Mar',
		high: 18.6,
		low: 7.3
	}, {
		month: 'Apr',
		high: 20.8,
		low: 8.1
	}, {
		month: 'May',
		high: 23.3,
		low: 9.9
	}, {
		month: 'Jun',
		high: 26.2,
		low: 11.9
	}, {
		month: 'Jul',
		high: 27.7,
		low: 13.3
	}, {
		month: 'Aug',
		high: 27.6,
		low: 13.2
	}, {
		month: 'Sep',
		high: 26.4,
		low: 12.1
	}, {
		month: 'Oct',
		high: 23.6,
		low: 9.9
	}, {
		month: 'Nov',
		high: 17,
		low: 6.8
	}, {
		month: 'Dec',
		high: 14.7,
		low: 5.8
	}],

	counter: 0,

	generateData: function() {
		var data = this.config.data,
			i, result = [],
			temp = 15,
			min = this.counter % 2 === 1 ? 0 : temp;
		for (i = 0; i < data.length; i++) {
			result.push({
				month: data[i].month,
				high: min + temp + Math.random() * temp,
				low: min + Math.random() * temp
			});
		}
		this.counter++;
		return result;
	},

	refreshData: function() {
		this.setData(this.generateData());
	}

});