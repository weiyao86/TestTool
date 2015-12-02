$(function() {
	var $form = $("form"),
		selUrl;

	$("a").on("click", function(e) {
		e.preventDefault();
		selUrl = $(this).attr("href");

		var data = $form.formConvertToJson();

		$form.attr("action", selUrl);
		$form.submit();

		// $.ajax({
		// 	type: "POST",
		// 	contentType: "application/x-www-form-urlencoded",
		// 	url: selUrl,
		// 	dataType: 'json',
		// 	data: {
		// 		userid: data.userid
		// 	},
		// 	success: function(data) {
		// 		alert('success' + data.name)
		// 	},
		// 	error: function(err) {
		// 		alert('error')
		// 	}

		// });
	});

	$("[data-id='content']").on("click", function() {

		var data = $(this).selectedAllAppointScope();
		$form.loadAppointScope(data);
	});

});

$.fn.formConvertToJson = function() {
	var arr = this.serializeArray(),
		rst = {};
	$.each(arr, function(idx, val) {
		rst[val.name] = val.value;
	})
	return rst;
}
$.fn.extend({
	loadAppointScope: function(data) {

		this.find("input,select,a,span,div,textarea").each(function(index, element) {
			var type, key = $(element).attr("data-field") || element.name;
			if (key == undefined)
				return;
			var tagN = element.tagName.toUpperCase();
			if (tagN == "INPUT") {
				type = $(element).attr("type");

				switch (type) {
					case "text":
						$(element).val(data[key]);
						break;
					case "checkbox":
						$(element).attr("checked", data[key]);
						break;
					case "hidden":
						$(element).val(data[key]);
						break;
					default:
						break;
				};
			} else if (tagN == "SELECT") {
				$(element).val(data[key]);
			} else if (tagN == "A") {
				$(element).text(data[key]);
			} else if (tagN == "DIV" || element.tagName == "SPAN") {
				$(element).html(data[key]);
			} else if (tagN == "TEXTAREA") {
				$(element).text(data[key]);
			}

		});
	},

	// return selected object list
	selectedAllAppointScope: function() {

		var resultObj = {};
		this.find("[data-field]").each(function(index, element) {
			var type, key = $(element).attr("data-field");
			if (key == undefined)
				return;
			if (element.tagName == "INPUT") {
				type = $(element).attr("type");

				switch (type) {
					case "text":
						resultObj[key] = $(element).val();
						break;
					case "checkbox":
						resultObj[key] = $(element).is(":checked");
						break;
					case "hidden":
						resultObj[key] = $(element).val();
						break;
					default:
						break;
				};
			} else if (element.tagName == "SELECT") {
				if ($(element).val().length == 0)
					resultObj[key] = "";
				else
					resultObj[key] = $(element).val(); // { "text": $(element).find("option:selected").text(), "value": $(element).val() };
			} else if (element.tagName == "A") {
				resultObj[key] = $(element).html();
			} else if (element.tagName == "DIV" || element.tagName == "SPAN") {
				resultObj[key] = $(element).html();
			} else if (element.tagName == "TEXTAREA") {
				resultObj[key] = $(element).val() || $(element).text();
			} else {
				resultObj[key] = $(element).text();
			}
		});
		return resultObj;
	}
});