var loadScriptPaths = {
	"master": {
		"development": ["app/master/main.js"],
		"release": ["master.min.js"]
	},

	"photo": {
		"development": ["app/photo/main.js"],
		"release": ["photo.min.js"]
	},

	"photoDetail": {
		"development": ["app/photo/detail.js"],
		"release": ["detail.min.js"]
	},

	"user": {
		"development": ["app/user/main.js"],
		"release": ["user.min.js"]
	}
};

(function() {
	var requireConfig = require.s.contexts._.config,
		loadModule = loadScriptPaths[pageConfig.pageCode],
		loadScriptSrc, baseUrl = requireConfig.baseUrl;

	var buildUrl = function(paths) {
		for (var i = 0; i < paths.length; i++) {
			if (pageConfig.isLocal) {
				paths[i] = baseUrl + paths[i];
			} else {
				paths[i] = pageConfig.releaseScripts + paths[i] + "?rv=" + pageConfig.releaseVersion;
			}
		}
		return paths;
	};

	if (pageConfig.isLocal) {
		loadScriptSrc = buildUrl(loadModule.development);
		require(loadScriptSrc);
	} else {
		loadScriptSrc = buildUrl(loadModule.release);
		require(["jquery"], function() {
			require(loadScriptSrc);
		});
	}
})();