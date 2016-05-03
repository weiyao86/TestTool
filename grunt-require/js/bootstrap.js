var loadScriptPaths = {
    catalog: {
        development: "app/catalog/main.js",
        release: "release/catalog.min.js"
    },

    detail: {
        development: "app/detail/main.js",
        release: "release/detail.min.js"
    },

    message: {
        development: "app/notice/message.js",
        release: "release/message.min.js"
    },

    bulletin: {
        development: "app/notice/bulletin.js",
        release: "release/bulletin.min.js"
    },

    order: {
        development: "app/order/main.js",
        release: "release/order.min.js"
    },

    orderManager: {
        development: "app/orderManager/main.js",
        release: "release/orderManager.min.js"
    },

    partNote: {
        development: "app/partNote/main.js",
        release: "release/partNote.min.js"
    },

    shoppingCart: {
        development: "app/shoppingCart/main.js",
        release: "release/shoppingCart.min.js"
    }
};

(function () {
    var requireConfig = require.s.contexts._.config,
        loadModule = loadScriptPaths[pageConfig.pageCode],
        version = requireConfig.version,
        loadScriptSrc, baseUrl = requireConfig.baseUrl;

    if (pageConfig.isLocal) {
        loadScriptSrc = baseUrl + loadModule.development + "?rv=" + version;
        require([loadScriptSrc]);
    } else {
        loadScriptSrc = baseUrl + loadModule.release + "?rv=" + version;
        require(["jquery"], function () {
            require([loadScriptSrc]);
        });
    }

})();
