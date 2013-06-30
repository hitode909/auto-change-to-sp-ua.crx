(function() {
    var defaults = {
        ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3',
        width: 640,
    };
    ['ua', 'width'].forEach(function (name) {
        var ret = localStorage[name];
        if (! ret) {
            localStorage[name] = defaults[name];
        }
    });

    var CurrentWidth;

    var onMessageHandler = function (width) {
        if (! width) return;
        CurrentWidth = width;
    };
    chrome.tabs.onActivated.addListener(function (info) {
        chrome.tabs.sendMessage(info.tabId, {}, onMessageHandler);
    });
    chrome.runtime.onMessage.addListener(onMessageHandler);

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            var threshold = localStorage.width;
            var ua        = localStorage.ua;
            if (CurrentWidth <= threshold) {
                for (var i = 0, l = details.requestHeaders.length; i < l; ++i) {
                    if (details.requestHeaders[i].name === 'User-Agent') {
                        details.requestHeaders[i].value = ua;
                        break;
                    }
                }
            }
            return { requestHeaders: details.requestHeaders };
        },
        { urls: ["<all_urls>"] },
        ["blocking", "requestHeaders"]
    );
})();
