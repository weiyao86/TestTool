
define(["globalConfig", "ajax", "mustache"], function (globalConfig, ajax, Mustache) {

    var trans = globalConfig.trans;
    var Note = function () {

        this.noteUrl = globalConfig.actions.note;
        this.init();
    }

    Note.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindEvent();
            self.bindTemplate();
        },

        bindDomEls: function () {
            var self = this;

            self.$note = $("#note");
            //self.$noteDesc = $("#note-desc");
            //self.$noteTitle = $("#note-title");
            self.$gridBody = $("#note-grid").find("tbody");
            self.$noteArrow = $("#note-arrow");
        },

        bindTemplate: function () {
            var self = this;

            self.gridTemplate = self.$gridBody.find("script").html();
        },

        bindEvent: function () {
            var self = this;

            self.$note.on(
                {
                    mouseenter: function () {
                        clearTimeout(self.hideItem);
                    },
                    mouseleave: function () {
                        self.delayHide();
                    }
                });
        },

        delayShow: function (e, $sender, usageHeight) {
            var self = this;

            clearTimeout(self.hideItem);
            self.showItem = setTimeout(function () {
                self.computeNote(e, $sender, usageHeight);
            }, 500);
        },

        computeNote: function (e, $sender, usageHeight) {
            var self = this,
                $body = $(document.body || document.documentElement),
                maxW = $(window).width(),
                maxH = $(window).height(),
                offset = $sender.offset(),
                left = offset.left - $sender.width() / 2 + $(window).scrollLeft(),
                top = offset.top + $sender.height(),
                noteW = self.$note.width(),
                noteH = self.$note.height(),
                distanceW = left + noteW,
                distanceH = top + noteH,
                arrowLeft = (noteW - self.$noteArrow.width()) / 2,
                clsup = "note-arrow-up",
                clsdown = "note-arrow-down";

            if (maxW < distanceW) {
                left = maxW - noteW + $(window).scrollLeft() - 20;

                if (left + noteW - (offset.left + $sender.width()) < $sender.width() / 3) {
                    arrowLeft = noteW / 100 * 80 + self.$noteArrow.width();
                }
            }

            if (maxH < distanceH) {
                top = offset.top - noteH;
                self.$noteArrow.removeClass(clsup).addClass(clsdown);
            } else {
                self.$noteArrow.removeClass(clsdown).addClass(clsup);
            }

            self.setNoteContent($sender);
            self.showNote(left, top, arrowLeft);
        },

        showNote: function (left, top, arrowLeft) {
            var self = this,
                left = left + "px",
                top = top + "px";
            
            self.$note.stop(true, true).show();
            if (left) {
                self.$note.animate({ "left": left, "top": top }, "fast");
                self.$noteArrow.css("left", arrowLeft + "px");
            } else {
                self.$note.show();
            }
        },

        setNoteContent: function ($sender) {
            var self = this,
                modelNote = $sender.attr("data-ModelNote"),
                title = $sender.attr("data-title") || trans["81"],
                id = $sender.attr("data-Id"),
                params = { "UsageId": id };

            //self.$noteDesc.text(modelNote);
            //self.$noteTitle.text(title);
            self.loadNote(params);
        },

        loadNote: function (params) {
            var self = this;

            ajax.invoke({
                url: self.noteUrl,
                data: JSON.stringify(params),
                contentType: "application/json",
                success: function (root) {
                    self.render(root.Data);
                },
                failed: function (root) {
                    alert(root.reason);
                }
            });
        },

        render: function (data) {
            var self = this,
                output = Mustache.render(self.gridTemplate, { records: data });

            self.$gridBody.html(output);
        },

        delayHide: function () {
            var self = this;

            clearTimeout(self.showItem);
            self.hideItem = setTimeout(function () {
                self.hideNote();
            }, 500);
        },

        hideNote: function () {
            var self = this;

            self.$note.hide();
        }
    }

    return Note;

})