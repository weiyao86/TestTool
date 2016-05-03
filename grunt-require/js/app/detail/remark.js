define(["globalConfig", "ajax", "mustache","track", "blockUI"], function (globalConfig, ajax, Mustache,track) {

    var readUrl = globalConfig.actions.remarkLoadUrl,
        addUrl = globalConfig.actions.remarkAddUrl,
        trans = globalConfig.trans,
        editUrl = globalConfig.actions.remarkEditUrl;

    var Remark = function () {
        this.init();
    };

    Remark.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindTempalte();
            self.bindEvent();
        },

        bindDomEls: function () {
            var self = this;

            self.$add = $("#add-remark");
            self.$grid = $("#remark-grid");
            self.$dialog = $("#remark-edit");
            self.$operation = $("#remark-operation");
        },

        bindTempalte: function () {
            var self = this;

            self.gridTemplate = self.$grid.find("script").html();
        },

        bindEvent: function () {
            var self = this, action;

            self.$add.click(function () {
                self.open();
            });

            self.$operation.on("click", "a", function (e) {
                self.operationClicked(e);
            });

            self.$grid.on("click", "a[data-action]", function (e) {
                self.gridClicked(e);
            });
        },

        operationClicked: function (e) {
            var self = this,
                action = $(e.target).attr("data-action");

            if (action === "save") {
                self.save();
            } else if (action === "cancel") {
                self.close();
                self.clear();
            }
        },

        gridClicked: function (e) {
            var self = this,
                action = $(e.target).attr("data-action");

            if (action === "edit") {
                self.renderEdit(e);
                self.open();
            }
        },

        load: function () {
            var self = this,
                params = { PartNumber: $.getParameterByName("partNumber") };

            ajax.invoke({
                url: readUrl,
                data: params,
                success: function (root) {
                    self.buildData(root.Data);
                },
                failed: function (reason) {
                    alert(reason.errorMessage);
                }
            });
        },

        save: function () {
            var self = this,
                params = self.getParams();

            ajax.invoke({
                url: addUrl,
                data: params,
                success: function (root) {
                    alert(trans["162"]);
                    self.close();
                    self.load();
                    track.publish("partdetail", "添加备注", "click", "add", params);

                },
                failed: function () {
                    alert(reason.errorMessage);
                }
            });
        },

        renderEdit: function (e) {
            var self = this, field, value,
                $els = self.$dialog.find("[data-scope='edit'][data-field]");

            $els.each(function (idx, el) {
                field = $(el).attr("data-field");
                value = $(e.target).attr("data-" + field);
                if (value) $(el).setVal(value);
            });
        },

        buildData: function (data) {
            var self = this;

            for (var i = 0; i < data.length; i++) {
                data[i]["rowNumber"] = i + 1;
            }

            self.render(data);
        },

        render: function (data) {
            var self = this,
                output = Mustache.render(self.gridTemplate, { records: data });

            self.$grid.html(output);
        },

        getParams: function () {
            var self = this, val, field,
                params = {},
                $els = self.$dialog.find("[data-scope='edit'][data-field]");

            $els.each(function (idx, e) {
                field = $(e).attr("data-field");
                val = $(e).getVal();
                params[field] = val;
            });

            return params;
        },

        open: function () {
            var self = this,
                left = ($(window).width() - self.$dialog.width()) / 2,
                top = ($(window).height() - self.$dialog.height()) / 2;

            $(document).on("keyup.remark", function (e) {
                if (e.keyCode === 27) self.close();
            })

            $.blockUI({
                message: self.$dialog,
                css: {
                    left: left,
                    top: top,
                    width: self.$dialog.width(),
                    height: self.$dialog.height(),
                    border: 'none',
                    cursor: 'default',
                    textAlign: 'left'
                }
            });
        },

        close: function () {
            var self = this;

            $(document).off("keyup.remark");
            $.unblockUI();
            self.clear();
        },

        clear: function () {
            var self = this,
                $els = self.$dialog.find("[data-scope='edit'][data-isClear!='false'][data-field]");

            $els.each(function (idx, e) {
                $(e).clearVal();
            });
        }

    };

    return Remark;

});