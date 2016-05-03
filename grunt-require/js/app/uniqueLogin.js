define(["globalConfig", "cookie"], function (globalConfig) {

    //单一登陆处理
    var uniqueLoginSwitch = globalConfig.context.uniqueLoginSwitch,
        trans = globalConfig.trans;

    if ($.trim(uniqueLoginSwitch).toLowerCase() == 'true') {
        var prevent = function (result) {

            if (result == 0) {
                stop();
                var cookie = $.cookies.get(globalConfig.context.uniqueLoginCookieName);
                if (cookie) {
                    $.cookies.del(globalConfig.context.uniqueLoginCookieName);
                    alert(trans[186]);//trans[50111]"您的账号已被其他人登陆！"
                }
                window.location.href = globalConfig.context.loginUrl;
            }
        }, stop = function () {
            if (handle != null) window.clearInterval(handle);
        }, handle = window.setInterval(
            function () {
                $.ajax({
                    url: globalConfig.context.uniqueAuthUrl,
                    type: 'POST',
                    success: function (result) {
                        prevent(result);
                    },
                    error: function (error) {
                        stop();
                    }
                });

            }, globalConfig.context.uniqueLoginIntervalSeconds * 1000);
    };

});