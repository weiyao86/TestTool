define(["globalConfig", "ajax", "loading", "track", "zTree", "jqExtend", "json2"], function (globalConfig, ajax, Loading, track) {
    var defaults = {
        getTreeUrl: globalConfig.actions.getTreeUrl,
        callbacks: {
            onClickNode: null,
            onClickArrow: null,
            oneLoad: null,
            onLoadByParam: null
        }
    },
    trans = globalConfig.trans,
        Tree = function (opts) {
            this.opts = $.extend({}, defaults, opts);
            this.init();
        };

    Tree.prototype = {

        init: function () {
            var self = this;
            self.buildDom();
            self.extend();
            self.bindEvnet();
            self.initTreeConfig();
            self.load();
        },

        buildDom: function () {
            var self = this;

            self.$treeContainer = $("#tree_container");
            self.$tree = $("#tree_content");
            self.$arrowFirst = $("#arrow_l");

            self.treeW = self.treeTempW = self.$treeContainer.outerWidth(true) + 5;
            self.ztreeObj = null;
            self.ztreeData = {};
        },

        extend: function () {
            var self = this;
            Loading.extend([self, self.$treeContainer]);
        },

        bindEvnet: function () {
            var self = this, w = 0;
            self.$arrowFirst.on("click", function () {
                var $this = $(this),
                    action;
                if (self.treeW) {
                    w = -self.treeW;
                    self.treeW = 0;
                    action = "collapse";
                } else {
                    w = 0;
                    self.treeW = self.treeTempW;
                    action = "expand";
                }
                self.$treeContainer.animate({ "marginLeft": w }, function () {
                    if (typeof self.opts.callbacks.onClickArrow === "function") {
                        self.opts.callbacks.onClickArrow.call(self, this);
                    }
                    $this.toggleClass("pos-to-r");
                    track.publish("legendData", "侧边栏左-" + (action == "collapse" ? "收缩" : "展开"), "click", action);
                });

            });
        },

        initTreeConfig: function () {
            var self = this;

            self.setting = {
                view: {
                    showTitle: true,
                    showLine: false,
                    showIcon: true,
                    selectedMulti: false,
                    dblClickExpand: false,
                    addDiyDom: $.proxy(self.addDiyDom, self),
                    nameIsHTML: true
                },
                data: {
                    simpleData: {
                        enable: true
                    },
                    key: {
                        title: "title"
                    }
                },
                callback: {
                    onClick: $.proxy(self.clickNode, self),
                    onExpand: function (e, treeId, treeNode) {
                        //if (typeof self.opts.callbacks.oneLoad === "function") {
                        //    self.opts.callbacks.oneLoad.call(this, e, treeId, treeNode);
                        //}
                    }
                }
            };
        },

        //控制间距
        addDiyDom: function (treeId, treeNode) {
            var self = this,
                switchObj = $("#" + treeNode.tId + "_switch"),
                icoObj = $("#" + treeNode.tId + "_ico"),
                $span = $("#" + treeNode.tId + "_span");

            icoObj.before(switchObj);
            switchObj.remove();

            $span.css({
                "display": "inline-block",
                "width": treeNode.level ? "180px" : "190px" 
            });
        },

        clickNode: function (e, treeId, treeNode) {
            var self = this, rtParams;

            if (self.curMenu && self.curMenu.id != treeNode.id) {
                var parentN = self.getSiblingTree(treeNode),
                    curN = self.getSiblingTree(self.curMenu);
                if (parentN.id != curN.id) {
                    self.ztreeObj.expandNode(curN, false);
                }
            }

            self.ztreeObj.expandNode(treeNode);

            rtParams = self.redirectLegend(treeNode, true);
            if (!rtParams.isStop) {
                if (typeof self.opts.callbacks.onClickNode === "function")
                    self.opts.callbacks.onClickNode.apply(this, [rtParams]);
            }
            self.curMenu = self.ztreeObj.getSelectedNodes()[0] || null;
            return false;
        },

        redirectLegend: function (treeNode, isTrack) {
            var self = this,
                params = {},
                data = self.ztreeData,
                urlParams = self.opts.urlParams,
                isStop = false;

            if (treeNode.level == 0) {
                if (treeNode.id == (self.curMenu && self.curMenu.id || '')) return { isStop: true };
                params = $.extend({}, urlParams, {
                    "GroupCode": treeNode.id
                });

                data = $.grep(data, function (val, idx) {
                    return val.pId == treeNode.id;
                });

                isTrack && track.publish("group", "树节点-缩略图", "click", "view", JSON.stringify(params));
            } else {
                params = $.extend({}, urlParams, {
                    "GroupCode": treeNode.pId,
                    "ImageCode": treeNode.id
                });
                isTrack && track.publish("group", "树节点-左图右数据", "click", "view", JSON.stringify(params));
            }
            return {
                isStop: isStop,
                treeNode: treeNode,
                data: data,
                params: params
            };
        },



        getSiblingTree: function (treeNode) {
            var self = this;
            while (treeNode.getParentNode()) {
                treeNode = treeNode.getParentNode();
            }
            return treeNode;
        },


        load: function (params) {
            var self = this;
            self.opts.urlParams = $.extend({}, self.opts.urlParams, params);
            ajax.invoke({
                url: self.opts.getTreeUrl,
                contentType: "application/json",
                data: JSON.stringify(self.opts.urlParams),
                beforeSend: function () {
                    self.$treeContainer.loadingShow();
                },
                complete: function () {
                    self.$treeContainer.loadingHide();
                },
                success: $.proxy(self.success, self),
                failed: function (error) { alert(error.reason); }
            });
        },

        success: function (result) {
            var self = this,
                rtData = result.Data || [];
            self.loadTree(rtData);
        },

        loadTree: function (result) {
            var self = this, urlParams = self.opts.urlParams, zNodes = result.Tree || [];

            var ret = $.mappingJSON(zNodes, {
                "Id": "id",
                "PId": "pId",
                "Name": "name",
                "Note": "note"
            }, []), note;

            for (var i = 0; i < ret.length; i++) {
                note = ret[i].name + (ret[i].note ? "(" + ret[i].note + ")" : '');
                ret[i]["name"] = note;
                ret[i]["note"] = note;
                ret[i]["title"] = note;
            }
            self.ztreeData = ret;
            $.fn.zTree.init(self.$tree, self.setting, ret);
            self.ztreeObj = $.fn.zTree.getZTreeObj(self.$tree.attr("id"));

            //Exist ImageCode
            if (urlParams && urlParams["ImageCode"]) {
                self.curMenu = self.ztreeObj.getNodeByParam("id", urlParams["ImageCode"]);
                if ($.type(self.opts.callbacks.onLoadByParam) === "function") {
                    self.opts.callbacks.onLoadByParam.call(null);
                }
            }
            else {
                //Exist GroupCode
                if (urlParams && urlParams["GroupCode"]) {
                    self.curMenu = self.ztreeObj.getNodeByParam("id", urlParams["GroupCode"]);
                    if ($.type(self.opts.callbacks.onLoadByParam) === "function") {
                        self.opts.callbacks.onLoadByParam.call(null);
                    }
                } else {
                    self.curMenu = self.ztreeObj.getNodes()[0];
                }
                // self.ztreeObj.expandNode(self.curMenu, true, false, true, true);

                if (typeof self.opts.callbacks.oneLoad === "function") {
                    self.curMenu && self.opts.callbacks.oneLoad.call(this, self.curMenu);
                }

            }
            if (!self.curMenu) return;

            self.ztreeObj.selectNode(self.curMenu);
        },

        triggerNode: function (action) {
            var self = this,
                stNode, reNode;
            stNode = self.ztreeObj.getSelectedNodes()[0];
            reNode = self.searchNode(stNode, action);
            reNode && self.toLegend({ imgId: reNode.id });
        },

        searchNode: function (stNode, action) {
            if (stNode == null) return;
            var self = this,
                preMes = trans[10001],
                nextMes = trans[10000],
                preStNode, nextStNode,
                parentNode = stNode.getParentNode();

            if (action == 'prev') {
                preStNode = stNode.getPreNode();
                if (preStNode) return preStNode;
                if (parentNode == null) return alert(preMes);

                if (parentNode.level == 0) {
                    parentNode = parentNode.getPreNode();
                    return (parentNode && parentNode.children[parentNode.children.length - 1]) || alert(preMes);
                } else {
                    return self.searchNode(parentNode, action);
                }
            }
            else if (action == 'next') {
                nextStNode = stNode.getNextNode();
                if (nextStNode) return nextStNode;
                if (parentNode == null) return alert(nextMes);

                if (parentNode.level == 0) {
                    parentNode = parentNode.getNextNode();
                    return (parentNode && parentNode.children[0]) || alert(nextMes);
                } else {
                    return self.searchNode(parentNode, action);
                }
            }
        },

        toLegend: function (params) {
            var self = this,
                nodes = self.ztreeObj.getNodeByParam("id", params.imgId),
                parentNode = nodes.getParentNode(), rtParams;

            rtParams = self.redirectLegend(nodes);
            if (!rtParams.isStop) {
                if (typeof self.opts.callbacks.onClickNode === "function")
                    self.opts.callbacks.onClickNode.apply(this, [rtParams]);
            }

            if (!parentNode) return;
            self.ztreeObj.selectNode(nodes);
            self.curMenu = nodes;
        }

    };


    return Tree;
});