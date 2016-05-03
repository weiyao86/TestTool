require(["globalConfig", "ajax", "remark", "track", "uniqueLogin", "jquery", "loupe", "jqExtend", "initMasterCmp", "domReady!"], function (globalConfig, ajax, Remark, track) {

    var Main = {

        init: function () {
            var self = this;

            self.initComponent();
            self.bindDomEls();
            self.reBuildEl();
            self.bindEvent();
            self.decideBtnStatus();
            self.initContainerW();
            self.verifyCurrent();
            self.initLoupe();
        },

        initComponent: function () {
            var self = this;

            self.remark = new Remark();
            self.remark.load();
        },

        bindDomEls: function () {
            var self = this;

            self.$imgWrap = $("#img-container");
            self.$img = $("#img");
            self.$btnLeft = $("#toggle-img-left");
            self.$btnRight = $("#toggle-img-right");
            self.$buy = $("#buy");
            self.$switch = $("#detail-grid-switch");
            self.$allGrid = $("#detail-grid");
        },

        bindEvent: function () {
            var self = this;

            self.$imgWrap.on("click", "img", function () {
                var src = $(this).attr("data-picture-src");
                self.$img.attr("src", src);
                track.publish("partdetail", "配件照片", "click", "view", "PartNumber:" + self.$buy.attr("data-partNumber") + ";imageSrc:" + src);
            });

            self.$btnLeft.click(function () {
                self.leftMove()
            });

            self.$btnRight.click(function () {
                self.rightMove();
            });

            self.$buy.click(function () {
                var partNo = $(this).attr("data-partNumber");
                self.addtoShoppingCart(partNo);
                track.publish("partdetail", "购买", "click", "add", "PartNumber:" + partNo);
            });

            self.$switch.on("click", "li[data-area]", function (e) {
                var area = $(this).attr("data-area");
                self.toggleGrid(area);
                if (area === "SuperSession") {
                    track.publish("partdetail", "替换关系", "click", "view");
                }
                else
                    track.publish("partdetail", "用户备注", "click", "view");

            });
        },

        reBuildEl: function () {
            var self = this;

            self.ol = self.$imgWrap.find("ol");
            self.position = self.ol.position();
            self.img = self.$imgWrap.find("img");
            self.imgWrapW = self.$imgWrap.width();
            self.allImgWidth = self.img.length * (self.img.eq(0).width() + 2 + 10);
            self.oneImgW = self.img.eq(0).width() + 2 + 10;
        },

        initContainerW: function () {
            var self = this;

            self.$imgWrap.find("ol").css("width", self.allImgWidth + "px");
        },

        initLoupe: function () {
            var self = this;

            self.$imgWrap.find("img").each(function (idx, val) {
                var img = new Image();
                img.src = $(val).attr("src").replace(/\!\w*$/, '');
            });

            $("#loupe_scope").Loupe({
                large: "#large",
                fixed: "#showImg",
                isBackground: true,
                isShowInnerImg: false,
                filter: ['default.png']
            });

        },

        leftMove: function () {
            var self = this,
                left = self.position.left + self.img.eq(0).width() + 10 + 2 + "px";

            if (-self.position.left > 0) {
                self.ol.animate({ "left": left }, "fast", function () {
                    self.reBuildEl();
                    self.decideBtnStatus();
                });
            }
        },

        rightMove: function () {
            var self = this,
                left = self.position.left - self.img.eq(0).width() - 10 - 2 + "px";

            if (self.allImgWidth + self.position.left > self.imgWrapW) {
                self.ol.animate({ "left": left }, "fast", function () {
                    self.reBuildEl();
                    self.decideBtnStatus();
                });
            }
        },

        decideBtnStatus: function () {
            var self = this;

            if (-self.position.left > 0) {
                self.$btnLeft.addClass("toggle-btn-left-active");
            } else {
                self.$btnLeft.removeClass("toggle-btn-left-active");
            }

            if (self.allImgWidth - (-self.position.left) - self.imgWrapW >= self.oneImgW) {
                self.$btnRight.addClass("toggle-btn-right-active");
            } else {
                self.$btnRight.removeClass("toggle-btn-right-active");
            }
        },

        addtoShoppingCart: function (partNumber) {
            amplify.publish("buy", partNumber);
        },

        toggleGrid: function (area) {
            var self = this,
                clsName = 'detail-switch-active',
                $gridWrap = self.$allGrid,
                $grid = $gridWrap.find("div[data-area='" + area + "']"),
                type = self.getType();

            self.$switch.find("[class$='" + clsName + "']").removeClass(clsName);
            self.$switch.find("[data-area='" + area + "']").addClass(clsName);

            $gridWrap.find("div[data-area]").hide();
            $grid.show();
        },

        getType: function () {

            return $.getParameterByName("type");
        },

        verifyCurrent: function () {
            var self = this,
                type = self.getType();

            if (type.length > 0) self.toggleGrid(type);
        }

    }

    Main.init();

})