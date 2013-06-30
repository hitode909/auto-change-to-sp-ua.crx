(function() {
    var p = function() {
        console.log(JSON.stringify(Array.prototype.slice.call(arguments, 0, arguments.length)));
    }
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

    var CurrentWidth = localStorage.width;

    var onMessageHandler = function (width) {
        if (! width) return;
        CurrentWidth = width;
    };
    var onFocusHandler = function (tabId) {
        chrome.tabs.sendMessage(tabId, {}, onMessageHandler);
    };
    chrome.tabs.onActivated.addListener(function (info) {
        onFocusHandler(info.tabId);
    });
    chrome.windows.onFocusChanged.addListener(function () {
        chrome.tabs.getSelected(function (tab) {
            onFocusHandler(tab.id);
        });
    });
    chrome.runtime.onMessage.addListener(onMessageHandler);

    chrome.webRequest.onBeforeSendHeaders.addListener(
        function (details) {
            var threshold = localStorage.width;
            // p({ current: CurrentWidth, threshold: threshold });
            if (CurrentWidth <= threshold) {
                for (var i = 0, l = details.requestHeaders.length; i < l; ++i) {
                    if (details.requestHeaders[i].name === 'User-Agent') {
                        details.requestHeaders[i].value = localStorage.ua;
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
