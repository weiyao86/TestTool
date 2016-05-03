
; (function ($) {

    var $HEAD = $('head'),
        LINE_WIDTH = 10,
        $DOM = $(document),
        STYLE_ID = "cursor_e_resize",
        EVENT_NAME_SPACE = "layresizable";

    var LayResizable = function (target, opts) {
        this.opts = opts;

        this.init(target);
    };

    LayResizable.prototype = {

        init: function (target) {
            var self = this;
            
            self.implantStyle();
            self.buildDomEl(target);
            self.createResizable();
            self.bindEvent();
            self.offsetLeft = self.$target.offset().left;
            if (self.opts.onInitFinish) {
                self.opts.onInitFinish.apply(self, []);
            }
        },

        implantStyle: function () {
            var self = this,
                styleClass = '.layresizable {position: relative; z-index:50;} ' +
                             '.layresizable-el { cursor: e-resize; float: left; width: 8px; position: absolute; z-index: 5; width: ' + LINE_WIDTH + 'px; border:0px solid red; }' +
                             '.layresizable-el div { position: relative; left: 0px; width: 1px; }' +
                             '.layresizable-shade {background-color: #000000; height: 100%; opacity: 0; position: absolute; width: 100%; z-index: 4;filter:alpha(opacity=0);}';
            $HEAD.append('<style type="text/css"> ' + styleClass + ' </style>');
        },

        buildDomEl: function (target) {
            var self = this;

            self.$target = $(target);
            self.$container = self.$target.parent();
            self.$targetEls = self.$target.children("div");
        },

        createResizable: function () {
            var self = this,
                html = [],
                left = 0,
                lefts = self.opts.lefts,
                innerHTML,
                id = self.$target.attr("id"),
                height, count = self.$targetEls.length;

            self.$targetEls.each(function (index) {
                left = parseInt($(this).width()) + parseInt($(this).css("left"));
                height = parseInt($(this).outerHeight(true)) - 2;
                html.push(self.getHtml(left, height, index, count));
            });

            innerHTML = ' \n\r <!-- layresizable --> \n\r  <div class="layresizable" data-target="' + id + '" >' + html.join(' ') + '</div>';

            if (self.opts.isAppendFirst) {
                self.$target.parent().prepend(innerHTML);
            } else {
                self.$target.before(innerHTML);
            }

            self.$resizableEls = self.$container.find(".layresizable").children("div");
        },

        getHtml: function (left, height, index, count) {
            var self = this,
                width = "",
                cursor = "",
                left = left - (LINE_WIDTH / 3);

            if (count - 1 === index) {
                left = left - 20;
                cursor = "cursor:default;";
                width = "width :1px;";
            }
            return '<div data-resize="true" class="layresizable-el" style="' + width + ' left:' + left + 'px; height:' + height + 'px;' + cursor + '">' +
                         '<div style="height:' + height + 'px;"></div>' +
                   '</div>';
        },

        bindEvent: function () {
            var self = this,
                $el = self.$resizableEls;

            $el.filter("div:not(:last)").on("mousedown", function (e) {
                if (e.which === 1) {
                    self.start(this, e);
                    e.preventDefault();
                }
            });
            $(window).on("resize." + EVENT_NAME_SPACE, function () {
                self.resizeToAdjust();
            });
        },

        resizeToAdjust: function () {
            var self = this, width = 0, left = 0, height,
                count = self.$targetEls.length;

            self.$targetEls.each(function (index) {
                left = parseInt($(this).css("left"))+ parseInt($(this).width());
                height = parseInt($(this).height()) - 2;
                left = (left - (LINE_WIDTH / 3));
                self.$resizableEls.eq(index).css({
                    "left": left + "px",
                    "height": height + "px"
                });

                self.$resizableEls.children("div").height(height);
            });
            self.offsetLeft = self.$target.offset().left;
        },

        start: function (drag, e) {
            var self = this,
                width = 15,
                $drag = $(drag),
                idx = $drag.index(),
                $el = self.$resizableEls,
                $childrenEl = $(drag).children("div"),
                startPosition = $(drag).offset().left,
                max = self.opts.max || parseInt($el.eq(idx + 1).css("left")) - width,
                min = self.opts.min || (idx === 0 ? width : parseInt($el.eq(idx - 1).css("left")) + width);

            $childrenEl.css("border-left", "2px dotted #000");
            $HEAD.append('<style id="' + STYLE_ID + '" type="text/css">*{cursor:e-resize!important}</style>');
            self.createShade();
            $DOM.on("mousemove." + EVENT_NAME_SPACE, function (e) {
                self.move($drag, e, min, max);
                e.preventDefault();
            }).on("mouseup." + EVENT_NAME_SPACE, function (e) {
                self.stop($drag, idx, e, startPosition);
                e.preventDefault();
            });
        },

        move: function ($drag, e, min, max) {
            var self = this,
                l = e.pageX - self.offsetLeft;

            if (l > min && l < max) {
                $drag.css("left", l + "px");
            }
        },

        stop: function ($drag, idx, e, startPosition) {
            var self = this,
                $colLeft = self.$targetEls.eq(idx),
                $colRight = self.$targetEls.eq(idx + 1),
                leftWidth = $colLeft.width(),
                rightWidth = $colRight.width(),
                stopPosition = $drag.offset().left,
                distance = (startPosition - stopPosition),
                leftWidth = leftWidth - distance,
                rightWidth = rightWidth + distance;

            self.resetStyle($drag);
            self.adjustSize($colLeft, $colRight, leftWidth, rightWidth);
            self.unbindEvent();
            self.destroyShade();

            if (self.opts.onDragStop !== null) {
                self.opts.onDragStop.apply(self, [{
                    colLeft: $colLeft,
                    colRight: $colRight,
                    leftWidth: leftWidth,
                    rightWidth: rightWidth,
                    distance: distance,
                    stopPosition: stopPosition,
                    index :idx
                }]);
            }
        },

        adjustSize: function ($colLeft, $colRight, leftWidth, rightWidth) {
            var self = this;

            $colLeft.css("width", leftWidth + "px");
            $colLeft.children("div").css("width", leftWidth + "px");
            if (self.opts.isChangeRight) {
                $colRight.css({ "width": rightWidth + "px", "left": leftWidth + "px" });
            }
        },

        disabled:function(){
            var self = this;

            self.$resizableEls.hide();
        },

        enabled:function(){
            var self = this;

            self.$resizableEls.show();
        },

        unbindEvent: function () {
            var self = this;

            $DOM.off("mousemove." + EVENT_NAME_SPACE + " mouseup." + EVENT_NAME_SPACE);
        },

        createShade: function () {
            var self = this;

            $(document.body).prepend('<div class="layresizable-shade"></div>');
        },

        destroyShade: function () {
            var self = this;

            $(".layresizable-shade").remove();
        },

        resetStyle: function ($drag) {
            var self = this;

            $('#' + STYLE_ID).remove();
            $drag.find("div").css("border", "");
        }
    };

    $.fn.extend({
        layResizable: function (options) {
            var defaults = {
                isAppendFirst: false,
                isChangeRight: true,
                minWidth: 15,
                onDragStart: null,
                onDragStop: null
            };

            options = $.extend(defaults, options || {});
            return this.each(function () {
                new LayResizable(this, options);
            });
        }
    });

})(jQuery);