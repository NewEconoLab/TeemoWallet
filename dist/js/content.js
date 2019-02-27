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
    var title = document.title;
    var domain = document.URL;
    var message = { title, domain };
    var request = e.data;
    if (request.command) {
        const params = request.params;
        const command = request.command;
        const data = params ? { message, params, command } : { message, command };
        chrome.runtime.sendMessage(data);
    }
}, false);
/**
 * 发送返回值
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.return)
        window.postMessage(request, '*');
});
window.onload = () => {
    injectCustomJs();
    sendMsgTest();
};
//# sourceMappingURL=content.js.map