require(["globalConfig", "ajax", "grid", "orderGrid", "delear", "operationOrder", "updateAds", "mustache", "uniqueLogin", "blockUI", "initMasterCmp", "jquery", "domReady!"],
    function (globalConfig, ajax, Grid, OrderGrid, Delear, OperationOrder, UpdateAds, Mustache) {

        var userUrl = globalConfig.actions.userData,
            saveOrderUrl = globalConfig.actions.saveOrder,
            saveAsOrderUrl = globalConfig.actions.saveAsOrder;

        var Order = {

            init: function () {
                var self = this;

                self.bindDomEls();
                self.bindEvent();
                self.initComponent();
            },

            bindDomEls: function () {
                var self = this;

                self.$orderChoiceWrap = $("#order-choice");
            },

            bindEvent: function () {
                var self = this;
             
                self.$orderChoiceWrap.on("change", "[data-field='tms']", function () {
                    self.changeOrderType($(this).find("option:selected").attr("data-type"));
                });                
            },

            initComponent: function () {
                var self = this;

                self.orderGrid = new OrderGrid();
                self.updataAds = new UpdateAds();
                self.delear = new Delear({
                    callbacks: {
                        onClicked: function (field, node) {
                            self.updataAds.open(field, node)
                        }
                    }
                });
                self.operationOrder = new OperationOrder({
                    callbacks: {
                        onUploadSuccess: function () {
                            self.orderGrid.grid.filter();
                        },
                        onExported: function () {
                            self.orderGrid.exportedSetStatusBtn();
                        }
                    }
                });
            },

            changeOrderType: function (type) {
                var self = this,
                    $orderType = self.$orderChoiceWrap.find("[data-field='order-type']");

                $orderType.find("option").removeAttr("selected");
                $orderType.find("[value='" + type + "']").attr("selected", "selected");
            }
            
        }

        Order.init();

    })