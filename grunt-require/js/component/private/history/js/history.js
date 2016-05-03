/*!
 * Name: History
 * Version: 1.0-2014-11-14
 * @requires jQuery v1.4 or later
 */

(function () {

    // i18n
    var i18n = {
        "zh_CN": {
            "100": "删除成功",
            "101": "删除失败",
            "102": "请选中需要删除的记录",
            "103": "确认删除当前记录吗?",
            "104": "确认删除选中记录吗",
            "105": "添加书签",
            "106": "书签名称",
            "107": "保存",
            "108": "取消",
            "109": "添加时间",
            "110": "操作",
            "111": "删除",
            "112": "查看",
            "113": "序号",
            "114": "品牌",
            "115": "目录",
            "116": "年",
            "117": "车型",
            "118": "主组",
            "119": "图例编号",
            "120": "历史管理"
        },
        "en_US": {
            "100": "Deleted successfully",
            "101": "Delete failed",
            "102": "Please select the record to be deleted",
            "103": "Confirm delete the current record it?",
            "104": "Confirm delete the selected record it?",
            "105": "Add a bookmark",
            "106": "Bookmark Name",
            "107": "Save",
            "108": "Cancel",
            "109": "Add Time",
            "110": "Operating",
            "111": "Delete",
            "112": "View",
            "113": "No.",
            "114": "Brand",
            "115": "Catalogue",
            "116": "Year",
            "117": "Model",
            "118": "Major Group",
            "119": "Legand No.",
            "120": "History management"
        }
    };

    // component steup
    function setup(listTpl, css, Mustache, ajax, globalConfig, track) {
        var actions = globalConfig.actions,
            trans = i18n[globalConfig.context.lang || "zh_CN"];

        // default config options
        var defaultOpts = {
            history: "tis-history",
            listTpl: listTpl,
            urls: {
                read: actions.historyLoadUrl,
                destroy: actions.historyDeleteUrl,
                save: actions.historyInsertUrl
            }
        };

        // define history constructor
        var History = function (opts) {

            this.opts = $.extend(true, {}, defaultOpts, opts || {});

            this.init();
        };

        // history prototype realize
        History.prototype = {

            init: function () {
                var me = this;

                me.embedTpl();
                me.initDomEl();
                me.initListTpl();
                me.initEvent();
            },

            embedTpl: function () {
                var me = this,
                    listTpl = Mustache.render(me.opts.listTpl, trans);

                $(document.body).append(listTpl.replace(/{-{/g, "{{").replace(/}-}/g, "}}"));
            },

            initDomEl: function () {
                var me = this;

                me.host = me.opts.host || "";
                me.loadingImgSrc = me.opts.loadingImgSrc || "";
                me.$target = $("#" + me.opts.target);
                me.$tisHistory = $("#" + me.opts.history);
                me.$checkAll = me.$tisHistory.find("[data-action=check-all]");
                me.$tisHistoryBody = me.$tisHistory.find("[data-action=body]");
            },

            initListTpl: function () {
                var me = this;

                me.listTpl = me.$tisHistory.find("[data-action=list-tpl]").html();
            },

            initEvent: function () {
                var me = this;

                me.$target.on("click", function () {
                    me.openHistory();
                });

                me.getHistoryEl("close").on("click", function () {
                    me.closeHistory();
                });

                me.$checkAll.on("click", function () {
                    me.checkAll();
                });

                me.getHistoryEl("delete-checked").on("click", function () {
                    me.destroyMultiple();
                });

                me.getHistoryEl("body").on("click", "input[type=checkbox], a", function () {
                    me.selectionRow(this);
                });
            },

            selectionRow: function (target) {
                var me = this,
                    action = $(target).attr("data-action");

                switch (action) {
                    case "view":
                        me.viewHistory(target);
                        break;
                    case "destroy":
                        me.destroySingle(target);
                        break;
                    case "check":
                        me.singleCheck();
                        break;
                    default:
                        break;
                }
            },

            viewHistory: function (target) {
                var me = this,
                    params = $(target).attr("data-params"),
                    host = globalConfig.context.host == "" ? "/" : globalConfig.context.host,
                    url = host + "?" + params;

                var trackParams = { source: "历史管理窗口", args: params };
                track.publish("legendData", "跳转至左图右数据", "click", "view", trackParams);
                window.open(url, "_self");
            },

            checkAll: function () {
                var me = this,
                    $checkBoxs = me.getHistoryEl("check"),
                    isChecked = me.$checkAll.is(":checked");

                $checkBoxs.attr("checked", isChecked);
            },

            singleCheck: function () {
                var me = this,
                    $checkBoxs = me.getHistoryEl("check"),
                    count = $checkBoxs.length,
                    checkedCount = $checkBoxs.filter(":checked").length;

                me.$checkAll.attr("checked", count == checkedCount);
            },

            loadData: function () {
                var me = this;

                ajax.invoke({
                    url: me.opts.urls.read,
                    contentType: "application/json",
                    beforeSend: function () {
                        me.$tisHistory.block({
                            message: me.loadingImgSrc,
                            css: {
                                border: "none",
                                background: "none"
                            }
                        });
                    },
                    complete: function () {
                        me.$tisHistory.unblock();
                    },
                    success: function (root) {
                        me.finishLoad(root);
                    },
                    failed: function (root) {
                        alert(root.reason)
                    }
                });
            },

            finishLoad: function (root) {
                var me = this, i = 0,
                    data = root.Data;

                // build rowNumber key
                for (; i < data.length; i++) {
                    data[i]["rowNumber"] = (i + 1);
                }

                me.render(data);
            },

            render: function (data) {
                var me = this,
                    html = Mustache.render(me.listTpl, { records: data });

                me.$tisHistoryBody.html(html);
                me.$checkAll.prop("checked", false);
            },

            destroySingle: function (target) {
                if (!confirm(trans["103"])) {
                    return;
                }
                var me = this,
                    $tr = $(target).parents("tr"),
                    id = $tr.attr("data-id"),
                    params = [{ Id: id }];

                me.doDestroy(params);
                track.publish("history", "单条删除", "click", "delete", params[0]);
            },

            destroyMultiple: function () {
                var me = this, params = [],
                    $checkedBox = me.getHistoryEl("check").filter(":checked");

                if ($checkedBox.length === 0) {
                    alert(trans["102"]);
                    return;
                }
                if (!confirm(trans["104"])) {
                    return;
                }
                $checkedBox.each(function () {
                    var id = $(this).parents("tr").attr("data-id");
                    params.push({ Id: id });
                });

                me.doDestroy(params);
                track.publish("history", "选中删除", "click", "delete", { args: params });

            },

            doDestroy: function (params) {
                var me = this;

                ajax.invoke({
                    url: me.opts.urls.destroy,
                    data: JSON.stringify(params),
                    contentType: "application/json",
                    success: function (root) {
                        me.finishDestroy();
                    },
                    failed: function (root) {
                        alert(trans["101"] + ":" + root.reason)
                    }
                });
            },

            finishDestroy: function () {
                var me = this;

                alert(trans["100"]);
                me.loadData();
            },

            addHistory: function (params) {
                var me = this;

                ajax.invoke({
                    url: me.opts.urls.save,
                    contentType: "application/json",
                    data: JSON.stringify(params)
                });
            },

            openHistory: function () {
                var me = this,
                    dialogWidth = me.$tisHistory.width(),
                    dialogHeight = me.$tisHistory.height();

                $.blockUI({
                    focusInput: false,
                    message: me.$tisHistory,
                    css: {
                        top: ($(window).height() - dialogHeight) / 2 + 'px',
                        left: ($(window).width() - dialogWidth) / 2 + 'px',
                        width: dialogWidth + 'px',
                        height: dialogHeight + 'px',
                        cursor: 'auto',
                        border: "0",
                        borderRadius: "4px"
                    }
                });
                me.loadData();
            },

            closeHistory: function () {
                var me = this;

                $.unblockUI();
            },

            getHistoryEl: function (action) {
                var me = this;

                return me.$tisHistory
                         .find('[data-action="' + action + '"]');
            }
        };

        // return constructor
        return History;
    }

    /* Using require js AMD standard */
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {

        var basePath = (function () {
            var splittedPath,
                config = require.s.contexts._.config,
                path = config.paths["history"];

            if (typeof path !== "undefined") {
                splittedPath = path.split(/\/+/g);
                return splittedPath.slice(0, splittedPath.length - 2).join("/") + "/";
            } else {
                alert("require config paths 'history' key not exist")
            }
        })();

        if (typeof basePath !== "undefined") {
            define(['text!' + basePath + 'tpl/list-dialog.html',
                    'text!' + basePath + 'css/history.css',
                    "mustache", "ajax", "globalConfig", "track", "blockUI"],
                    setup);
        }
    }
})()