
define(["globalConfig", "ajax", "grid", "track", "json2"], function (globalConfig, ajax, Grid, track) {

    var addOrderListUrl = globalConfig.actions.addOrderList,
        tempOrderDeleteUrl = globalConfig.actions.tempOrderDeleteUrl,
        qtySaveUrlForOrder = globalConfig.actions.qtySaveUrlForOrder,
        trans = globalConfig.trans,
        OrderGrid = function () {

            this.init();
        }

    OrderGrid.prototype = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindEvent();
            self.initComponent();
        },

        bindDomEls: function () {
            var self = this;
            self.$grid = $("#order-grid");
            self.$priceOrder = $("#price_order");
            self.$amount = $("#amount");
            self.$modelCode = $("#model-code");
            self.$filterScope = $("#filter");
            self.$partNo = self.$filterScope.find("[data-field='PartNumber']");
            self.$btnAddOrder = $("#btn-add-order");
            self.$checkAll = self.$grid.find("[data-action='check-all']");
            self.$deleteCheck = $("#delete-check");
            self.btnStatus = self.$grid.attr("data-status") || 0;
            self.rangeTextByPart = '';
        },

        initComponent: function () {
            var self = this;

            self.grid = new Grid({
                grid: {
                    gridId: "order-grid",
                    sort: [{ "Field": "UpdateDate", "Order": 1 }, { "Field": "PartNumber", "Order": 0 }]
                },
                filter: {
                    extraCondition: { "field": "orderCode", "value": self.$modelCode.text(), "operator": "0" }
                },
                paging: {
                    id: "order-paging"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("order-list", "查询", "click", "view", params);
                    },
                    onLoadDataAfter: function (root) {
                        self.$checkAll.prop("checked", false);
                        var isShowPrice = root.Data.IsShowPrice;
                        if (isShowPrice) {
                            self.settingsAmount(root.Data.Amount);
                            self.$priceOrder.show();
                        }
                        else self.$priceOrder.hide();


                        $.each(root.Data.Details, function (idx, val) {
                            root.Data.Details[idx]["IsShowPrice"] = isShowPrice;
                        });
                    },

                    onRenderAfter: function (root) {
                        self.setStatusBtn();

                        var $tdByPart = self.grid.$grid.find("td[data-range-part='" + self.rangeTextByPart + "']");

                        self.setSelectionRange($tdByPart.find("input[data-action]").get(0));
                        self.rangeTextByPart = '';
                    },

                    onRowClicked: function (e, cells, keys, action) {
                        self.decideAction(e, cells, keys, action);
                    }
                }
            });
            self.grid.filter();
        },

        settingsAmount: function (amount) {
            var self = this;
            self.$amount.text(amount);
        },

        bindEvent: function () {
            var self = this;

            self.$checkAll.on("change", function () {
                self.decideIsCheck($(this));
            });

            self.$grid.on("change", "input[data-field='ck_single']", function () {
                var flag = self.$grid.find("input[data-field='ck_single']:not(:checked)").size();

                self.$checkAll.prop("checked", !flag);
            });

            self.$grid.on("blur", "input[type='text'][ data-action='blur']", function () {
                self.rounding($(this));
            });

            self.$grid.on("focus", "input[type='text'][ data-action='blur']", function () {
                self.qtyChangeNum = $(this).val() || 1;
            });

            self.$deleteCheck.on("click", function () {
                self.deleteCheckData();
            });

            self.$btnAddOrder.on("click", function () {
                self.addOrderList();
            });
        },

        decideIsCheck: function ($sender) {
            var self = this,
                $checkbox = self.$grid.find("input[data-field='ck_single']:checkbox");

            $checkbox.prop("checked", $sender.prop("checked"));
        },

        deleteCheckData: function () {
            var self = this, arr = [],
                $checkbox = self.$grid.find("input[data-field='ck_single']:checkbox:checked"),
                params;

            $checkbox.each(function (index, val) {
                arr.push($(val).attr("data-PartNumber"));
            });

            if ($checkbox.size()) {
                params = {
                    orderCode: self.$modelCode.text(),
                    parts: arr
                };
                self.deleteData(params);
                track.publish("order-list", "删除选中项", "click", "view", params);
            } else {
                alert(trans['182']);
            }
        },

        deleteData: function (params) {
            var self = this;

            if (!confirm(trans['153'])) return;

            ajax.invoke({
                url: tempOrderDeleteUrl,
                contentType: "application/json",
                data: JSON.stringify(params),
                success: function (root) {
                    self.grid.search({
                        pageIdx: function (thatGrid) {
                            thatGrid.currentIndex = self.searchGridByCurIdx(params.parts.length);
                        }
                    });
                    alert(trans[177]);
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        decideAction: function (e, cells, keys, action) {
            var self = this, arr = [],
                $td = $(e.target).closest("td"),
                unitPkgQty = $td.attr("data-UnitPkgQty"),
                $textBox = $td.find("input[type='text']"),
                partNumber = $td.attr("data-PartNumber"),
                params;

            if (action === "delete") {
                arr.push(partNumber);
                params = {
                    orderCode: self.$modelCode.text(),
                    parts: arr
                };
                self.deleteData(params);
                track.publish("order-list", "单条删除", "click", "delete", params);
            } else if (action === "increase-qty") {
                self.increaseQty(unitPkgQty, $textBox, partNumber);
            } else if (action === "decrease-qty") {
                self.decreaseQty(unitPkgQty, $textBox, partNumber);
            }
        },

        increaseQty: function (unitPkgQty, $textBox, partNumber) {
            var self = this, params,
                val = Number($textBox.val()),
                unitPkgQty = Number(unitPkgQty),
                lastQty = val + unitPkgQty;

            if (lastQty > 99999) return alert(trans[11117]);
            $textBox.val(lastQty);

            params = {
                "PartNumber": partNumber,
                "Qty": lastQty,
                "OrderCode": self.$modelCode.text()
            }
            self.qtyChange(params);
            track.publish("order-list", "增加数量", "click", "view", params);
        },

        decreaseQty: function (unitPkgQty, $textBox, partNumber) {
            var self = this, params,
                val = Number($textBox.val()),
                unitPkgQty = Number(unitPkgQty),
                lastQty = val - unitPkgQty;

            if (lastQty < 1 || val == unitPkgQty) return;
            if (val !== unitPkgQty) {
                $textBox.val(lastQty);
            }

            params = {
                "PartNumber": partNumber,
                "Qty": $textBox.val(),
                "OrderCode": self.$modelCode.text()
            }
            self.qtyChange(params);
            track.publish("order-list", "减少数量", "click", "view", params);
        },

        rounding: function ($sender) {
            var self = this,
                maxNum = 99999,
                UnitPkgQty = $sender.closest("td").attr("data-UnitPkgQty"),
                PartNumber = $sender.closest("td").attr("data-PartNumber"),
                qty = $sender.val() || 1;
            if (isNaN(qty) || !/^\d+$/.test(qty)) {
                $sender.val(self.qtyChangeNum);
                return alert(trans[11127]);
            };
            if (parseInt(qty) < 1 || parseInt(qty) == UnitPkgQty) {
                qty = UnitPkgQty;
            }

            if (parseInt(qty) > maxNum) {
                alert(trans[11117]);
                qty = maxNum;
            }
            if (parseInt(qty) % parseInt(UnitPkgQty) !== 0) {
                qty = Math.ceil(parseInt(qty) / parseInt(UnitPkgQty)) * parseInt(UnitPkgQty);
                if (qty > maxNum) {
                    do {
                        qty -= UnitPkgQty;
                    } while (qty > maxNum)
                }
                alert(trans['154'] + ":" + UnitPkgQty + ", " + trans['155'] + ":" + qty);
            }

            $sender.val(qty);
            if (self.qtyChangeNum == qty) return;
            params = {
                "PartNumber": PartNumber,
                "Qty": $sender.val(),
                "OrderCode": self.$modelCode.text()
            };
            self.qtyChange(params);
        },

        qtyChange: function (params) {
            var self = this;

            ajax.invoke({
                url: qtySaveUrlForOrder,
                contentType: "application/json",
                data: JSON.stringify(params),
                success: function (root) {
                    self.grid.filter({
                        isCurIdx: true
                    });
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        addOrderList: function () {
            var self = this,
                partNo = $.trim(self.$partNo.val()),
                params = {
                    OrderCode: self.$modelCode.text(),
                    PartNumber: partNo
                };
            if (partNo) {
                ajax.invoke({
                    url: addOrderListUrl,
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    beforeSend: function () {
                        self.grid.loadingShow();
                    },
                    complete: function () { self.grid.loadingHide(); },
                    success: function (result) {
                        var data = result.Data || {};
                        if (data === 1) {
                            alert(trans[11119]);
                        }
                        else if (data === 2) {
                            self.$partNo.val('');
                            self.grid.filter();
                            alert(trans[11118]);
                        }
                        else if (data === 3) {
                            self.$partNo.val('');
                            self.grid.filter();
                            self.rangeTextByPart = partNo;
                            alert(trans[183]);
                        }
                    },
                    failed: function (error) {
                        alert(error.reason);
                    }
                });
            } else {
                alert(trans[156]);
            }
            track.publish("order-list", "加入清单", "click", "add", params);
        },

        setStatusBtn: function () {
            var self = this,
                $btns = self.$grid.find("a[data-action='decrease-qty'],b[data-action='increase-qty'],a[data-action='delete']").add(self.$deleteCheck);
            if (self.btnStatus != "2") {
                $btns.css("visibility", "visible");
                self.$btnAddOrder.show();
            }
            else {
                $btns.css("visibility", "hidden");
                self.$btnAddOrder.hide();
                self.$grid.find("input[data-action='blur']").prop("disabled", true);
            }
        },

        setSelectionRange: function (txtObj) {
            if (!txtObj) return;

            var self = this,
                l = txtObj.value.length,
                range;
            if (txtObj.createTextRange) {
                range = txtObj.createTextRange();
                range.select();
            }
            else {
                txtObj.setSelectionRange(0, l);
                txtObj.focus();
            }
        },

        searchGridByCurIdx: function (delNum) {
            var self = this,
                $grid = self.grid.$grid,
                $tr = $grid.find(">tbody>tr"),
                idx = self.grid.currentIndex;
            if ($tr.size() == delNum) {
                idx = idx - 1;
                return idx ? idx : 1;
            }
            return idx;
        },

        exportedSetStatusBtn: function () {
            var self = this;
            self.$grid.find("a[data-action='decrease-qty'],b[data-action='increase-qty'],a[data-action='delete']").add(self.$deleteCheck).css("visibility", "hidden");
            self.$grid.find("input[data-action='blur']").prop("disabled", true);
            self.$btnAddOrder.hide();
            self.btnStatus = 2;
        }
    };

    return OrderGrid;

});
