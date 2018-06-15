/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('et6.view.main.MainController', {
	extend: 'Ext.app.ViewController',

	alias: 'controller.main',

	onItemSelected: function(sender, record) {
		Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
	},

	onConfirm: function(choice) {
		if (choice === 'yes') {
			//
		}
	},
	onAxisLabelRender: function(axis, label, layoutContext) {
		// Custom renderer overrides the native axis label renderer.
		// Since we don't want to do anything fancy with the value
		// ourselves except appending a '%' sign, but at the same time
		// don't want to loose the formatting done by the native renderer,
		// we let the native renderer process the value first.
		// return layoutContext.renderer(label) + '%';
		return label.toFixed(label < 10 ? 1 : 0) + '%';
	},

	onSeriesTooltipRender: function(tooltip, record, item) {
		var title = item.series.getTitle();

		tooltip.setHtml(title + ' on' + record.get('month') + ': ' + record.get(item.series.getYField()) + '%');
	},

	onItemHighlightChange: function(chart, newHighlightItem, oldHighlightItem) {
		this.setSeriesLineWidth(newHighlightItem, 4);
		this.setSeriesLineWidth(oldHighlightItem, 2);
	},

	setSeriesLineWidth: function(item, lineWidth) {
		if (item) {
			item.series.setStyle({
				lineWidth: lineWidth
			});
		}
	},

	onSeriesLabelRender: function(value) {
		return 'Hi: ' + value.toFixed(1);
	},

	onToggleMarkers: function() {
		var chart = this.lookupReference('chart'),
			seriesList = chart.getSeries(),
			ln = seriesList.length,
			i = 0,
			series;

		for (; i < ln; i++) {
			series = seriesList[i];
			series.setShowMarkers(!series.getShowMarkers());
		}

		chart.redraw();
	},

	onPreview: function() {

		var chart = this.lookupReference('chart');

		chart.preview();
	}
});