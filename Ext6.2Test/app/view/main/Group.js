Ext.define("et6.view.main.Group", {
	extend: 'Ext.panel.Panel',
	alias: 'widget.group',
	layout: 'fit',
	tbar: [
		'->', {
			text: 'Toggle markers',
			handler: 'onToggleMarkers'
		}, {
			text: 'Preview',
			handler: 'onPreview'
		}
	],
	items: [{
		xtype: 'cartesian',
		itemId: 'group-chart',
		reference: 'chart',
		interactions: {
			type: 'itemedit',
			// type: 'panzoom',
			zoomOnPanGesture: true
		},
		width: 400,
		height: 400,
		innerPadding: {
			left: 40,
			right: 40
		},
		legend: {
			type: 'sprite',
			docked: 'right'
		},
		store: {
			type: 'browsers'
		},

		sprites: [{
			type: 'text',
			text: 'Line Charts - Basic Line',
			fontSize: 22,
			width: 100,
			height: 30,
			x: 40, // the sprite x position
			y: 20 // the sprite y position
		}, {
			type: 'text',
			text: 'Data: Browser Stats 2012',
			fontSize: 10,
			x: 200,
			y: 470
		}, {
			type: 'text',
			text: 'Source: http://www.w3schools.com/',
			fontSize: 10,
			x: 200,
			y: 485
		}],
		axes: [{
			type: 'numeric',
			position: 'left',
			grid: true,
			minimum: 0,
			maximum: 24,
			renderer: 'onAxisLabelRender'
		}, {
			type: 'category',
			position: 'bottom',
			grid: true,
			label: {
				rotate: {
					degrees: -45
				}
			}
		}],
		series: [{
			type: 'bar',
			title: 'bar',
			xField: 'month',
			yField: 'data4',
			style: {
				minGapWidth: 10
			},
			highlight: {
				strokeStyle: 'black',
				fillStyle: 'gold'
			},

			label: {
				field: 'data4',
				display: 'insideEnd'
					// renderer: 'onSeriesLabelRender'
			},
			marker: {
				type: 'square',
				fx: {
					duration: 200,
					easing: 'backOut'
				}
			},
			tooltip: {
				trackMouse: true,
				showDelay: 0,
				dismissDelay: 0,
				hideDelay: 0,
				renderer: 'onSeriesTooltipRender'
			}
		}, {
			type: 'line',
			title: 'line',
			xField: 'month',
			yField: 'data1',
			style: {
				lineWidth: 2
			},
			marker: {
				radius: 4,
				lineWidth: 2,
				type: 'triangle',
				fx: {
					duration: 200,
					easing: 'backOut'
				}
			},
			label: {
				field: 'data1',
				display: 'over'
			},
			highlightCfg: {
				scaling: 2
			},
			highlight: {
				fillStyle: '#000',
				radius: 5,
				lineWidth: 2,
				strokeStyle: '#fff'
			},
			tooltip: {
				trackMouse: true,
				showDelay: 0,
				dismissDelay: 0,
				hideDelay: 0,
				renderer: 'onSeriesTooltipRender'
			}
		}]
	}]
});


Ext.define('et6.store.browsers', {
	extend: 'Ext.data.Store',
	alias: 'store.browsers',

	//                   IE    Firefox  Chrome   Safari
	fields: ['month', 'data1', 'data2', 'data3', 'data4', 'other'],

	constructor: function(config) {
		config = config || {};

		config.data = [{
			month: 'Jan',
			data1: 20,
			data2: 37,
			data3: 35,
			data4: 4,
			other: 4
		}, {
			month: 'Feb',
			data1: 20,
			data2: 37,
			data3: 36,
			data4: 5,
			other: 2
		}, {
			month: 'Mar',
			data1: 19,
			data2: 36,
			data3: 37,
			data4: 4,
			other: 4
		}, {
			month: 'Apr',
			data1: 18,
			data2: 36,
			data3: 38,
			data4: 5,
			other: 3
		}, {
			month: 'May',
			data1: 18,
			data2: 35,
			data3: 39,
			data4: 4,
			other: 4
		}, {
			month: 'Jun',
			data1: 17,
			data2: 34,
			data3: 42,
			data4: 4,
			other: 3
		}, {
			month: 'Jul',
			data1: 16,
			data2: 34,
			data3: 43,
			data4: 4,
			other: 3
		}, {
			month: 'Aug',
			data1: 16,
			data2: 33,
			data3: 44,
			data4: 4,
			other: 3
		}, {
			month: 'Sep',
			data1: 16,
			data2: 32,
			data3: 44,
			data4: 4,
			other: 4
		}, {
			month: 'Oct',
			data1: 16,
			data2: 32,
			data3: 45,
			data4: 4,
			other: 3
		}, {
			month: 'Nov',
			data1: 15,
			data2: 31,
			data3: 46,
			data4: 4,
			other: 4
		}, {
			month: 'Dec',
			data1: 15,
			data2: 31,
			data3: 47,
			data4: 4,
			other: 3
		}];

		this.callParent([config]);
	}


});