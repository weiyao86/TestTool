define(["globalConfig", "jquery", 'json2'], function (settings) {
    var CATEGORYS = {
        "homePage": "首页",
        "header": "页头",
        "group": "分组页面",
        "thumbnails": "缩略图页面",
        "legendData": "左图右数据页面",
        "partdetail": "详情页面",
        "vsn": "vsn查询",
        "vin": "vin查询",
        "part": "零件编号查询窗口",
        "legend": "图例编号查询窗口",
        "advance": "高级查询窗口",
        "info": "信息检索窗口",
        "option-info": "选装信息窗口",
        "bodystyle-info": "车身类型信息窗口",
        "model-info": "车型窗口",
        "usernote": "用户备注查询页面",
        "supersession": "替换查询窗口",
        "buy-layout": "购买窗口",
        "shopping-cart": "购物车窗口",
        "order-list": "订单列表页面",
        "build-order-page": "生成订单页面",
        "book-mark": "书签管理窗口",
        "add-book-mark":"添加书签窗口",
        "history":"历史管理窗口",
        "message": "通知页面",
        "bulletin": "通讯页面"
    },
        ACTIONS = {
            "search": "搜索",
            "expand": "展开",
            "collapse": "收缩",
            "add": "添加",
            "view": "查看",
            "paging": "翻页",
            "delete": "删除",
            "create": "生成",
            "open": "弹出",
            "export": "导出",
            "import":"导入",
            "print": "打印",
            "prev": "向上",
            "next": "向下",
            "zoomin": "放大",
            "zoomout": "缩小",
            "rotate": "旋转",
            "reset": "还原",
            "link": "跳转",
            "submit": "提交",
            "copy":"复制",
            "save":"保存"
        },
        EVENTS = {
            "drag": "拖拽",
            "click": "点击",
            "enter": "回车",
            "mouseenter": "鼠标移入"
        },
        local = window.location,
        url = settings.context.trackUrl,
        trackEnable = settings.context.trackEnabled,
        appcode = settings.context.appcode,
        usercode = settings.context.usercode,
        lang = settings.context.lang,
        localUrl = local.pathname + "/" + (typeof local.search === "undefined" ? "" : local.search);

    var track = {

        init: function () {
            var self = this;

            self.initEvents();
        },

        initEvents: function () {
            var self = this;

            $("a[data-track]").on('click', function () {
                var track = $(this).attr('data-track'),
                    href = $(this).attr('href'),
                    track = JSON.parse(track);

                self.publish(track.category, track.target, 'click', 'link', href);
            });
        },

        //        /**
        //         * description: The user operation is sent to the server side
        //         * @category {string} Page category operation area
        //         * @action {string} user operation action
        //         * @event {string} user operation event type (click 、dblclick...)
        //         * @label {string} The current operation object labels
        //         * @value {string} User behavior description
        //         */

        publish: function (category, target, event, action, value) {
            var self = this;
            if ($.type(value) == "object") value = JSON.stringify(value);
            var params = {
                ul: localUrl,
                cag: CATEGORYS[category],
                tg: target,
                evt: EVENTS[event],
                act: ACTIONS[action],
                val: value,
                lg: lang,
                ac: appcode,
                uc: usercode
            };
            if (Boolean(trackEnable)) {
                $.ajax({
                    url: url,
                    dataType: 'jsonp',
                    jsonp: '_cb',
                    jsonpCallback: '_scb',
                    data: params
                });

            }
        }
    };

    track.init();

    return {

        /**
         * description: The user operation is sent to the server side
         * @category {string} Page category operation area
         * @target {string} user operation target
         * @event {string} user operation event type (click 、dblclick...)
         * @action {string} user operation action
         * @value {string} User behavior description
         */
        publish: function (category, target, event, action, value) {
            track.publish(category, target, event, action, value);
        }
    };
});