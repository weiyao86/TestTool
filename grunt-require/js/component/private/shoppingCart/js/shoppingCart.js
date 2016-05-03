(function () {
    // i18n
    var i18n = {
        "zh_CN": {
            "100": "购物车",
            "101": "购物车中还没有商品，赶紧选购吧!",
            "102": "共",
            "103": "件商品",
            "104": "共计",
            "105": "去购物车结算",
            "106": "件",
            "107": "无记录匹配搜索",
            "108": "此零件已在购物车中！",
            "109": "购买成功",
            "110": "是否确认删除",
            "111": "删除成功",
            "112": "错误",
            "113": "去购物车结算",
            "114": "最大值不能超过 99999",
            "115": "最小包装单元",
            "116": "已圆整",
            "117": "请输入最小包装数的整数倍",
            "118": "此零件在EPC中不存在，请返回检查零件编号是否有误"
        },
        "en_US": {
            "100": "Cart",
            "101": "Still empty? Go and Pick!",
            "102": "Subtotal",
            "103": "items",
            "104": "Total",
            "105": "Go to the cart for settlement",
            "106": "item",
            "107": "No records match search",
            "108": "The Part is already in the Cart",
            "109": "Buy successfully",
            "110": "Confirm the Deletion",
            "111": "Deleted successfully",
            "112": "Error",
            "113": "Go to the cart for settlement",
            "114": "The maximum value is 99999",
            "115": "Min. Package Unit",
            "116": "Orderer Info.",
            "117": "Please enter the multiple of qty",
            "118": "The part does not exist in the EPC. Please double check the part no."
        }
    };


    // component steup
    function setup(listTpl, Mustache, ajax, globalConfig, track) {
        var actions = globalConfig.actions,
            trans = i18n[globalConfig.context.lang || "zh_CN"];

        //// default config options
        var defaultOpts = {
            shoppingCart: "shopping-cart",
            target: "nav-shopping-cart",
            listTpl: listTpl,
            firstBg: "#b4e0ff",//#c7c7c7
            lastBg: "#ffffff",
            bgDelayTime: 2 * 1000,
            layerDelayTime: 3 * 1000,
            events: {},
            urls: {
                read: actions.shoppingCartLoadAll,
                destroy: actions.shoppingCartDelete,
                save: actions.shoppingCartSave,
                linkToDetail: actions.shoppingCartDetail,
                update: actions.shoppingCartUpdate
            },
            callbacks: {
                doDestroyAfter: null
            }
        };

        //// define history constructor
        var ShoppingCart = function (opts) {

            this.opts = $.extend(true, {}, defaultOpts, opts || {});

            this.init();
        };

        //// history prototype realize
        ShoppingCart.prototype = {

            init: function () {
                var me = this;

                me.initVariable();
                me.embedTpl();
                me.initDomEl();
                me.initListTpl();
                me.initEvent();
                me.loadData();
            },

            on: function (events, fun) {
                var me = this;
                if (typeof events === "string" && typeof fun === "function") {
                    events = { events: fun };
                }
                if ($.isEmptyObject(events)) return;
                for (var key in events) {
                    me.events[key] = events[key];
                }
            },

            afterDestroy: function (params, ret) {
                var me = this;
                if (typeof me.events['afterDestroy'] === 'function') {
                    me.events['afterDestroy'].call(me, params, ret);
                }
            },

            afterQtyChange: function (params, ret) {
                var me = this;
                if (typeof me.events['afterQtyChange'] === 'function') {
                    me.events['afterQtyChange'].call(me, params, ret);
                }
            },

            afterAddToShoppingCart: function (params, ret) {
                var me = this;
                if (typeof me.events['afterAddToShoppingCart'] === 'function') {
                    me.events['afterAddToShoppingCart'].call(me, params, ret);
                }
            },

            afterQtyChange: function (params, flag) {
                var me = this;
                if (typeof me.events['afterQtyChange'] === 'function') {
                    me.events['afterQtyChange'].call(me, params, flag);
                }
            },

            initVariable: function () {
                var me = this;
                me.host = me.opts.host || "";
                me.loadingImgSrc = me.opts.loadingImgSrc || "";
                me.events = {};
            },

            embedTpl: function () {
                var me = this,
                    $target = $("#" + me.opts.target),
                    listTpl = Mustache.render(me.opts.listTpl, trans);

                // 待master头部除去购物车模板，则不需要remove方法
                $target.find(".nav-detail-box").remove();

                $target.append(listTpl.replace(/{-{/g, "{{").replace(/}-}/g, "}}"));
            },

            initDomEl: function () {
                var me = this;

                me.$totalNum = $("#" + me.opts.totalNum);
                me.$shoppingScope = $("#" + me.opts.shoppingScope);
                me.$target = $("#" + me.opts.target);
                me.$tisCart = $("#" + me.opts.shoppingCart);
                me.$cartLink = me.$target.find(">a.nav-item-link");
                me.maxQty = 99999;
                me.globalPartNo = me.firstNo = '';
                me.clearTime = null;
                me.dockFlag = true;
                me.curViewTop = 0;
                me.loadedCallback = {
                    tipFun: null
                };
            },

            initListTpl: function () {
                var me = this;

                me.listTpl = me.$tisCart.find("[data-action=list-tpl]").html();
            },

            initEvent: function () {
                var me = this;

                me.$tisCart.on("click", "[data-action='destory']", function () {
                    me.destroySingle(this);
                });

                me.$target.on("mouseenter mouseleave", function (e) {
                    var evt = e.type;
                    if (evt == "mouseenter") {
                        if (me.$shoppingScope.is(":hidden")) {
                            me.$shoppingScope.show();
                        }
                        me.dockFlag = false;
                    }
                    else {
                        me.$shoppingScope.hide();
                        me.globalPartNo = me.firstNo = '';
                        me.dockFlag = true;
                    }
                });

                me.$cartLink.on("mouseenter", function (e) {
                    if (me.$shoppingScope.is(":hidden")) {
                        me.loadData();
                    }
                });

                me.$tisCart.on("click", "a[data-action='toDetail']", function () {
                    track.publish("header", "去购物车结算", "click", "link", $(this).attr("href"));
                    window.open(me.host + "/ShoppingCart", "_blank");
                });

                me.$tisCart.on("click", "[data-action='decrease-qty'],[data-action='increase-qty']", function (e) {
                    var $li = $(this).closest("li[data-id]"),
                        action = $(this).attr("data-action"),
                        $textBox = $(this).siblings("[type='text']"),
                        upq = $li.attr("data-unitpkg-qty"),
                        partNum = $li.attr("data-id");
                    if (action === "increase-qty") me.increaseQty(upq, $textBox, partNum);
                    else if (action === "decrease-qty") me.decreaseQty(upq, $textBox, partNum);
                    me.curViewTop = $li.closest("ul").scrollTop();
                   
                });


                me.$tisCart.on("blur", "input[type='text'][data-action='blur']", function () {
                    me.rounding($(this));
                });

                me.$tisCart.on("focus", "input[type='text'][data-action='blur']", function () {
                    me.qtyChangeNum = $(this).val() || 1;
                });

            },

            viewCartDetail: function (target) {
                var me = this,
                    params = $(target).attr("data-params"),
                    url = globalConfig.context.host + "?" + params;

                window.open(url, "_self");
            },

            loadData: function () {
                var me = this;

                ajax.invoke({
                    url: me.opts.urls.read,
                    contentType: "application/json",
                    success: function (root) {
                        me.finishLoad(root);
                    },
                    failed: function (root) {
                        me.getTipsEl(root.reason)
                    }
                });
            },

            finishLoad: function (root) {
                var me = this;

                if (root.IsSuccess) {
                    root.Data.IsShowCart = function () {
                        return root.Data.Total > 0 ? true : false;
                    };
                    me.render(root.Data);
                }
            },

            render: function (data) {
                var me = this,
                    html = Mustache.render(me.listTpl, data);

                me.$tisCart.html(html);
                me.$totalNum.html(data.Total);
                me.showFirst();
                if (me.curViewTop) {
                    me.$tisCart.find("ul[data-field='part-scope']").scrollTop(me.curViewTop);
                    me.curViewTop = 0;
                }

                if (typeof me.loadedCallback.tipFun === "function") {
                    me.loadedCallback.tipFun.call(null, me);
                    me.clearCallbackMsg();
                }
            },

            showFirst: function () {
                var me = this,
                    $ul, $curLi;

                if (me.globalPartNo) {
                    $curLi = me.$tisCart.find("li[data-id='" + me.globalPartNo + "']");
                    $ul = $curLi.closest("ul");
                    $curLi.prependTo($ul)
                       .css({ "backgroundColor": me.opts.firstBg })
                       .delay(me.opts.bgDelayTime)
                       .animate({ "backgroundColor": me.opts.lastBg });
                }
                else if (me.firstNo) {
                    $curLi = me.$tisCart.find("li[data-id='" + me.firstNo + "']");
                    $ul = $curLi.closest("ul");
                    $curLi.prependTo($ul);
                };
            },

            setShowFirstForPart: function (partNo) {
                var me = this;
                me.globalPartNo = partNo;
            },

            cartDelayHide: function () {
                var me = this;
                me.$shoppingScope.show();
                me.loadData();
                clearTimeout(me.clearTime);
                me.clearTime = setTimeout(function () {
                    me.dockFlag && me.$target.trigger("mouseleave");
                }, me.opts.layerDelayTime);
            },

            destroySingle: function (target) {
                if (!confirm(trans["110"])) {
                    return;
                }
                var me = this,
                    $tr = $(target).parents("li"),
                    id = $tr.attr("data-id"),
                    params = [id];

                me.doDestroy(params);
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
            },

            doDestroy: function (params) {
                var me = this;

                ajax.invoke({
                    url: me.opts.urls.destroy,
                    data: JSON.stringify({ parts: params }),
                    contentType: "application/json",
                    success: function (root) {
                        me.finishDestroy();

                        me.afterDestroy(params, root);
                    },
                    failed: function (root) {
                        alert(trans["112"] + ":" + root.reason)
                    }
                });
            },

            finishDestroy: function () {
                var me = this;

                alert(trans["111"]);
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

            addToShoppingCart: function (partNumber) {
                var me = this,
                    params = { "PartNumber": partNumber };

                ajax.invoke({
                    url: me.opts.urls.save,
                    data: params,
                    success: function (root) {
                        me.globalPartNo = partNumber;
                        me.firstNo = partNumber;
                        me.addShoppingCartSuccess(root);
                        me.afterAddToShoppingCart(params, root);
                    },
                    failed: function (error) {
                        alert(error.reason);
                    }
                });
            },

            addShoppingCartSuccess: function (root) {
                var me = this;
                if (root.IsSuccess) {
                    me.cartDelayHide();
                }

            },

            loadingShow: function () {
                var me = this;

                me.$tisCart.block({
                    message: me.loadingImgSrc,
                    css: {
                        border: "none",
                        background: "none"
                    }
                });
            },

            loadingHide: function () {
                var me = this;

                me.$tisCart.unblock();
            },

            increaseQty: function (unitPkgQty, $textBox, partNumber) {
                var me = this, params,
                    val = Number($textBox.val()),
                    unitPkgQty = Number(unitPkgQty),
                    lastQty = val + unitPkgQty;
                me.clearCallbackMsg();
                if (lastQty > me.maxQty) return me.getTipsEl(trans[114]);
                $textBox.val(lastQty);

                params = {
                    "PartNumber": partNumber,
                    "Qty": lastQty
                }
                me.qtyChange(params);
                me.afterQtyChange(params,'add');
            },

            decreaseQty: function (unitPkgQty, $textBox, partNumber) {
                var me = this, params,
                    val = Number($textBox.val()),
                    unitPkgQty = Number(unitPkgQty),
                    lastQty = val - unitPkgQty;
                me.clearCallbackMsg();
                if (lastQty < 1 || val == unitPkgQty) return;
                if (val !== unitPkgQty) {
                    $textBox.val(lastQty);
                }

                params = {
                    "PartNumber": partNumber,
                    "Qty": $textBox.val()
                }
                me.qtyChange(params);
                me.afterQtyChange(params, 'del');
            },

            rounding: function ($sender) {
                var me = this,
                    $curLi = $sender.closest("li"),
                    UnitPkgQty = $curLi.attr("data-unitpkg-qty"),
                    PartNumber = $curLi.attr("data-id"),
                    maxqty = '',
                    qty = $sender.val() || 1;

                me.clearCallbackMsg();
                if (isNaN(qty) || !/^\d+$/.test(qty)) {
                    $sender.val(me.qtyChangeNum);
                    return;
                };

                if (parseInt(qty) < 1 || parseInt(qty) == UnitPkgQty) {
                    qty = UnitPkgQty;
                }

                if (parseInt(qty) > me.maxQty) {
                    maxqty = trans[114];
                    qty = me.maxQty;
                }
                if (parseInt(qty) % parseInt(UnitPkgQty) !== 0) {
                    qty = Math.ceil(parseInt(qty) / parseInt(UnitPkgQty)) * parseInt(UnitPkgQty);
                    if (qty > me.maxQty) {
                        qty = UnitPkgQty * Math.floor(me.maxQty / UnitPkgQty)
                    }

                    me.loadedCallback.tipFun = function () {
                        var msg = (maxqty && maxqty + ';') + trans['115'] + ":" + UnitPkgQty + ", " + trans['116'] + ":" + qty;
                        me.getTipsEl(msg);
                    };
                }

                $sender.val(qty);
                if (me.qtyChangeNum == qty) return;
                params = { "PartNumber": PartNumber, "Qty": $sender.val() };
                me.curViewTop = $curLi.closest("ul").scrollTop();
                me.qtyChange(params);
            },

            clearCallbackMsg: function () {
                var me = this;
                me.loadedCallback.tipFun = null;
                me.globalPartNo = '';
            },

            qtyChange: function (params) {
                var me = this;

                ajax.invoke({
                    url: me.opts.urls.update,
                    contentType: "application/json",
                    data: JSON.stringify(params),
                    beforeSend: function () {
                        me.loadingShow();
                    },
                    complete: function () { me.loadingHide(); },
                    success: function (root) {
                        switch (root.Data) {
                            case 1:
                                me.getTipsEl(trans['118']);
                                break;
                            case 2:
                                me.getTipsEl(trans['117']);
                                break;
                            default:
                                me.loadData();
                                me.afterQtyChange(params, root);
                                break;
                        }
                    },
                    failed: function (error) {
                        me.getTipsEl(error.reason);
                    }
                });
            },

            getTipsEl: function (msg) {
                var me = this,
                    $tip = me.$tisCart.find("[data-action='tips']");
                $tip.find("[data-field='content']").html(msg).prop("title", msg);
                $tip.stop(false, true).slideDown().delay(3000).slideUp();
            }
        };

        // return constructor
        return ShoppingCart;
    }

    /* Using require js AMD standard */
    if (typeof define === 'function' && define.amd && define.amd.jQuery) {

        var basePath = (function () {
            var splittedPath,
                config = require.s.contexts._.config,
                path = config.paths["shoppingCart"];

            if (typeof path !== "undefined") {
                splittedPath = path.split(/\/+/g);
                return splittedPath.slice(0, splittedPath.length - 2).join("/") + "/";
            } else {
                alert("require config paths 'shoppingCart' key not exist")
            }
        })();


        if (typeof basePath !== "undefined") {
            define(['text!' + basePath + 'tpl/cart-list.html',
                    "mustache",
                    "ajax",
                    "globalConfig",
                    "track",
                    "blockUI"],
                    setup);
        }


        // Load css file
        (function () {
            var link = document.createElement("link"),
                url = require.s.contexts._.config.baseUrl + basePath + 'css/shoppingCart.css';

            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        })();
    }
})();