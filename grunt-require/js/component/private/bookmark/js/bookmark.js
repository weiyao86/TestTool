/*!
 * Name: Bookmark
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
            "109": "书签管理",
            "110": "添加时间",
            "111": "操作",
            "112": "删除",
            "113": "查看",
            "114": "书签名称不允许为空",
            "115": "添加成功"
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
            "109": "Bookmark Manager",
            "110": "Add Time",
            "111": "Operating",
            "112": "Delete",
            "113": "View",
            "114": "Bookmark names are not allowed to empty",
            "115": "Bookmarked"
        }
    };

    // component steup
    function setup(listTpl, addTpl, css, Mustache, ajax, globalConfig, track) {

        var actions = globalConfig.actions,
            trans = i18n[globalConfig.context.lang || "zh_CN"];

        // default config options
        var defaultOpts = {
            bookmark: "tis-bookmark",
            favorites: "tis-bookmark-favorites",
            addTpl: addTpl,
            listTpl: listTpl,
            urls: {
                read: actions.bookmarkLoadUrl,
                save: actions.bookmarkSaveUrl,
                destroy: actions.bookmarkDeleteUrl,
                view: actions.bookmarkViewUrl
            },
            callbacks: {
                onAddFavorites: null
            }
        };

        // define bookmark constructor
        var Bookmark = function (opts) {

            this.opts = $.extend(true, {}, defaultOpts, opts || {});

            this.init();
        };

        // bookmark prototype realize
        Bookmark.prototype = {

            init: function () {
                var me = this;

                me.embedTpl();
                me.initDomEl();
                me.initListTpl();
                me.initEvent();
            },

            embedTpl: function () {
                var me = this,
                    listTpl = Mustache.render(me.opts.listTpl, trans),
                    addTpl = Mustache.render(me.opts.addTpl, trans);

                $(document.body).append(listTpl.replace(/{-{/g, "{{").replace(/}-}/g, "}}"));
                $(document.body).append(addTpl.replace(/{-{/g, "{{").replace(/}-}/g, "}}"));
            },

            initDomEl: function () {
                var me = this;

                me.host = me.opts.host || "";
                me.loadingImgSrc = me.opts.loadingImgSrc || "";
                me.$target = $("#" + me.opts.target);
                me.$tisFavorites = $("#" + me.opts.favorites);
                me.$tisBookmark = $("#" + me.opts.bookmark);
                me.$favoritesTarget = $("#" + me.opts.favoritesTarget);
                me.$checkAll = me.$tisBookmark.find("[data-action=check-all]");
                me.$tisBookmarkBody = me.$tisBookmark.find("[data-action=body]");
            },

            initListTpl: function () {
                var me = this;

                me.listTpl = me.$tisBookmark.find("[data-action=list-tpl]").html();
            },

            initEvent: function () {
                var me = this;

                me.$target.on("click", function () {
                    me.openBookmark();
                });

                me.$favoritesTarget.on("click", function () {
                    me.openFavorites();
                });

                me.getFavoritesEl("close").on("click", function () {
                    me.closeFavorites();
                });

                me.getFavoritesEl("save").on("click", function () {
                    me.addFavorites();
                });

                me.getBookmarkEl("close").on("click", function () {
                    me.closeBookmark();
                });

                me.$checkAll.on("click", function () {
                    me.checkAll();
                });

                me.getBookmarkEl("delete-checked").on("click", function () {
                    me.destroyMultiple();
                });

                me.getBookmarkEl("body").on("click", "input[type=checkbox], a", function () {
                    me.selectionRow(this);
                });
            },

            selectionRow: function (target) {
                var me = this,
                    action = $(target).attr("data-action");

                switch (action) {
                    case "view":
                        me.viewBookmark(target);
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

            viewBookmark: function (target) {
                var me = this,
                    params = $(target).attr("data-params"),
                    host = globalConfig.context.host == "" ? "/" : globalConfig.context.host,
                    url = host + "?" + params;

                var trackParams = { source: "书签管理窗口", args: params };
                track.publish("legendData", "跳转至左图右数据", "click", "view", trackParams);

                window.open(url, "_self");
            },

            checkAll: function () {
                var me = this,
                    $checkBoxs = me.getBookmarkEl("check"),
                    isChecked = me.$checkAll.is(":checked");

                $checkBoxs.attr("checked", isChecked);
            },

            singleCheck: function () {
                var me = this,
                    $checkBoxs = me.getBookmarkEl("check"),
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
                        me.$tisBookmark.block({
                            message: me.loadingImgSrc,
                            css: {
                                border: "none",
                                background: "none"
                            }
                        });
                    },
                    complete: function () {
                        me.$tisBookmark.unblock();
                    },
                    success: function (root) {
                        me.finishLoad(root);
                    },
                    failed: function (root) {
                        alert(root.reason);
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

                me.$tisBookmarkBody.html(html);
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
                track.publish("book-mark", "删除单条", "click", "delete", { args: params });
            },

            destroyMultiple: function () {
                var me = this, params = [],
                    $checkedBox = me.getBookmarkEl("check").filter(":checked");

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
                track.publish("book-mark", "选中删除", "click", "delete", { args: params });
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

            addFavorites: function () {
                if (!this.validateBookmarkName()) {
                    alert(trans["114"]);
                    this.getFavoritesEl("bookmark-name").focus();
                    return;
                }
                var me = this,
                    params = me.getParams();

                ajax.invoke({
                    url: me.opts.urls.save,
                    data: JSON.stringify(params),
                    contentType: "application/json",
                    success: function (root) {
                        me.finishFavorites(root);
                    },
                    failed: function (root) {
                        alert(root.reason);
                    }
                });
                track.publish("add-book-mark", "添加书签窗口-保存", "click", "add", params);
            },

            validateBookmarkName: function () {
                var me = this,
                    $bookmarkName = me.getFavoritesEl("bookmark-name"),
                    bokmarkNameVal = $bookmarkName.val();

                if ($.trim(bokmarkNameVal).length === 0) {
                    return false;
                } else {
                    return true;
                }
            },

            getParams: function () {
                var me = this,
                    bookmarkName = me.getFavoritesEl("bookmark-name").val(),
                    params = { "Description": bookmarkName };

                for (var key in me.paths) {
                    params[key] = me.paths[key];
                }

                return params;
            },

            finishFavorites: function (root) {
                var me = this;

                alert(trans["115"]);
                me.closeFavorites();
            },

            openBookmark: function () {
                var me = this,
                    dialogWidth = me.$tisBookmark.width(),
                    dialogHeight = me.$tisBookmark.height();

                $.blockUI({
                    focusInput: false,
                    message: me.$tisBookmark,
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

            closeBookmark: function () {
                var me = this;

                $.unblockUI();
            },

            openFavorites: function (params) {
                var me = this,
                    dialogHeight = me.$tisFavorites.height(),
                    dialogWidth = me.$tisFavorites.width();

                me.paths = params;
                $.blockUI({
                    message: me.$tisFavorites,
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
            },

            closeFavorites: function () {
                var me = this;

                me.getFavoritesEl("bookmark-name").val("");
                $.unblockUI();
            },

            getBookmarkEl: function (action) {
                var me = this;

                return me.$tisBookmark
                         .find('[data-action="' + action + '"]');
            },

            getFavoritesEl: function (action) {
                var me = this;

                return me.$tisFavorites
                         .find('[data-action="' + action + '"]');
            }

        };

        // return constructor
        return Bookmark;
    }

    /* Using require js AMD standard */
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {

        var basePath = (function () {
            var splittedPath,
                config = require.s.contexts._.config,
                path = config.paths["bookmark"];

            if (typeof path !== "undefined") {
                splittedPath = path.split(/\/+/g);
                return splittedPath.slice(0, splittedPath.length - 2).join("/") + "/";
            } else {
                alert("require config paths 'bookmark' key not exist")
            }
        })();

        if (typeof basePath !== "undefined") {
            define(['text!' + basePath + 'tpl/list-dialog.html',
                    'text!' + basePath + 'tpl/add-dialog.html',
                    'text!' + basePath + 'css/bookmark.css',
                    "mustache", "ajax", "globalConfig", "track", "blockUI"],
                    setup);
        }
    }
})()