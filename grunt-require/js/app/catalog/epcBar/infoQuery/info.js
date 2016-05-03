
define(["globalConfig", "ajax", "grid","track"], function (globalConfig, ajax, Grid,track) {

    var InfoSearch = function () {

        this.init();

    };

    InfoSearch.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindEvent();
            self.initBodyStype();
            self.initOption();
            self.initModel();
        },

        bindDomEls: function () {
            var self = this;

            self.$switchBtn = $("#switch-btn");
            self.$switchWrap = $("#switch-wrap");
            self.$optionSearchFilter = $("#option-search-filter"); 
            self.$modelSearchFilter = $("#model-search-filter");
        },      

        bindEvent: function () {
            var self = this;

            self.$switchBtn.on("click", "a", function () {
                var action = $(this).attr("data-field");
                self.changeSelectionClass($(this), action);
                self.changeContent(action);
            });

            self.$optionSearchFilter.on("keyup", "input[data-scope='filter'][data-field]", function () {
                self.optionGrid.filter();
            });

            self.$modelSearchFilter.on("keyup", "input[data-scope='filter'][data-field]", function () {
                self.modelGrid.filter();
            });
        },

        initBodyStype: function () {
            var self = this;

            self.bodyStyleGrid = new Grid({
                grid: {
                    gridId: "bodyStyle-search-grid"
                },
                paging: {
                    id: "bodyStyle-search-paging"
                },
                filter: {
                    id: "bodyStyle-search-filter",
                    resetId: "bodyStyle-search-btn-clear",
                    filterId: "bodyStyle-search-btn-filter"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("bodystyle-info", "查询", "click", "view", params);
                    }
                }
            });
        },

        initOption: function () {
            var self = this;

            self.optionGrid = new Grid({
                grid: {
                    gridId: "option-search-grid",
                    blockTarget: "option-grid-block"
                },
                paging: {
                    id: "option-search-paging"
                },
                filter: {
                    id: "option-search-filter",
                    resetId: "option-search-btn-clear"
                    //filterId: "option-search-btn-filter"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("option-info", "查询", "click", "view", params);
                    }
                }
            });
        },

        initModel: function () {
            var self = this;

            self.modelGrid = new Grid({
                grid: {
                    gridId: "model-search-grid",
                    blockTarget: "model-grid-block"
                },
                paging: {
                    id: "model-search-paging"
                },
                filter: {
                    id: "model-search-filter",
                    resetId: "model-search-btn-clear"
                    //filterId: "model-search-btn-filter"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("model-info", "查询", "click", "view", params);
                    }
                }
            });
        },

        changeSelectionClass: function ($sender, action) {
            var self = this;

            self.$switchBtn.find("a").removeClass();
            $sender.addClass("switch-active");
        },

        changeContent: function (action) {
            var self = this, targetName='';

            self.$switchWrap.find("div[data-field]").hide();
            self.$switchWrap.find("[data-field='" + action + "']").show();
            
            switch (action) {
                case "BodyStyle":
                    targetName = "车身类型信息";
                    break;
                case "Option":
                    targetName = "选装信息";
                    break;
                case "Model":
                    targetName = "车型";
                    break;
                default:

            }
            track.publish("info", targetName, "click", "view");
        }

    }

    return InfoSearch;
})