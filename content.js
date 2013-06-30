(function() {
    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        sendResponse(window.outerWidth);
    });

    window.addEventListener('resize', function () {
        chrome.runtime.sendMessage(window.outerWidth);
    });
})();
