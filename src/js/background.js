
chrome.webRequest.onCompleted.addListener(function(details){
    if (!details || details.tabId < 0) return false;

    if (details.url.indexOf("https://bx.in.th/api/price/?pairing=") != -1) {
        var url = new URL(details.url);
        var q = url.search.replace("?","").split("&")
        if(q.length == 2) {
            let checked = localStorage.getItem("bxswitch");
            if(+checked == 1) {
                fetch(`${url.href}&time=${new Date().getTime()}`, {
                    method: 'POST',
                    body: JSON.stringify({format:1}),
                    mode: 'cors',
                    cache: 'default'
                }).then(function(response) {
                    return response.json();
                })
                .then(function(data) {
                    showNotification(data);
                })
                .catch(function(e) {
                    console.log("error:", e)
                });
            }
        }
    }
},
{urls: ["<all_urls>"]},
['responseHeaders']
);

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        // console.log(details.requestBody);
    },
    {urls: ["<all_urls>"]},
    ['requestBody']
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        return {requestHeaders: details.requestHeaders};
    },
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);

function showNotification(data) {
    
    var title = `Last: ${data.last} ${data.volume.split(" ")[1]}`;
    var message = `${data.change}% | Hight: ${data.high} \nLow: ${data.low} | Avg: ${data.avg}`

    // Now create the notification
    chrome.notifications.create(`${new Date().getTime()}`, {
        type: 'basic',
        iconUrl: 'src/icon/bx-128x128.png',
        title: title,
        message: message
    }, function(notificationId) {});
}

chrome.webRequest.onResponseStarted.addListener(function (data) {
    
        if (!data || data.tabId < 0) return false;
    
        chrome.tabs.get(data.tabId, function (tab) {
            if (chrome.runtime.lastError) {
                console.log(chrome.runtime.lastError.message);
            } else {
                var tabInfo = tab;
                data.tab = tabInfo;
                if (!tabInfo.url) return false;
    
                chrome.tabs.sendMessage(tab.id, {action: "success", data: data.tab});
            }
        });
    }, {
        urls: ["<all_urls>"]
    }, ["responseHeaders"]
);