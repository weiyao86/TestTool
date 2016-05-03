require(["globalConfig", "ajax", "grid", "track", "uniqueLogin", "initMasterCmp", "amplify", "jqExtend", "jquery", "domReady!"], function (globalConfig, ajax, Grid, track) {

    var shoppingCartDeleteUrl = globalConfig.actions.shoppingCartDelete,
        shoppingCartSaveUrl = globalConfig.actions.shoppingCartSave,
        shoppingCartUpdate = globalConfig.actions.shoppingCartUpdate,
        createOrderUrl = globalConfig.actions.createOrder,
        orderDetailUrl = globalConfig.actions.orderDetail,
        trans = globalConfig.trans;

    var main = {

        init: function () {
            var self = this;

            self.bindDomEls();
            self.bindEvent();
            self.initComponent();
        },

        bindDomEls: function () {
            var self = this;

            self.$priceShoppingcart = $("#price_shoppingcart");
            self.$amount = $("#amount");
            self.$grid = $("#shoppingCart-grid");
            self.$checkAll = self.$grid.find("[data-action='check-all']");
            self.$deleteCheck = $("#delete-check");
            self.$buildOrder = $("#build-order");
            self.$joinWrap = $("#join-shoppingCart");
            self.$filter = $("#filter");
            self.$search = $("#btn-filter-check");

            self.checkUrl = self.$search.attr("data-check-url");
            self.rangeTextByPart = '';
        },

        bindEvent: function () {
            var self = this;

            self.$checkAll.click(function () {
                self.decideIsCheck($(this));
            });

            self.$grid.on("change", "input[data-field='ck_single']", function () {
                var flag = self.$grid.find("input[data-field='ck_single']:not(:checked)").size();

                self.$checkAll.prop("checked", !flag);
            });

            self.$deleteCheck.click(function () {
                self.deleteCheckData();
            });

            self.$grid.on("blur", "input[type='text']", function () {
                self.rounding($(this));
            });

            self.$grid.on("focus", "input[type='text']", function () {
                self.qtyChangeNum = $(this).val() || 1;
            });

            self.$buildOrder.click(function () {
                self.hasOrder();
            });

            self.$search.on("click", function () {
                self.generalSearch();
            });

            self.$filter.on("click", "[data-action='search-all']", function () {
                self.grid.clear();
                self.grid.filter();
            });

        },

        generalSearch: function () {
            var self = this,
                $joinPartNumber = self.$joinWrap.find("[data-field='PartNumber']"),
                    partNum = $.trim($joinPartNumber.val());

            if (!partNum.length) {
                self.grid.filter();
            } else {
                self.rangeTextByPart = partNum;
                self.search();
            }
        },

        initComponent: function () {
            var self = this;

            self.grid = new Grid({
                grid: {
                    gridId: "shoppingCart-grid",
                    keys: ["PartNumber"]
                },
                filter: {
                    id: "filter"
                },
                paging: {
                    id: "shoppingCart-paging"
                },
                callbacks: {
                    onLoadDataBefore: function (params) {
                        track.publish("shopping-cart", "查询", "click", "view", params);
                    },
                    onLoadDataAfter: function (root) {
                        if (root.Data.IsShowPrice) {
                            self.settingsAmount(root.Data.Amount);
                            self.$priceShoppingcart.show();
                        }
                        else self.$priceShoppingcart.hide();
                        self.$checkAll.prop("checked", false);

                    },
                    onRenderAfter: function (root) {
                        var $tdByPart = self.grid.$grid.find("td[data-range-part='" + self.rangeTextByPart + "']");

                        self.setSelectionRange($tdByPart.find("input[data-action]").get(0));
                        self.rangeTextByPart = '';
                    },
                    onRowClicked: function (e, cells, keys, action) {
                        self.decideAction(e, cells, keys, action);
                    }
                }
            });


            self.$filter.off("keyup").on("keyup", "input[data-field='PartNumber']", function (e) {
                if (e.keyCode === 13) {
                    self.generalSearch();
                }
            });

            self.grid.filter();
        },

        search: function () {
            var self = this,
                params = self.$filter.selectedAllAppointScope();
            ajax.invoke({
                type: 'POST',
                url: self.checkUrl,
                data: params,
                traditional: true,
                success: function (rst) {
                    self.checkExist(params, rst);
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        checkExist: function (params, rst) {
            var self = this,
                data = rst.Data;

            switch (data.Code) {
                case 1:
                    //EPC中不存在
                    track.publish("shopping-cart", "EPC中无此零件", "click", "search", params);
                    alert(trans[11146]);
                    break;
                case 2:
                    //已在购物车中
                    track.publish("shopping-cart", "该零件已在购物车中", "click", "search", params);
                    self.grid.filter();
                    break;
                case 3:
                    //11146：EPC 中无此零件！   11147：购物车中无此零件（配件号：   11148：配件名称：        11149：），是否加入购物车？
                    var confirm = trans[11147] + params.PartNumber + '\r\n' + trans[11148] + data.PartDesc + trans[11149];
                    if (window.confirm(confirm)) {
                        self.joinShoppingCart();
                        track.publish("shopping-cart", "根据提示加入购物车中", "click", "add", params);
                    } else {
                        track.publish("shopping-cart", "根据提示取消加入购物车", "click", "add", params);
                    }
                    break;
                default:

            }
        },

        decideAction: function (e, cells, keys, action) {
            var self = this, arr = [],
                UnitPkgQty = $(e.target).parents("td").attr("data-UnitPkgQty"),
                textBox = $(e.target).parent().find("input[type='text']"),
                PartNumber = $(e.target).parents("td").attr("data-PartNumber");

            if (action === "delete") {
                arr.push(cells.PartNumber);
                self.deleteData(arr);
                track.publish("shopping-cart", "单条删除", "click", "delete", { args: arr });
            } else if (action === "increase-qty") {
                self.increaseQty(UnitPkgQty, textBox, PartNumber);

            } else if (action === "decrease-qty") {
                self.decreaseQty(UnitPkgQty, textBox, PartNumber);

            }
        },

        settingsAmount: function (amount) {
            var self = this;

            self.$amount.text(amount);
        },

        decideIsCheck: function ($sender) {
            var self = this,
                flag = $sender.prop("checked"),
                checkbox = self.$grid.find("tbody input[type='checkbox']");
            checkbox.prop("checked", flag);
        },

        deleteCheckData: function () {
            var self = this, arr = [],
                $checkbox = self.$grid.find("input[data-field='ck_single']:checkbox:checked");

            $checkbox.each(function (index, val) {
                arr.push($(val).attr("data-PartNumber"));
            });

            if ($checkbox.size()) {
                self.deleteData(arr);

                track.publish("shopping-cart", "删除选中项", "click", "delete", { args: arr });
            } else {
                alert(trans['182']);
            }
        },

        deleteData: function (params) {
            var self = this;

            if (!confirm(trans['153'])) return;

            ajax.invoke({
                url: shoppingCartDeleteUrl,
                contentType: "application/json",
                data: JSON.stringify({ parts: params }),
                success: function (root) {
                    self.grid.search({
                        pageIdx: self.searchGridByCurIdx(params.length)
                    });
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        increaseQty: function (UnitPkgQty, textBox, PartNumber) {
            var self = this, params,
                val = Number(textBox.val()),
                UnitPkgQty = Number(UnitPkgQty),
                lastQty = val + UnitPkgQty;

            if (lastQty > 99999) return alert(trans[11117]);
            textBox.val(val + UnitPkgQty);

            params = { "PartNumber": PartNumber, "Qty": textBox.val() }
            self.qtyChange(params);
            track.publish("shopping-cart", "数量增加", "click", "view", params);
        },

        decreaseQty: function (UnitPkgQty, textBox, PartNumber) {
            var self = this, params,
                val = Number(textBox.val()),
                UnitPkgQty = Number(UnitPkgQty),
                lastQty = val - UnitPkgQty;
            if (lastQty < 1 || val == UnitPkgQty) return;

            if (val !== UnitPkgQty) {
                textBox.val(val - UnitPkgQty);
            }

            params = { "PartNumber": PartNumber, "Qty": textBox.val() }
            self.qtyChange(params);
            track.publish("shopping-cart", "数量减少", "click", "view", params);
        },

        rounding: function ($sender) {
            var self = this,
                 maxNum = 99999,
                UnitPkgQty = $sender.parents("td").attr("data-UnitPkgQty"),
                PartNumber = $sender.parents("td").attr("data-PartNumber"),
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
            params = { "PartNumber": PartNumber, "Qty": $sender.val() };
            self.qtyChange(params);
        },

        qtyChange: function (params) {
            var self = this;

            ajax.invoke({
                url: shoppingCartUpdate,
                contentType: "application/json",
                data: JSON.stringify(params),
                success: function (root) {
                    switch (root.Data) {
                        case 1:
                            alert(trans['11119']);
                            break;
                        case 2:
                            alert(trans['11128']);
                            break;
                        default:
                            self.grid.search({
                                isCurIdx: true
                            });
                            break;
                    }
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        joinShoppingCart: function () {
            var self = this,
                $joinPartNumber = self.$joinWrap.find("[data-field='PartNumber']"),
                partNum = $.trim($joinPartNumber.val());

            if (partNum.length === 0) {
                alert(trans['156']);
                return;
            }

            ajax.invoke({
                url: shoppingCartSaveUrl,
                contentType: "application/json",
                data: JSON.stringify({ PartNumber: partNum }),
                success: function (root) {
                    if (!root.Data) return;
                    switch (root.Data.Code) {
                        case 1:
                            alert(trans['89813']);
                            break;
                        default:
                            $joinPartNumber.val("");
                            self.grid.filter();
                            amplify.publish("cartDelayHide", partNum);
                            break;
                    }
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        },

        hasOrder: function () {
            var self = this;

            self.buildOrder();
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

        buildOrder: function () {
            var self = this;

            ajax.invoke({
                url: createOrderUrl,
                type: "post",
                contentType: "application/json",
                success: function (root) {
                    if (root.Data) {
                        track.publish("shopping-cart", "生成订单", "click", "submit", "OrderCode:" + root.Data);

                        window.location.href = orderDetailUrl + "&orderCode=" + root.Data;
                    } else {
                        window.location.href = window.location.href;
                        alert(trans['184']);
                    }
                },
                failed: function (error) {
                    alert(error.reason);
                }
            });
        }

    }

    main.init();

});