define(["bookmark", "history", "shoppingCart", "notice", "globalConfig", "track", "cookie", "uniqueLogin", "amplify"],
    function (Bookmark, History, ShoppingCart, Notice, globalConfig, track) {
        var host = globalConfig.context.host;
        var defaultOpt = {
            header: "page_header"
        };

        var master = {

            init: function () {
                var me = this;
                me.buildDom();
                me.initComponent();
                me.subscribeEvent();
                me.bindEvent();
            },

            buildDom: function () {
                var me = this;

                me.$header = $("#" + defaultOpt.header);
            },

            subscribeEvent: function () {
                var me = this;

                amplify.subscribe("buy", function (partNumber) {
                    me.shoppingCart.addToShoppingCart(partNumber);
                })
                amplify.subscribe("cartDelayHide", function (partNumber) {
                    me.shoppingCart.setShowFirstForPart(partNumber);
                    me.shoppingCart.cartDelayHide();
                })
            },

            initComponent: function () {
                var me = this;

                me.bookmark = new Bookmark({
                    target: "btn-bookmark-manager",
                    host: host,
                    loadingImgSrc: "<img src='" + host + "/style/images/loading.gif' />"
                });

                me.history = new History({
                    target: "btn-history-manager",
                    host: host,
                    loadingImgSrc: "<img src='" + host + "/style/images/loading.gif' />"
                });

                me.shoppingCart = new ShoppingCart({
                    host: host,
                    shoppingScope: "shopping-cart-scope",
                    loadingImgSrc: "<img src='" + host + "/style/images/loading.gif' />",
                    totalNum: "shoppingcart-total-qty-tips .nav-item-tips-text"
                });

                me.notice = new Notice();
            },

            bindEvent: function () {
                var me = this;
                me.$header.on("click", "[data-lang]", function () {
                    var lang = $(this).attr("data-lang"),
                        key = "lng",
                        val = lang,
                        target = "";
                    lang && (val = lang.toLowerCase());
                    if (val === "zh_cn") { target = "语言-中文"; }
                    else if (val === "en_us") { target = "语言-English"; }
                    $.cookies.set(key, lang.replace(/_/, '-'));


                    track.publish("header", target, "click", "link", val);

                    window.location.reload(true);
                });

                //me.$header.on("click", "#nav-home a", function () {
                //    track.publish("header", "产品大全", "click", "link", $(this).attr("href"));
                //});
                //me.$header.on("click", "[data-action='logout']", function () {
                //    track.publish("header", "用户名-退出系统", "click", "link", $(this).attr("href"));
                //});
                //me.$header.on("click", "#nav-admin a", function () {
                //    track.publish("header", "管理中心", "click", "link", $(this).attr("href"));
                //});
                me.$header.on("click", "#btn-bookmark-manager", function (e) {
                    track.publish("header", "书签-书签管理", "click", "open", "书签-书签管理");
                    e.stopPropagation();
                });
                me.$header.on("click", "#btn-history-manager", function (e) {
                    track.publish("header", "书签-历史管理", "click", "open", "书签-历史管理");
                    e.stopPropagation();
                });
                me.$header.on("click", "#nav-order a", function () {
                    track.publish("header", "订单", "click", "link", $(this).attr("href"));
                });
                me.$header.on("click", "#notice-wrap", function (e) {
                    var $tag = $(e.target),
                        name = e.target.tagName,
                        targetName;
                    if (name == 'A') {
                        var idx = $tag.closest('li').index();
                        if (idx == 0) {
                            targetName = "消息-通知";
                        } else {
                            targetName = "消息-通讯";
                        }
                        track.publish("header", targetName, "click", "link", $tag.attr("href"));
                    }
                });
            }
        };

        master.init();

        return master;
    });