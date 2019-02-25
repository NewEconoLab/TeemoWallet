// 向页面注入JS
function injectCustomJs(jsPath) {
    jsPath = jsPath || 'js/inject.js';
    var temp = document.createElement('script');
    temp.setAttribute('type', 'text/javascript');
    // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
    temp.src = chrome.extension.getURL(jsPath);
    temp.onload = function () {
        // 放在页面不好看，执行完后移除掉
        // this.parentNode.removeChild(this);
    };
    document.head.appendChild(temp);
}
function sendMsgTest() {
    window.postMessage({ "test": '这里是contentScript.js' }, '*');
}
// 接收向页面注入的JS
window.addEventListener("message", function (e) {
    //获取Dapp页面信息
    var refTitle = document.title;
    var refDomain = document.URL;
    // var refIcoUrl = refDomain + $("head link[rel*='icon']").attr("href");
    // alert(refTitle) 
    // alert(refDomain) 
    // alert(refIcoUrl)
    var refInfo = { refTitle, refDomain };
    var request = e.data;
    if (request.key === "getAccount") {
        chrome.runtime.sendMessage({
            key: 'getAccount',
            msg: {}
        });
    }
    if (request.key === "sendTransferTx") {
        alert('ContentScript: sendInvokeTx');
        chrome.runtime.sendMessage({
            key: 'sendTransferTx',
            msg: {
                refInfo: refInfo,
                from: request.msg.from,
                to: request.msg.to,
                asset: request.msg.asset,
                value: request.msg.value
            }
        });
    }
    if (request.key === "sendInvokeTx") {
        alert('ContentScript: sendInvokeTx');
        var scriptHash = request.msg.scriptHash;
        var invokeParam = request.msg.invokeParam;
        // alert(scriptHash);
        // alert(invokeParam);
        chrome.runtime.sendMessage({
            key: 'sendInvokeTx',
            msg: {
                refInfo: refInfo,
                scriptHash: scriptHash,
                invokeParam: invokeParam
            }
        });
    }
    if (request.key == "invokeGroup") {
        chrome.runtime.sendMessage({
            key: 'sendInvokeTx',
            msg: {
                invokeParam: request.msg
            }
        });
    }
    console.log(request);
}, false);
window.onload = () => {
    injectCustomJs();
    sendMsgTest();
};
var Test = () => {
    alert("test");
};
var getAccount = (callback) => {
    alert("inject getAccount");
    window.postMessage({
        key: "getAccount",
        msg: {}
    }, "*");
    window.addEventListener("message", function (e) {
        var request = e.data;
        if (request.key === "getAccount_R") {
            callback(request.msg);
        }
    }, false);
};
// invoke 调用
var invokeGroup = (invokeMessage) => {
    window.postMessage({
        key: "invokeGroup",
        msg: invokeMessage
    }, "*");
};
var sendTransferTx = (from, to, asset, value, callback) => {
    alert("inject sendTransferTx");
    window.postMessage({
        key: "sendTransferTx",
        msg: {
            from: from,
            to: to,
            asset: asset,
            value: value
        }
    }, "*");
    window.addEventListener("message", function (e) {
        var request = e.data;
        if (request.key === "sendTransferTx_R") {
            callback(request.msg);
        }
    }, false);
};
var sendInvokeTx = (scriptHash, invokeParam, callback) => {
    alert("inject sendInvokeTx");
    window.postMessage({
        key: "sendInvokeTx",
        msg: {
            scriptHash: scriptHash,
            invokeParam: invokeParam
        }
    }, "*");
    window.addEventListener("message", function (e) {
        var request = e.data;
        if (request.key === "sendInvokeTx_R") {
            callback(request.msg);
        }
    }, false);
};
// function sendMsgTest() {
//     window.postMessage({"test": '这里是inject.js'}, '*');
// }
//# sourceMappingURL=background.js.map