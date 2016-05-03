
require(["globalConfig", "ajax", "grid", "track", "initMasterCmp", "uniqueLogin", "jquery", "domReady!"], function (globalConfig, ajax, Grid, track) {

    var deleteOrderUrl = globalConfig.actions.deleteOrder,
        trans = globalConfig.trans;

    var orderManager = {

        init: function () {
            var self = this;

            self.initConmponent();
        },

        initConmponent: function () {
            var self = this;

            self.grid = new Grid({
                grid: {
                    gridId: "order-manager-grid"
                },
                paging: {
                    id: "order-manager-paging"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("order-list", "查询", "click", "view", params);
                    },
                    onLoadDataAfter: function (root) {
                        if (root.Data.Details && !root.Data.IsShowPrice) {
                            $.each(root.Data.Details, function (index, val) {
                                delete root.Data.Details[index].Amount;
                            });
                        }
                    },
                    onRowClicked: function (e, cells, keys, action) {
                        if (action === "delete") {
                            self.deleteOrderSingle(keys);
                            track.publish("order-list", "删除", "click", "delete", keys);
                        } else if (action === "detail") {
                            track.publish("order-list", "订单详情", "click", "link", $(e.target).attr("href"));
                        }
                    }
                }
            });

            self.grid.filter();
        },

        deleteOrderSingle: function (params) {
            var self = this;

            if (!confirm(trans['153'])) return;
            ajax.invoke({
                url: deleteOrderUrl,
                contentType: "application/json",
                data: params,
                success: function (root) {
                    alert(trans['177']);
                    self.grid.filter();
                },
                failed: function (root) {
                    alert(root.reason);
                }
            });
        }

    }

    orderManager.init();

});